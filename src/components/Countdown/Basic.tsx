import useCountdown from "@/hooks/useCountdown"

type BasicTimerProps = {
  targetSeconds: number
  options: { finishEarly: boolean; onTimerEnd: () => void }
}

const BasicTimer = ({ targetSeconds, options }: BasicTimerProps) => {
  const countdown = useCountdown(targetSeconds, options)
  const style = { "--value": countdown } as React.CSSProperties
  return (
    <div className="bg-base-300 rounded-b-box rounded-tr-box relative overflow-x-auto">
      <div
        className="preview border-base-300 bg-base-200 rounded-b-box rounded-tr-box undefined flex min-h-[6rem] min-w-[18rem] max-w-4xl flex-wrap items-center justify-center gap-2 overflow-x-hidden border bg-cover bg-top p-4"
        style={{ backgroundSize: "5px 5px" }}
      >
        <span className="countdown font-mono text-6xl">
          <span style={style}></span>
        </span>
      </div>
    </div>
  )
}

export default BasicTimer
