import { type Device, type InsertDevice, type GpsLocation, type InsertGpsLocation, type Alert, type InsertAlert } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Device methods
  getDevices(): Promise<Device[]>;
  getDevice(id: string): Promise<Device | undefined>;
  createDevice(device: InsertDevice): Promise<Device>;
  updateDevice(id: string, updates: Partial<InsertDevice>): Promise<Device | undefined>;
  deleteDevice(id: string): Promise<boolean>;

  // GPS Location methods
  getGpsLocations(deviceId?: string): Promise<GpsLocation[]>;
  getLatestGpsLocation(deviceId: string): Promise<GpsLocation | undefined>;
  createGpsLocation(location: InsertGpsLocation): Promise<GpsLocation>;

  // Alert methods
  getAlerts(deviceId?: string): Promise<Alert[]>;
  getUnresolvedAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  resolveAlert(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private devices: Map<string, Device>;
  private gpsLocations: Map<string, GpsLocation>;
  private alerts: Map<string, Alert>;

  constructor() {
    this.devices = new Map();
    this.gpsLocations = new Map();
    this.alerts = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample devices
    const sampleDevices: Device[] = [
      {
        id: "device-001",
        name: "Main Monitoring Unit",
        type: "sensor",
        status: "online",
        batteryLevel: 78,
        temperature: 42,
        signalStrength: -42,
        networkType: "4G LTE",
        dataUsage: 2.3,
        uptime: 4334, // 72h 14m
        cpuTemp: 38,
        gpuTemp: 45,
        cpuUsage: 34,
        memoryUsage: 2.1,
        storageUsage: 45,
        lastSeen: new Date(),
        createdAt: new Date(),
      },
      {
        id: "device-002",
        name: "GPS Tracker 01",
        type: "gps",
        status: "online",
        batteryLevel: 85,
        temperature: 38,
        signalStrength: -38,
        networkType: "4G LTE",
        dataUsage: 1.8,
        uptime: 2880,
        cpuTemp: 35,
        gpuTemp: 40,
        cpuUsage: 28,
        memoryUsage: 1.5,
        storageUsage: 32,
        lastSeen: new Date(),
        createdAt: new Date(),
      },
      {
        id: "device-003",
        name: "Security Camera 01",
        type: "camera",
        status: "warning",
        batteryLevel: 23,
        temperature: 45,
        signalStrength: -55,
        networkType: "4G LTE",
        dataUsage: 8.9,
        uptime: 1440,
        cpuTemp: 42,
        gpuTemp: 48,
        cpuUsage: 65,
        memoryUsage: 3.2,
        storageUsage: 78,
        lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        createdAt: new Date(),
      },
    ];

    sampleDevices.forEach(device => this.devices.set(device.id, device));

    // Create sample GPS locations
    const sampleLocations: GpsLocation[] = [
      {
        id: "loc-001",
        deviceId: "device-001",
        latitude: -6.2088,
        longitude: 106.8456,
        accuracy: 5,
        timestamp: new Date(),
      },
      {
        id: "loc-002",
        deviceId: "device-002",
        latitude: -6.2100,
        longitude: 106.8470,
        accuracy: 3,
        timestamp: new Date(),
      },
      {
        id: "loc-003",
        deviceId: "device-003",
        latitude: -6.2076,
        longitude: 106.8443,
        accuracy: 8,
        timestamp: new Date(),
      },
    ];

    sampleLocations.forEach(location => this.gpsLocations.set(location.id, location));

    // Create sample alerts
    const sampleAlerts: Alert[] = [
      {
        id: "alert-001",
        deviceId: "device-003",
        type: "low_battery",
        message: "Device battery level is critically low at 23%",
        severity: "critical",
        resolved: false,
        createdAt: new Date(),
      },
    ];

    sampleAlerts.forEach(alert => this.alerts.set(alert.id, alert));
  }

  async getDevices(): Promise<Device[]> {
    return Array.from(this.devices.values());
  }

  async getDevice(id: string): Promise<Device | undefined> {
    return this.devices.get(id);
  }

  async createDevice(insertDevice: InsertDevice): Promise<Device> {
    const id = randomUUID();
    const device: Device = {
      ...insertDevice,
      id,
      lastSeen: new Date(),
      createdAt: new Date(),
    };
    this.devices.set(id, device);
    return device;
  }

  async updateDevice(id: string, updates: Partial<InsertDevice>): Promise<Device | undefined> {
    const device = this.devices.get(id);
    if (!device) return undefined;

    const updatedDevice: Device = {
      ...device,
      ...updates,
      lastSeen: new Date(),
    };
    this.devices.set(id, updatedDevice);
    return updatedDevice;
  }

  async deleteDevice(id: string): Promise<boolean> {
    return this.devices.delete(id);
  }

  async getGpsLocations(deviceId?: string): Promise<GpsLocation[]> {
    const locations = Array.from(this.gpsLocations.values());
    return deviceId ? locations.filter(loc => loc.deviceId === deviceId) : locations;
  }

  async getLatestGpsLocation(deviceId: string): Promise<GpsLocation | undefined> {
    const locations = Array.from(this.gpsLocations.values())
      .filter(loc => loc.deviceId === deviceId)
      .sort((a, b) => b.timestamp!.getTime() - a.timestamp!.getTime());
    return locations[0];
  }

  async createGpsLocation(insertLocation: InsertGpsLocation): Promise<GpsLocation> {
    const id = randomUUID();
    const location: GpsLocation = {
      ...insertLocation,
      id,
      timestamp: new Date(),
    };
    this.gpsLocations.set(id, location);
    return location;
  }

  async getAlerts(deviceId?: string): Promise<Alert[]> {
    const alerts = Array.from(this.alerts.values());
    return deviceId ? alerts.filter(alert => alert.deviceId === deviceId) : alerts;
  }

  async getUnresolvedAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(alert => !alert.resolved);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = {
      ...insertAlert,
      id,
      createdAt: new Date(),
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async resolveAlert(id: string): Promise<boolean> {
    const alert = this.alerts.get(id);
    if (!alert) return false;

    alert.resolved = true;
    this.alerts.set(id, alert);
    return true;
  }
}

export const storage = new MemStorage();
