import React from "react"

type Props = {
  children: React.ReactNode
  Icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>
} & JSX.IntrinsicElements["button"]

function IconButton({ children, Icon, ...buttonProps }: Props) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      {...buttonProps}
    >
      <Icon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
      {children}
    </button>
  )
}

export default IconButton
