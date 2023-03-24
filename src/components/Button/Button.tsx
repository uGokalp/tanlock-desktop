type ButtonProps = JSX.IntrinsicElements["button"] & {
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
}

export default function Button({ size = "md", ...props }: ButtonProps) {
  const { children } = props
  switch (size) {
    case "sm":
      return (
        <button
          type="button"
          className="rounded bg-indigo-600 py-1 px-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          {...props}
        >
          {children}
        </button>
      )
    case "md":
      return (
        <button
          type="button"
          className="rounded bg-indigo-600 py-1 px-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          {...props}
        >
          {children}
        </button>
      )

    case "lg":
      return (
        <button
          type="button"
          className="rounded-md bg-indigo-600 py-1.5 px-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          {...props}
        >
          {children}
        </button>
      )

    case "xl":
      return (
        <button
          type="button"
          className="rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          {...props}
        >
          {children}
        </button>
      )

    case "2xl":
      return (
        <button
          type="button"
          className="rounded-md bg-indigo-600 py-2.5 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          {...props}
        >
          {children}
        </button>
      )
  }
}
