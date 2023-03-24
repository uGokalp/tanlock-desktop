import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"

import Button from "@/components/Button/Button"
import ConfirmationModal from "@/components/Modal/ConfirmationModal"
import { queryClient } from "@/config/queryClient"
import userCrud from "@/db/tables/user-crud"
import { User } from "@/db/types"
import { onPromise } from "@/utils"

type Props = {
  user: User
}

const UserConfigProfile = ({ user }: Props) => {
  const [deleteModal, setDeleteModal] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, getValues } = useForm<User>({
    defaultValues: user,
  })

  const updateUser = useMutation({
    mutationFn: async (user: User) => {
      return await userCrud.update(user)
    },
    onSuccess: () => {
      void queryClient.refetchQueries(["db-users"])
    },
  })

  const deleteUser = useMutation({
    mutationFn: async (user: User) => {
      return await userCrud.delete(user)
    },
    onSuccess: () => {
      void queryClient.refetchQueries(["db-users"])
    },
  })

  const onDelete = () => {
    const user = getValues()
    deleteUser.mutate(user)
    onCancel()
  }
  const onCancel = () => {
    void router.push("/users/list")
  }

  const onSubmit = handleSubmit((user) => {
    updateUser.mutate(user)
  })

  return (
    <div>
      <ConfirmationModal
        open={deleteModal}
        setOpen={setDeleteModal}
        action={onDelete}
        title="Delete User"
        description="Are you sure you want to delete this user?"
      />
      <form onSubmit={onPromise(onSubmit)}>
        <div className="pb-2">
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor="id"
          >
            Database ID
          </label>
          <div className="mt-2">
            <input
              id="id"
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-100"
              disabled
              {...register("id")}
            />
          </div>
        </div>
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

            <label className="relative mb-4 inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                value=""
                className="peer sr-only"
                {...register("four_eye")}
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-indigo-800"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Four Eye
              </span>
            </label>
          </div>
        </div>
        <div className="flex justify-center pt-5 gap-5">
          <Button size="2xl" type="submit">
            Save
          </Button>
          <Button size="2xl" type="button" onClick={() => setDeleteModal(true)}>
            Delete
          </Button>
          <Button size="2xl" type="button" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default UserConfigProfile
