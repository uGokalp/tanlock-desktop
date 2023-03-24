import localforage from "localforage"

import { User } from "@/db/types"
import { uuid } from "@/db/utils"

class UserCrud {
  get = async (id: number) => {
    const users = await localforage.getItem<User[]>("user")
    if (users === null) {
      await localforage.setItem("user", [])
      return []
    }
    const user = users.find((u) => u.id === id)
    return user
  }
  list = async () => {
    const users = await localforage.getItem<User[]>("user")
    if (users === null) {
      await localforage.setItem("user", [])
      return []
    }
    return users
  }
  create = async (user: User) => {
    const users = await localforage.getItem<User[]>("user")
    if (users === null) {
      const record = { ...user, id: uuid([]) }
      await localforage.setItem("user", [record])
      return true
    }
    const record = { ...user, id: uuid(users) }
    const res = await localforage.setItem("user", [...users, record])
    return Boolean(res)
  }
  update = async (user: User) => {
    const users = await localforage.getItem<User[]>("user")
    const oldUser = users?.find((u) => u.id === user.id)
    if (!oldUser || users === null) return false
    const newUser = { ...user, id: oldUser.id }
    const newUsers = users.filter((u) => u.id !== user.id)
    const res = await localforage.setItem(
      "user",
      [...newUsers, newUser].sort((a, b) => a.id - b.id),
    )
    return Boolean(res)
  }

  delete = async (user: User) => {
    const users = await localforage.getItem<User[]>("user")
    if (users === null) return false
    const newUsers = users.filter((u) => u.id !== user.id)
    const res = await localforage.setItem(
      "user",
      newUsers.sort((a, b) => a.id - b.id),
    )
    return Boolean(res)
  }
}

const userCrud = new UserCrud()
export default userCrud
