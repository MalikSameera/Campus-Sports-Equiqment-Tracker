# Campus Sports Equipment Tracker

Offline-first Expo / React Native app with Dashboard, Inventory, Equipment Detail, Borrow Log, and Add Equipment screens.

## Run

Requires Node.js 20.19+ and npm. Run `npm install`, then `npm start`. Use an Expo Go client compatible with SDK 54, an emulator, or `npm run web`. On Windows, use `npm.cmd` if PowerShell blocks npm scripts.

Run `npm test` for inventory rule tests and `npx expo export --platform web` to verify bundling.

## Features

- Dashboard counts physical units; summary cards open filtered inventory.
- Search names and asset IDs; filter categories and availability.
- View condition, location, quantities, and adjust maintenance stock.
- Log borrower, student/staff ID, quantity, and due date. View active loans, overdue records, and return history.
- Returns restore availability exactly once. Stock validation prevents over-borrowing or assigning borrowed units to maintenance.
- Add equipment with generated asset IDs and required-field validation.

## Offline data

Six sample equipment types seed on first launch. Inventory and transactions share a versioned AsyncStorage record. Writes complete before the UI reports success; failed reads offer retry without overwriting existing data. No backend or account is required.

Data is specific to the device/browser profile. Clearing app data removes it. Development requires the Expo server to load the bundle; install a standalone build for fully offline cold starts. Administrator authentication, synchronization, backup/export, and encryption are outside this prototype.

`src/inventory.js` contains inventory rules, `tests/inventory.test.js` verifies stock and transaction behavior, and `App.js` contains screens and persistence.
