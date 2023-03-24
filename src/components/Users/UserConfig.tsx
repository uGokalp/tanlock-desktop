import { Tab } from "@headlessui/react"
import { BuildingOfficeIcon, UserIcon } from "@heroicons/react/20/solid"
import { useRouter } from "next/router"
import { useState } from "react"

import EmptyState from "@/components/EmptyState"
import UserConfigAC from "@/components/Users/UserConfigAC"
import UserConfigProfile from "@/components/Users/UserConfigProfile"
import { useMediums } from "@/hooks/db/useMediums"
import { useUser } from "@/hooks/db/useUsers"
import { classNames } from "@/utils"

type UserConfigProps = {
  userId: number
}

export default function UserConfig({ userId }: UserConfigProps) {
  const [tab, setTab] = useState<number>(0)
  const user = useUser(userId)
  const mediums = useMediums()
  const medium = mediums.data && mediums.data.find((m) => m.login === user?.login)

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
              <UserIcon
                className={classNames(
                  tab === 0
                    ? "text-indigo-500"
                    : "text-gray-400 group-hover:text-gray-500",
                  "-ml-0.5 mr-2 h-5 w-5",
                )}
                aria-hidden="true"
              />
              <span>Profile</span>
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
              <BuildingOfficeIcon
                className={classNames(
                  tab === 1
                    ? "text-indigo-500"
                    : "text-gray-400 group-hover:text-gray-500",
                  "-ml-0.5 mr-2 h-5 w-5",
                )}
                aria-hidden="true"
              />
              <span>Basic Access Control</span>
            </Tab>
          </Tab.List>
        </div>
        <Tab.Panels>
          <Tab.Panel className="pt-5">
            {user ? <UserConfigProfile user={user} /> : <div>Loading...</div>}
          </Tab.Panel>
          <Tab.Panel className="pt-5">
            {medium ? (
              <UserConfigAC medium={medium} />
            ) : (
              <EmptyState message="No data." />
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
