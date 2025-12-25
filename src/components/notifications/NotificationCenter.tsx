import React from 'react';
import { Bell, Check, Trash2, ShoppingBag, Tag, MessageCircle, Info, Store, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications, Notification } from '@/context/NotificationContext';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'order':
      return <ShoppingBag className="w-4 h-4 text-primary" />;
    case 'offer':
      return <Tag className="w-4 h-4 text-accent" />;
    case 'chat':
      return <MessageCircle className="w-4 h-4 text-blue-500" />;
    case 'store':
      return <Store className="w-4 h-4 text-green-500" />;
    case 'product':
      return <Package className="w-4 h-4 text-orange-500" />;
    default:
      return <Info className="w-4 h-4 text-muted-foreground" />;
  }
};

const NotificationCenter: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full deal-badge text-xs font-bold flex items-center justify-center text-accent-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-7"
            >
              <Check className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearNotifications}
              className="text-xs h-7 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'p-4 hover:bg-secondary/50 cursor-pointer transition-colors',
                    !notification.read && 'bg-primary/5'
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  {notification.link ? (
                    <Link to={notification.link} className="block">
                      <NotificationItem notification={notification} />
                    </Link>
                  ) : (
                    <NotificationItem notification={notification} />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => (
  <div className="flex gap-3">
    <div className="shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
      {getNotificationIcon(notification.type)}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm truncate">{notification.title}</p>
      <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
      <p className="text-xs text-muted-foreground mt-1">
        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
      </p>
    </div>
    {!notification.read && (
      <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
    )}
  </div>
);

export default NotificationCenter;
