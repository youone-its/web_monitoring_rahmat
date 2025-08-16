import { useMutation } from "@tanstack/react-query";
import { Cpu, RotateCcw, Download, Battery, Thermometer, Wifi, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Device } from "./types";

interface DeviceStatusWidgetProps {
  devices?: Device[];
}

export default function DeviceStatusWidget({ devices = [] }: DeviceStatusWidgetProps) {
  const { toast } = useToast();
  const mainDevice = devices.find(d => d.type === 'sensor') || devices[0];

  const downloadReportMutation = useMutation({
    mutationFn: async (deviceId: string) => {
      return apiRequest("GET", `/api/devices/${deviceId}/report`);
    },
    onSuccess: () => {
      toast({
        title: "Report Download",
        description: "Device report downloaded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to download report",
        variant: "destructive",
      });
    },
  });

  const getBatteryStatus = (level: number) => {
    if (level > 50) return "Good";
    if (level > 20) return "Fair";
    return "Critical";
  };

  const formatUptime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!mainDevice) {
    return (
      <Card className="lg:col-span-1 overflow-hidden" data-testid="device-status-widget">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-secondary flex items-center space-x-2">
            <Cpu className="text-primary" size={20} />
            <span>Kondisi Perangkat</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Cpu size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No devices available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-1 overflow-hidden" data-testid="device-status-widget">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-secondary flex items-center space-x-2">
            <Cpu className="text-primary" size={20} />
            <span>Kondisi Perangkat</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-blue-700 text-sm font-medium"
            data-testid="refresh-device-status-button"
          >
            <RotateCcw size={16} className="mr-1" />
            Update
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Battery Status */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Battery className="text-accent text-lg" size={20} />
              <span className="font-medium text-gray-800">Battery Level</span>
            </div>
            <span className="text-2xl font-bold text-accent" data-testid="battery-level">
              {mainDevice.batteryLevel}%
            </span>
          </div>
          <Progress 
            value={mainDevice.batteryLevel} 
            className="h-3"
            data-testid="battery-progress"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>
              Estimated: <span data-testid="battery-estimate">6h 32m</span>
            </span>
            <span className={`font-medium ${
              mainDevice.batteryLevel! > 50 ? 'text-accent' : 
              mainDevice.batteryLevel! > 20 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {getBatteryStatus(mainDevice.batteryLevel!)}
            </span>
          </div>
        </div>

        {/* Connectivity Status */}
        <div className={`p-4 rounded-lg border ${mainDevice.wifiConnected ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' : 'bg-gradient-to-r from-red-50 to-red-100 border-red-200'}`}> 
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Wifi className={`${mainDevice.wifiConnected ? 'text-accent' : 'text-red-500'} text-lg`} size={20} />
              <span className="font-medium text-gray-800">Connectivity</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full status-indicator ${mainDevice.wifiConnected ? 'bg-accent' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${mainDevice.wifiConnected ? 'text-accent' : 'text-red-600'}`} data-testid="connectivity-status">
                {mainDevice.wifiConnected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">WiFi SSID</div>
              <div className={`font-semibold ${mainDevice.wifiConnected ? '' : 'text-gray-400'}`} data-testid="network-type">
                {mainDevice.wifiSSID || 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Uptime</div>
              <div className="font-semibold" data-testid="device-uptime">
                {formatUptime(mainDevice.uptime!)}
              </div>
            </div>
            {/* Optionally show signal strength if available */}
            {typeof mainDevice.signalStrength === 'number' && (
              <div>
                <div className="text-gray-600">Signal Strength</div>
                <div className="font-semibold" data-testid="signal-strength">
                  {mainDevice.signalStrength} dBm
                </div>
              </div>
            )}
          </div>
          {/* Bluetooth Devices */}
          {mainDevice.bluetoothDevices && mainDevice.bluetoothDevices.length > 0 && (
            <div className="mt-4">
              <div className="text-gray-600 font-medium mb-1">Bluetooth Devices</div>
              <ul className="list-disc list-inside text-gray-800 text-sm">
                {mainDevice.bluetoothDevices.map((bt, idx) => (
                  <li key={idx}>{bt}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
