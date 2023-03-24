import localforage from "localforage"

import { Medium } from "@/db/types"
import { uuid } from "@/db/utils"

class MediumCrud {
  get = async (id: number) => {
    const mediums = await localforage.getItem<Medium[]>("medium")
    if (mediums === null) {
      await localforage.setItem("medium", [])
      return []
    }
    const medium = mediums.find((u) => u.id === id)
    return medium
  }
  list = async () => {
    const mediums = await localforage.getItem<Medium[]>("medium")
    if (mediums === null) {
      await localforage.setItem("medium", [])
      return []
    }
    return mediums
  }
  create = async (medium: Medium) => {
    const mediums = await localforage.getItem<Medium[]>("medium")
    if (mediums === null) {
      const record = { ...medium, id: uuid([]) }
      await localforage.setItem("medium", [record])
      return true
    }
    const record = { ...medium, id: uuid(mediums) }
    const res = await localforage.setItem("medium", [...mediums, record])
    return Boolean(res)
  }
  update = async (medium: Medium) => {
    const mediums = await localforage.getItem<Medium[]>("medium")
    const oldMedium = mediums?.find((u) => u.id === medium.id)
    if (!oldMedium || mediums === null) return false
    const newMedium = { ...medium, id: oldMedium.id }
    const newMediums = mediums.filter((u) => u.id !== medium.id)
    const res = await localforage.setItem(
      "medium",
      [...newMediums, newMedium].sort((a, b) => a.id - b.id),
    )
    return Boolean(res)
  }

  delete = async (medium: Medium) => {
    const mediums = await localforage.getItem<Medium[]>("medium")
    if (mediums === null) return false
    const newMediums = mediums.filter((u) => u.id !== medium.id)
    const res = await localforage.setItem(
      "medium",
      newMediums.sort((a, b) => a.id - b.id),
    )
    return Boolean(res)
  }
}

const mediumCrud = new MediumCrud()
export default mediumCrud
