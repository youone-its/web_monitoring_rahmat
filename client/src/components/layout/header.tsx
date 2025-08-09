import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Bell, User, Menu, Satellite } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [location] = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/" },
    { name: "Devices", href: "/devices" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2" data-testid="logo-link">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Satellite className="text-white text-sm" size={16} />
              </div>
              <span className="text-xl font-bold text-secondary" data-testid="app-name">
                SmartMonitor
              </span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const isActive = location === item.href || 
                (item.href === "/" && location === "/dashboard");
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`pb-4 transition-colors duration-200 ${
                    isActive
                      ? "text-primary font-medium border-b-2 border-primary"
                      : "text-gray-600 hover:text-primary"
                  }`}
                  data-testid={`nav-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile and Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative p-2 text-gray-600 hover:text-primary"
                  data-testid="notifications-button"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuItem className="font-medium">
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm text-gray-600">
                  No new notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-3"
                  data-testid="user-menu-button"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="text-white text-sm" size={16} />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-secondary">
                    Admin User
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 text-gray-600"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              data-testid="mobile-menu-button"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                  data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
