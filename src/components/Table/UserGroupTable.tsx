import { createColumnHelper } from "@tanstack/react-table"

import BaseTable from "@/components/BaseTable"
import { UserGroup } from "@/config/db/types"

type UserListTableProps = {
  data: UserGroup[]
}
const columnHelper = createColumnHelper<UserGroup>()

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: () => <span>Id</span>,
  }),
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: () => <span>Name</span>,
  }),
]

const UserGroupTable: React.FC<UserListTableProps> = ({ data }) => {
  return (
    <div className="py-3">
      <BaseTable data={data} columns={columns} />
    </div>
  )
}

export default UserGroupTable
