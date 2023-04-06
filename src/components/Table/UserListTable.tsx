import { createColumnHelper } from "@tanstack/react-table"
import { useRouter } from "next/router"
import { toast } from "react-toastify"

import CheckboxTable from "@/components/Table/CheckboxTable"
import { User } from "@/db/types"
import { useDeleteUsers } from "@/hooks/db/useUsers"
import { exportUsers } from "@/utils/tauri"

type UserListTableProps = {
  data: User[]
}
const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: () => <span>Id</span>,
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
  columnHelper.accessor("four_eye", {
    cell: (info) => info.getValue().toString(),
    header: () => <span>Four Eye</span>,
  }),
]

const UserListTable: React.FC<UserListTableProps> = ({ data }) => {
  const deleteUsers = useDeleteUsers()
  const router = useRouter()
  const onEdit = (id: number) => {
    void router.push(`/users/${id}`)
  }
  const onExport = (data: User[]) => {
    exportUsers(data)
      .then(() => toast.success("Users exported successfully!"))
      .catch((e) => {
        if (e instanceof Error) toast.error(e.message)
        else toast.error("Error exporting users!")
      })
  }
  return (
    <div className="py-3">
      <CheckboxTable
        data={data}
        columns={columns}
        onDelete={deleteUsers.mutate}
        header="Users"
        onEdit={onEdit}
        onExport={onExport}
      />
    </div>
  )
}

export default UserListTable
