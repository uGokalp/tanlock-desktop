import { CheckCircleIcon } from "@heroicons/react/20/solid"

type SuccessProps = {
  header: string
  message: React.ReactNode
}
export default function Success({ header, message }: SuccessProps) {
  return (
    <div className="rounded-md bg-green-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">{header}</h3>
          <div className="mt-2 text-sm text-green-700">{message}</div>
          <div className="mt-4"></div>
        </div>
      </div>
    </div>
  )
}
