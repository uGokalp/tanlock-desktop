import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"

import CheckboxTable from "@/components/Table/CheckboxTable"
import deviceStore from "@/db/device-store"
import { DeviceGroup } from "@/db/types"
import { useDeviceGroups } from "@/hooks/db/useDeviceGroups"

type DeviceListTableProps = {
  data: DeviceGroup[]
}
const columnHelper = createColumnHelper<DeviceGroup>()

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

const DeviceGroupTable: React.FC<DeviceListTableProps> = ({ data }) => {
  const queryClient = useQueryClient()
  const deviceGroups = useDeviceGroups()
  const deleteUsers = useMutation({
    mutationFn: async (ids: number[]) => {
      return await deviceStore.deleteDeviceGroups(ids)
    },
    onSuccess: async () => {
      await deviceGroups.refetch()
      await queryClient.invalidateQueries({ queryKey: ["db-device"] })
    },
  })
  return (
    <div className="py-3">
      <CheckboxTable
        data={data}
        columns={columns}
        onDelete={deleteUsers.mutate}
        header="Device Groups"
      />
    </div>
  )
}

export default DeviceGroupTable
