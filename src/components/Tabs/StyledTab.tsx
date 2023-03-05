import { Tab } from "@headlessui/react"
import { Fragment } from "react"

import { classNames } from "@/utils"

type Props = {
  children: React.ReactNode
  disabled?: boolean
  hoverMessage?: string
}

export default function StyledTab({
  children,
  disabled = false,
  hoverMessage = undefined,
}: Props) {
  return (
    <Tab as={Fragment}>
      {({ selected }) => (
        <div className="group relative flex justify-center">
          <button
            disabled={Boolean(disabled)}
            className={classNames(
              selected
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
              "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium",
              disabled ? "cursor-not-allowed" : "",
            )}
          >
            {children}
          </button>
          {hoverMessage ? (
            <span className="absolute top-10 w-full scale-0 rounded bg-gray-800 p-2 text-xs text-white transition-all group-hover:scale-100">
              {hoverMessage}
            </span>
          ) : null}
        </div>
      )}
    </Tab>
  )
}
