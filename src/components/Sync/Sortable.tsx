import { ArrowSmallRightIcon } from "@heroicons/react/20/solid"
import { useState } from "react"

import DeviceGroupSelect from "@/components/Select/DeviceGroupSelect"
import UserGroupSelect from "@/components/Select/UserGroupSelect"
import { UserTransform } from "@/config/api/types"
import { DeviceGroup, User, UserGroup } from "@/config/db/types"
import { useDeviceGroups, useDeviceGroupsById } from "@/hooks/db/useDeviceGroups"
import { useUserGroups, useUserGroupsById } from "@/hooks/db/useUserGroups"
import { useAssignGroup, useTanlockUsersBulk } from "@/hooks/outbound"
import { UserSchema } from "@/types/types"

const UserItem = ({
  login,
  cname,
  id,
}: Pick<User, "active" | "cname" | "id" | "login">) => {
  return (
    <li key={id} className="py-2">
      <div className="flex items-center space-x-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">{cname}</p>
          <p className="truncate text-sm text-gray-500">{login}</p>
        </div>
      </div>
    </li>
  )
}

export default function Sortable() {
  const hasDiff = true
  const isLoading = false

  const [leftView, setLeftView] = useState<User[]>()
  const [rightView, setRightView] = useState<UserSchema[]>()

  const [selectedUserGroup, setSelectedUserGroup] = useState<UserGroup>()
  const [selectedDeviceGroup, setSelectedDeviceGroup] = useState<DeviceGroup>()

  const { data: userGroups } = useUserGroups()
  const { data: deviceGroups } = useDeviceGroups()

  useUserGroupsById(selectedUserGroup?.id, (v) => {
    setLeftView(v)
  })
  const { data: selectedDevices } = useDeviceGroupsById(selectedDeviceGroup?.id)
  useTanlockUsersBulk(
    (selectedDevices && selectedDevices.map((v) => v.network__ip)) || [],
    (v) => {
      setRightView(v)
    },
  )

  const assignMutation = useAssignGroup()

  const onSubmit = () => {
    const ips = selectedDevices?.map((v) => v.network__ip) || []
    const users = leftView?.map((view) => UserTransform.toApi(view)) as UserSchema[]
    assignMutation.mutate({ ips, users })
    return null
  }

  return (
    <div>
      {userGroups && deviceGroups && (
        <div className="pb-5">
          <div className="pb-4">
            <h1>User Group</h1>
            <UserGroupSelect options={userGroups} setOption={setSelectedUserGroup} />
          </div>
          <div className="pb-4">
            <h1>Device Group</h1>
            <DeviceGroupSelect
              options={deviceGroups}
              setOption={setSelectedDeviceGroup}
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-9 gap-x-12">
        <div className="col-span-4">
          <h2 className="text-lg font-medium text-gray-900">Users in Group</h2>
          <ul className="divide-y divide-gray-200 pt-2">
            {leftView &&
              leftView.map((user) => <UserItem key={`${user.id}-left`} {...user} />)}
          </ul>
        </div>
        <div className="col-span-1 grid place-content-center">
          <ArrowSmallRightIcon />
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
        <div className="col-span-4">
          <h2 className="text-lg font-medium text-gray-900">Users in Group</h2>
          <ul className="divide-y divide-gray-200 pt-2">
            {rightView &&
              rightView.map((user, idx) => (
                <UserItem
                  key={`${user.cname}-${idx}-right`}
                  id={idx}
                  {...user}
                ></UserItem>
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
