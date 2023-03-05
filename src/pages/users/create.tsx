import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import SpinnerButton from "@/components/Button/SpinnerButton"
import { User } from "@/config/db/types"
import { useInsertUser } from "@/hooks/db/useUsers"
import Sidebar from "@/layouts/Sidebar"
import { onPromise } from "@/utils"

const CreateUser = () => {
  const { register, handleSubmit, reset } = useForm<User>()
  const { mutateAsync: userMutation, isLoading } = useInsertUser()
  const onSubmit = handleSubmit((data) => {
    void userMutation(data).then(() => {
      toast.success("User created successfully!")
      reset()
    })
  })
  return (
    <Sidebar>
      <form onSubmit={onPromise(onSubmit)}>
        <div className="group relative z-0 mb-6 w-full">
          <input
            type="string"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder=" "
            required
            {...register("login")}
          />
          <label
            htmlFor="floating_email"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Login
          </label>
        </div>
        <div className="group relative z-0 mb-6 w-full">
          <input
            type="string"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder=" "
            required
            {...register("cname")}
          />
          <label
            htmlFor="cname"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Cname
          </label>
        </div>
        <div className="group relative z-0 mb-6 w-full">
          <input
            type="string"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder=" "
            required
            {...register("employee")}
          />
          <label
            htmlFor="floating_repeat_password"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Employee
          </label>
        </div>
        <div className="grid md:grid-cols-6 md:gap-6">
          <label className="relative mb-4 inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              value=""
              className="peer sr-only"
              {...register("active")}
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Active
            </span>
          </label>

          <label className="relative mb-4 inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              value=""
              className="peer sr-only"
              {...register("four_eye")}
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Four Eye
            </span>
          </label>
        </div>

        <SpinnerButton
          type="submit"
          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          isLoading={isLoading}
        >
          Submit
        </SpinnerButton>
      </form>
    </Sidebar>
  )
}

export default CreateUser
