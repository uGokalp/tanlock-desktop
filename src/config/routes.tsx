import {
  ArrowPathIcon,
  BuildingLibraryIcon,
  DeviceTabletIcon,
  DocumentMagnifyingGlassIcon,
  DocumentTextIcon,
  HomeIcon,
  KeyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline"

export const routes = [
  {
    sidebarName: "Dashboard",
    path: "/",
    children: [],
    fullName: "Dashboard",
    icon: HomeIcon,
  },
  {
    sidebarName: "Scan",
    path: "/scan",
    children: [],
    fullName: "Scan for devices",
    icon: DocumentMagnifyingGlassIcon,
  },
  {
    sidebarName: "Users",
    path: "/users",
    icon: UserGroupIcon,
    children: [
      {
        sidebarName: "Create",
        path: "/users/create",
        children: [],
        fullName: "Create Users",
      },
      {
        sidebarName: "List",
        path: "/users/list",
        children: [],
        fullName: "User List",
      },
      {
        sidebarName: "Groups",
        path: "/users/groups",
        children: [],
        fullName: "User Groups",
      },
    ],
  },
  {
    sidebarName: "Devices",
    path: "/devices",
    icon: DeviceTabletIcon,
    children: [
      {
        sidebarName: "List",
        path: "/devices/list",
        children: [],
        fullName: "Device List",
      },
      {
        sidebarName: "Groups",
        path: "/devices/groups",
        children: [],
        fullName: "Device Groups",
      },
    ],
  },
  {
    sidebarName: "Credentials",
    path: "/credentials",
    icon: KeyIcon,
    children: [
      {
        sidebarName: "Enroll",
        path: "/credentials/enroll",
        children: [],
      },
      {
        sidebarName: "List",
        path: "/credentials/list",
        children: [],
      },
    ],
  },
  {
    sidebarName: "Sync",
    path: "/sync",
    children: [],
    fullName: "Sync devices",
    icon: ArrowPathIcon,
  },
  {
    sidebarName: "Config Editor",
    path: "/config-editor",
    icon: DocumentTextIcon,
    children: [
      {
        sidebarName: "Edit",
        path: "/config-editor/config",
      },
    ],
  },
  {
    sidebarName: "Logs",
    path: "/logs",
    icon: DocumentTextIcon,
    children: [],
  },
  {
    sidebarName: "Admin",
    path: "/admin",
    icon: BuildingLibraryIcon,
    children: [],
  },
]
