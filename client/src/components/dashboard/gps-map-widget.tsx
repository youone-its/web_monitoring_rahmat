import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, RotateCcw, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Device } from "@shared/schema";

// Leaflet imports (dynamic to avoid SSR issues)
let L: any;

interface GPSMapWidgetProps {
  devices?: Device[];
}

interface SelectedDevice {
  id: string;
  name: string;
  status: string;
  lastSeen: string;
  location: string;
}

export default function GPSMapWidget({ devices = [] }: GPSMapWidgetProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const [selectedDevice, setSelectedDevice] = useState<SelectedDevice | null>(null);

  const { data: locations, refetch: refetchLocations } = useQuery({
    queryKey: ["/api/gps-locations"],
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  const onlineDevices = devices.filter(d => d.status === 'online');

  useEffect(() => {
    async function initializeMap() {
      if (!mapRef.current || mapInstanceRef.current) return;

      // Dynamic import of Leaflet
      if (!L) {
        L = (await import('leaflet')).default;
        
        // Fix for default markers in React
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });
      }

      const map = L.map(mapRef.current).setView([-6.2088, 106.8456], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !locations || !devices.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current.clear();

    // Add new markers
    locations.forEach((location: any) => {
      const device = devices.find(d => d.id === location.deviceId);
      if (!device) return;

      const color = device.status === 'online' ? '#22c55e' : 
                   device.status === 'warning' ? '#f59e0b' : '#ef4444';
      
      const marker = L.circleMarker([location.latitude, location.longitude], {
        color: color,
        fillColor: color,
        fillOpacity: 0.8,
        radius: 8,
        weight: 2,
      });

      marker.bindPopup(`
        <div class="p-2 font-sans">
          <strong class="text-lg">${device.name}</strong><br>
          <span class="text-sm text-gray-600">Status: ${device.status}</span><br>
          <span class="text-sm text-gray-600">Battery: ${device.batteryLevel}%</span><br>
          <button 
            onclick="window.showDeviceDetails('${device.id}')" 
            class="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            View Details
          </button>
        </div>
      `);

      marker.addTo(mapInstanceRef.current);
      markersRef.current.set(device.id, marker);
    });

    // Global function for popup buttons
    (window as any).showDeviceDetails = (deviceId: string) => {
      const device = devices.find(d => d.id === deviceId);
      const location = locations.find((l: any) => l.deviceId === deviceId);
      
      if (device && location) {
        setSelectedDevice({
          id: device.id,
          name: device.name,
          status: device.status,
          lastSeen: device.lastSeen ? new Date(device.lastSeen).toLocaleString() : 'Unknown',
          location: `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
        });
      }
    };
  }, [locations, devices]);

  const handleRefresh = () => {
    refetchLocations();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'offline': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  return (
    <>
      <Card className="lg:col-span-1 overflow-hidden" data-testid="gps-map-widget">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-secondary flex items-center space-x-2">
              <MapPin className="text-primary" size={20} />
              <span>Peta Lokasi GPS</span>
            </CardTitle>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-accent rounded-full status-indicator" />
              <span data-testid="map-status">Live</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div 
            ref={mapRef} 
            className="h-80 bg-gray-100 rounded-lg"
            data-testid="gps-map"
          />
          
          {/* Map Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users size={16} />
              <span data-testid="device-count">
                {onlineDevices.length} Devices Online
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="text-primary hover:text-blue-700 text-sm font-medium"
              data-testid="refresh-map-button"
            >
              <RotateCcw size={16} className="mr-1" />
              Refresh
            </Button>
          </div>

          {/* Device Legend */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Status Legend</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { status: 'Online', color: '#22c55e' },
                { status: 'Offline', color: '#ef4444' },
                { status: 'Warning', color: '#f59e0b' },
                { status: 'Inactive', color: '#9ca3af' },
              ].map(({ status, color }) => (
                <div key={status} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  />
                  <span>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Details Modal */}
      <Dialog open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
        <DialogContent className="max-w-md" data-testid="device-details-modal">
          <DialogHeader>
            <DialogTitle>Device Details</DialogTitle>
          </DialogHeader>
          {selectedDevice && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Device ID:</span>
                <span className="font-medium" data-testid="device-id">
                  {selectedDevice.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium" data-testid="device-name">
                  {selectedDevice.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium" data-testid="device-location">
                  {selectedDevice.location}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Seen:</span>
                <span className="font-medium" data-testid="device-last-seen">
                  {selectedDevice.lastSeen}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge 
                  className="font-medium"
                  style={{ 
                    backgroundColor: getStatusColor(selectedDevice.status),
                    color: 'white'
                  }}
                  data-testid="device-status"
                >
                  {selectedDevice.status}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
