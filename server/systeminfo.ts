import si from "systeminformation";

export async function getSystemDevice() {
  const [battery, network, mem, cpu, osInfo, time, bluetooth] = await Promise.all([
    si.battery().catch(() => undefined),
    si.networkInterfaces().catch(() => []),
    si.mem().catch(() => undefined),
    si.currentLoad().catch(() => undefined),
    si.osInfo().catch(() => undefined),
    si.time(),
    si.bluetoothDevices ? si.bluetoothDevices().catch(() => []) : Promise.resolve([]),
  ]);

  // Pick first network interface with an IP
  const net = Array.isArray(network) ? network.find(n => n.ip4 && !n.virtual) : undefined;

  return {
    id: "local-system",
    name: osInfo && 'hostname' in osInfo ? osInfo.hostname : "Local System",
    type: "sensor",
    status: "online",
    batteryLevel: battery && 'hasBattery' in battery && battery.hasBattery ? battery.percent : null,
    temperature: null, // systeminformation can provide cpu/gpu temp if needed
    signalStrength: null, // not available
    networkType: net ? net.type : null,
    dataUsage: null, // not available
    uptime: Math.floor((time.uptime || 0) / 60),
    cpuTemp: null, // can be added
    gpuTemp: null, // can be added
    cpuUsage: cpu && 'currentLoad' in cpu ? cpu.currentLoad : null,
    memoryUsage: mem && 'used' in mem ? +(mem.used / 1024 / 1024 / 1024).toFixed(1) : null,
    storageUsage: null, // can be added
    lastSeen: new Date(),
    createdAt: new Date(),
    bluetoothDevices: Array.isArray(bluetooth) ? bluetooth.map(b => b.name) : [],
  };
}
