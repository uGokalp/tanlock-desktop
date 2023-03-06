import { Statement } from "rado/index"

import { invoke, resourcePath } from "@/utils/tauri"
import Database from "tauri-plugin-sql-api"

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
    const db = await Database.load("sqlite:dev.db")
    const data = await db.select(sql, values)
    const res = this.parse<T>((await data) as Result[])
    return res
  }

  async execute(sql: Statement["sql"], values?: string[]): Promise<boolean> {
    const db = await Database.load("sqlie:dev.db")
    const exec = db.execute(sql, values)
    const res = await exec
    return Boolean(res.rowsAffected)
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
