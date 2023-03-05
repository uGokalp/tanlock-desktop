import { createContext, useContext, useState } from "react"

const FORM_STATE = {
  selectedIndex: 0,
  steps: {
    setup: {
      valid: false,
      dirty: false,
      value: {
        deviceIp: "192.168.1",
        userCname: "",
      },
    },
    listen: {
      valid: false,
      dirty: false,
      value: {
        receiveEmails: false,
        receiveNotifications: false,
      },
    },
  },
}

const FormStateContext = createContext({
  form: FORM_STATE,
  setForm: (
    form: typeof FORM_STATE | ((form: typeof FORM_STATE) => typeof FORM_STATE),
  ) => {
    void form
  },
})

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [form, setForm] = useState(FORM_STATE)

  return (
    <FormStateContext.Provider
      value={{
        form,
        setForm,
      }}
    >
      {children}
    </FormStateContext.Provider>
  )
}

export const useFormContext = () => {
  const formContext = useContext(FormStateContext)

  if (!formContext) {
    throw new Error("useFormContext has to be used within <FormStateContext.Provider>")
  }

  return formContext
}
