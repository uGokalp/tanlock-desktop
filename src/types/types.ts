import { Device } from "@/config/db/types"

export type DeviceInfo = {
  device: {
    name: string
    contact: string
    location: string
    serialno: string
  }
  network: {
    macaddr: string
    ip: string
    netmask: string
    dns: string
    gateway: string
  }
  relais: {
    r1: boolean
    r0: boolean
  }
  time: {
    time: string
    offset: string
    invalid: boolean
    stamp: number
  }
  version: {
    filesystem: string
    hwdesc: string
    software: string
    flavor: string
    hash: string
    branch: string
    firmware: string
    build: string
    date: string
    hardware: string
  }
  external: {
    s2: boolean
    s1: boolean
  }
  sensor: {
    lock: boolean
    handle: boolean
    motor: boolean
  }
}

export interface UserSchema {
  login: string
  cname: string
  employee: string
  active: boolean
  fourEye: boolean
}

export const deviceInfotoDevice = (deviceInfo: DeviceInfo): Omit<Device, "id"> => {
  return {
    device__name: deviceInfo.device.name,
    device__contact: deviceInfo.device.contact,
    device__location: deviceInfo.device.location,
    device__serialno: deviceInfo.device.serialno,
    network__macaddr: deviceInfo.network.macaddr,
    network__ip: deviceInfo.network.ip,
    network__netmask: deviceInfo.network.netmask,
    network__dns: deviceInfo.network.dns,
    network__gateway: deviceInfo.network.gateway,
    relais__r1: deviceInfo.relais.r1,
    relais__r0: deviceInfo.relais.r0,
    time__time: deviceInfo.time.time,
    time__offset: deviceInfo.time.offset,
    time__invalid: deviceInfo.time.invalid,
    time__stamp: deviceInfo.time.stamp,
    version__filesystem: deviceInfo.version.filesystem,
    version__hwdesc: deviceInfo.version.hwdesc,
    version__software: deviceInfo.version.software,
    version__flavor: deviceInfo.version.flavor,
    version__hash: deviceInfo.version.hash,
    version__branch: deviceInfo.version.branch,
    version__firmware: deviceInfo.version.firmware,
    version__build: deviceInfo.version.build,
    version__date: deviceInfo.version.date,
    version__hardware: deviceInfo.version.hardware,
    external__s2: deviceInfo.external.s2,
    external__s1: deviceInfo.external.s1,
    sensor__lock: deviceInfo.sensor.lock,
    sensor__handle: deviceInfo.sensor.handle,
    sensor__motor: deviceInfo.sensor.motor,
  }
}
