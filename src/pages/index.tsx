import type { NextPage } from "next"

import { useDevices } from "@/hooks/db/useDevices"
import { useUserGroups, useUsersInGroups } from "@/hooks/db/useUserGroups"
import { useUsers } from "@/hooks/db/useUsers"
import Sidebar from "@/layouts/Sidebar"

const Home: NextPage = () => {
  const devices = useDevices()
  const users = useUsers()
  const usersInGroups = useUsersInGroups()
  const userGroups = useUserGroups()
  return (
    <Sidebar>
      <div className="w-full rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select tab
          </label>
          <select
            id="tabs"
            className="block w-full rounded-t-lg border-0 border-b border-gray-200 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          >
            <option>Statistics</option>
            <option>Services</option>
            <option>FAQ</option>
          </select>
        </div>
        <ul
          className="divide-x divide-gray-200 rounded-lg text-center text-sm font-medium text-gray-500 dark:divide-gray-600 dark:text-gray-400 sm:flex"
          id="fullWidthTab"
          data-tabs-toggle="#fullWidthTabContent"
          role="tablist"
        >
          <li className="w-full">
            <button
              id="stats-tab"
              data-tabs-target="#stats"
              type="button"
              role="tab"
              aria-controls="stats"
              aria-selected="true"
              className="inline-block w-full rounded-tl-lg bg-gray-50 p-4 hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Statistics
            </button>
          </li>
        </ul>
        <div
          id="fullWidthTabContent"
          className="border-t border-gray-200 dark:border-gray-600"
        >
          <div
            className="rounded-lg bg-white p-4 dark:bg-gray-800 md:p-8"
            id="stats"
            role="tabpanel"
            aria-labelledby="stats-tab"
          >
            <dl className="mx-auto grid max-w-screen-xl grid-cols-4 gap-8 p-4 text-gray-900 dark:text-white sm:p-8">
              <div className="flex flex-col items-center justify-center">
                <dt className="mb-2 text-3xl font-extrabold">{users.data?.length}</dt>
                <dd className="font-light text-gray-500 dark:text-gray-400">Users</dd>
              </div>
              <div className="flex flex-col items-center justify-center">
                <dt className="mb-2 text-3xl font-extrabold">{devices.data?.length}</dt>
                <dd className="font-light text-gray-500 dark:text-gray-400">Devices</dd>
              </div>
              <div className="flex flex-col items-center justify-center">
                <dt className="mb-2 text-3xl font-extrabold">
                  {userGroups.data?.length}
                </dt>
                <dd className="font-light text-gray-500 dark:text-gray-400">
                  User Groups
                </dd>
              </div>
              <div className="flex flex-col items-center justify-center">
                <dt className="mb-2 text-3xl font-extrabold">
                  {usersInGroups.data?.length}
                </dt>
                <dd className="font-light text-gray-500 dark:text-gray-400">
                  Users in Groups
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </Sidebar>
  )
}

export default Home
