import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"

import { queryClient } from "@/config/queryClient"
import db from "@/db"
import deviceStore from "@/db/device-store"
import { Device, DeviceListSchema } from "@/db/types"
import { DeviceInfo } from "@/types/types"

export const useDevices = () => {
  return useQuery({ queryKey: ["db-devices"], queryFn: () => db.getDevices() })
}

export const useDevice = (id: number) => {
  const query = queryClient.getQueryCache().find(["db-devices"])
  if (!query?.state) {
    query?.reset()
    return
  }
  const data = DeviceListSchema.parse(query.state.data)
  return data.find((user: Device) => user.id === id)
}

// Uses device info because result is coming from api req
export const useInsertDevices = () => {
  return useMutation({
    mutationFn: (devices: DeviceInfo[]) => db.insertDevices(devices),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries(["db-devices"])
      toast.success(`${variables.length} devices inserted.`)
    },
  })
}

export const useDeleteDevices = () => {
  return useMutation({
    mutationFn: (ids: number[]) => deviceStore.deleteDevices(ids),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries(["db-devices"])
      toast.success(`${variables.length} devices deleted.`)
    },
  })
}
