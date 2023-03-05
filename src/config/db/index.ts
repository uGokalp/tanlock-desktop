import Repository from "@/config/db/repository"
import {
  DeviceListSchema,
  User,
  UserGroup,
  UserGroupListSchema,
  UserListSchema,
} from "@/config/db/types"
import { DeviceInfo, deviceInfotoDevice } from "@/types/types"

// turn above into zod

class Db {
  async getUsers() {
    try {
      const users = await Repository.selectUsers()
      return UserListSchema.parse(users)
    } catch (err) {
      console.error(err)
      throw new Error("Error getting users")
    }
  }

  async getUserGroups() {
    try {
      const userGroups = await Repository.listUserGroups()
      return UserGroupListSchema.parse(userGroups)
    } catch (err) {
      console.error(err)
      throw new Error("Error getting users")
    }
  }

  async getDevices() {
    try {
      const users = await Repository.selectDevices()
      return DeviceListSchema.parse(users)
    } catch (err) {
      console.error(err)
      throw new Error("Error getting users")
    }
  }

  async insertUser(user: User) {
    try {
      const out = await Repository.createUser(user)
      return out
    } catch (err) {
      console.error(err)
      throw new Error("Error inserting users")
    }
  }

  async insertUsers(users: User[]) {
    try {
      const out = await Promise.all(users.map((user) => Repository.createUser(user)))
      return out
    } catch (err) {
      console.error(err)
      throw new Error("Error inserting users")
    }
  }

  async insertUserGroup(userGroup: UserGroup) {
    try {
      const out = await Repository.createUserGroup(userGroup)
      return out
    } catch (err) {
      console.error(err)
      throw new Error("Error inserting users")
    }
  }

  async insertDevices(devices: DeviceInfo[]) {
    try {
      const out = await Promise.all(
        devices.map((device) => Repository.createDevices(deviceInfotoDevice(device))),
      )
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
