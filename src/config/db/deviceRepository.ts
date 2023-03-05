/* eslint-disable @typescript-eslint/no-unused-vars */

import radoDb from "@/config/db/connector"
import queryBuilder from "@/config/db/queryBuilder"
import { DeviceGroupTable, DeviceGroupXRefTable, DeviceTable } from "@/config/db/schema"
import { Device, DeviceGroup, DeviceWithGroups } from "@/config/db/types"

export default class DeviceRepository {
  static selectDevices(): Promise<Device[]> {
    const query = queryBuilder(DeviceTable().select({ ...DeviceTable }))
    return radoDb.select(query.statement.sql, query.params)
  }
  static createDevices(record: Device): Promise<boolean> {
    const query = queryBuilder(DeviceTable().insertOne(record))
    return radoDb.execute(query.statement.sql, query.params)
  }

  static listDeviceGroups(): Promise<DeviceGroup[]> {
    const query = queryBuilder(DeviceGroupTable().select({ ...DeviceGroupTable }))
    return radoDb.select(query.statement.sql, query.params)
  }

  static createDeviceGroup(record: DeviceGroup): Promise<boolean> {
    const query = queryBuilder(DeviceGroupTable().insertOne(record))
    return radoDb.execute(query.statement.sql, query.params)
  }

  static getDevicesByGroupId(id: number): Promise<Device[]> {
    const query = queryBuilder(
      DeviceGroupXRefTable({ group_id: id })
        .innerJoin(DeviceGroupTable({ id: DeviceGroupXRefTable.group_id }))
        .innerJoin(DeviceTable({ id: DeviceGroupXRefTable.device_id }))
        .select({ ...DeviceTable }),
    )
    return radoDb.select(query.statement.sql, query.params)
  }

  static insertDevicesToGroupId(group_id: number, Devices: Device[]): Promise<boolean> {
    const ids = Devices.map((device) => device.id)
    const query = queryBuilder(
      DeviceGroupXRefTable({ group_id }).insertAll(
        ids.map((id) => ({ group_id, device_id: id })),
      ),
    )
    return radoDb.execute(query.statement.sql, query.params)
  }

  static removeDevicesFromGroupId(
    group_id: number,
    Devices: Device[],
  ): Promise<boolean[]> {
    const ids = Devices.map((device) => device.id)
    const queries = ids.map((id) =>
      queryBuilder(DeviceGroupXRefTable({ group_id, device_id: id }).delete()),
    )
    const result = Promise.all(
      queries.map((query) => radoDb.execute(query.statement.sql, query.params)),
    )
    return result
  }

  static async updateDevicesToGroupId(
    group_id: number,
    Devices: Device[],
  ): Promise<unknown> {
    const currentDevices = await this.getDevicesByGroupId(group_id)
    const { toAdd, toRemove } = compareDevices(currentDevices, Devices)
    console.log({ toAdd, toRemove })
    const awaitable = []
    if (toAdd.length) awaitable.push(this.insertDevicesToGroupId(group_id, toAdd))
    if (toRemove.length)
      awaitable.push(this.removeDevicesFromGroupId(group_id, toRemove))
    return await Promise.all(awaitable)
  }

  static listDevicesInGroups(): Promise<DeviceWithGroups[]> {
    const query = queryBuilder(
      DeviceGroupXRefTable()
        .innerJoin(DeviceGroupTable({ id: DeviceGroupXRefTable.group_id }))
        .innerJoin(DeviceTable({ id: DeviceGroupXRefTable.device_id }))
        .select({
          ...DeviceTable,
          group_id: DeviceGroupXRefTable.group_id,
          group_name: DeviceGroupTable.name,
        }),
    )
    return radoDb.select(query.statement.sql, query.params)
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
