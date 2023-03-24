import { useRouter } from "next/router"

import DeviceConfig from "@/components/Devices/DeviceConfig"
import Sidebar from "@/layouts/Sidebar"

const DeviceConfigPage = () => {
  const router = useRouter()
  const { deviceId } = router.query

  return (
    <Sidebar>
      <DeviceConfig deviceId={parseInt(deviceId as string, 10)} />
    </Sidebar>
  )
}

export default DeviceConfigPage
