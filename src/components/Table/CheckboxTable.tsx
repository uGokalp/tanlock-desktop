import { ArrowDownTrayIcon } from "@heroicons/react/20/solid"
import {
  flexRender,
  getCoreRowModel,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table"
import { useLayoutEffect, useRef, useState } from "react"

import IconButton from "@/components/Button/IconButton"
import EmptyState from "@/components/EmptyState"
import { classNames } from "@/utils"

type IData = {
  id: number
}

type TableProps<T> = Omit<TableOptions<T>, "getCoreRowModel"> & {
  onDelete: (ids: number[]) => void
  header: string
  onEdit?: (id: number) => void
  onExport?: (data: T[]) => void
}

export default function CheckboxTable<T extends IData>({
  data,
  columns,
  onDelete,
  header,
  onEdit,
  onExport,
}: TableProps<T>) {
  const checkbox = useRef<HTMLInputElement>(null)
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedRows, setSelectedRows] = useState<typeof data>([])

  const table = useReactTable<T>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  useLayoutEffect(() => {
    const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length
    setChecked(selectedRows.length === data.length)
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate
      setIndeterminate(isIndeterminate)
    }
  }, [data.length, selectedRows])

  function toggleAll() {
    setSelectedRows(checked || indeterminate ? [] : data)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }

  const onDeleteAll = () => {
    if (selectedRows.length === 0) return
    onDelete((selectedRows as unknown as { id: number }[]).map((row) => row.id))
  }

  const canEdit = Boolean(onEdit)

  return (
    <div className="px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">{header}</h1>
        </div>
        {onExport && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <IconButton Icon={ArrowDownTrayIcon} onClick={() => onExport(data)}>
              Export
            </IconButton>
          </div>
        )}
      </div>
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative">
              {selectedRows.length > 0 && (
                <div className="absolute top-0 left-16 flex h-12 items-center space-x-3 bg-white sm:left-12">
                  {/* <button
                    type="button"
                    className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Bulk edit
                  </button> */}
                  <button
                    onClick={onDeleteAll}
                    type="button"
                    className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Delete all
                  </button>
                </div>
              )}
              <table className="min-w-full table-fixed divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="relative w-16 px-8 sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        className="absolute left-6 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-4"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    {table.getHeaderGroups().map((headerGroup) =>
                      headerGroup.headers.map((header, idx) => (
                        <th
                          key={header.id}
                          scope="col"
                          className={classNames(
                            "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
                            idx === 0 ? "min-w-[6rem]" : "",
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </th>
                      )),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {table.getRowModel().rows.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-gray-100">
                      <td className="relative w-16 px-8 sm:w-12 sm:px-6">
                        {selectedRows.includes(data[idx]) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                        )}
                        <input
                          type="checkbox"
                          className="absolute left-6 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-4"
                          value={row.id}
                          checked={selectedRows.includes(data[idx])}
                          onChange={(e) =>
                            setSelectedRows(
                              e.target.checked
                                ? [...selectedRows, data[idx]]
                                : selectedRows.filter((p) => p !== data[idx]),
                            )
                          }
                        />
                      </td>
                      {row.getVisibleCells().map((cell, idx) => (
                        <td
                          key={cell.id}
                          className={classNames(
                            "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
                            idx === 0 ? "max-w-[1rem]" : "",
                            canEdit ? "hover:cursor-pointer" : "",
                          )}
                          onClick={() => onEdit && onEdit(row.original.id)}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {table.getRowModel().rows.length === 0 && (
                <div className="pt-2">
                  <EmptyState message="No data." />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
