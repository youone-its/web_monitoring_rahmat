import psutil
import platform
import json
import time
import subprocess

def get_wifi_status():
    try:
        ssid = subprocess.check_output(["iwgetid", "-r"]).decode().strip()
        if ssid:
            return {"connected": True, "ssid": ssid}
        else:
            return {"connected": False, "ssid": None}
    except Exception:
        return {"connected": False, "ssid": None}

def get_bluetooth_connections():
    try:
        output = subprocess.check_output(["bluetoothctl", "info"]).decode()
        devices = []
        for line in output.splitlines():
            if line.strip().startswith("Name:"):
                devices.append(line.split("Name:")[1].strip())
        return devices
    except Exception:
        return []

def main():
    battery = psutil.sensors_battery()
    mem = psutil.virtual_memory()
    cpu_percent = psutil.cpu_percent(interval=1)
    uptime = time.time() - psutil.boot_time()
    wifi = get_wifi_status()
    bt_devices = get_bluetooth_connections()

    data = {
        "hostname": platform.node(),
        "os": platform.system(),
        "batteryLevel": battery.percent if battery else None,
        "isCharging": battery.power_plugged if battery else None,
        "memoryUsage": round(mem.used / (1024 ** 3), 2),
        "memoryTotal": round(mem.total / (1024 ** 3), 2),
        "cpuUsage": cpu_percent,
        "uptime": int(uptime // 60),
        "wifiConnected": wifi["connected"],
        "wifiSSID": wifi["ssid"],
        "bluetoothDevices": bt_devices,
        "lastSeen": time.strftime('%Y-%m-%d %H:%M:%S'),
    }
    print(json.dumps(data))

if __name__ == "__main__":
    main()
