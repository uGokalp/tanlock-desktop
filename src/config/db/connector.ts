import { Statement } from "rado/index"

import { invoke, resourcePath } from "@/utils/tauri"

type Result = {
  result: string
}

type DbResult<T> = {
  result: T
}

/* 

  RadoDb is a wrapper around the tauri sqlite plugin. It is used to execute sql statements and return the result as a typed object.

  Connection is never closed, singleton pattern is used to avoid opening and closing the connection on every query.

*/

class RadoDb {
  path: string
  constructor() {
    this.path = "./dev.db"
  }
  async select<T>(sql: Statement["sql"], values?: string[]): Promise<T[]> {
    const path = await resourcePath(this.path)
    const data = invoke("plugin:sqlite|select", {
      path,
      sql,
      values: values ?? [],
    })
    try {
      const res = this.parse<T>((await data) as Result[])
      return res
    } catch (e) {
      console.log(e)
      await this.open()
      const res = this.parse<T>((await data) as Result[])
      return res
    }
  }

  async execute(sql: Statement["sql"], values?: string[]): Promise<boolean> {
    const path = await resourcePath(this.path)
    const exec = values
      ? invoke("plugin:sqlite|execute2", { path, sql, values })
      : invoke("plugin:sqlite|execute", { path, sql })

    try {
      const res = await exec
      return res as Promise<boolean>
    } catch (e) {
      await this.open()
      const res = await exec
      return res as Promise<boolean>
    }
  }

  async open() {
    const path = await resourcePath(this.path)
    await invoke<string>("plugin:sqlite|open", { path })
  }
  async close(): Promise<boolean> {
    const path = await resourcePath(this.path)
    return invoke("plugin:sqlite|close", { path })
  }

  parse<T>(data: Result[]) {
    return data.map((d) => {
      const parsed = JSON.parse(d.result) as DbResult<T>
      return parsed.result
    })
  }
}

const radoDb = new RadoDb()
export default radoDb
