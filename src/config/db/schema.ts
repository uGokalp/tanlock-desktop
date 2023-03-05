import { column, table } from "rado"

export const UserTable = table({
  // Pass a definition under a key with the actual name of the table in database
  user: class {
    id = column.integer.primaryKey()
    cname = column.string
    login = column.string
    employee = column.string
    active = column.boolean
    four_eye = column.boolean

    // Define helper methods directly on the model
  },
})

export const UserGroupTable = table({
  // Pass a definition under a key with the actual name of the table in database
  user_group: class {
    id = column.integer.primaryKey()
    name = column.string
    // Define helper methods directly on the model
  },
})

export const UserGroupXRefTable = table({
  // Pass a definition under a key with the actual name of the table in database
  user_group_xref: class {
    id = column.integer.primaryKey()
    user_id = column.integer.references(() => UserTable.id)
    group_id = column.integer.references(() => UserGroupTable.id)

    // Define helper methods directly on the model
  },
})

export const DeviceTable = table({
  // Pass a definition under a key with the actual name of the table in database
  device: class {
    id = column.integer.primaryKey()
    device__name = column.string
    device__contact = column.string
    device__location = column.string
    device__serialno = column.string
    network__macaddr = column.string
    network__ip = column.string
    network__netmask = column.string
    network__dns = column.string
    network__gateway = column.string
    relais__r1 = column.boolean
    relais__r0 = column.boolean
    time__time = column.string
    time__offset = column.string
    time__invalid = column.boolean
    time__stamp = column.number
    version__filesystem = column.string
    version__hwdesc = column.string
    version__software = column.string
    version__flavor = column.string
    version__hash = column.string
    version__branch = column.string
    version__firmware = column.string
    version__build = column.string
    version__date = column.string
    version__hardware = column.string
    external__s2 = column.boolean
    external__s1 = column.boolean
    sensor__lock = column.boolean
    sensor__handle = column.boolean
    sensor__motor = column.boolean

    // Define helper methods directly on the model
  },
})

export const DeviceGroupTable = table({
  // Pass a definition under a key with the actual name of the table in database
  device_group: class {
    id = column.integer.primaryKey()
    name = column.string
    // Define helper methods directly on the model
  },
})

export const DeviceGroupXRefTable = table({
  // Pass a definition under a key with the actual name of the table in database
  device_group_xref: class {
    id = column.integer.primaryKey()
    device_id = column.integer.references(() => DeviceTable.id)
    group_id = column.integer.references(() => DeviceGroupTable.id)

    // Define helper methods directly on the model
  },
})
