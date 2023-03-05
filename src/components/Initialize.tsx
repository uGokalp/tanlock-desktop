export {}

// import { PlusIcon } from "@heroicons/react/20/solid"

// import { useAppStore } from "@/store"
// import { getBaseDirectory } from "@/utils/tauri"

// export default function Initialize() {
//   const appStore = useAppStore()

//   const onClick = () => {
//     void appStore.initialize()
//     getBaseDirectory()
//       .then((dir) => {
//         console.log(dir)
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//   }
//   return (
//     <div className="grid h-56 content-center gap-4 pt-10">
//       <div className="text-center">
//         <svg
//           className="mx-auto h-12 w-12 text-gray-400"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           aria-hidden="true"
//         >
//           <path
//             vectorEffect="non-scaling-stroke"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
//           />
//         </svg>
//         <h3 className="mt-2 text-sm font-semibold text-gray-900">
//           Looks like you are running the app for the first time
//         </h3>
//         <p className="mt-1 text-sm text-gray-500">
//           Get started by initializing the application.
//         </p>
//         <p>Message from app: {appStore.msg}</p>
//         <div className="mt-6">
//           <button
//             type="button"
//             onClick={() => onClick()}
//             className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//           >
//             <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
//             Start
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
