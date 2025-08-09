import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const devices = pgTable("devices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'gps', 'camera', 'sensor'
  status: text("status").notNull().default('offline'), // 'online', 'offline', 'warning'
  batteryLevel: integer("battery_level").default(100),
  temperature: real("temperature").default(0),
  signalStrength: integer("signal_strength").default(0),
  networkType: text("network_type").default('4G LTE'),
  dataUsage: real("data_usage").default(0),
  uptime: integer("uptime").default(0), // in minutes
  cpuTemp: real("cpu_temp").default(0),
  gpuTemp: real("gpu_temp").default(0),
  cpuUsage: real("cpu_usage").default(0),
  memoryUsage: real("memory_usage").default(0),
  storageUsage: real("storage_usage").default(0),
  lastSeen: timestamp("last_seen").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gpsLocations = pgTable("gps_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  accuracy: real("accuracy").default(0),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  type: text("type").notNull(), // 'low_battery', 'high_temperature', 'connectivity_loss'
  message: text("message").notNull(),
  severity: text("severity").notNull().default('warning'), // 'info', 'warning', 'critical'
  resolved: boolean("resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDeviceSchema = createInsertSchema(devices).omit({
  id: true,
  createdAt: true,
  lastSeen: true,
});

export const insertGpsLocationSchema = createInsertSchema(gpsLocations).omit({
  id: true,
  timestamp: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Device = typeof devices.$inferSelect;
export type InsertGpsLocation = z.infer<typeof insertGpsLocationSchema>;
export type GpsLocation = typeof gpsLocations.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;
