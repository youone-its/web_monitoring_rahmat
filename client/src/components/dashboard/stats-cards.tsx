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


  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-testid="stats-cards">

    </div>
  );
}
