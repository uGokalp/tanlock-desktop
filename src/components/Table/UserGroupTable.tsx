import { useMutation } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"

import CheckboxTable from "@/components/Table/CheckboxTable"
import { queryClient } from "@/config/queryClient"
import { UserGroup } from "@/db/types"
import userStore from "@/db/user-store"
import { useUserGroups } from "@/hooks/db/useUserGroups"

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
  const userGroups = useUserGroups()
  const deleteUsers = useMutation({
    mutationFn: async (ids: number[]) => {
      await userStore.deleteUserGroups(ids)
    },
    onSuccess: async () => {
      await userGroups.refetch()
      await queryClient.refetchQueries(["db-user-groups", "db-users-in-groups"])
    },
  })
  return (
    <div className="py-3">
      <CheckboxTable
        data={data}
        columns={columns}
        onDelete={deleteUsers.mutate}
        header="User Groups"
      />
    </div>
  )
}

export default UserGroupTable
