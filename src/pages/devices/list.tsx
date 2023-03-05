import { Spinner } from "flowbite-react"

import DeviceListTable from "@/components/Table/DeviceListTable"
import { useDevices } from "@/hooks/db/useDevices"
import Sidebar from "@/layouts/Sidebar"

const DeviceList = () => {
  const { data, isLoading } = useDevices()
  return (
    <Sidebar>
      {isLoading && (
        <div className="text-center">
          <Spinner size="xl" />
        </div>
      )}
      {data && <DeviceListTable data={data} />}
    </Sidebar>
  )
}

export default DeviceList
