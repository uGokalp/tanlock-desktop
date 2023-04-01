import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

import LoadingButton from "@/components/Button/LoadingButton"
import DeviceScanTable from "@/components/Table/DeviceScanTable"
import { useScan } from "@/hooks/tauri/useScan"
import Sidebar from "@/layouts/Sidebar"
import { DeviceInfo } from "@/types/types"
import { onPromise } from "@/utils"

export type ScanFormData = {
  ipAdress: string
  rangeStart: string
  rangeEnd: string
}

const Scan = () => {
  const { register, handleSubmit } = useForm<ScanFormData>({
    defaultValues: {
      ipAdress: "192.168.1",
      rangeStart: "90",
      rangeEnd: "91",
    },
  })
  const { mutate: scanMutation, data: mutationData, isLoading } = useScan()
  const onSubmit = handleSubmit((data) => {
    scanMutation(data)
  })
  const cache = useQueryClient().getQueryData<DeviceInfo[]>(["scan"])
  const scanData = cache || mutationData
  return (
    <Sidebar>
      <form onSubmit={onPromise(onSubmit)}>
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            IP Adress
          </label>
          <input
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            {...register("ipAdress")}
          />
        </div>
        <div className="mb-6 flex justify-center gap-3">
          <label className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            IP Range Start
          </label>
          <input
            type="number"
            className="w-1/2 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            {...register("rangeStart")}
          />
          <label className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            IP Range End
          </label>
          <input
            type="number"
            className="w-1/2 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            {...register("rangeEnd")}
          />
        </div>
        <LoadingButton
          isLoading={isLoading}
          type="submit"
          className="block w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Scan
        </LoadingButton>
      </form>
      <div id="break" className="pb-10"></div>

      {scanData && <DeviceScanTable data={scanData} />}
    </Sidebar>
  )
}

export default Scan
