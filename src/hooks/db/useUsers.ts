import { useMutation, useQuery } from "@tanstack/react-query"

import db from "@/db"
import { User, UserListSchema } from "@/db/types"
import userStore from "@/db/user-store"
import { queryClient } from "@/config/queryClient"

export const useUsers = () => {
  return useQuery({ queryKey: ["db-users"], queryFn: () => db.getUsers() })
}

export const useUser = (id: number) => {
  const query = queryClient.getQueryCache().find(["db-users"])
  if (!query?.state) {
    query?.reset()
    return
  }
  const data = UserListSchema.parse(query.state.data)
  return data.find((user: User) => user.id === id)
}

export const useInsertUsers = () => {
  return useMutation({
    mutationFn: (users: User[]) => db.insertUsers(users),
    onSuccess: () => {
      void queryClient.invalidateQueries(["db-users"])
    },
  })
}

export const useInsertUser = () => {
  return useMutation({
    mutationFn: (user: User) => db.insertUser(user),
    onSuccess: () => {
      void queryClient.invalidateQueries(["db-users"])
    },
  })
}

export const useDeleteUsers = () => {
  return useMutation({
    mutationFn: (ids: number[]) => userStore.deleteUsers(ids),
    onSuccess: () => {
      void queryClient.invalidateQueries(["db-users"])
    },
  })
}
