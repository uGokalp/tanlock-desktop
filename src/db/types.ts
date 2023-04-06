import { z } from "zod"

import { MediumCreateSchema } from "@/config/api/types"

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

export const UserSchema = z.object({
  id: z.number(),
  login: z.string(),
  cname: z.string(),
  employee: z.coerce.number(),
  active: z.coerce.boolean(),
  four_eye: z.coerce.boolean(),
})

const GroupSchema = z.object({
  id: z.number(),
  name: z.string(),
})

const UserWithGroupsSchema = UserSchema.extend({
  groups: GroupSchema,
})
const DeviceWithGroupsSchema = DeviceSchema.extend({
  GroupSchema,
})
const GroupXref = z.object({
  id: z.number(),
  group_id: z.number(),
})

const UserGroupXref = GroupXref.extend({ user_id: z.number() })
const DeviceGroupXref = GroupXref.extend({ device_id: z.number() })

export const UserListSchema = z.array(UserSchema)
export const DeviceListSchema = z.array(DeviceSchema)
export const UserGroupListSchema = z.array(GroupSchema)
export const DeviceGroupListSchema = z.array(GroupSchema)
export const MediumSchema = MediumCreateSchema.extend({ id: z.number() })

export type User = z.infer<typeof UserSchema>
export type UserGroup = z.infer<typeof GroupSchema>
export type UserWithGroups = z.infer<typeof UserWithGroupsSchema>

export type Device = z.infer<typeof DeviceSchema>
export type DeviceGroup = z.infer<typeof GroupSchema>
export type DeviceWithGroups = z.infer<typeof DeviceWithGroupsSchema>

export type DeviceGroupXref = z.infer<typeof DeviceGroupXref>
export type UserGroupXref = z.infer<typeof UserGroupXref>
export type MediumListSchema = z.infer<typeof MediumListSchema>

export const MediumListSchema = z.array(MediumSchema)
export type Medium = z.infer<typeof MediumSchema>
export type DeviceBaseData = {
  name: Device["device__name"]
  location: Device["device__location"]
  contact: Device["device__contact"]
}
