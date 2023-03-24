import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "react-toastify"

import api from "@/config/api/api"
import { MediumCreate } from "@/config/api/types"
import { queryClient } from "@/config/queryClient"
import db from "@/db"
import { UserSchema } from "@/types/types"

export const useTanlockUsers = (ip: string) => {
  return useQuery(["tanlock-users", ip], () => {
    return api.getUsers(ip)
  })
}

export const useTanlockUsersBulk = (
  ips: string[],
  onSuccess?: (data: UserSchema[]) => void,
) => {
  return useQuery(
    ["tanlock-users", ...ips],
    async () => {
      const v = await Promise.all(ips.map((ip) => api.getUsers(ip)))
      return v.flat()
    },
    {
      enabled: Boolean(ips.length),
      onSuccess,
    },
  )
}

type CreateMediumParams = {
  ip: string
  medium: MediumCreate
}

export const useCreateMedium = () => {
  return useMutation(
    ({ ip, medium }: CreateMediumParams) => {
      return api.createNewMedium(ip, medium)
    },
    {
      onError: (error: AxiosError) => {
        if (error.response?.status === 404) {
          toast.error("User not found on the device!")
        } else if (error.response?.status === 400) {
          toast.error("Bad Request")
        }
      },
    },
  )
}

type AssignGroupParams = {
  ips: string[]
  users: UserSchema[]
}

export const useAssignGroup = () => {
  return useMutation(
    async ({ ips, users }: AssignGroupParams) => {
      await api.deleteAllMediums(ips)
      await api.deleteAllUsers(ips)
      await api.assignGroup(ips, users)
      const mediums = await db.listMediums()
      const logins = users.map((u) => u.login)
      const matchingMediums = mediums.filter((medium) => logins.includes(medium.login))
      if (matchingMediums.length) {
        await api.assignMediums(ips, matchingMediums)
      }
      return true
    },
    {
      onSuccess: (_d, variables) => {
        void queryClient.invalidateQueries(["tanlock-users", ...variables.ips])
        toast.success("Successfully assigned users to devices!")
      },
      onError: (error: AxiosError) => {
        if (error.response?.status === 404) {
          toast.error("User not found on the device!")
        } else if (error.response?.status === 400) {
          toast.error("Bad Request")
        }
      },
    },
  )
}
