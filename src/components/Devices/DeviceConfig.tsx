import { Tab } from "@headlessui/react"
import { KeyIcon, UserGroupIcon } from "@heroicons/react/20/solid"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import DeviceConfigProfile from "@/components/Devices/DeviceConfigProfile"
import DeviceConfigUserList from "@/components/Devices/DeviceConfigUserList"
import EmptyState from "@/components/EmptyState"
import api from "@/config/api/api"
import { Device } from "@/db/types"
import { useDevice } from "@/hooks/db/useDevices"
import { classNames } from "@/utils"

type DeviceConfigProps = {
  deviceId: number
}

export default function DeviceConfig({ deviceId }: DeviceConfigProps) {
  const [tab, setTab] = useState<number>(0)
  const device = useDevice(deviceId)
  const usersInDevice = useQuery(
    ["users-in-device", device?.network__ip],
    () => api.getUsers((device as Device)?.network__ip),
    {
      enabled: Boolean(device) && Boolean(device?.network__ip),
    },
  )

  return (
    <div>
      <Tab.Group selectedIndex={tab} onChange={setTab}>
        <div className="border-b border-gray-200">
          <Tab.List className="-mb-px flex space-x-8">
            <Tab
              className={classNames(
                tab === 0
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium",
              )}
              aria-current={tab === 0 ? "page" : undefined}
            >
              <KeyIcon
                className={classNames(
                  tab === 0
                    ? "text-indigo-500"
                    : "text-gray-400 group-hover:text-gray-500",
                  "-ml-0.5 mr-2 h-5 w-5",
                )}
                aria-hidden="true"
              />
              <span>Basic Configuration</span>
            </Tab>
            <Tab
              className={classNames(
                tab === 1
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium",
              )}
              aria-current={tab === 1 ? "page" : undefined}
            >
              <UserGroupIcon
                className={classNames(
                  tab === 1
                    ? "text-indigo-500"
                    : "text-gray-400 group-hover:text-gray-500",
                  "-ml-0.5 mr-2 h-5 w-5",
                )}
                aria-hidden="true"
              />
              <span>Current Users</span>
            </Tab>
          </Tab.List>
        </div>
        <Tab.Panels>
          <Tab.Panel className="pt-5">
            {device ? <DeviceConfigProfile device={device} /> : <div>Loading...</div>}
          </Tab.Panel>
          <Tab.Panel className="pt-5">
            {usersInDevice.data ? (
              <DeviceConfigUserList users={usersInDevice.data} />
            ) : (
              <EmptyState message="No data." />
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
