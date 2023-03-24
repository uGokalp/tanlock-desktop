import { useRouter } from "next/router"

import UserConfig from "@/components/Users/UserConfig"
import Sidebar from "@/layouts/Sidebar"

const UserConfigPage = () => {
  const router = useRouter()
  const { userId } = router.query

  return (
    <Sidebar>
      <UserConfig userId={parseInt(userId as string, 10)} />
    </Sidebar>
  )
}

export default UserConfigPage
