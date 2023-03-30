import { Disclosure } from "@headlessui/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

import Header from "@/components/Header"
import { routes } from "@/config/routes"
import { classNames } from "@/utils"

type SidebarProps = {
  children: React.ReactNode
}

export default function Sidebar({ children }: SidebarProps) {
  const router = useRouter()
  const currentRoute = router.pathname
  const currentRouteParent = `/${currentRoute.split("/")[1]}`

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div>
        ˝{/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
            <div className="routes-center flex flex-shrink-0 px-4">
              <Image
                className="w-auto"
                src="/tanlock-invert.png"
                alt="Your Company"
                width={223}
                height={65.75}
              />
            </div>

            <div className="mt-5 flex flex-grow flex-col">
              <nav className="flex-1 space-y-1 bg-white px-2" aria-label="Sidebar">
                {routes.map((route) =>
                  !route.children.length ? (
                    <div key={route.path}>
                      <Link
                        href={route.path}
                        className={classNames(
                          route.path === currentRoute
                            ? "bg-gray-100 text-gray-900"
                            : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          "routes-center group flex w-full items-center rounded-md py-2 pl-2 text-sm font-medium",
                        )}
                      >
                        <route.icon
                          className={classNames(
                            route.path
                              ? "text-gray-500"
                              : "text-gray-400 group-hover:text-gray-500",
                            "mr-3 h-6 w-6 flex-shrink-0",
                          )}
                          aria-hidden="true"
                        />
                        {route.sidebarName}
                      </Link>
                    </div>
                  ) : (
                    <Disclosure
                      as="div"
                      key={route.path}
                      className="space-y-1"
                      defaultOpen={route.path === currentRouteParent}
                    >
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={classNames(
                              route.path === currentRoute
                                ? "bg-gray-100 text-gray-900"
                                : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                              "routes-center group flex w-full rounded-md py-2 pl-2 pr-1 text-left text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500",
                            )}
                          >
                            <route.icon
                              className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                              aria-hidden="true"
                            />
                            <span className="flex-1">{route.sidebarName}</span>
                            <svg
                              className={classNames(
                                open ? "rotate-90 text-gray-400" : "text-gray-300",
                                "ml-3 h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-gray-400",
                              )}
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                            </svg>
                          </Disclosure.Button>
                          <Disclosure.Panel className="space-y-1">
                            {route.children.map((subRoute) => (
                              <Link
                                href={subRoute.path}
                                passHref
                                legacyBehavior
                                key={subRoute.path}
                              >
                                <Disclosure.Button
                                  as={"a"}
                                  className={classNames(
                                    subRoute.path === currentRoute
                                      ? "bg-gray-100 text-gray-900"
                                      : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                    "routes-center group flex w-full rounded-md py-2 pl-11 pr-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                  )}
                                >
                                  {subRoute.sidebarName}
                                </Disclosure.Button>
                              </Link>
                            ))}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ),
                )}
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col lg:pl-64">
          <main className="flex-1">
            <div className="">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Header />
              </div>
              <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
