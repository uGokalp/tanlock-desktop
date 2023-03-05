import { ArrowSmallRightIcon } from "@heroicons/react/20/solid"
import { useState } from "react"
import { toast } from "react-toastify"

import { Device } from "@/config/db/types"
import { useUpdateDevicesToGroups } from "@/hooks/db/useDeviceGroups"
import { isEqual } from "@/utils"

type DeviceItemProps = Device & {
  onClick: (id: number) => void
  children: React.ReactNode
}

const DeviceItem = ({
  device__name,
  network__ip,
  id,
  onClick,
  children,
}: DeviceItemProps) => {
  return (
    <li key={id} className="py-2">
      <div className="flex items-center space-x-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">{device__name}</p>
          <p className="truncate text-sm text-gray-500">{network__ip}</p>
        </div>
        <div>
          <button
            onClick={() => onClick(id)}
            className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50"
          >
            {children}
          </button>
        </div>
      </div>
    </li>
  )
}

type SortableProps = {
  allDevices: Device[]
  devicesInGroup: Device[] | undefined
  group_id: number
}

export default function Sortable({
  allDevices,
  devicesInGroup,
  group_id,
}: SortableProps) {
  console.log("devicesInGroup", devicesInGroup)
  const [allDevicesView, setAllDevicesView] = useState(() =>
    allDevices.filter((device) => !devicesInGroup?.find((u) => u.id === device.id)),
  )
  const [devicesInGroupView, setDevicesInGroupView] = useState(() => devicesInGroup)
  const { mutateAsync: updateMutation, isLoading } = useUpdateDevicesToGroups()
  const hasDiff = !isEqual(devicesInGroup, devicesInGroupView)

  const onClickLeft = (id: number) => {
    const device = allDevicesView.find((device) => device.id === id)
    if (device) {
      setAllDevicesView(allDevicesView.filter((device) => device.id !== id))
      setDevicesInGroupView(
        [...(devicesInGroupView || []), device].sort((a, b) => a.id - b.id),
      )
    }
  }

  const onClickRight = (id: number) => {
    const device = devicesInGroupView?.find((device) => device.id === id)
    if (device && devicesInGroupView) {
      setDevicesInGroupView(devicesInGroupView.filter((device) => device.id !== id))
      setAllDevicesView([...allDevicesView, device].sort((a, b) => a.id - b.id))
    }
  }

  const onSubmit = () => {
    if (devicesInGroupView) {
      void updateMutation({ group_id, devices: devicesInGroupView }).then(() => {
        toast.success("Devices assigned to group successfully!")
      })
    }
  }

  return (
    <div>
      <div className="grid grid-cols-9 gap-x-12">
        <div className="col-span-4">
          <h2 className="text-lg font-medium text-gray-900">All Devices</h2>
          <ul className="divide-y divide-gray-200 pt-2">
            {allDevicesView.map((device) => (
              <DeviceItem key={`${device.id}-left`} {...device} onClick={onClickLeft}>
                +
              </DeviceItem>
            ))}
          </ul>
        </div>
        <div className="col-span-1 grid place-content-center">
          <ArrowSmallRightIcon />
        </div>
        <div className="col-span-4">
          <h2 className="text-lg font-medium text-gray-900">Devices in Group</h2>
          <ul className="divide-y divide-gray-200 pt-2">
            {devicesInGroupView &&
              devicesInGroupView.map((device) => (
                <DeviceItem
                  key={`${device.id}-right`}
                  {...device}
                  onClick={onClickRight}
                >
                  -
                </DeviceItem>
              ))}
          </ul>
          {hasDiff && (
            <div className="mt-5 mr-5 justify-end">
              <button
                disabled={isLoading}
                onClick={onSubmit}
                type="button"
                className="inline-flex items-end rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm !outline-none hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2                  "
              >
                Assign Devices
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
