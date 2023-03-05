import Image from "next/image"

type BasicCardProps = {
  cname: string
  cardIdentifier: string
}

const BasicCard = ({ cname, cardIdentifier }: BasicCardProps) => {
  return (
    <div className="flex flex-shrink-0 flex-col">
      <div className="relative h-56 w-96 overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-blue-800">
        <svg
          viewBox="0 0 220 192"
          width="220"
          height="192"
          fill="none"
          className="absolute -left-10 -top-16 text-blue-900 opacity-50"
        >
          <defs>
            <pattern
              id="837c3e70-6c3a-44e6-8854-cc48c737b659"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" fill="currentColor"></rect>
            </pattern>
          </defs>
          <rect
            width="220"
            height="192"
            fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
          ></rect>
        </svg>
        <svg
          viewBox="0 0 220 192"
          width="220"
          height="192"
          fill="none"
          className="absolute -right-20 -bottom-32 text-blue-900 opacity-50"
        >
          <defs>
            <pattern
              id="837c3e70-6c3a-44e6-8854-cc48c737b659"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" fill="currentColor"></rect>
            </pattern>
          </defs>
          <rect
            width="220"
            height="192"
            fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
          ></rect>
        </svg>
        <Image
          src="https://ml7xwoneoyzf.i.optimole.com/w:200/h:200/q:mauto/rt:fill/g:ce/https://tanlock.com/wp-content/uploads/2021/05/Logo-2021-screen.png"
          alt=""
          className="absolute right-2 top-2 h-24"
          height={96}
          width={96}
        />
        <div className="absolute top-10 left-5 h-12 w-16 overflow-hidden rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-200 opacity-90">
          <span className="absolute top-1/2 left-1 flex h-full w-10 -translate-y-1/2 -translate-x-1/2 transform rounded-lg border border-gray-400 bg-opacity-50"></span>
          <span className="absolute top-1/2 right-1 flex h-full w-10 -translate-y-1/2 translate-x-1/2 transform rounded-lg border border-gray-400 bg-opacity-50"></span>
          <span className="absolute top-1.5 right-0 flex h-5 w-full -translate-y-1/2 transform rounded-full border border-gray-400 bg-opacity-50"></span>
          <span className="absolute bottom-1.5 right-0 flex h-5 w-full translate-y-1/2 transform rounded-full border border-gray-400 bg-opacity-50"></span>
        </div>
        <div className="text-md absolute bottom-12 left-5 space-x-1.5 font-semibold text-white">
          <span>{cardIdentifier}</span>
        </div>
        <div className="absolute bottom-16 left-5 text-base font-semibold text-gray-200"></div>
        <div className="text-md absolute bottom-4 left-5 font-semibold uppercase text-gray-200">
          <span>{cname}</span>
        </div>
      </div>
    </div>
  )
}

export default BasicCard
