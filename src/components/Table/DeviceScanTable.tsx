import { createColumnHelper } from "@tanstack/react-table"

import BaseTable from "@/components/BaseTable"
import SpinnerButton from "@/components/Button/SpinnerButton"
import { useInsertDevices } from "@/hooks/db/useDevices"
import { DeviceInfo } from "@/types/types"

type DeviceScanTableProps = {
  data: Array<DeviceInfo>
}

type DeviceTable = {
  name: string
  location: string
  ip: string
}

const columnHelper = createColumnHelper<DeviceTable>()

const columns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: () => <span>Device Name</span>,
  }),
  columnHelper.accessor("location", {
    cell: (info) => info.getValue(),
    header: () => <span>Device Location</span>,
  }),
  columnHelper.accessor("ip", {
    cell: (info) => info.getValue(),
    header: () => <span>Device IP</span>,
  }),
]

const transform = (data: DeviceScanTableProps["data"]): DeviceTable[] => {
  return data.map((info) => {
    return {
      name: info.device.name,
      location: info.device.location,
      ip: info.network.ip,
    }
  })
}

const DeviceScanTable: React.FC<DeviceScanTableProps> = ({ data }) => {
  const devices = transform(data)
  const { mutate: insertDevice, isLoading } = useInsertDevices()
  const onClick = () => {
    insertDevice(data)
  }

  return (
    <div className="py-3">
      <BaseTable data={devices} columns={columns} />
      <div className="float-right pt-2">
        <SpinnerButton isLoading={isLoading} onClick={onClick}>
          Add to database
        </SpinnerButton>
      </div>
    </div>
  )
}

export default DeviceScanTable
