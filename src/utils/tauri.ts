import type { InvokeArgs } from "@tauri-apps/api/tauri"

const isNode = (): boolean =>
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

interface Options {
  /** Notification title. */
  title: string
  /** Optional notification body. */
  body?: string
  /** Optional notification icon. */
  icon?: string
}

export const sendNotification = async (options: Options) => {
  if (isNode()) {
    // This shouldn't ever happen when React fully loads
    return Promise.resolve(undefined as unknown)
  }
  const { isPermissionGranted, requestPermission, sendNotification } = await import(
    "@tauri-apps/api/notification"
  )
  let permissionGranted = await isPermissionGranted()
  if (!permissionGranted) {
    const permission = await requestPermission()
    permissionGranted = permission === "granted"
  }
  return sendNotification(options)
}

export const resourcePath = async (path: string): Promise<string> => {
  if (isNode()) {
    // This shouldn't ever happen when React fully loads
    return Promise.resolve("undefined")
  }
  const { resolveResource } = await import("@tauri-apps/api/path")
  return await resolveResource(path)
}
