import {
  flexRender,
  getCoreRowModel,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table"

import EmptyState from "@/components/EmptyState"

type TableProps<T> = Omit<TableOptions<T>, "getCoreRowModel">

export default function BaseTable<T>({ data, columns }: TableProps<T>) {
  const table = useReactTable<T>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} scope="col" className="px-6 py-3">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4">
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
  )
}
