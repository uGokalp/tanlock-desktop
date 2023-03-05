import { Tab } from "@headlessui/react"
import { Spinner } from "flowbite-react"
import { useState } from "react"

import UserGroupSelect from "@/components/Select/UserGroupSelect"
import UserGroupTable from "@/components/Table/UserGroupTable"
import StyledTab from "@/components/Tabs/StyledTab"
import CreateUserGroupModal from "@/components/Users/CreateUserGroupModal"
import Sortable from "@/components/Users/Sortable"
import { UserGroup } from "@/config/db/types"
import { useUserGroups, useUserGroupsById } from "@/hooks/db/useUserGroups"
import { useUsers } from "@/hooks/db/useUsers"
import Sidebar from "@/layouts/Sidebar"

const UserGroups = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { data: users } = useUsers()

  const { data: userGroups, isLoading } = useUserGroups()
  const onClickCreateUserGroup = () => {
    setIsOpen(!isOpen)
  }

  const [selected, setSelected] = useState<UserGroup>()
  const { data: usersInGroup } = useUserGroupsById(selected?.id)
  const isAssignmentBlocked = userGroups && userGroups.length === 0

  return (
    <>
      <CreateUserGroupModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <Sidebar>
        <Tab.Group>
          <Tab.List className=" -mb-px flex space-x-8 border-gray-200">
            <StyledTab>List Groups</StyledTab>
            <StyledTab disabled={isAssignmentBlocked}>Assign Groups</StyledTab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel className="pt-5">
              <div className="pb-5">
                <button
                  onClick={onClickCreateUserGroup}
                  type="button"
                  className="inline-flex items-end rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm !outline-none hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2                  "
                >
                  New User Group
                </button>
              </div>
              {isLoading && (
                <div className="text-center">
                  <Spinner size="xl" />
                </div>
              )}
              {userGroups && <UserGroupTable data={userGroups} />}
            </Tab.Panel>
            <Tab.Panel className="pt-5">
              <div className="pb-5">
                {userGroups && userGroups.length ? (
                  <UserGroupSelect options={userGroups} setOption={setSelected} />
                ) : null}
              </div>
              {users && usersInGroup ? (
                <Sortable
                  allUsers={users}
                  usersInGroup={usersInGroup}
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

export default UserGroups
