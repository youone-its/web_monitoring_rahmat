import psutil
import platform
import json
import time
import socket

try:
    import bluetooth
except ImportError:
    bluetooth = None

def get_bluetooth_devices():
    if not bluetooth:
        return []
    try:
        devices = bluetooth.discover_devices(duration=4, lookup_names=True)
        return [name for addr, name in devices]
    except Exception:
        return []

def get_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return None

def main():
    battery = psutil.sensors_battery()
    mem = psutil.virtual_memory()
    cpu_percent = psutil.cpu_percent(interval=1)
    uptime = time.time() - psutil.boot_time()
    net_if_addrs = psutil.net_if_addrs()
    net_if_stats = psutil.net_if_stats()
    active_if = next((iface for iface, stats in net_if_stats.items() if stats.isup and iface != 'lo'), None)
    ip = get_ip()
    bt_devices = get_bluetooth_devices()

    data = {
        "hostname": platform.node(),
        "os": platform.system(),
        "batteryLevel": battery.percent if battery else None,
        "isCharging": battery.power_plugged if battery else None,
        "memoryUsage": round(mem.used / (1024 ** 3), 2),
        "memoryTotal": round(mem.total / (1024 ** 3), 2),
        "cpuUsage": cpu_percent,
        "uptime": int(uptime // 60),
        "networkType": active_if,
        "ip": ip,
        "bluetoothDevices": bt_devices,
        "lastSeen": time.strftime('%Y-%m-%d %H:%M:%S'),
    }
    print(json.dumps(data))

if __name__ == "__main__":
    main()
