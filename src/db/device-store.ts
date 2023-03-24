import localforage from "localforage"
import { omitBy } from "lodash-es"

import {
  Device,
  DeviceBaseData,
  DeviceGroup,
  DeviceGroupXref,
  DeviceWithGroups,
  Medium,
} from "@/db/types"
import { uuid } from "@/db/utils"

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
    const newDevices = [...devices, { ...record, id: uuid(devices) }]
    const res = await localforage.setItem("device", newDevices)
    return Boolean(res)
  }

  async deleteDevices(ids: number[]) {
    const devices = await this.selectDevices()
    const newDevices = devices.filter((user) => !ids.includes(user.id))
    const res = await localforage.setItem("device", newDevices)
    const deviceGroupXref = await localforage.getItem<DeviceGroupXref[]>(
      "deviceGroupXref",
    )
    if (deviceGroupXref) {
      const newDeviceGroupXref = deviceGroupXref.filter(
        (xref) => !ids.includes(xref.device_id),
      )
      await localforage.setItem("deviceGroupXref", newDeviceGroupXref)
    }
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
      { ...record, id: uuid(deviceGroups) },
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
      id: uuid(devices),
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

  async listMediums(): Promise<Medium[]> {
    const mediums = await localforage.getItem<Medium[]>("mediums")
    if (mediums) {
      return mediums
    }
    await localforage.setItem("mediums", [])
    return []
  }

  async createMedium(record: Omit<Medium, "id">) {
    const mediums = await this.listMediums()
    const newDevices = [...mediums, { ...record, id: uuid(mediums) }]
    const res = await localforage.setItem("mediums", newDevices)
    return Boolean(res)
  }

  async deleteMediums(ids: number[]) {
    const mediums = await this.listMediums()
    const newMediums = mediums.filter((user) => !ids.includes(user.id))
    const res = await localforage.setItem("mediums", newMediums)
    return Boolean(res)
  }

  // Todo: change this to use api
  async updateBasedata(ip: string, basedata: DeviceBaseData) {
    const devices = await this.selectDevices()
    const newDevices = devices.map((device) => {
      if (device.network__ip === ip) {
        return {
          ...device,
          device__name: basedata.name,
          device__location: basedata.location,
          device__contact: basedata.contact,
        }
      }
      return device
    })
    const res = await localforage.setItem("device", newDevices)
    return Boolean(res)
  }

  // Todo: refactor to crud model
  async deleteDeviceGroups(ids: number[]): Promise<boolean> {
    const deviceGroups = await localforage.getItem<DeviceGroup[]>("deviceGroups")
    if (!deviceGroups) return false
    const deviceGroupXref = await localforage.getItem<DeviceGroupXref[]>(
      "deviceGroupXref",
    )
    if (deviceGroupXref) {
      const newDeviceGroupXref = deviceGroupXref.filter(
        (xref) => !ids.includes(xref.group_id),
      )
      await localforage.setItem("deviceGroupXref", newDeviceGroupXref)
    }
    const newDeviceGroups = deviceGroups.filter((group) => !ids.includes(group.id))
    await localforage.setItem("deviceGroups", newDeviceGroups)
    return true
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
