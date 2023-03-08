import deviceStore from "@/config/db/device-store"
import {
  DeviceListSchema,
  User,
  UserGroup,
  UserGroupListSchema,
  UserListSchema,
} from "@/config/db/types"
import userStore from "@/config/db/user-store"
import { DeviceInfo, deviceInfotoDevice } from "@/types/types"

// turn above into zod

class Db {
  async getUsers() {
    try {
      const users = await userStore.selectUsers()
      return UserListSchema.parse(users)
    } catch (err) {
      console.error(err)
      throw new Error("Error getting users")
    }
  }

  async getUserGroups() {
    try {
      const userGroups = await userStore.listUserGroups()
      return UserGroupListSchema.parse(userGroups)
    } catch (err) {
      console.error(err)
      throw new Error("Error getting users")
    }
  }

  async getDevices() {
    try {
      const devices = await deviceStore.selectDevices()
      return DeviceListSchema.parse(devices)
    } catch (err) {
      console.error(err)
      throw new Error("Error getting devices")
    }
  }

  async insertUser(user: User) {
    try {
      const out = await userStore.createUser(user)
      return out
    } catch (err) {
      console.error(err)
      throw new Error("Error inserting users")
    }
  }

  async insertUsers(users: User[]) {
    try {
      const out = []
      for (const user of users) {
        const res = await userStore.createUser(user)
        out.push(res)
      }
      return out
    } catch (err) {
      console.error(err)
      throw new Error("Error inserting users")
    }
  }

  async insertUserGroup(userGroup: UserGroup) {
    try {
      const out = await userStore.createUserGroup(userGroup)
      return out
    } catch (err) {
      console.error(err)
      throw new Error("Error inserting users")
    }
  }

  async insertDevices(devices: DeviceInfo[]) {
    try {
      const out = []
      for (const device of devices) {
        const res = await deviceStore.createDevices(deviceInfotoDevice(device))
        out.push(res)
      }
      return out
    } catch (err) {
      console.error(err)
      throw new Error("Error inserting users")
    }
  }
}
const db = new Db()
export default db

export type DeviceInfo2 = {
  device: {
    name: string
    contact: string
    location: string
    serialno: string
  }
  network: {
    macaddr: string
    ip: string
    netmask: string
    dns: string
    gateway: string
  }
  relais: {
    r1: boolean
    r0: boolean
  }
  time: {
    time: string
    offset: string
    invalid: boolean
    stamp: number
  }
  version: {
    filesystem: string
    hwdesc: string
    software: string
    flavor: string
    hash: string
    branch: string
    firmware: string
    build: string
    date: string
    hardware: string
  }
  external: {
    s2: boolean
    s1: boolean
  }
  sensor: {
    lock: boolean
    handle: boolean
    motor: boolean
  }
}
