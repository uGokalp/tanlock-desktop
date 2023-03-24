import localforage from "localforage"

import { Device } from "@/db/types"
import { uuid } from "@/db/utils"

class DeviceCrud {
  get = async (id: number) => {
    const users = await localforage.getItem<Device[]>("device")
    if (users === null) {
      await localforage.setItem("device", [])
      return []
    }
    const device = users.find((u) => u.id === id)
    return device
  }
  list = async () => {
    const users = await localforage.getItem<Device[]>("device")
    if (users === null) {
      await localforage.setItem("device", [])
      return []
    }
    return users
  }
  create = async (device: Device) => {
    const users = await localforage.getItem<Device[]>("device")
    if (users === null) {
      const record = { ...device, id: uuid([]) }
      await localforage.setItem("device", [record])
      return true
    }
    const record = { ...device, id: uuid(users) }
    const res = await localforage.setItem("device", [...users, record])
    return Boolean(res)
  }
  update = async (device: Device) => {
    const users = await localforage.getItem<Device[]>("device")
    const oldDevice = users?.find((u) => u.id === device.id)
    if (!oldDevice || users === null) return false
    const newDevice = { ...device, id: oldDevice.id }
    const newDevices = users.filter((u) => u.id !== device.id)
    const res = await localforage.setItem(
      "device",
      [...newDevices, newDevice].sort((a, b) => a.id - b.id),
    )
    return Boolean(res)
  }

  delete = async (device: Device) => {
    const users = await localforage.getItem<Device[]>("device")
    if (users === null) return false
    const newDevices = users.filter((u) => u.id !== device.id)
    const res = await localforage.setItem(
      "device",
      newDevices.sort((a, b) => a.id - b.id),
    )
    return Boolean(res)
  }
}

const deviceCrud = new DeviceCrud()
export default deviceCrud
