import deviceStore from "@/db/device-store"
import {
  DeviceListSchema,
  Medium,
  MediumListSchema,
  User,
  UserGroup,
  UserGroupListSchema,
  UserListSchema,
} from "@/db/types"
import userStore from "@/db/user-store"
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
      console.log(userGroups)
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
  async listMediums() {
    try {
      const mediums = await deviceStore.listMediums()
      return MediumListSchema.parse(mediums)
    } catch (err) {
      console.error(err)
      throw new Error("Error listing mediums")
    }
  }
  async insertMedium(medium: Omit<Medium, "id">) {
    try {
      const res = await deviceStore.createMedium(medium)
      return res
    } catch (err) {
      console.error(err)
      throw new Error("Error inserting mediums")
    }
  }
}
const db = new Db()
export default db
