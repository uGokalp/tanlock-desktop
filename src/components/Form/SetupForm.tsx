import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import UserSelect from "@/components/Select/UserSelect"
import { User, UserSchema } from "@/db/types"
import { useUsers } from "@/hooks/db/useUsers"
import { onPromise } from "@/utils"

const formSchema = z.object({
  deviceIp: z.string().ip({ version: "v4", message: "Invalid IP!" }),
  user: UserSchema,
})
export type FormData = z.infer<typeof formSchema>

function SetupForm(
  props: React.PropsWithChildren<{
    onNext: () => void
    setState: (deviceIp: string, user: User) => void
    state: { deviceIp?: string; user?: User }
  }>,
) {
  const { data: users } = useUsers()
  const { register, handleSubmit, control, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    shouldUseNativeValidation: true,
    defaultValues: {
      deviceIp: props.state.deviceIp,
      user: props.state.user,
    },
  })

  const deviceIpControl = register("deviceIp", { required: true })

  return (
    <form
      onSubmit={onPromise(
        handleSubmit((value) => {
          props.setState(value.deviceIp, value.user)
          props.onNext()
        }),
      )}
    >
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
          Device Ip
        </label>
        <input
          {...deviceIpControl}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>
      <div className="mb-6">
        {/* <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          User
        </label> */}
        {users && <UserSelect options={users} control={control} />}
        {/* <input
          {...userControl}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        /> */}
      </div>
      <div className="pt-5">
        <div className="flex justify-end">
          <button
            onClick={() => reset()}
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Reset
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Next
          </button>
        </div>
      </div>
    </form>
  )
}

export default SetupForm
