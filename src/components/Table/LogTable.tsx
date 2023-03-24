import { createColumnHelper, OnChangeFn, PaginationState } from "@tanstack/react-table"
import React from "react"

import PaginatedBaseTable from "@/components/Table/PaginatedBaseTable"
import { DeviceLogs } from "@/config/api/types"

type Log = DeviceLogs["entries"]
type LogTableProps = {
  data: DeviceLogs
  currentPage: number
  setPagination: OnChangeFn<PaginationState>
}
const columnHelper = createColumnHelper<Log[number]>()

const transformTs = (ts: Log[number]["ts"]) => {
  const date = new Date(ts)
  return date.toLocaleDateString()
}
const transformInfo = (info: Log[number]["info"]) => {
  let str = ""
  if (!info) return str
  for (let i = 1; i < info.length + 1; i++) {
    if (i === 1) {
      str += "{ "
    }
    let val = info[i - 1]
    switch (typeof val) {
      case "string":
        val = `"${val}"`
        break
      case "boolean":
        val = val ? "true" : "false"
        break
      case "number":
        val = val.toString()
        break
      case "object":
        val = JSON.stringify(val)
    }
    str += `[${i}] = ${val}, `
    if (i === info.length) {
      str += "}"
    }
  }
  return str
}

const columns = [
  columnHelper.accessor("ts", {
    cell: (info) => transformTs(info.getValue()),
    header: () => <span>Timestamp</span>,
  }),
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: () => <span>Event</span>,
  }),
  columnHelper.accessor("info", {
    cell: (info) => transformInfo(info.getValue()),
    header: () => <span>Information</span>,
  }),
  columnHelper.accessor("sqn", {
    cell: (info) => info.getValue(),
    header: () => <span>Sqn</span>,
  }),
]

const LogTable: React.FC<LogTableProps> = ({ data, currentPage, setPagination }) => {
  const pagesize = data.pagesize
  const total = data.total
  const pagination = React.useMemo(
    () => ({
      pageIndex: currentPage,
      pageSize: pagesize,
    }),
    [currentPage, pagesize],
  )

  return (
    <div className="py-3">
      <PaginatedBaseTable
        data={data.entries}
        columns={columns}
        pagination={pagination}
        setPagination={setPagination}
        totalPages={Math.ceil(total / pagesize)}
      />
    </div>
  )
}

export default LogTable
