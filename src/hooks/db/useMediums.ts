import { useMutation, useQuery } from "@tanstack/react-query"

import { queryClient } from "@/config/queryClient"
import db from "@/db"
import deviceStore from "@/db/device-store"
import { Medium } from "@/db/types"

export const useMediums = () => {
  return useQuery({ queryKey: ["db-mediums"], queryFn: () => db.listMediums() })
}

export const useInsertMedium = () => {
  return useMutation({
    mutationFn: (medium: Omit<Medium, "id">) => db.insertMedium(medium),
    onSuccess: () => {
      void queryClient.invalidateQueries(["db-mediums"])
    },
  })
}

export const useDeleteMediums = () => {
  return useMutation({
    mutationFn: (ids: number[]) => deviceStore.deleteMediums(ids),
    onSuccess: () => {
      void queryClient.invalidateQueries(["db-mediums"])
    },
  })
}
