import { useMutation, useQuery } from "@tanstack/react-query"

import DeviceRepository from "@/config/db/deviceRepository"
import { Device, DeviceGroup } from "@/config/db/types"
import { queryClient } from "@/config/queryClient"

export const useDeviceGroups = () => {
  return useQuery({
    queryKey: ["db-device-groups"],
    queryFn: () => DeviceRepository.listDeviceGroups(),
  })
}

export const useDevicesInGroups = () => {
  return useQuery({
    queryKey: ["db-devices-in-groups"],
    queryFn: () => DeviceRepository.listDevicesInGroups(),
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
      DeviceRepository.updateDevicesToGroupId(group_id, devices),
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
      DeviceRepository.createDeviceGroup(deviceGroup),
    onSuccess: () => {
      void queryClient.invalidateQueries(["db-device-groups"])
    },
  })
}

// Gets the device that belong to a group with id
export const useDeviceGroupsById = (id: number | undefined) => {
  return useQuery({
    queryKey: ["db-device-groups", id],
    queryFn: () => DeviceRepository.getDevicesByGroupId(id as number),
    enabled: Boolean(id),
  })
}
