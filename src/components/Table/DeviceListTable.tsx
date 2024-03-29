import { createColumnHelper } from "@tanstack/react-table"
import { useRouter } from "next/router"
import { useState } from "react"
import { toast } from "react-toastify"

import CheckboxTable from "@/components/Table/CheckboxTable"
import { Device, DeviceSchema } from "@/db/types"
import { useDeleteDevices } from "@/hooks/db/useDevices"
import { exportDevices } from "@/utils/tauri"

const keyToName = (key: string) => {
  return key
    .split("__")
    .map((k) => k[0].toUpperCase() + k.slice(1))
    .join(" ")
}

type DeviceListTableProps = {
  data: Device[]
}
const columnHelper = createColumnHelper<Device>()

const keys = DeviceSchema.keyof()
export const allColumns = keys.options.map((key) => {
  return columnHelper.accessor(key, {
    cell: (info) => info.getValue(),
    header: () => <span>{keyToName(key)}</span>,
  })
})

const DeviceListTable: React.FC<DeviceListTableProps> = ({ data }) => {
  const [filtersIsOpen, setFiltersIsOpen] = useState<boolean>(false)
  const [columns, setColumns] = useState<typeof allColumns>(allColumns)
  const deleteDevices = useDeleteDevices()
  //Dispatch<SetStateAction<ColumnDef
  const router = useRouter()
  const onEdit = (id: number) => {
    void router.push(`/devices/${id}`)
  }
  const onExport = (data: Device[]) => {
    exportDevices(data)
      .then(() => toast.success("Devices exported successfully!"))
      .catch((e) => {
        if (e instanceof Error) toast.error(e.message)
        else toast.error("Error exporting devices!")
      })
  }

  return (
    <div className="py-3">
      {/* <div className="flex justify-end py-3">
        <button
          onClick={() => setFiltersIsOpen(!filtersIsOpen)}
          type="button"
          className="group flex items-center rounded-md bg-white py-2 pl-2 pr-1 text-left text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <div>
            <span className="flex-1">Open Filters</span>
            <FunnelIcon
              className="ml-2 flex text-gray-500"
              style={{ height: 20, width: 20 }}
            />
          </div>
        </button>
        <DeviceFilters
          open={filtersIsOpen}
          setOpen={setFiltersIsOpen}
          columnKeys={keys}
          setColumns={setColumns}
        />
      </div> */}

      <CheckboxTable
        data={data}
        columns={columns}
        header="Devices"
        onDelete={deleteDevices.mutate}
        onEdit={onEdit}
        onExport={onExport}
      />
    </div>
  )
}

export default DeviceListTable
