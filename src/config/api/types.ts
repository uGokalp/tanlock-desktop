import { z } from "zod"

import { User } from "@/config/db/types"
import { UserSchema } from "@/types/types"

export interface DeviceLogs {
  size: number
  entries: {
    ts: number
    info: number[] | boolean[] | string[]
    name: string
  }[]
  total: number
  pagesize: number
}

export const MediumCreateSchema = z.object({
  type: z.literal(19).default(19),
  identifier: z.string(),
  login: z.string(),
  start: z.boolean().default(true),
  next: z.union([z.literal(0), z.literal(255)]).default(0),
})

export const MediumCreateResSchema = z.object({
  type: z.literal(19),
  identifier: z.string(),
  start: z.boolean(),
  uid: z.number(),
  next: z.union([z.literal(0), z.literal(255)]),
})

export type MediumCreate = z.infer<typeof MediumCreateSchema>
export type MediumCreateRes = z.infer<typeof MediumCreateResSchema>

export const ApiErrorSchema = z.object({
  ok: z.literal(false),
  error: z.literal("not found"),
})

export type ApiError = z.infer<typeof ApiErrorSchema>

export const UserTransform = {
  toApi: (user: User): UserSchema => ({
    login: user.login,
    cname: user.cname,
    employee: user.employee,
    active: user.active,
    fourEye: user.four_eye,
  }),
  toDb: (user: UserSchema): Omit<User, "id"> => ({
    login: user.login,
    cname: user.cname,
    employee: user.employee,
    active: user.active,
    four_eye: user.fourEye,
  }),
}
