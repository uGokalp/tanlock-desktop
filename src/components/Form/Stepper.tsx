import { Tab } from "@headlessui/react"
import { Fragment } from "react"

type StepperProps = {
  steps: { label: string }[]
  selectedIndex: number
}

export default function Stepper({ steps, selectedIndex }: StepperProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step, index) => {
          const isCurrentStep = index === selectedIndex
          const isComplete = index < selectedIndex
          const isUpcoming = index > selectedIndex

          if (isComplete) {
            return (
              <Tab as={Fragment} key={step.label}>
                <li className="md:flex-1">
                  <button className="group flex w-full flex-col border-l-4 border-indigo-600 py-2 pl-4 hover:border-indigo-800 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0">
                    <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800">
                      Step {index}
                    </span>
                    <span className="text-sm font-medium">{step.label}</span>
                  </button>
                </li>
              </Tab>
            )
          }
          if (isCurrentStep) {
            return (
              <Tab as={Fragment} key={step.label}>
                <li key={step.label} className="md:flex-1">
                  <button
                    className="flex w-full flex-col border-l-4 border-indigo-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0"
                    aria-current="step"
                  >
                    <span className="text-sm font-medium text-indigo-600">
                      Step {index}
                    </span>
                    <span className="text-sm font-medium">{step.label}</span>
                  </button>
                </li>
              </Tab>
            )
          }
          if (isUpcoming) {
            return (
              <Tab as={Fragment} key={step.label}>
                <li key={step.label} className="md:flex-1">
                  <button className="group  flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0">
                    <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                      Step {index}
                    </span>
                    <span className="text-sm font-medium">{step.label}</span>
                  </button>
                </li>
              </Tab>
            )
          }
        })}
      </ol>
    </nav>
  )
}
