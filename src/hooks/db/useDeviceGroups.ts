import { useMutation, useQuery } from "@tanstack/react-query"

import deviceStore from "@/db/device-store"
import { Device, DeviceGroup } from "@/db/types"
import { queryClient } from "@/config/queryClient"

export const useDeviceGroups = () => {
  return useQuery({
    queryKey: ["db-device-groups"],
    queryFn: () => deviceStore.listDeviceGroups(),
  })
}

export const useDevicesInGroups = () => {
  return useQuery({
    queryKey: ["db-devices-in-groups"],
    queryFn: () => deviceStore.listDevicesInGroups(),
  })
}

type UpdateParams = {
  group_id: number
  devices: Device[]
}

// Adds and removes devices from a group
export const useUpdateDevicesToGroups = () => {
  return useMutation({
    mutationFn: ({ group_id, devices }: UpdateParams) =>
      deviceStore.updateDevicesToGroupId(group_id, devices),
    onSuccess: (value, variables) => {
      void queryClient.invalidateQueries(["db-devices-in-groups"])
      void queryClient.invalidateQueries(["db-device-groups", variables.group_id])
    },
  })
}

// only updates the group name Todo: remove
export const useInsertDeviceGroup = () => {
  return useMutation({
    mutationFn: (deviceGroup: DeviceGroup) =>
      deviceStore.createDeviceGroup(deviceGroup),
    onSuccess: () => {
      void queryClient.invalidateQueries(["db-device-groups"])
    },
  })
}

// Gets the device that belong to a group with id
export const useDeviceGroupsById = (id: number | undefined) => {
  return useQuery({
    queryKey: ["db-device-groups", id],
    queryFn: () => deviceStore.getDevicesByGroupId(id as number),
    enabled: Boolean(id),
  })
}
