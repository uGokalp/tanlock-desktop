import { ArrowSmallRightIcon } from "@heroicons/react/20/solid"
import { isEqual, omit } from "lodash-es"
import { useState } from "react"

import LoadingButton from "@/components/Button/LoadingButton"
import ConfirmationModal from "@/components/Modal/ConfirmationModal"
import DeviceGroupSelect from "@/components/Select/DeviceGroupSelect"
import UserGroupSelect from "@/components/Select/UserGroupSelect"
import { UserTransform } from "@/config/api/types"
import { DeviceGroup, User, UserGroup } from "@/db/types"
import { useDeviceGroups, useDeviceGroupsById } from "@/hooks/db/useDeviceGroups"
import { useUserGroups, useUserGroupsById } from "@/hooks/db/useUserGroups"
import { useAssignGroup, useTanlockUsersBulk } from "@/hooks/outbound"
import { UserSchema } from "@/types/types"

const getModalDescription = (users: UserSchema[]) => {
  let message = "This action will overwrite the current users in the device group."
  const numUsers = users.length
  if (numUsers === 0) {
    message += "\n There are currently no users in the device group."
    return message
  }
  if (numUsers > 0) {
    message += `\n There are currently ${numUsers} users in the device group.`
    return message
  }
  return message
}

const UserItem = ({
  login,
  id,
  ip,
  cname,
}: Pick<User, "active" | "cname" | "id" | "login"> & { ip: string | undefined }) => {
  return (
    <li key={id} className="py-2">
      <div className="flex items-center space-x-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">
            {login} - {cname}
          </p>
          <p className="truncate text-sm text-gray-500">{ip}</p>
        </div>
      </div>
    </li>
  )
}

interface UserSchemaApi extends UserSchema {
  uid: number
}

const diffFn = (left: User[] | undefined, right: UserSchemaApi[] | undefined) => {
  if (!left || !right) return false
  const userLeft = left.map((l) => omit(l, ["id"]))
  const userRight = right.map((r) => UserTransform.toDb(r))
  return !isEqual(userLeft, userRight)
}

export default function Sortable() {
  const [confirmModal, setConfirmModal] = useState(false)
  const [leftView, setLeftView] = useState<User[]>()
  const [rightView, setRightView] = useState<UserSchemaApi[]>()

  const [selectedUserGroup, setSelectedUserGroup] = useState<UserGroup>()
  const [selectedDeviceGroup, setSelectedDeviceGroup] = useState<DeviceGroup>()

  const { data: userGroups } = useUserGroups()
  const { data: deviceGroups } = useDeviceGroups()
  const hasDiff = diffFn(leftView, rightView)

  useUserGroupsById(selectedUserGroup?.id, (v) => {
    setLeftView(v)
  })
  const { data: selectedDevices } = useDeviceGroupsById(selectedDeviceGroup?.id)
  useTanlockUsersBulk(
    (selectedDevices && selectedDevices.map((v) => v.network__ip)) || [],
    (v) => {
      setRightView(v as UserSchemaApi[])
    },
  )

  const assignMutation = useAssignGroup()

  const onSubmit = () => {
    const ips = selectedDevices?.map((v) => v.network__ip) || []
    const users = leftView?.map((view) => UserTransform.toApi(view)) as UserSchema[]
    assignMutation.mutate({ ips, users })
  }

  const modalDescription = getModalDescription(rightView || [])

  return (
    <div>
      <ConfirmationModal
        open={confirmModal}
        setOpen={setConfirmModal}
        action={() => onSubmit()}
        title="Are you sure you want to assign this user group to this device group?"
        description={modalDescription}
      />
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
              leftView.map((user) => (
                <UserItem key={`${user.id}-left`} {...user} ip={""} />
              ))}
          </ul>
        </div>
        <div className="col-span-1 grid place-content-center">
          <ArrowSmallRightIcon />
          {hasDiff && (
            <div className="mt-5 mr-5 justify-end">
              <LoadingButton
                isLoading={assignMutation.isLoading}
                disabled={assignMutation.isLoading}
                onClick={() => setConfirmModal(true)}
                type="button"
                className="inline-flex items-end rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm !outline-none hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2                  "
              >
                Assign
              </LoadingButton>
            </div>
          )}
        </div>
        <div className="col-span-4">
          <h2 className="text-lg font-medium text-gray-900">Users in Device Group</h2>
          <ul className="divide-y divide-gray-200 pt-2">
            {rightView &&
              rightView.map((user, idx) => (
                <UserItem
                  key={`${user.cname}-${idx}-right`}
                  id={idx}
                  {...user}
                  ip={selectedDevices?.map((v) => v.network__ip)[idx] as string}
                ></UserItem>
              ))}
          </ul>
        </div>
      </div>
      {leftView && rightView && !hasDiff && (
        <div className="mt-5 mr-5 justify-end">
          This user group and device group are already synced.
        </div>
      )}
    </div>
  )
}
