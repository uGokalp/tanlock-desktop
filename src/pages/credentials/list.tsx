import { Spinner } from "flowbite-react"

import MediumListTable from "@/components/Table/MediumListTable"
import { useMediums } from "@/hooks/db/useMediums"
import Sidebar from "@/layouts/Sidebar"

const MediumList = () => {
  const { data, isLoading } = useMediums()
  return (
    <Sidebar>
      {isLoading && (
        <div className="text-center">
          <Spinner size="xl" />
        </div>
      )}
      {data && <MediumListTable data={data} />}
    </Sidebar>
  )
}

export default MediumList
