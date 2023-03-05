import { FormEvent, useEffect, useState } from "react"

import BasicTimer from "@/components/Countdown/Basic"
import { useFormContext } from "@/components/Form/FormContext"
import BasicCard from "@/components/PhysicalCard/BasicCard"
import { MediumCreateSchema } from "@/config/api/types"
import { useCreateMedium } from "@/hooks/outbound"
import { getTimestamp } from "@/utils"

function SwipeCardForm(
  props: React.PropsWithChildren<{
    onNext: () => void
    onPrev: () => void
  }>,
) {
  const { form } = useFormContext()
  const [countdown, setCountdown] = useState(false)
  const [cardLoaded, setCardLoaded] = useState(true)
  const [countdownExpired, setCountdownExpired] = useState(false)

  const [ts, setTs] = useState<number>(() => getTimestamp())
  const createMedium = useCreateMedium()

  // const { data: cardData } = useCardSwipe(
  //   form.steps.setup.value.deviceIp,
  //   ts,
  //   3000,
  //   countdown,
  //   cardLoaded || countdownExpired,
  // )
  const cardData = "e9549ef90a7c05"
  useEffect(() => {
    if (cardData) {
      setCardLoaded(true)
    }
  }, [cardData])

  const ProcessButton = () => (
    <div className="flex justify-center pt-5">
      <button
        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={(e) => {
          e.preventDefault()
          setCountdown(true)
          setTs(getTimestamp())
        }}
      >
        Start Process
      </button>
    </div>
  )

  const Timer = () => (
    <div className="flex justify-center pt-5">
      <BasicTimer
        targetSeconds={30}
        options={{
          finishEarly: cardLoaded,
          onTimerEnd: () => setCountdownExpired(true),
        }}
      />
    </div>
  )

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("before parse")
    const medium = MediumCreateSchema.parse({
      login: form.steps.setup.value.userCname,
      identifier: cardData,
    })
    console.log("Medium is", medium)
    createMedium
      .mutateAsync({
        ip: form.steps.setup.value.deviceIp,
        medium,
      })
      .then((res) => {
        console.log(res)
        props.onNext()
      })
      .catch((err) => {
        console.error(err)
        props.onPrev()
      })
  }

  return (
    <form onSubmit={onSubmit}>
      <div className={"flex w-full flex-col space-y-4"}>
        <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-black sm:text-4xl">
          {!cardData ? "Please swipe your card" : "Is this your card?"}
        </h2>

        {!countdown ? <ProcessButton /> : null}
        {countdown && !cardLoaded ? <Timer /> : null}
        {cardData && cardLoaded ? (
          <div className="flex items-center justify-center">
            <BasicCard
              cname={form.steps.setup.value.userCname}
              cardIdentifier={cardData}
            />
          </div>
        ) : null}

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              onClick={props.onPrev}
              type="button"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Back
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default SwipeCardForm
