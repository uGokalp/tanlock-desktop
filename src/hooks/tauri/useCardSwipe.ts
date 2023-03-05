import { useQuery } from "@tanstack/react-query"

import api from "@/config/api/api"

export const useCardSwipe = (
  ip: string,
  ts: number,
  interval: number,
  enabled: boolean,
  done: boolean,
) => {
  return useQuery({
    queryKey: ["card-swipe", ip],
    queryFn: () => api.lastMedium(ip, ts),
    enabled: enabled && !done,
    refetchInterval: interval,
    refetchOnWindowFocus: false,
  })
}
