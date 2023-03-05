import { useMutation } from "@tanstack/react-query"

import api from "@/config/api/api"
import { queryClient } from "@/config/queryClient"
import { ScanFormData } from "@/pages/scan"

export const useScan = () => {
  return useMutation({
    mutationFn: async (scanFormData: ScanFormData) => {
      return api.scan(scanFormData)
    },
    onSuccess: (result) => {
      queryClient.setQueryData(["scan"], result)
    },
  })
}
