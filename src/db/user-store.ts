import localforage from "localforage"
import { omitBy } from "lodash-es"

import { User, UserGroup, UserGroupXref } from "@/db/types"
import { uuid } from "@/db/utils"

class UserStore {
  async selectUsers() {
    const res = await localforage.getItem<User[]>("user")
    if (res) {
      return res
    }
    await localforage.setItem("user", [])
    return []
  }

  async createUser(record: Omit<User, "id">) {
    const users = await this.selectUsers()
    const newUsers = [...users, { ...record, id: uuid(users) }]
    const res = await localforage.setItem("user", newUsers)
    return Boolean(res)
  }

  async createUsers(record: Omit<User, "id">) {
    const users = await this.selectUsers()
    const newUsers = [...users, { ...record, id: uuid(users) }]
    const res = await localforage.setItem("user", newUsers)
    return Boolean(res)
  }

  async deleteUsers(ids: number[]) {
    const users = await this.selectUsers()
    const newUsers = users.filter((user) => !ids.includes(user.id))
    const res = await localforage.setItem("user", newUsers)
    const userGroupXref = await localforage.getItem<UserGroupXref[]>("userGroupXref")
    if (userGroupXref) {
      const newUserGroupXref = userGroupXref.filter(
        (xref) => !ids.includes(xref.user_id),
      )
      await localforage.setItem("userGroupXref", newUserGroupXref)
    }
    return Boolean(res)
  }

  async listUserGroups(): Promise<UserGroup[]> {
    const userGroups = await localforage.getItem<UserGroup[]>("userGroups")
    if (userGroups) {
      return userGroups
    }
    await localforage.setItem("userGroups", [])
    return []
  }

  async createUserGroup(record: UserGroup): Promise<boolean> {
    const userGroups = await this.listUserGroups()
    await localforage.setItem("userGroups", [
      ...userGroups,
      { ...record, id: uuid(userGroups) },
    ])
    return true
  }

  async getUsersByGroupId(id: number): Promise<User[]> {
    const userGroupXref =
      (await localforage.getItem<UserGroupXref[]>("userGroupXref")) || []
    const userGroups = await localforage.getItem<UserGroup[]>("userGroups")
    const users = await localforage.getItem<User[]>("user")
    if (!userGroups || !users) {
      return []
    }
    const userGroup = userGroups.find((group) => group.id === id)
    if (!userGroup) {
      return []
    }
    const userIds = userGroupXref
      .filter((xref) => xref.group_id === id)
      .map((xref) => xref.user_id)
    const userList = users.filter((User) => userIds.includes(User.id))
    return userList
  }

  async insertUsersToGroupId(group_id: number, users: User[]): Promise<boolean> {
    const ids = users.map((user) => user.id)
    const userGroupXref =
      (await localforage.getItem<UserGroupXref[]>("userGroupXref")) || []
    const newUserGroupXrefs = ids.map((id) => ({
      group_id,
      user_id: id,
      id: uuid(users),
    }))
    const newUserGroupXref = [...userGroupXref, ...newUserGroupXrefs]
    await localforage.setItem("userGroupXref", newUserGroupXref)
    return true
  }

  async removeUsersFromGroupId(group_id: number, users: User[]): Promise<boolean[]> {
    const ids = users.map((User) => User.id)
    const userGroups = await localforage.getItem<UserGroup[]>("userGroups")
    const newUserGroups = omitBy(userGroups, { id: group_id })
    await localforage.setItem("userGroups", newUserGroups)
    return ids.map(() => true)
  }

  async updateUsersToGroupId(group_id: number, Users: User[]): Promise<unknown> {
    const currentUsers = await this.getUsersByGroupId(group_id)
    const { toAdd, toRemove } = compareUsers(currentUsers, Users)
    console.log({ toAdd, toRemove })
    const awaitable = []
    if (toAdd.length) awaitable.push(this.insertUsersToGroupId(group_id, toAdd))
    if (toRemove.length) awaitable.push(this.removeUsersFromGroupId(group_id, toRemove))
    return await Promise.all(awaitable)
  }

  async listUsersInGroups(): Promise<User[]> {
    const userGroupXref = await localforage.getItem<UserGroupXref[]>("userGroupXref")
    const userGroups = await localforage.getItem<UserGroup[]>("userGroups")
    const users = await localforage.getItem<User[]>("user")
    if (!userGroupXref || !userGroups || !users) return []

    return users.filter((user) => {
      const xref = userGroupXref.filter((xref) => xref.user_id === user.id)
      const groupIds = xref.map((xref) => xref.group_id)
      const groups = userGroups.filter((group) => groupIds.includes(group.id))
      return groups.length > 0
    })
  }

  // Todo: refactor to crud model
  async deleteUserGroups(ids: number[]): Promise<boolean> {
    const userGroups = await localforage.getItem<UserGroup[]>("userGroups")
    if (!userGroups) return false
    const userGroupXref = await localforage.getItem<UserGroupXref[]>("userGroupXref")

    if (userGroupXref) {
      const newUserGroupXref = userGroupXref.filter(
        (xref) => !ids.includes(xref.group_id),
      )
      await localforage.setItem("userGroupXref", newUserGroupXref)
    }
    const newUserGroups = userGroups.filter((group) => !ids.includes(group.id))
    await localforage.setItem("userGroups", newUserGroups)
    return true
  }
}

function compareUsers(currentUsers: User[], newUsers: User[]) {
  const toAdd: User[] = []
  const toRemove: User[] = []
  currentUsers.forEach((user) => {
    if (!newUsers.find((u) => u.id === user.id)) toRemove.push(user)
  })
  newUsers.forEach((user) => {
    if (!currentUsers.find((u) => u.id === user.id)) toAdd.push(user)
  })
  return { toAdd, toRemove }
}

const userStore = new UserStore()
export default userStore
