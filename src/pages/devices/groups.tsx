import { Tab } from "@headlessui/react"
import { Spinner } from "flowbite-react"
import { useState } from "react"

import CreateDeviceGroupModal from "@/components/Devices/CreateDeviceGroupModal"
import Sortable from "@/components/Devices/Sortable"
import DeviceGroupSelect from "@/components/Select/DeviceGroupSelect"
import DeviceGroupTable from "@/components/Table/DeviceGroupTable"
import StyledTab from "@/components/Tabs/StyledTab"
import { DeviceGroup } from "@/config/db/types"
import { useDeviceGroups, useDeviceGroupsById } from "@/hooks/db/useDeviceGroups"
import { useDevices } from "@/hooks/db/useDevices"
import Sidebar from "@/layouts/Sidebar"

const DeviceGroups = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { data: devices } = useDevices()

  const { data: deviceGroups, isLoading } = useDeviceGroups()
  const onClickCreateDeviceGroup = () => {
    setIsOpen(!isOpen)
  }

  const [selected, setSelected] = useState<DeviceGroup>()
  const { data: devicesInGroup } = useDeviceGroupsById(selected?.id)
  const isAssignmentBlocked = deviceGroups && deviceGroups.length === 0
  const hoverMessage = isAssignmentBlocked ? "No device groups to assign" : undefined

  return (
    <>
      <CreateDeviceGroupModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <Sidebar>
        <Tab.Group>
          <Tab.List className=" -mb-px flex space-x-8 border-gray-200">
            <StyledTab>List Groups</StyledTab>
            <StyledTab disabled={isAssignmentBlocked} hoverMessage={hoverMessage}>
              Assign Groups
            </StyledTab>
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel className="pt-5">
              <div className="pb-5">
                <button
                  onClick={onClickCreateDeviceGroup}
                  type="button"
                  className="inline-flex items-end rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm !outline-none hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2                  "
                >
                  New Device Group
                </button>
              </div>
              {isLoading && (
                <div className="text-center">
                  <Spinner size="xl" />
                </div>
              )}
              {deviceGroups && <DeviceGroupTable data={deviceGroups} />}
            </Tab.Panel>
            <Tab.Panel className="pt-5">
              <div className="pb-5">
                {deviceGroups && deviceGroups.length ? (
                  <DeviceGroupSelect
                    options={deviceGroups}
                    setOption={setSelected}
                    key="device-select"
                  />
                ) : null}
              </div>
              {devices && devicesInGroup ? (
                <Sortable
                  allDevices={devices}
                  devicesInGroup={devicesInGroup}
                  group_id={selected?.id as number}
                />
              ) : null}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </Sidebar>
    </>
  )
}

export default DeviceGroups
