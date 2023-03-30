import { Tab } from "@headlessui/react"
import { create } from "zustand"

import Button from "@/components/Button/Button"
import SetupForm from "@/components/Form/SetupForm"
import Stepper from "@/components/Form/Stepper"
import Success from "@/components/Form/Success"
import SwipeCardForm from "@/components/Form/SwipeCardForm"
import { User } from "@/db/types"
import Sidebar from "@/layouts/Sidebar"

interface FormState {
  currentStep: number
  deviceIp?: string
  user?: User
  next: () => void
  prev: () => void
  setupSubmit: (deviceIp: string, user: User) => void
  reset: () => void
}

const defaultValues = {
  currentStep: 0,
  deviceIp: "192.168.1.92",
  user: undefined,
}

const useFormStep = create<FormState>((set) => ({
  ...defaultValues,
  next: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prev: () => set((state) => ({ currentStep: state.currentStep - 1 })),
  setupSubmit: (deviceIp: string, user: User) => {
    set(() => ({ deviceIp, user }))
  },
  reset: () => set(() => defaultValues),
}))

const FORM_STEPS = [
  {
    label: "Setup",
  },
  {
    label: "Listen",
  },
  {
    label: "Complete",
  },
]

const EnrollNew = () => {
  const state = useFormStep()
  const setupState = { deviceIp: state.deviceIp, user: state.user }
  return (
    <Sidebar>
      <Tab.Group selectedIndex={state.currentStep}>
        <Tab.List className={"Stepper mb-6"}>
          <Stepper selectedIndex={state.currentStep} steps={FORM_STEPS} />
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            <div className={"flex w-full flex-col space-y-6"}>
              <SetupForm
                onNext={state.next}
                setState={state.setupSubmit}
                state={setupState}
              />
            </div>
          </Tab.Panel>

          <Tab.Panel>
            <div className={"flex w-full flex-col space-y-6"}>
              {state.deviceIp && state.user && (
                <SwipeCardForm
                  onNext={state.next}
                  onPrev={state.prev}
                  deviceIp={state.deviceIp}
                  user={state.user}
                />
              )}
            </div>
          </Tab.Panel>

          <Tab.Panel>
            <div className={"flex w-full flex-col space-y-6"}>
              {state.deviceIp && state.user && (
                <>
                  <Success
                    header="Enrollment Successful!"
                    message={
                      <p>
                        User{" "}
                        <b>
                          {state.user.cname} - {state.user.login}
                        </b>{" "}
                        enrolled to device <b>{state.deviceIp}</b>.
                      </p>
                    }
                  />
                  <Button size="xl" onClick={state.reset}>
                    Start Over
                  </Button>
                </>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Sidebar>
  )
}

export default EnrollNew
