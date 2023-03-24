import { createColumnHelper } from "@tanstack/react-table"

import BaseTable from "@/components/BaseTable"
import { UserSchema } from "@/types/types"

type Props = {
  users: UserSchema[]
}

const DeviceConfigUserList = ({ users }: Props) => {
  const columnHelper = createColumnHelper<UserSchema>()
  const columns = [
    columnHelper.accessor("uid", {
      cell: (info) => info.getValue(),
      header: () => <span>UID</span>,
    }),
    columnHelper.accessor("login", {
      cell: (info) => info.getValue(),
      header: () => <span>Login</span>,
    }),
    columnHelper.accessor("cname", {
      cell: (info) => info.getValue(),
      header: () => <span>Common Name</span>,
    }),
    columnHelper.accessor("employee", {
      cell: (info) => info.getValue(),
      header: () => <span>Employee Number</span>,
    }),
    columnHelper.accessor("active", {
      cell: (info) => info.getValue().toString(),
      header: () => <span>Active</span>,
    }),
    columnHelper.accessor("fourEye", {
      cell: (info) => info.getValue().toString(),
      header: () => <span>Four Eye</span>,
    }),
  ]
  return (
    <div>
      <BaseTable data={users.sort((a, b) => a.uid - b.uid)} columns={columns} />
    </div>
  )
}

export default DeviceConfigUserList
