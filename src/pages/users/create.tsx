import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import LoadingButton from "@/components/Button/LoadingButton"
import { User } from "@/db/types"
import { useInsertUser } from "@/hooks/db/useUsers"
import Sidebar from "@/layouts/Sidebar"
import { onPromise } from "@/utils"

const CreateUser = () => {
  const { register, handleSubmit, reset } = useForm<User>({
    defaultValues: {
      four_eye: false,
      active: true,
    },
  })
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
        <div className="pb-2">
          <label
            htmlFor="login"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Login
          </label>
          <div className="mt-2">
            <input
              id="login"
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              {...register("login")}
            />
          </div>
        </div>
        <div className="pb-2">
          <label
            htmlFor="cname"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Common Name
          </label>
          <div className="mt-2">
            <input
              id="cname"
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              {...register("cname")}
            />
          </div>
        </div>
        <div className="pb-2">
          <label
            htmlFor="employee"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Employee Number
          </label>
          <div className="mt-2">
            <input
              type="number"
              id="employee"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              {...register("employee")}
            />
          </div>
          <div className="grid md:grid-cols-6 md:gap-6 pt-5">
            <label className="relative mb-4 inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                value=""
                className="peer sr-only"
                {...register("active")}
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-indigo-800"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Active
              </span>
            </label>

            {/* <label className="relative mb-4 inline-flex cursor-pointer items-center">
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
            </label> */}
          </div>
        </div>
        <LoadingButton
          type="submit"
          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          isLoading={isLoading}
        >
          Submit
        </LoadingButton>
      </form>
    </Sidebar>
  )
}

export default CreateUser
