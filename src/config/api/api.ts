import axios, { AxiosHeaders, AxiosInstance } from "axios"

// import axiosTauriApiAdapter from "axios-tauri-api-adapter"
import {
  DeviceLogs,
  MediumCreate,
  MediumCreateRes,
  MediumCreateSchema,
} from "@/config/api/types"
import { ScanFormData } from "@/pages/scan"
import { DeviceInfo, UserSchema } from "@/types/types"
import { cartesian, isEmpty, range } from "@/utils"

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

class Api {
  client: AxiosInstance
  constructor() {
    this.client = axios.create({
      // timeout: 8000,
      // adapter: axiosTauriApiAdapter,
      headers: this.basicAuthHeaders(),
    })
  }
  public async scan({
    ipAdress,
    rangeStart,
    rangeEnd,
  }: ScanFormData): Promise<DeviceInfo[]> {
    const ipRanges = range(parseInt(rangeStart, 10), parseInt(rangeEnd, 10)).map(
      (ip) => `${ipAdress}.${ip}`,
    )
    const toFetch = []
    for (const ipRange of ipRanges) {
      toFetch.push(this.client.get<DeviceInfo>(`http://${ipRange}/rest/v1/info`))
    }
    const data = await Promise.all(toFetch)

    return data.map((d) => d.data)
  }

  private basicAuthHeaders() {
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

  private async getLastDeviceLog(ip: string): Promise<DeviceLogs> {
    const pageSize = 100
    const { data: firstReq } = await this.client.get<DeviceLogs>(
      `http://${ip}/rest/v1/log?pagesize=${pageSize}`,
    )
    const nextPage = Math.floor(firstReq.total / firstReq.pagesize)
    const { data: lastReq } = await this.client.get<DeviceLogs>(
      `http://${ip}/rest/v1/log?pagesize=${pageSize}&page=${nextPage}`,
    )
    return lastReq
  }

  public async createNewMedium(ip: string, medium: MediumCreate) {
    const payload = MediumCreateSchema.parse(medium)
    const { data } = await this.client.post<MediumCreateRes>(
      `http://${ip}/rest/v1/mediums`,
      {
        ...payload,
      },
    )
    return data
  }

  public async getUsers(ip: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data } = await this.client.get(`http://${ip}/rest/v1/users`)
    console.log(data)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (isEmpty(data)) {
      return []
    }
    return data as UserSchema[]
  }

  public async createUsersInDevices(ips: string[], users: UserSchema[]) {
    const product = cartesian(ips, users)
    const toFetch = product.map(([ip, user]) => {
      return this.client.post(`http://${ip as string}/rest/v1/users`, user)
    })
    const data = await Promise.all(toFetch)
    return data
  }

  public async deleteUsersInDevices(ips: string[], users: UserSchema[]) {
    const product = cartesian(ips, users)
    const toFetch = product.map(([ip, user]) => {
      return this.client.delete(
        `http://${ip as string}/rest/v1/users/${(user as UserSchema).login}}`,
      )
    })
    const data = await Promise.all(toFetch)
    return data
  }

  public async assignGroup(ips: string[], users: UserSchema[]) {
    return this.createUsersInDevices(ips, users)
  }
}

const api = new Api()
export default api
