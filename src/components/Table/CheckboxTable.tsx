import {
  flexRender,
  getCoreRowModel,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table"
import { useLayoutEffect, useRef, useState } from "react"

import EmptyState from "@/components/EmptyState"
import { classNames } from "@/utils"

type IData = {
  id: number
}

type TableProps<T> = Omit<TableOptions<T>, "getCoreRowModel"> & {
  onDelete: (ids: number[]) => void
  header: string
  onEdit?: (id: number) => void
}

export default function CheckboxTable<T extends IData>({
  data,
  columns,
  onDelete,
  header,
  onEdit,
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

  return (
    <div className="px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">{header}</h1>
        </div>
        {/* <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 py-1.5 px-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button>
        </div> */}
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
                    <tr key={row.id} className="">
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
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                      <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-3">
                        {onEdit && (
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                            aria-disabled
                            onClick={() => {
                              if (onEdit) {
                                onEdit(data[idx].id)
                              }
                            }}
                          >
                            Edit<span className="sr-only">, {row.id}</span>
                          </a>
                        )}
                      </td>
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
