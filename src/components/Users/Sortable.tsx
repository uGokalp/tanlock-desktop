import { ArrowSmallRightIcon } from "@heroicons/react/20/solid"
import { useState } from "react"
import { toast } from "react-toastify"

import { User } from "@/config/db/types"
import { useUpdateUsersToGroups } from "@/hooks/db/useUserGroups"
import { isEqual } from "@/utils"

type UserItemProps = User & {
  onClick: (id: number) => void
  children: React.ReactNode
}

const UserItem = ({ login, cname, id, onClick, children }: UserItemProps) => {
  return (
    <li key={id} className="py-2">
      <div className="flex items-center space-x-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">{cname}</p>
          <p className="truncate text-sm text-gray-500">{login}</p>
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
  allUsers: User[]
  usersInGroup: User[] | undefined
  group_id: number
}

export default function Sortable({ allUsers, usersInGroup, group_id }: SortableProps) {
  const [allUsersView, setAllUsersView] = useState(() =>
    allUsers.filter((user) => !usersInGroup?.find((u) => u.id === user.id)),
  )
  const [usersInGroupView, setUsersInGroupView] = useState(() => usersInGroup)
  const { mutateAsync: updateMutation, isLoading } = useUpdateUsersToGroups()
  const hasDiff = !isEqual(usersInGroup, usersInGroupView)

  const onClickLeft = (id: number) => {
    const user = allUsersView.find((user) => user.id === id)
    if (user) {
      setAllUsersView(allUsersView.filter((user) => user.id !== id))
      setUsersInGroupView(
        [...(usersInGroupView || []), user].sort((a, b) => a.id - b.id),
      )
    }
  }

  const onClickRight = (id: number) => {
    const user = usersInGroupView?.find((user) => user.id === id)
    if (user && usersInGroupView) {
      setUsersInGroupView(usersInGroupView.filter((user) => user.id !== id))
      setAllUsersView([...allUsersView, user].sort((a, b) => a.id - b.id))
    }
  }

  const onSubmit = () => {
    if (usersInGroupView) {
      void updateMutation({ group_id, users: usersInGroupView }).then(() => {
        toast.success("Users assigned to group successfully!")
      })
    }
  }

  return (
    <div>
      <div className="grid grid-cols-9 gap-x-12">
        <div className="col-span-4">
          <h2 className="text-lg font-medium text-gray-900">All Users</h2>
          <ul className="divide-y divide-gray-200 pt-2">
            {allUsersView.map((user) => (
              <UserItem key={`${user.id}-left`} {...user} onClick={onClickLeft}>
                +
              </UserItem>
            ))}
          </ul>
        </div>
        <div className="col-span-1 grid place-content-center">
          <ArrowSmallRightIcon />
        </div>
        <div className="col-span-4">
          <h2 className="text-lg font-medium text-gray-900">Users in Group</h2>
          <ul className="divide-y divide-gray-200 pt-2">
            {usersInGroupView &&
              usersInGroupView.map((user) => (
                <UserItem key={`${user.id}-right`} {...user} onClick={onClickRight}>
                  -
                </UserItem>
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
                Assign Users
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
