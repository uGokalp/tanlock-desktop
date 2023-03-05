import { jsonrepair } from "jsonrepair"

export type ConfigJson = {
  config: {
    access: {
      cftp: {
        user: {
          root: string
        }
      }
      cockpit: {
        config: string
        service: string
      }
      ftp: {
        user: {
          root: string
          update: string
        }
      }
    }
    api: {
      rest: {
        legacy: boolean
        rest_v1: boolean
      }
      snmp: {
        config: {
          v1v2: {
            community_readonly: string
            community_readwrite: string
          }
          v3: {
            auth_algo: string
            auth_password: string
            engineid: string
            priv_algo: string
            priv_password: string
            username: string
          }
        }
        enable: boolean
        mib_version: string
        snmp_v1: boolean
        snmp_version: string
        trap: {
          destination: string
          enable: boolean
        }
      }
      web: {
        legacy: boolean
        web_v1: boolean
      }
    }
    basedata: {
      contact: string
      location: string
      showOnLogin: boolean
    }
    device: {
      firstboot: boolean
      name: string
    }
    disco: {
      method: string
      payload: string
      timer: number
      type: string
      url: string
    }
    flock: {
      alarm: {
        dotl: number
        preDotl: number
        useDC1: boolean
        useDC2: boolean
      }
      kittinterval: number
    }
    ftp: {
      enable: boolean
    }
    http: {
      enable: boolean
      port: number
    }
    https: {
      enable: boolean
      port: number
    }
    input: {
      two_factor: boolean
    }
    log: {
      http: {
        enabled: boolean
        target: string
      }
      snmptrap: {
        enabled: boolean
      }
    }
    medium: {
      hw: string
      imp: {
        e17_card_iclass_uid: boolean
        e19_card_uid: boolean
      }
    }
    module: {
      load: string
      rfidmod: {
        cache: {
          timeout: number
        }
        pollinterval: {
          keys: number
          scan: number
        }
        uart: number
      }
    }
    network: {
      dnshost: string
      gateway: string
      ip_addr: string
      netmask: string
      ntphost: string
      ntpinterval: number
      use_dhcp: boolean
      vlan: {
        active: boolean
        pcp: number
        vid: number
      }
    }
    nodelink: {
      tcp: {
        enable: boolean
      }
    }
    system: {
      timezone: string
    }
    updater: {
      auth: string
      url: string
    }
  }
}

// export const loadConfig = (json: string): ConfigJson => {
//   const re = /(\w+) = /g
//   const rep = /"$1" : /
//   const replaced = json.replace(re, rep).replace(/\//g, "")
//   const parsed = jsonrepair(replaced)
//   const config = JSON.parse(parsed) as ConfigJson
//   return config
// }
