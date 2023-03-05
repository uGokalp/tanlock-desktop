import { createColumnHelper } from "@tanstack/react-table"

import BaseTable from "@/components/BaseTable"
import { User } from "@/config/db/types"

type UserListTableProps = {
  data: User[]
}
const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor("login", {
    cell: (info) => info.getValue(),
    header: () => <span>Login</span>,
  }),
  columnHelper.accessor("cname", {
    cell: (info) => info.getValue(),
    header: () => <span>Cname</span>,
  }),
  columnHelper.accessor("employee", {
    cell: (info) => info.getValue(),
    header: () => <span>Employee</span>,
  }),
  columnHelper.accessor("active", {
    cell: (info) => info.getValue().toString(),
    header: () => <span>Active</span>,
  }),
  columnHelper.accessor("four_eye", {
    cell: (info) => info.getValue().toString(),
    header: () => <span>Four Eye</span>,
  }),
]

const UserListTable: React.FC<UserListTableProps> = ({ data }) => {
  return (
    <div className="py-3">
      <BaseTable data={data} columns={columns} />
    </div>
  )
}

export default UserListTable
