import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Store,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

interface StoreLayoutProps {
  children: React.ReactNode;
}

const StoreLayout: React.FC<StoreLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getStoresByOwner } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const userStores = user ? getStoresByOwner(user.id) : [];
  const hasApprovedStore = userStores.some(s => s.status === 'approved');
  const hasPendingStore = userStores.some(s => s.status === 'pending');

  const navItems = [
    { to: '/store-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/store-dashboard/products', label: 'My Products', icon: Package, disabled: !hasApprovedStore },
    { to: '/store-dashboard/store', label: 'Store Settings', icon: Store },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 glass border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <Link to="/store-dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg fresh-badge flex items-center justify-center">
              <span className="font-bold text-primary-foreground">D</span>
            </div>
            <span className="font-bold">Store Panel</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-card border-r border-border transition-transform duration-300',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-border hidden lg:block">
              <Link to="/store-dashboard" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl fresh-badge flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">D</span>
                </div>
                <div>
                  <p className="font-bold">DealFinder</p>
                  <p className="text-xs text-muted-foreground">Store Panel</p>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 p-4">
              {hasPendingStore && (
                <Alert className="mb-4 border-yellow-500/50 bg-yellow-500/10">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <AlertDescription className="text-sm text-yellow-600">
                    Your store is pending approval
                  </AlertDescription>
                </Alert>
              )}
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.disabled ? '#' : item.to}
                    onClick={(e) => {
                      if (item.disabled) {
                        e.preventDefault();
                      } else {
                        setIsSidebarOpen(false);
                      }
                    }}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                      item.disabled && 'opacity-50 cursor-not-allowed',
                      location.pathname === item.to
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.disabled && (
                      <Badge variant="secondary" className="ml-auto text-xs">Pending</Badge>
                    )}
                    {location.pathname === item.to && !item.disabled && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-border">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary transition-all text-muted-foreground"
                >
                  <Store className="w-5 h-5" />
                  <span className="font-medium">Back to Shop</span>
                </Link>
              </div>
            </ScrollArea>

            {/* User Section */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-primary">
                    {user?.name?.charAt(0) || 'S'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user?.name || 'Store Owner'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <ThemeToggle className="flex-1 hidden lg:flex" />
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default StoreLayout;
