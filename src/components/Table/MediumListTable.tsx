import { createColumnHelper } from "@tanstack/react-table"
import { toast } from "react-toastify"

import CheckboxTable from "@/components/Table/CheckboxTable"
import { Medium } from "@/db/types"
import { useDeleteMediums } from "@/hooks/db/useMediums"
import { exportMediums } from "@/utils/tauri"

type MediumListTableProps = {
  data: Medium[]
}
const columnHelper = createColumnHelper<Medium>()

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: () => <span>Id</span>,
  }),
  columnHelper.accessor("login", {
    cell: (info) => info.getValue(),
    header: () => <span>Login</span>,
  }),
  columnHelper.accessor("type", {
    cell: (info) => info.getValue(),
    header: () => <span>Type</span>,
  }),
  columnHelper.accessor("identifier", {
    cell: (info) => info.getValue(),
    header: () => <span>Identifier</span>,
  }),
  columnHelper.accessor("start", {
    cell: (info) => info.getValue().toString(),
    header: () => <span>Start</span>,
  }),
  columnHelper.accessor("next", {
    cell: (info) => info.getValue().toString(),
    header: () => <span>Next</span>,
  }),
]

const MediumListTable: React.FC<MediumListTableProps> = ({ data }) => {
  const deleteMediums = useDeleteMediums()
  const onExport = (data: Medium[]) => {
    exportMediums(data)
      .then(() => toast.success("Mediums exported successfully!"))
      .catch((e) => {
        if (e instanceof Error) toast.error(e.message)
        else toast.error("Error exporting mediums!")
      })
  }
  return (
    <div className="py-3">
      <CheckboxTable
        data={data}
        columns={columns}
        onDelete={deleteMediums.mutate}
        header={"Mediums"}
        onExport={onExport}
      />
    </div>
  )
}

export default MediumListTable
