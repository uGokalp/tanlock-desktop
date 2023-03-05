import "@/styles/globals.scss"
import "react-toastify/dist/ReactToastify.css"

import { QueryClientProvider, useIsFetching } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import type { AppProps } from "next/app"
import { ToastContainer } from "react-toastify"
import TopBarProgress from "react-topbar-progress-indicator"

import { queryClient } from "@/config/queryClient"
import useProgress from "@/hooks/useProgress"
import CommandPalette from "@/providers/CommandPalette"

TopBarProgress.config({
  barColors: {
    "0": "#fff",
    "1.0": "grey",
  },
  barThickness: 2,
  shadowBlur: 2,
})

const FetchingBar = () => {
  const isFetching = useIsFetching()
  return isFetching ? <TopBarProgress /> : null
}

function MyApp({ Component, pageProps, router }: AppProps) {
  useProgress({ router })

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <CommandPalette>
        <FetchingBar />
        <Component {...pageProps} />
      </CommandPalette>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default MyApp
