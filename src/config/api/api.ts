import { AxiosHeaders } from "axios"

// import axiosTauriApiAdapter from "axios-tauri-api-adapter"
import { BaseApi } from "@/config/api/base"
import {
  DeviceLogs,
  MediumCreate,
  MediumCreateRes,
  MediumCreateSchema,
} from "@/config/api/types"
import { DeviceBaseData } from "@/db/types"
import { ScanFormData } from "@/pages/scan"
import { DeviceInfo, UserSchema } from "@/types/types"
import { cartesian, isEmpty, range } from "@/utils"
import { invoke, isFulfilled } from "@/utils/tauri"

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

class Api extends BaseApi {
  public async scan({
    ipAdress,
    rangeStart,
    rangeEnd,
  }: ScanFormData): Promise<DeviceInfo[]> {
    const client = await this.client()
    const ipRanges = range(parseInt(rangeStart, 10), parseInt(rangeEnd, 10)).map(
      (ip) => `${ipAdress}.${ip}`,
    )
    const pings = (
      await Promise.allSettled(ipRanges.map((ip) => invoke<boolean>("ping", { ip })))
    ).map((p) => p.status === "fulfilled" && p.value)
    const availableIps = ipRanges.filter((_, i) => pings[i])
    console.log(availableIps)

    const toFetch = []
    for (const ip of availableIps) {
      toFetch.push(client.get<DeviceInfo>(`http://${ip}/rest/v1/info`))
    }
    const data = (await Promise.allSettled(toFetch))
      .filter(isFulfilled)
      .map((d) => d.value.data)
    return data
  }

  public basicAuthHeaders() {
    const username = "api"
    const password = "lab"
    const headers = new AxiosHeaders()
    headers.set(
      "Authorization",
      `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    )
    return headers
  }

  public async lastMedium(ip: string, ts: number) {
    const data = await this.getLastDeviceLog(ip)
    console.log(data)
    const lastMediumEntry = data.entries
      .filter((e) => e.ts >= ts)
      .filter((e) => e.name === "MEDIUM_PRESENTED")

    const last = lastMediumEntry.length - 1

    if (
      Array.isArray(lastMediumEntry[last].info) &&
      lastMediumEntry[last].info?.[1] !== undefined
    ) {
      return lastMediumEntry[last].info[1] as string
    }
    return null
  }

  async getDeviceLog(ip: string, page: number, pageSize: number) {
    console.log("getDeviceLog", ip, page, pageSize)
    const client = await this.client()
    const { data } = await client.get<DeviceLogs>(
      `http://${ip}/rest/v1/log?pagesize=${pageSize}&page=${page}`,
    )
    return data
  }

  private async getLastDeviceLog(ip: string): Promise<DeviceLogs> {
    const client = await this.client()
    const pageSize = 100
    const { data: firstReq } = await client.get<DeviceLogs>(
      `http://${ip}/rest/v1/log?pagesize=${pageSize}`,
    )
    const nextPage = Math.floor(firstReq.total / firstReq.pagesize)
    const { data: lastReq } = await client.get<DeviceLogs>(
      `http://${ip}/rest/v1/log?pagesize=${pageSize}&page=${nextPage}`,
    )
    return lastReq
  }

  public async createNewMedium(ip: string, medium: MediumCreate) {
    const client = await this.client()
    const payload = MediumCreateSchema.parse(medium)
    const { data } = await client.post<MediumCreateRes>(
      `http://${ip}/rest/v1/mediums`,
      {
        ...payload,
      },
    )
    return data
  }

  public async assignMediums(ips: string[], mediums: MediumCreate[]) {
    const product = cartesian(ips, mediums)
    const toFetch = product.map(([ip, medium]) => {
      return this.createNewMedium(ip as string, medium as MediumCreate)
    })
    const data = await Promise.all(toFetch)
    return data
  }

  public async getUsers(ip: string) {
    const client = await this.client()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data } = await client.get(`http://${ip}/rest/v1/users`)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (isEmpty(data)) {
      return []
    }
    return data as UserSchema[]
  }

  public async createUsersInDevices(ips: string[], users: UserSchema[]) {
    const client = await this.client()
    const product = cartesian(ips, users)
    const toFetch = product.map(([ip, user]) => {
      return client.post(`http://${ip as string}/rest/v1/users`, user)
    })
    const data = await Promise.all(toFetch)
    return data
  }

  public async deleteUsersInDevices(ips: string[], users: UserSchema[]) {
    const client = await this.client()
    const product = cartesian(ips, users)
    const toFetch = product.map(([ip, user]) => {
      return client.delete(
        `http://${ip as string}/rest/v1/users/${(user as UserSchema).login}}`,
      )
    })
    const data = await Promise.all(toFetch)
    return data
  }

  public async deleteAllMediums(ips: string[]) {
    const client = await this.client()
    const toFetch = ips.map((ip) => {
      return client.delete(`http://${ip}/rest/v1/mediums`)
    })
    const data = await Promise.all(toFetch)
    return data
  }

  public async deleteAllUsers(ips: string[]) {
    const client = await this.client()
    const toFetch = ips.map((ip) => {
      return client.delete(`http://${ip}/rest/v1/users?withMediums=true`)
    })
    const data = await Promise.all(toFetch)
    return data
  }

  public async assignGroup(ips: string[], users: UserSchema[]) {
    return this.createUsersInDevices(ips, users)
  }

  public async updateBasedata(ip: string, basedata: DeviceBaseData) {
    const client = await this.client()
    const { data } = await client.put<typeof basedata>(
      `http://${ip}/rest/v1/lock/basedata`,
      basedata,
    )
    return data
  }
  public async reboot(ip: string) {
    const client = await this.client()
    const { data } = await client.put<{ ok: true }>(`http://${ip}/rest/v1/reboot`)
    return data
  }
}

const api = new Api()
export default api
