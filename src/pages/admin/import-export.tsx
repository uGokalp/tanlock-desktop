import { toast } from "react-toastify"

import Button from "@/components/Button/Button"
import Caution from "@/components/Caution"
import { exportDb } from "@/db/export"
import Sidebar from "@/layouts/Sidebar"
import { onPromise } from "@/utils"
import { dialogReadFile, dialogWriteFile } from "@/utils/tauri"

const ImportExport = () => {
  const onImport = async () => {
    const file = await dialogReadFile()
    console.log(file)
  }
  const onExport = async () => {
    console.log("Export")
    const text = await exportDb()
    if (!text) {
      toast.error("Failed to export")
      return
    }
    await dialogWriteFile(text)
  }
  return (
    <Sidebar>
      <Caution />
      <div className="pt-3 flex gap-5">
        <Button onClick={onPromise(onImport)} size="2xl">
          Import
        </Button>
        <Button onClick={onPromise(onExport)} size="2xl">
          Export
        </Button>
      </div>
    </Sidebar>
  )
}

export default ImportExport
