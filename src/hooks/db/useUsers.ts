import { useMutation, useQuery } from "@tanstack/react-query"

import db from "@/config/db"
import { User } from "@/config/db/types"
import { queryClient } from "@/config/queryClient"

export const useUsers = () => {
  return useQuery({ queryKey: ["db-users"], queryFn: () => db.getUsers() })
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
