import { Spinner } from "flowbite-react"

import UserListTable from "@/components/Table/UserListTable"
import { useUsers } from "@/hooks/db/useUsers"
import Sidebar from "@/layouts/Sidebar"

const UserList = () => {
  const { data, isLoading } = useUsers()
  // console.log(data)
  return (
    <Sidebar>
      {isLoading && (
        <div className="text-center">
          <Spinner size="xl" />
        </div>
      )}
      {data && <UserListTable data={data} />}
    </Sidebar>
  )
}

export default UserList
