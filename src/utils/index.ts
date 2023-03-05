/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { SyntheticEvent } from "react"

export const range = (j: number, k: number): number[] => {
  // eslint-disable-next-line prefer-spread
  return Array.apply(null, Array(k - j + 1)).map((_, n) => {
    return n + j
  })
}

export function onPromise<T>(promise: (event: SyntheticEvent) => Promise<T>) {
  return (event: SyntheticEvent) => {
    if (promise) {
      promise(event).catch((error) => {
        console.log("Unexpected error", error)
      })
    }
  }
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export const isObject = (obj: unknown): boolean => {
  return obj instanceof Object && !(obj instanceof Array)
}

export const isEqual = (first: unknown, second: unknown): boolean => {
  if (first === second) {
    return true
  }
  if (
    (first === undefined ||
      second === undefined ||
      first === null ||
      second === null) &&
    (first || second)
  ) {
    return false
  }
  const firstType = first?.constructor.name
  const secondType = second?.constructor.name
  if (firstType !== secondType) {
    return false
  }
  if (Array.isArray(first) && Array.isArray(second)) {
    if (first.length !== second.length) {
      return false
    }
    let equal = true
    for (let i = 0; i < first.length; i++) {
      if (!isEqual(first[i], second[i])) {
        equal = false
        break
      }
    }
    return equal
  }
  if (isObject(first) && isObject(second)) {
    let equal = true
    const fObj = first as Record<string, unknown>
    const sObj = second as Record<string, unknown>
    const fKeys = Object.keys(fObj)
    const sKeys = Object.keys(sObj)
    if (fKeys.length !== sKeys.length) {
      return false
    }
    for (let i = 0; i < fKeys.length; i++) {
      if (fObj[fKeys[i]] && sObj[fKeys[i]]) {
        if (fObj[fKeys[i]] === sObj[fKeys[i]]) {
          continue // eslint-disable-line
        }
        if (
          fObj[fKeys[i]] &&
          ((fObj[fKeys[i]] as Record<string, unknown>).constructor.name === "Array" ||
            (fObj[fKeys[i]] as Record<string, unknown>).constructor.name === "Object")
        ) {
          equal = isEqual(fObj[fKeys[i]], sObj[fKeys[i]])
          if (!equal) {
            break
          }
        } else if (fObj[fKeys[i]] !== sObj[fKeys[i]]) {
          equal = false
          break
        }
      } else if (
        (fObj[fKeys[i]] && !sObj[fKeys[i]]) ||
        (!fObj[fKeys[i]] && sObj[fKeys[i]])
      ) {
        equal = false
        break
      }
    }
    return equal
  }
  return first === second
}

export const notEmpty = (value: unknown): boolean => {
  if (value === undefined || value === null) {
    return false
  }
  if (Array.isArray(value)) {
    return value.length > 0
  }
  return true
}

export function getTimestamp() {
  return Math.floor(Date.now() / 1000)
}

export const isEmpty = (val: Record<string, unknown> | null | undefined) =>
  // eslint-disable-next-line eqeqeq
  val == null || !(Object.keys(val) || val).length

export const flatten = (arr: any[], depth = 1): any[] => {
  if (typeof Array.prototype.flat !== "undefined") return arr.flat(depth)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return arr.reduce(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    (a, v) => a.concat(depth > 1 && Array.isArray(v) ? flatten(v, depth - 1) : v),
    [],
  )
}

export const cartesian = <T, K>(...sets: (T & K)[][]) =>
  sets.reduce<(T & K)[][]>(
    (accSets, set) =>
      accSets.flatMap((accSet) => set.map((value) => [...accSet, value])),
    [[]],
  )
