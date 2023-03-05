import { useMutation, useQuery } from "@tanstack/react-query"

import db from "@/config/db"
import Repository from "@/config/db/repository"
import { User, UserGroup } from "@/config/db/types"
import { queryClient } from "@/config/queryClient"

export const useUserGroups = () => {
  return useQuery({ queryKey: ["db-user-groups"], queryFn: () => db.getUserGroups() })
}

export const useUsersInGroups = () => {
  return useQuery({
    queryKey: ["db-users-in-groups"],
    queryFn: () => Repository.listUsersInGroups(),
  })
}

type UpdateParams = {
  group_id: number
  users: User[]
}

// Adds and removes users from a group
export const useUpdateUsersToGroups = () => {
  return useMutation({
    mutationFn: ({ group_id, users }: UpdateParams) =>
      Repository.updateUsersToGroupId(group_id, users),
    onSuccess: (value, variables) => {
      void queryClient.invalidateQueries(["db-users-in-groups"])
      void queryClient.invalidateQueries(["db-user-groups", variables.group_id])
    },
  })
}

// only updates the group name Todo: remove
export const useInsertUserGroup = () => {
  return useMutation({
    mutationFn: (userGroup: UserGroup) => db.insertUserGroup(userGroup),
    onSuccess: () => {
      void queryClient.invalidateQueries(["db-user-groups"])
    },
  })
}

// Gets the user that belong to a group with id
export const useUserGroupsById = (
  id: number | undefined,
  onSuccess?: (data: User[]) => void,
) => {
  return useQuery(
    ["db-user-groups", id],
    async () => await Repository.getUsersByGroupId(id as number),
    { enabled: Boolean(id), onSuccess },
  )
}
