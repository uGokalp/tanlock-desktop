import { useMutation } from "@tanstack/react-query"
import localforage from "localforage"
import { useState } from "react"
import { toast } from "react-toastify"

import api from "@/config/api/api"
import { useDevices } from "@/hooks/db/useDevices"
import Sidebar from "@/layouts/Sidebar"

const Admin = () => {
  const [key, setKey] = useState("")
  const devices = useDevices()

  const clearDevices = useMutation({
    mutationFn: async (ips: string[]) => {
      return await api.deleteAllUsers(ips)
    },
    onSuccess: () => {
      toast.success("Devices cleared")
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  const onClick = () => {
    localforage
      .removeItem(key)
      .then(() => {
        toast.success(`Key: ${key} removed`)
      })
      .catch((e) => {
        toast.error("Failed to remove key")
      })
  }

  const onDropTables = () => {
    localforage
      .dropInstance()
      .then(() => {
        toast.success("Dropped all tables")
      })
      .catch((e) => {
        toast.error("Failed to drop all tables")
      })
  }
  const onClearAllUsers = () => {
    if (!devices.data) return
    const ips = devices.data?.map((d) => d.network__ip)
    clearDevices.mutate(ips)
  }
  return (
    <Sidebar>
      <div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Db Key
          </label>
          <div className="mt-2">
            <input
              onChange={(e) => {
                setKey(e.target.value)
              }}
              type="email"
              name="email"
              id="email"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="pt-5">
          <button
            onClick={onClick}
            type="button"
            className="rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Delete By Key
          </button>
        </div>
        <div className="pt-5">
          <button
            onClick={onClearAllUsers}
            type="button"
            className="rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Clear users from all devices
          </button>
        </div>
        <div className="pt-5">
          <button
            onClick={onDropTables}
            type="button"
            className="rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Drop Tables
          </button>
        </div>
      </div>
    </Sidebar>
  )
}

export default Admin
