import type { InvokeArgs } from "@tauri-apps/api/tauri"

import { Device, Medium, User } from "@/db/types"

export const isNode = (): boolean =>
  Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) ===
  "[object process]"

export async function invoke<T>(
  cmd: string,
  args?: InvokeArgs | undefined,
): Promise<T> {
  if (isNode()) {
    // This shouldn't ever happen when React fully loads
    return Promise.resolve(undefined as unknown as T)
  }
  const tauriAppsApi = await import("@tauri-apps/api")
  const tauriInvoke = tauriAppsApi.invoke
  return tauriInvoke(cmd, args)
}

export const tauriDbExists = async () => {
  return await invoke<boolean>("does_db_exist")
}

export function isFulfilled<T>(
  val: PromiseSettledResult<T>,
): val is PromiseFulfilledResult<T> {
  return val.status === "fulfilled"
}

export const dialogReadFile = async <T>() => {
  if (isNode()) {
    // This shouldn't ever happen when React fully loads
    return Promise.resolve(undefined)
  }
  const { open } = await import("@tauri-apps/api/dialog")
  const { readTextFile } = await import("@tauri-apps/api/fs")
  try {
    const selectedPath = await open({
      multiple: false,
      title: "Select db file",
      filters: [{ name: "db", extensions: ["json"] }],
    })
    if (selectedPath === null) {
      return undefined
    }
    const text = await readTextFile(selectedPath as string)
    return JSON.parse(text) as T
  } catch (e) {
    console.error("Error reading file", e)
    return undefined
  }
}

export const dialogWriteFile = async (data: string) => {
  if (isNode()) {
    // This shouldn't ever happen when React fully loads
    return Promise.resolve(undefined)
  }
  const { save } = await import("@tauri-apps/api/dialog")
  const { writeTextFile } = await import("@tauri-apps/api/fs")
  const { documentDir, delimiter } = await import("@tauri-apps/api/path")
  try {
    const dir = await documentDir()
    const selectedPath = await save({
      filters: [{ name: "db", extensions: ["json"] }],
      title: "Save db file",
      defaultPath: `${dir}${delimiter}db.json`,
    })
    if (selectedPath === null) {
      return undefined
    }
    await writeTextFile(selectedPath, data)
    return selectedPath
  } catch (e) {
    console.error("Error writing file", e)
    return undefined
  }
}

export const exportUsers = async (data: User[]) => {
  if (isNode()) {
    // This shouldn't ever happen when React fully loads
    return Promise.resolve(undefined)
  }
  const { save } = await import("@tauri-apps/api/dialog")
  const { documentDir, delimiter } = await import("@tauri-apps/api/path")
  const dir = await documentDir()
  const path = await save({
    filters: [{ name: "csv", extensions: ["csv"] }],
    title: "Save users file",
    defaultPath: `${dir}${delimiter}users.csv`,
  })
  if (path === null) {
    throw new Error("No path selected!")
  }
  const res = await invoke<boolean>("users_to_csv", { path, data })
  return res
}

export const exportDevices = async (devices: Device[]) => {
  if (isNode()) {
    // This shouldn't ever happen when React fully loads
    return Promise.resolve(undefined)
  }
  const { save } = await import("@tauri-apps/api/dialog")
  const { documentDir, delimiter } = await import("@tauri-apps/api/path")
  const dir = await documentDir()
  const path = await save({
    filters: [{ name: "csv", extensions: ["csv"] }],
    title: "Save devices file",
    defaultPath: `${dir}${delimiter}devices.csv`,
  })
  if (path === null) {
    throw new Error("No path selected!")
  }
  const data = devices.map((d) => ({
    id: d.id,
    name: d.device__name,
    ip: d.network__ip,
    location: d.device__location,
    contact: d.device__contact,
  }))
  const res = await invoke<boolean>("devices_to_csv", { path, data })
  return res
}

export const exportMediums = async (data: Medium[]) => {
  if (isNode()) {
    // This shouldn't ever happen when React fully loads
    return Promise.resolve(undefined)
  }
  const { save } = await import("@tauri-apps/api/dialog")
  const { documentDir, delimiter } = await import("@tauri-apps/api/path")
  const dir = await documentDir()
  const path = await save({
    filters: [{ name: "csv", extensions: ["csv"] }],
    title: "Save mediums file",
    defaultPath: `${dir}${delimiter}mediums.csv`,
  })
  if (path === null) {
    throw new Error("No path selected!")
  }
  const res = await invoke<boolean>("mediums_to_csv", { path, data })
  return res
}
