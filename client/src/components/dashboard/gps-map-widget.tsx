import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
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
  // State for user's own location
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(true);
  // Get user's current location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      setGeoLoading(false);
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          latitude: pos.coords.latitude + 0.0023,
          longitude: pos.coords.longitude +0.0015,
        });
        setGeoLoading(false);
      },
      (err) => {
        if (err.code === 1) {
          setGeoError('Location permission denied. Please allow location access.');
        } else {
          setGeoError('Unable to retrieve your location.');
        }
        setGeoLoading(false);
      },
      { enableHighAccuracy: true }
    );
  }, []);




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

      // Default center, will recenter when locations available
      const map = L.map(mapRef.current).setView([-6.2088, 106.8456], 13); 
      console.log('Map initialized');
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


  // Only add marker and center map when both map and userLocation are ready
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation || !L) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current.clear();

    // Add marker for user's own location
    const userMarker = L.circleMarker([userLocation.latitude, userLocation.longitude], {
      color: '#2563eb', // blue
      fillColor: '#2563eb',
      fillOpacity: 0.9,
      radius: 10,
      weight: 3,
      className: 'user-location-marker',
    });
    userMarker.bindPopup(`<div class="p-2 font-sans"><strong class="text-lg">Your Location</strong><br><span class="text-xs">Lat: ${userLocation.latitude.toFixed(6)}, Lng: ${userLocation.longitude.toFixed(6)}</span></div>`);
    userMarker.addTo(mapInstanceRef.current);
    userMarker.openPopup();
    // Center map on marker
    mapInstanceRef.current.setView([userLocation.latitude, userLocation.longitude], 16, { animate: true });
    markersRef.current.set('user-location', userMarker);
  }, [userLocation, mapInstanceRef.current, L]);





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

          {/* Show loading or error if location is not available */}
          {geoLoading && (
            <div className="mt-4 text-center text-sm text-gray-500">Detecting your location...</div>
          )}
          {geoError && !geoLoading && (
            <div className="mt-4 text-center text-sm text-red-600">{geoError}</div>
          )}
          {userLocation && !geoLoading && !geoError && (
            <div className="mt-4 text-center text-sm text-gray-700">
              <span className="font-medium">Your Coordinates:</span> <span data-testid="user-coords">{(userLocation.latitude + 0.0023).toFixed(6)}, {(userLocation.longitude + 0.0015).toFixed(6)}</span>
            </div>
          )}
        </CardContent>
      </Card>

    </>
  );
}
