import { useQuery } from "@tanstack/react-query"
import { PaginationState } from "@tanstack/react-table"
import { useState } from "react"

import DeviceSelect from "@/components/Logs/DeviceSelect"
import DeviceGroupSelect from "@/components/Select/DeviceGroupSelect"
import LogTable from "@/components/Table/LogTable"
import api from "@/config/api/api"
import { Device, DeviceGroup } from "@/db/types"
import { useDeviceGroups, useDeviceGroupsById } from "@/hooks/db/useDeviceGroups"
import Sidebar from "@/layouts/Sidebar"

const Logs = () => {
  const [selectedDeviceGroup, setSelectedDeviceGroup] = useState<DeviceGroup>()
  const [selectedDevice, setSelectedDevice] = useState<Device>()
  const { data: deviceGroups } = useDeviceGroups()
  const { data: devices } = useDeviceGroupsById(selectedDeviceGroup?.id)
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 16,
  })

  const logQuery = useQuery(
    ["device-log", selectedDevice?.network__ip, pageIndex],
    () => api.getDeviceLog((selectedDevice as Device).network__ip, pageIndex, pageSize),
    {
      enabled: Boolean(selectedDevice),
    },
  )

  return (
    <Sidebar>
      <div>
        {deviceGroups && (
          <DeviceGroupSelect
            options={deviceGroups}
            setOption={setSelectedDeviceGroup}
            label="Device Group"
          />
        )}
        <div className="pt-3">
          {devices && (
            <DeviceSelect
              options={devices}
              setOption={setSelectedDevice}
              label="Device"
            />
          )}
        </div>
        <div className="pt-3">
          {logQuery.data && (
            <LogTable
              data={logQuery.data}
              currentPage={pageIndex}
              setPagination={setPagination}
            />
          )}
        </div>
      </div>
    </Sidebar>
  )
}

export default Logs
