import { useMutation, useQuery } from "@tanstack/react-query"

import { queryClient } from "@/config/queryClient"
import { invoke } from "@/utils/tauri"

export const useShouldInitialize = () => {
  return useQuery(["initialized"], () => invoke<boolean>("does_db_exist"))
}

export const useInitialize = () => {
  return useMutation({
    mutationFn: () => invoke<boolean>("initialize_db"),
    onSuccess: () => {
      void queryClient.invalidateQueries(["initialized"])
    },
  })
}
