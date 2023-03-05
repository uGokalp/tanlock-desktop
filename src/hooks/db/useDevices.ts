import { useMutation, useQuery } from "@tanstack/react-query"

import db from "@/config/db"
import { queryClient } from "@/config/queryClient"
import { DeviceInfo } from "@/types/types"

export const useDevices = () => {
  return useQuery({ queryKey: ["db-devices"], queryFn: () => db.getDevices() })
}

// Uses device info because result is coming from api req
export const useInsertDevices = () => {
  return useMutation({
    mutationFn: (devices: DeviceInfo[]) => db.insertDevices(devices),
    onSuccess: () => {
      void queryClient.invalidateQueries(["db-devices"])
    },
  })
}
