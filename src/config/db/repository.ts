/* eslint-disable @typescript-eslint/no-unused-vars */

import radoDb from "@/config/db/connector"
import queryBuilder from "@/config/db/queryBuilder"
import {
  DeviceTable,
  UserGroupTable,
  UserGroupXRefTable,
  UserTable,
} from "@/config/db/schema"
import { Device, User, UserGroup, UserWithGroups } from "@/config/db/types"
import { UserSchema } from "@/types/types"

export default class Repository {
  static selectUsers(): Promise<UserSchema[]> {
    const query = queryBuilder(UserTable().select({ ...UserTable }))
    return radoDb.select(query.statement.sql, query.params)
  }
  static createUser(record: User): Promise<boolean> {
    const query = queryBuilder(UserTable().insertOne(record))
    return radoDb.execute(query.statement.sql, query.params)
  }

  static createUsers(record: User): Promise<boolean> {
    const query = queryBuilder(UserTable().insertOne(record))
    return radoDb.execute(query.statement.sql, query.params)
  }
  static selectDevices(): Promise<Device[]> {
    const query = queryBuilder(DeviceTable().select({ ...DeviceTable }))
    return radoDb.select(query.statement.sql, query.params)
  }
  static createDevices(record: Omit<Device, "id">): Promise<boolean> {
    const query = queryBuilder(DeviceTable().insertOne(record))
    return radoDb.execute(query.statement.sql, query.params)
  }

  static listUserGroups(): Promise<UserGroup[]> {
    const query = queryBuilder(UserGroupTable().select({ ...UserGroupTable }))
    return radoDb.select(query.statement.sql, query.params)
  }

  static createUserGroup(record: UserGroup): Promise<boolean> {
    const query = queryBuilder(UserGroupTable().insertOne(record))
    return radoDb.execute(query.statement.sql, query.params)
  }

  static getUsersByGroupId(id: number): Promise<User[]> {
    const query = queryBuilder(
      UserGroupXRefTable({ group_id: id })
        .innerJoin(UserGroupTable({ id: UserGroupXRefTable.group_id }))
        .innerJoin(UserTable({ id: UserGroupXRefTable.user_id }))
        .select({ ...UserTable }),
    )
    return radoDb.select(query.statement.sql, query.params)
  }

  static insertUsersToGroupId(group_id: number, users: User[]): Promise<boolean> {
    const ids = users.map((user) => user.id)
    const query = queryBuilder(
      UserGroupXRefTable({ group_id }).insertAll(
        ids.map((id) => ({ group_id, user_id: id })),
      ),
    )
    return radoDb.execute(query.statement.sql, query.params)
  }

  static removeUsersFromGroupId(group_id: number, users: User[]): Promise<boolean[]> {
    const ids = users.map((user) => user.id)
    const queries = ids.map((id) =>
      queryBuilder(UserGroupXRefTable({ group_id, user_id: id }).delete()),
    )
    const result = Promise.all(
      queries.map((query) => radoDb.execute(query.statement.sql, query.params)),
    )
    return result
  }

  static async updateUsersToGroupId(group_id: number, users: User[]): Promise<unknown> {
    const currentUsers = await this.getUsersByGroupId(group_id)
    const { toAdd, toRemove } = compareUsers(currentUsers, users)
    console.log({ toAdd, toRemove })
    const awaitable = []
    if (toAdd.length) awaitable.push(this.insertUsersToGroupId(group_id, toAdd))
    if (toRemove.length) awaitable.push(this.removeUsersFromGroupId(group_id, toRemove))
    return await Promise.all(awaitable)
  }

  static listUsersInGroups(): Promise<UserWithGroups[]> {
    const query = queryBuilder(
      UserGroupXRefTable()
        .innerJoin(UserGroupTable({ id: UserGroupXRefTable.group_id }))
        .innerJoin(UserTable({ id: UserGroupXRefTable.user_id }))
        .select({
          ...UserTable,
          group_id: UserGroupXRefTable.group_id,
          group_name: UserGroupTable.name,
        }),
    )
    return radoDb.select(query.statement.sql, query.params)
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
