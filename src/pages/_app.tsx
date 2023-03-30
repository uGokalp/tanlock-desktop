import "@/styles/globals.scss"
import "react-toastify/dist/ReactToastify.css"

import {
  QueryClientProvider,
  useIsFetching,
  useIsMutating,
} from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import type { AppProps } from "next/app"
import { ToastContainer } from "react-toastify"
import TopBarProgress from "react-topbar-progress-indicator"

import { queryClient } from "@/config/queryClient"
import useProgress from "@/hooks/useProgress"

TopBarProgress.config({
  barColors: {
    "0": "#fff",
    "1.0": "#4F46E5",
  },
  barThickness: 3,
  shadowBlur: 2,
})

const FetchingBar = () => {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()
  return isFetching || isMutating ? <TopBarProgress /> : null
}

function MyApp({ Component, pageProps, router }: AppProps) {
  useProgress({ router })

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <FetchingBar />
      <Component {...pageProps} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default MyApp
