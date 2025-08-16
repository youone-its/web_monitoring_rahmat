import { useMutation } from "@tanstack/react-query";
import { Cpu, RotateCcw, Download, Battery, Thermometer, Wifi, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Device as BaseDevice } from "@shared/schema";

// Extend Device type locally to allow bluetoothDevices for UI (optional, array of string)
type Device = BaseDevice & {
  bluetoothDevices?: string[];
};

interface DeviceStatusWidgetProps {
  devices?: Device[];
}

export default function DeviceStatusWidget({ devices = [] }: DeviceStatusWidgetProps) {
  const { toast } = useToast();
  const mainDevice = devices.find(d => d.type === 'sensor') || devices[0];

  const restartMutation = useMutation({
    mutationFn: async (deviceId: string) => {
      return apiRequest("POST", `/api/devices/${deviceId}/restart`);
    },
    onSuccess: () => {
      toast({
        title: "Device Restart",
        description: "Device restart command sent successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to restart device",
        variant: "destructive",
      });
    },
  });

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

  const handleRestart = () => {
    if (mainDevice) {
      restartMutation.mutate(mainDevice.id);
    }
  };

  const handleDownloadReport = () => {
    if (mainDevice) {
      downloadReportMutation.mutate(mainDevice.id);
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return "bg-accent";
    if (level > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

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
        <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Wifi className="text-accent text-lg" size={20} />
              <span className="font-medium text-gray-800">Connectivity</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full status-indicator" />
              <span className="text-sm font-medium text-accent" data-testid="connectivity-status">
                Connected
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Signal Strength</div>
              <div className="font-semibold" data-testid="signal-strength">
                {mainDevice.signalStrength} dBm
              </div>
            </div>
            <div>
              <div className="text-gray-600">Network Type</div>
              <div className="font-semibold" data-testid="network-type">
                {mainDevice.networkType}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Data Usage</div>
              <div className="font-semibold" data-testid="data-usage">
                {mainDevice.dataUsage} GB
              </div>
            </div>
            <div>
              <div className="text-gray-600">Uptime</div>
              <div className="font-semibold" data-testid="device-uptime">
                {formatUptime(mainDevice.uptime!)}
              </div>
            </div>
          </div>
        </div>

        {/* Bluetooth Devices */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-700"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 12 12m0 0-5.25-5.25M12 12l5.25 5.25M12 12l-5.25 5.25M12 3v18" /></svg>
              </span>
              <span className="font-medium text-gray-800">Bluetooth Devices</span>
            </div>
          </div>
          <div className="text-sm">
            {Array.isArray(mainDevice.bluetoothDevices) && mainDevice.bluetoothDevices.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1" data-testid="bluetooth-devices-list">
                {mainDevice.bluetoothDevices.map((dev: string, idx: number) => (
                  <li key={idx} className="text-gray-700">{dev}</li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500" data-testid="bluetooth-devices-empty">No Bluetooth devices connected</div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-3 flex items-center space-x-2">
            <Settings className="text-gray-600" size={16} />
            <span>System Status</span>
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">CPU Usage</span>
              <span className="font-medium" data-testid="cpu-usage">
                {mainDevice.cpuUsage}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Memory Usage</span>
              <span className="font-medium" data-testid="memory-usage">
                {mainDevice.memoryUsage}/4.0 GB
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Storage</span>
              <span className="font-medium" data-testid="storage-usage">
                {mainDevice.storageUsage}/128 GB
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Update</span>
              <span className="font-medium" data-testid="last-update">
                {mainDevice.lastSeen ? 
                  new Date(mainDevice.lastSeen).toLocaleString() : 
                  'Unknown'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              className="flex items-center justify-center space-x-2 py-2 px-4 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
              onClick={handleRestart}
              disabled={restartMutation.isPending}
              data-testid="restart-device-button"
            >
              <RotateCcw size={16} />
              <span>Restart</span>
            </Button>
            <Button 
              variant="outline"
              className="flex items-center justify-center space-x-2 py-2 px-4 text-sm"
              onClick={handleDownloadReport}
              disabled={downloadReportMutation.isPending}
              data-testid="download-report-button"
            >
              <Download size={16} />
              <span>Report</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
