import "nprogress/nprogress.css"

import { Router } from "next/router"
import NProgress from "nprogress"
import { useEffect } from "react"

type Props = {
  router: Router
}

const useProgress = ({ router }: Props) => {
  useEffect(() => {
    const handleRouteStart = () => NProgress.start()
    const handleRouteDone = () => NProgress.done()

    router.events.on("routeChangeStart", handleRouteStart)
    router.events.on("routeChangeComplete", handleRouteDone)
    router.events.on("routeChangeError", handleRouteDone)

    return () => {
      // Make sure to remove the event handler on unmount!
      router.events.off("routeChangeStart", handleRouteStart)
      router.events.off("routeChangeComplete", handleRouteDone)
      router.events.off("routeChangeError", handleRouteDone)
    }
  }, [router.events])
}

export default useProgress
