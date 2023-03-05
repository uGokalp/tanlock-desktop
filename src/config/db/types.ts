import { z } from "zod"

export const DeviceSchema = z.object({
  id: z.number(),
  device__name: z.string(),
  device__contact: z.string(),
  device__location: z.string(),
  device__serialno: z.string(),
  network__macaddr: z.string(),
  network__ip: z.string(),
  network__netmask: z.string(),
  network__dns: z.string(),
  network__gateway: z.string(),
  relais__r1: z.coerce.boolean(),
  relais__r0: z.coerce.boolean(),
  time__time: z.coerce.string(),
  time__offset: z.string(),
  time__invalid: z.coerce.boolean(),
  time__stamp: z.number(),
  version__filesystem: z.string(),
  version__hwdesc: z.string(),
  version__software: z.string(),
  version__flavor: z.string(),
  version__hash: z.string(),
  version__branch: z.string(),
  version__firmware: z.string(),
  version__build: z.string(),
  version__date: z.string(),
  version__hardware: z.string(),
  external__s2: z.coerce.boolean(),
  external__s1: z.coerce.boolean(),
  sensor__lock: z.coerce.boolean(),
  sensor__handle: z.coerce.boolean(),
  sensor__motor: z.coerce.boolean(),
})

const UserSchema = z.object({
  id: z.number(),
  login: z.string(),
  cname: z.string(),
  employee: z.string(),
  active: z.coerce.boolean(),
  four_eye: z.coerce.boolean(),
})

const GroupSchema = z.object({
  id: z.number(),
  name: z.string(),
})

const UserWithGroupsSchema = UserSchema.extend({
  GroupSchema,
})
const DeviceWithGroupsSchema = DeviceSchema.extend({
  GroupSchema,
})

export const UserListSchema = z.array(UserSchema)
export const DeviceListSchema = z.array(DeviceSchema)
export const UserGroupListSchema = z.array(GroupSchema)
export const DeviceGroupListSchema = z.array(GroupSchema)

export type User = z.infer<typeof UserSchema>
export type UserGroup = z.infer<typeof GroupSchema>
export type UserWithGroups = z.infer<typeof UserWithGroupsSchema>

export type Device = z.infer<typeof DeviceSchema>
export type DeviceGroup = z.infer<typeof GroupSchema>
export type DeviceWithGroups = z.infer<typeof DeviceWithGroupsSchema>
