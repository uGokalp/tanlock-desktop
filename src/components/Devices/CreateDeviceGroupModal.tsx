import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import SpinnerButton from "@/components/Button/SpinnerButton"
import { DeviceGroup } from "@/config/db/types"
import { useInsertDeviceGroup } from "@/hooks/db/useDeviceGroups"
import { onPromise } from "@/utils"

type ModalProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

function CreateDeviceGroupModal({ isOpen, setIsOpen }: ModalProps) {
  const [createdGroup, setCreatedGroup] = useState<string | undefined>(undefined)
  const { register, handleSubmit, reset } = useForm<DeviceGroup>()
  const { mutateAsync: DeviceMutation, isLoading } = useInsertDeviceGroup()
  const onSubmit = handleSubmit((data, e) => {
    void DeviceMutation(data).then(() => {
      toast.success("Device group created successfully!")
      reset()
      e?.preventDefault()
      setCreatedGroup(data.name)
    })
  })
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Create Device Group
                    </Dialog.Title>
                    <div className="mt-5">
                      <form onSubmit={onPromise(onSubmit)}>
                        <div className="group relative z-0 mb-6 w-full">
                          <input
                            type="string"
                            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                            placeholder=" "
                            required
                            {...register("name")}
                          />
                          <label
                            htmlFor="floating_email"
                            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
                          >
                            Login
                          </label>
                        </div>
                        <div className="mt-5 sm:mt-6">
                          <SpinnerButton
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                            isLoading={isLoading}
                          >
                            Create
                          </SpinnerButton>
                        </div>
                      </form>
                      <p className="pt-3 text-sm text-gray-500">
                        {createdGroup ? `${createdGroup} created successfully` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default CreateDeviceGroupModal
