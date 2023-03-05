import { createColumnHelper } from "@tanstack/react-table"

import BaseTable from "@/components/BaseTable"
import { DeviceGroup } from "@/config/db/types"

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
  return (
    <div className="py-3">
      <BaseTable data={data} columns={columns} />
    </div>
  )
}

export default DeviceGroupTable
