# Tanlock Configuration Management (TCM)

This applications talks to talks to Tanlock devices through their web apis.

# Features
- Creating `users` and `user groups`
- Scaning `devices` and creating `device groups`
- Assigning `user groups` to `device groups`
- Syncing local state with device state
- Viewing `device logs` within `device groups`

# Installing
Check release page for
- Windows msi
- Macos dmg
- Linux 

# Development
- Frontend Next.js (Typescript) is in src
- Backend Rust is in src-tauri

## Local Installation
1. Install Rust
2. Check https://tauri.app/v1/guides/getting-started/prerequisites for platform specific instructions
  - Windows users need Microsoft Visual Studio C++ Build Tools to build the application
  - Mac users need xcode build tools

3. Run pnmp install to install frontend packages
4. Run pnpm run dev for development build
5. Run pnpm build for production build