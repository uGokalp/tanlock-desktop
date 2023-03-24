import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import Button from "@/components/Button/Button"
import ConfirmationModal from "@/components/Modal/ConfirmationModal"
import api from "@/config/api/api"
import { queryClient } from "@/config/queryClient"
import deviceStore from "@/db/device-store"
import deviceCrud from "@/db/tables/device-crud"
import { Device, DeviceBaseData } from "@/db/types"
import { onPromise } from "@/utils"

type Props = {
  device: Device
}

type UpdateParams = {
  basedata: DeviceBaseData
  ip: string
}

const DeviceConfigProfile = ({ device }: Props) => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [rebootModal, setRebootModal] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, getValues } = useForm<Device>({
    defaultValues: device,
  })

  const updateDeviceBasedata = useMutation({
    mutationFn: async ({ basedata, ip }: UpdateParams) => {
      console.log("updateDeviceBasedata", { basedata, ip })
      await api.updateBasedata(ip, basedata)
      return await deviceStore.updateBasedata(ip, basedata)
    },
    onSuccess: () => {
      toast.success("Device updated")
      void queryClient.refetchQueries(["db-devices"])
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  const rebootDevice = useMutation({
    mutationFn: async (ip: string) => {
      return await api.reboot(ip)
    },
    onSuccess: () => {
      toast.success("Device rebooted")
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  const deleteUser = useMutation({
    mutationFn: async (device: Device) => {
      return await deviceCrud.delete(device)
    },
    onSuccess: () => {
      void queryClient.refetchQueries(["db-devices"])
    },
  })

  const onDelete = () => {
    const device = getValues()
    deleteUser.mutate(device)
    onCancel()
  }
  const onCancel = () => {
    void router.push("/devices/list")
  }

  const onSubmit = handleSubmit((device) => {
    const ip = device.network__ip
    const basedata = {
      name: device.device__name,
      location: device.device__location,
      contact: device.device__contact,
    }
    updateDeviceBasedata.mutate({ ip, basedata })
  })

  const onReboot = () => {
    const device = getValues()
    const ip = device.network__ip
    rebootDevice.mutate(ip)
  }

  return (
    <div>
      <ConfirmationModal
        open={deleteModal}
        setOpen={setDeleteModal}
        action={onDelete}
        title="Delete Device"
        description="Are you sure you want to delete this device?"
      />
      <ConfirmationModal
        open={rebootModal}
        setOpen={setRebootModal}
        action={onReboot}
        title="Reboot Device"
        description="Are you sure you want to reboot this device?"
      />
      <form onSubmit={onPromise(onSubmit)}>
        <div className="pb-2">
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor="id"
          >
            Database ID
          </label>
          <div className="mt-2">
            <input
              id="id"
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-100"
              disabled
              {...register("id")}
            />
          </div>
        </div>
        <div className="pb-2">
          <label
            htmlFor="cname"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Device Ip
          </label>
          <div className="mt-2">
            <input
              id="cname"
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-100"
              disabled
              {...register("network__ip")}
            />
          </div>
        </div>
        <div className="pb-2">
          <label
            htmlFor="login"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Device Name
          </label>
          <div className="mt-2">
            <input
              id="login"
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              {...register("device__name")}
            />
          </div>
        </div>
        <div className="pb-2">
          <label
            htmlFor="cname"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Device Location
          </label>
          <div className="mt-2">
            <input
              id="cname"
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              {...register("device__location")}
            />
          </div>
        </div>
        <div className="pb-2">
          <label
            htmlFor="cname"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Device Contact
          </label>
          <div className="mt-2">
            <input
              id="cname"
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              {...register("device__contact")}
            />
          </div>
        </div>

        <div className="flex justify-center pt-5 gap-5">
          <Button size="2xl" type="submit">
            Save
          </Button>
          <Button size="2xl" type="button" onClick={() => setRebootModal(true)}>
            Reboot
          </Button>
          <Button size="2xl" type="button" onClick={() => setDeleteModal(true)}>
            Delete
          </Button>
          <Button size="2xl" type="button" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default DeviceConfigProfile
