import { createColumnHelper } from "@tanstack/react-table"

import CheckboxTable from "@/components/Table/CheckboxTable"
import { Medium } from "@/db/types"
import { useDeleteMediums } from "@/hooks/db/useMediums"

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
  return (
    <div className="py-3">
      <CheckboxTable
        data={data}
        columns={columns}
        onDelete={deleteMediums.mutate}
        header={"Mediums"}
      />
    </div>
  )
}

export default MediumListTable
