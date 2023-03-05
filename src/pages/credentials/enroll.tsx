import { Tab } from "@headlessui/react"
import { produce } from "immer"
import { createContext, useCallback } from "react"

import { FormProvider, useFormContext } from "@/components/Form/FormContext"
import SetupForm from "@/components/Form/SetupForm"
import Stepper from "@/components/Form/Stepper"
import Success from "@/components/Form/Success"
import SwipeCardForm from "@/components/Form/SwipeCardForm"
import Sidebar from "@/layouts/Sidebar"

const FORM_STATE = {
  selectedIndex: 0,
  steps: {
    details: {
      valid: false,
      dirty: false,
      value: {
        name: "",
        dueDate: "",
      },
    },
    preferences: {
      valid: false,
      dirty: false,
      value: {
        receiveEmails: false,
        receiveNotifications: false,
      },
    },
  },
}

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

const FormStateContext = createContext({
  form: FORM_STATE,
  setForm: (
    form: typeof FORM_STATE | ((form: typeof FORM_STATE) => typeof FORM_STATE),
  ) => {
    void form
  },
})

const EnrollPage = () => {
  return (
    <Sidebar>
      <FormProvider>
        <CreateTaskMultiStepForm />
      </FormProvider>
    </Sidebar>
  )
}

const CreateTaskMultiStepForm = () => {
  const { form, setForm } = useFormContext()

  const next = useCallback(() => {
    setForm(
      produce((form) => {
        form.selectedIndex += 1
      }),
    )
  }, [setForm])

  const prev = useCallback(() => {
    setForm(
      produce((form) => {
        form.selectedIndex -= 1
      }),
    )
  }, [setForm])

  const selectedIndex = form.selectedIndex

  return (
    <Tab.Group selectedIndex={selectedIndex}>
      <Tab.List className={"Stepper mb-6"}>
        <Stepper selectedIndex={selectedIndex} steps={FORM_STEPS} />
      </Tab.List>

      <Tab.Panels>
        <Tab.Panel>
          <div className={"flex w-full flex-col space-y-6"}>
            <SetupForm onNext={next} />
          </div>
        </Tab.Panel>

        <Tab.Panel>
          <div className={"flex w-full flex-col space-y-6"}>
            <SwipeCardForm onNext={next} onPrev={prev} />
          </div>
        </Tab.Panel>

        <Tab.Panel>
          <div className={"flex w-full flex-col space-y-6"}>
            <Success
              header="Enrollment Successful!"
              message={
                <p>
                  User <b>{form.steps.setup.value.userCname}</b> enrolled to device{" "}
                  <b>{form.steps.setup.value.deviceIp}</b>.
                </p>
              }
            />
          </div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
}

export default EnrollPage
