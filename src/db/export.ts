import Dexie from "dexie"

import { isNode } from "@/utils/tauri"

export const exportDb = async () => {
  console.log("exporting db")
  if (isNode()) {
    // This shouldn't ever happen when React fully loads
    return Promise.resolve(undefined)
  }
  const { exportDB } = await import("dexie-export-import")
  const db = new Dexie("localforage")
  await db.open()
  console.log(db.tables)
  const data = await exportDB(db)
  return await data.text()
}
