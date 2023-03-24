import axios, { AxiosHeaders } from "axios"

import { isNode } from "@/utils/tauri"

export class BaseApi {
  public async client() {
    if (isNode()) {
      const _client = axios.create({
        headers: this.basicAuthHeaders(),
      })
      return Promise.resolve(_client)
    }
    const axiosTauriApiAdapter = await import("axios-tauri-api-adapter")
    const _client = axios.create({
      adapter: axiosTauriApiAdapter.axiosTauriApiAdapter,
      headers: this.basicAuthHeaders(),
    })
    return _client
  }

  public basicAuthHeaders() {
    return new AxiosHeaders()
  }
}
