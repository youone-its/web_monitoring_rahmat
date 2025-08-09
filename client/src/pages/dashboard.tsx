import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import NotificationBanner from "@/components/ui/notification-banner";
import GPSMapWidget from "@/components/dashboard/gps-map-widget";
import CameraFeedWidget from "@/components/dashboard/camera-feed-widget";
import DeviceStatusWidget from "@/components/dashboard/device-status-widget";
import StatsCards from "@/components/dashboard/stats-cards";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  
  // Fetch initial data
  const { data: devices, refetch: refetchDevices } = useQuery({
    queryKey: ["/api/devices"],
  });

  const { data: alerts, refetch: refetchAlerts } = useQuery({
    queryKey: ["/api/alerts/unresolved"],
  });

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ["/api/stats"],
  });

  // WebSocket connection for real-time updates
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      
      switch (data.type) {
        case 'device_updated':
        case 'device_created':
        case 'device_deleted':
          refetchDevices();
          refetchStats();
          break;
        case 'alert_created':
          refetchAlerts();
          toast({
            title: "New Alert",
            description: data.data.message,
            variant: data.data.severity === 'critical' ? 'destructive' : 'default',
          });
          break;
        case 'alert_resolved':
          refetchAlerts();
          break;
        case 'location_updated':
          // GPS locations will be handled by the map component
          break;
      }
    }
  }, [lastMessage, refetchDevices, refetchAlerts, refetchStats, toast]);

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Header />
      <NotificationBanner alerts={alerts} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary" data-testid="dashboard-title">
            Dashboard Pemantau
          </h1>
          <p className="text-gray-600 mt-2" data-testid="dashboard-description">
            Monitor lokasi GPS, feed kamera, dan kondisi perangkat secara real-time
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <GPSMapWidget devices={devices} />
          <CameraFeedWidget />
          <DeviceStatusWidget devices={devices} />
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />
      </main>
    </div>
  );
}
