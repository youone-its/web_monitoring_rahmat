import { Smartphone, Circle, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  stats?: {
    totalDevices: number;
    onlineDevices: number;
    alertsToday: number;
    dataUsage: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-8 bg-gray-200 rounded w-16" />
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      label: "Total Devices",
      value: stats.totalDevices,
      icon: Smartphone,
      iconBg: "bg-primary bg-opacity-10",
      iconColor: "text-primary",
      valueColor: "text-secondary",
      testId: "total-devices",
    },
    {
      label: "Online Now",
      value: stats.onlineDevices,
      icon: Circle,
      iconBg: "bg-accent bg-opacity-10",
      iconColor: "text-accent",
      valueColor: "text-accent",
      testId: "online-devices",
    },
    {
      label: "Alerts Today",
      value: stats.alertsToday,
      icon: AlertTriangle,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      valueColor: "text-red-500",
      testId: "alerts-today",
    },
    {
      label: "Data Usage",
      value: `${stats.dataUsage.toFixed(1)} GB`,
      icon: TrendingUp,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
      valueColor: "text-secondary",
      testId: "data-usage",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-testid="stats-cards">
      {statsData.map((stat) => (
        <Card key={stat.label} className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p 
                  className={`text-2xl font-bold ${stat.valueColor}`}
                  data-testid={stat.testId}
                >
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 ${stat.iconBg} rounded-lg`}>
                <stat.icon className={`${stat.iconColor} text-xl`} size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
