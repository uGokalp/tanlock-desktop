import { useEffect, useReducer, useRef } from "react"

import { invoke } from "@/utils/tauri"

interface State<T> {
  data?: T
  error?: Error
  isLoading: boolean
}

type Cache<T> = { [cmd: string]: T }

// discriminated union type
type Action<T> =
  | { type: "loading" }
  | { type: "fetched"; payload: T }
  | { type: "error"; payload: Error }

function useInvoke<T = unknown>(cmd: string): State<T> {
  const cache = useRef<Cache<T>>({})

  // Used to prevent state update if the component is unmounted
  const cancelRequest = useRef<boolean>(false)

  const initialState: State<T> = {
    error: undefined,
    data: undefined,
    isLoading: true,
  }

  // Keep state logic separated
  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "loading":
        return { ...initialState }
      case "fetched":
        return { ...initialState, data: action.payload, isLoading: false }
      case "error":
        return { ...initialState, error: action.payload, isLoading: false }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(fetchReducer, initialState)

  useEffect(() => {
    // Do nothing if the cmd is not given
    if (!cmd) return

    cancelRequest.current = false

    const invokeData = async () => {
      dispatch({ type: "loading" })

      // If a cache exists for this cmd, return it
      if (cache.current[cmd]) {
        dispatch({ type: "fetched", payload: cache.current[cmd] })
        return
      }

      try {
        const data = await invoke<T>(cmd)
        cache.current[cmd] = data
        if (cancelRequest.current) return

        dispatch({ type: "fetched", payload: data })
      } catch (error) {
        if (cancelRequest.current) return

        dispatch({ type: "error", payload: error as Error })
      }
    }

    void invokeData()

    // Use the cleanup function for avoiding a possibly...
    // ...state update after the component was unmounted
    return () => {
      cancelRequest.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmd])

  return state
}

export default useInvoke
