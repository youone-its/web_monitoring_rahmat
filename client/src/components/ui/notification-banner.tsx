import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Alert } from "@shared/schema";

interface NotificationBannerProps {
  alerts?: Alert[];
}

export default function NotificationBanner({ alerts = [] }: NotificationBannerProps) {
  const [visibleAlert, setVisibleAlert] = useState<Alert | null>(null);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Show the most recent critical alert that hasn't been dismissed
    const criticalAlerts = alerts
      .filter(alert => alert.severity === 'critical' && !alert.resolved && !dismissedAlerts.has(alert.id))
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

    if (criticalAlerts.length > 0) {
      setVisibleAlert(criticalAlerts[0]);
      
      // Auto-hide after 10 seconds
      const timeout = setTimeout(() => {
        setVisibleAlert(null);
      }, 10000);

      return () => clearTimeout(timeout);
    } else {
      setVisibleAlert(null);
    }
  }, [alerts, dismissedAlerts]);

  const handleDismiss = () => {
    if (visibleAlert) {
      setDismissedAlerts(prev => new Set(prev).add(visibleAlert.id));
      setVisibleAlert(null);
    }
  };

  if (!visibleAlert) {
    return null;
  }

  return (
    <div 
      className="notification-banner bg-red-500 text-white px-4 py-3"
      data-testid="notification-banner"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle size={20} />
          <span data-testid="notification-message">
            {visibleAlert.message}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:text-gray-200 hover:bg-red-600"
          onClick={handleDismiss}
          data-testid="dismiss-notification-button"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
}
