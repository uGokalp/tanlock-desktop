import localforage from "localforage"
import { omitBy } from "lodash-es"

import {
  Device,
  DeviceGroup,
  DeviceGroupXref,
  DeviceWithGroups,
} from "@/config/db/types"

const uuid = () => Date.now() + Math.random()

class DeviceStore {
  async selectDevices() {
    const res = await localforage.getItem<Device[]>("device")
    if (res) {
      return res
    }
    await localforage.setItem("device", [])
    return []
  }

  async createDevices(record: Omit<Device, "id">) {
    const devices = await this.selectDevices()
    const newDevices = [...devices, { ...record, id: uuid() }]
    const res = await localforage.setItem("device", newDevices)
    return Boolean(res)
  }

  async listDeviceGroups(): Promise<DeviceGroup[]> {
    const deviceGroups = await localforage.getItem<DeviceGroup[]>("deviceGroups")
    if (deviceGroups) {
      return deviceGroups
    }
    await localforage.setItem("deviceGroups", [])
    return []
  }

  async createDeviceGroup(record: DeviceGroup): Promise<boolean> {
    const deviceGroups = await this.listDeviceGroups()
    await localforage.setItem("deviceGroups", [
      ...deviceGroups,
      { ...record, id: uuid() },
    ])
    return true
  }

  async getDevicesByGroupId(id: number): Promise<Device[]> {
    const deviceGroupXref =
      (await localforage.getItem<DeviceGroupXref[]>("deviceGroupXref")) || []
    const deviceGroups = await localforage.getItem<DeviceGroup[]>("deviceGroups")
    const devices = await localforage.getItem<Device[]>("device")
    if (!deviceGroups || !devices) {
      return []
    }
    const deviceGroup = deviceGroups.find((group) => group.id === id)
    if (!deviceGroup) {
      return []
    }
    const deviceIds = deviceGroupXref
      .filter((xref) => xref.group_id === id)
      .map((xref) => xref.device_id)
    const deviceList = devices.filter((device) => deviceIds.includes(device.id))
    return deviceList
  }

  async insertDevicesToGroupId(group_id: number, devices: Device[]): Promise<boolean> {
    const ids = devices.map((device) => device.id)
    const deviceGroupXref =
      (await localforage.getItem<DeviceGroupXref[]>("deviceGroupXref")) || []
    const newDeviceGroupXrefs = ids.map((id) => ({
      group_id,
      device_id: id,
      id: uuid(),
    }))
    const newDeviceGroupXref = [...deviceGroupXref, ...newDeviceGroupXrefs]
    await localforage.setItem("deviceGroupXref", newDeviceGroupXref)
    return true
  }

  async removeDevicesFromGroupId(
    group_id: number,
    devices: Device[],
  ): Promise<boolean[]> {
    const ids = devices.map((device) => device.id)
    const deviceGroups = await localforage.getItem<DeviceGroup[]>("deviceGroups")
    const newDeviceGroups = omitBy(deviceGroups, { id: group_id })
    await localforage.setItem("deviceGroups", newDeviceGroups)
    return ids.map(() => true)
  }

  async updateDevicesToGroupId(group_id: number, Devices: Device[]): Promise<unknown> {
    const currentDevices = await this.getDevicesByGroupId(group_id)
    const { toAdd, toRemove } = compareDevices(currentDevices, Devices)
    console.log({ toAdd, toRemove })
    const awaitable = []
    if (toAdd.length) awaitable.push(this.insertDevicesToGroupId(group_id, toAdd))
    if (toRemove.length)
      awaitable.push(this.removeDevicesFromGroupId(group_id, toRemove))
    return await Promise.all(awaitable)
  }

  async listDevicesInGroups(): Promise<DeviceWithGroups[]> {
    const deviceGroupXref = await localforage.getItem<DeviceGroupXref[]>(
      "deviceGroupXref",
    )
    const deviceGroups = await localforage.getItem<DeviceGroup[]>("deviceGroups")
    const devices = await localforage.getItem<Device[]>("device")
    if (!deviceGroupXref || !deviceGroups || !devices) return []
    return []
  }
}

function compareDevices(currentDevices: Device[], newDevices: Device[]) {
  const toAdd: Device[] = []
  const toRemove: Device[] = []
  currentDevices.forEach((Device) => {
    if (!newDevices.find((u) => u.id === Device.id)) toRemove.push(Device)
  })
  newDevices.forEach((Device) => {
    if (!currentDevices.find((u) => u.id === Device.id)) toAdd.push(Device)
  })
  return { toAdd, toRemove }
}
const deviceStore = new DeviceStore()
export default deviceStore
