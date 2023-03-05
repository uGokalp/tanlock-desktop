import { useEffect, useState } from "react"

const useCountdown = (
  targetSeconds: number,
  options: { finishEarly: boolean; onTimerEnd: () => void } = {
    finishEarly: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onTimerEnd: () => {},
  },
) => {
  const [countDown, setCountDown] = useState(targetSeconds)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDown - 1)
    }, 1000)

    if (countDown === 0 || options.finishEarly) {
      clearInterval(interval)
    }

    return () => {
      options.onTimerEnd()
      clearInterval(interval)
    }
  }, [countDown, options, options.finishEarly])

  return countDown
}

export default useCountdown
