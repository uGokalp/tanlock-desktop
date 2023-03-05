export {}
// import { create } from "zustand"

// import { doesDbExist, invoke } from "@/utils/tauri"

// export type InitMsg = {
//   status: boolean
//   message: string
// }

// interface AppState {
//   initialized: boolean
//   msg: string
//   shouldInitialize: () => Promise<void>
//   initialize: () => Promise<void>
// }

// export const useAppStore = create<AppState>((set) => ({
//   initialized: false,
//   msg: "",
//   shouldInitialize: async () => {
//     const msg = await doesDbExist()
//     set({ initialized: msg, msg: "demo" })
//   },
//   initialize: async () => {
//     const msg = await invoke<InitMsg>("initialize_db")
//     console.log("initialize_db", msg)
//     set({ initialized: msg.status, msg: msg.message })
//   },
// }))
