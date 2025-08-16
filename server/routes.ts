import { getSystemDevice } from "./systeminfo";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertDeviceSchema, insertGpsLocationSchema, insertAlertSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Real system info endpoint
  app.get("/api/system-device", async (_req, res) => {
    try {
      const device = await getSystemDevice();
      res.json(device);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch system device info" });
    }
  });
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Store connected clients
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    
    ws.on('close', () => {
      clients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Broadcast function for real-time updates
  function broadcast(data: any) {
    const message = JSON.stringify(data);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Device routes
  app.get("/api/devices", async (req, res) => {
    try {
      const devices = await storage.getDevices();
      res.json(devices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch devices" });
    }
  });

  app.get("/api/devices/:id", async (req, res) => {
    try {
      const device = await storage.getDevice(req.params.id);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      res.json(device);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch device" });
    }
  });

  app.post("/api/devices", async (req, res) => {
    try {
      const deviceData = insertDeviceSchema.parse(req.body);
      const device = await storage.createDevice(deviceData);
      broadcast({ type: 'device_created', data: device });
      res.status(201).json(device);
    } catch (error) {
      res.status(400).json({ message: "Invalid device data" });
    }
  });

  app.patch("/api/devices/:id", async (req, res) => {
    try {
      const updates = req.body;
      const device = await storage.updateDevice(req.params.id, updates);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      broadcast({ type: 'device_updated', data: device });
      res.json(device);
    } catch (error) {
      res.status(500).json({ message: "Failed to update device" });
    }
  });

  app.delete("/api/devices/:id", async (req, res) => {
    try {
      const success = await storage.deleteDevice(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Device not found" });
      }
      broadcast({ type: 'device_deleted', data: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete device" });
    }
  });

  // GPS Location routes
  app.get("/api/gps-locations", async (req, res) => {
    try {
      const deviceId = req.query.deviceId as string;
      const locations = await storage.getGpsLocations(deviceId);
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch GPS locations" });
    }
  });

  app.get("/api/devices/:id/location", async (req, res) => {
    try {
      const location = await storage.getLatestGpsLocation(req.params.id);
      if (!location) {
        return res.status(404).json({ message: "No location found for device" });
      }
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch device location" });
    }
  });

  app.post("/api/gps-locations", async (req, res) => {
    try {
      const locationData = insertGpsLocationSchema.parse(req.body);
      const location = await storage.createGpsLocation(locationData);
      broadcast({ type: 'location_updated', data: location });
      res.status(201).json(location);
    } catch (error) {
      res.status(400).json({ message: "Invalid location data" });
    }
  });

  // Alert routes
  app.get("/api/alerts", async (req, res) => {
    try {
      const deviceId = req.query.deviceId as string;
      const alerts = await storage.getAlerts(deviceId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.get("/api/alerts/unresolved", async (req, res) => {
    try {
      const alerts = await storage.getUnresolvedAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch unresolved alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const alertData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(alertData);
      broadcast({ type: 'alert_created', data: alert });
      res.status(201).json(alert);
    } catch (error) {
      res.status(400).json({ message: "Invalid alert data" });
    }
  });

  app.patch("/api/alerts/:id/resolve", async (req, res) => {
    try {
      const success = await storage.resolveAlert(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Alert not found" });
      }
      broadcast({ type: 'alert_resolved', data: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to resolve alert" });
    }
  });

  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const devices = await storage.getDevices();
      const alerts = await storage.getUnresolvedAlerts();
      
      const stats = {
        totalDevices: devices.length,
        onlineDevices: devices.filter(d => d.status === 'online').length,
        alertsToday: alerts.length,
        dataUsage: devices.reduce((sum, d) => sum + (d.dataUsage || 0), 0),
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Simulate real-time updates
  setInterval(() => {
    storage.getDevices().then(devices => {
      devices.forEach(async (device) => {
        if (device.status === 'online') {
          // Simulate battery drain
          const newBatteryLevel = Math.max(15, device.batteryLevel! - Math.random() * 2);
        }
      });
    });
  }, 5000); // Update every 5 seconds

  return httpServer;
}
