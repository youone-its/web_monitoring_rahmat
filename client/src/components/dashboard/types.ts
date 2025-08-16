// Extend Device type for frontend to include bluetoothDevices (for demo/dev only)
import type { Device as BaseDevice } from "@shared/schema";

export type Device = BaseDevice & {
  bluetoothDevices?: string[];
  wifiConnected?: boolean;
  wifiSSID?: string | null;
};
