import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid"
import { useRouter } from "next/router"

import { routes } from "@/config/routes"

const splitPath = (path: string) => {
  return path
    .split("/")
    .filter((p) => p !== "")
    .map((p) => p[0].toUpperCase() + p.slice(1))
}

export default function Header() {
  const router = useRouter()
  const paths = splitPath(router.pathname)
  const route = routes.filter((r) => r.path === router.pathname)[0]
  return (
    <div>
      <div>
        <nav className="sm:hidden" aria-label="Back">
          <span className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
            <ChevronLeftIcon
              className="-ml-1 mr-1 h-5 w-5 flex-shrink-0 text-gray-400"
              aria-hidden="true"
            />
            Back
          </span>
        </nav>
        <nav className="hidden sm:flex" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-4">
            {paths.map((path, i) => {
              if (i === 0) {
                return (
                  <li key={path}>
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-500 hover:text-gray-700">
                        {path}
                      </span>
                    </div>
                  </li>
                )
              }
              return (
                <li key={path}>
                  <div className="flex items-center">
                    <ChevronRightIcon
                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                      {path}
                    </span>
                  </div>
                </li>
              )
            })}
          </ol>
        </nav>
      </div>
      <div className="mt-2 md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {""}
          </h2>
        </div>
      </div>
    </div>
  )
}
