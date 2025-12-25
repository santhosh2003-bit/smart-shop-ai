import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'offer' | 'system' | 'chat';
  read: boolean;
  createdAt: Date;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);



export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // We need user context to fetch specific notifications. 
  // Assuming useAuth is imported or we can't use it here if it's circular. 
  // For now, let's assume global notifications + we'll try to add useAuth.

  // Actually, usually AuthProvider wraps everything. 
  // We can try to import useAuth, but if NotificationProvider is outside AuthProvider it fails.
  // We will assume AuthProvider is higher up.
  const [user, setUser] = useState<any>(null); // Simplified manual fetch for now or we rely on the API to use session/token if we sent it.

  // Since we don't have AuthContext inside NotificationContext easily without circular dependency risk or refactoring context structure,
  // We can rely on the fact that the API call /api/notifications should ideally use the token from headers.
  // But our current system might not be sending token in fetch automatically unless we updated it.
  // We'll rely on our updated NotificationContext to fetch using a userId if available in localStorage or just fetch generic.

  // Note: Previous steps showed AuthContext being used in components. 
  // To avoid circular dependency (Auth->Notification->Auth), we will just fetch generally and let API handle via query if we can get ID.
  // Alternatively, we import useAuth from AuthContext if we're sure it's safe.

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // If we have a user stored in localStorage (handled by AuthContext generally)
        const storedUser = localStorage.getItem('user');
        const userId = storedUser ? JSON.parse(storedUser).id : null;

        const url = userId ? `/api/notifications?userId=${userId}` : '/api/notifications';
        const res = await fetch(url);
        const data = await res.json();

        const parsed = Array.isArray(data) ? data.map((n: any) => ({
          ...n,
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type || 'system',
          read: Boolean(n.isRead), // DB returns isRead (0/1), we need boolean
          createdAt: new Date(n.createdAt),
          link: n.link
        })) : [];
        setNotifications(parsed);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
        setNotifications([]);
      }
    };
    fetchNotifications();
    // Poll every minute as simple "live" fallback if sockets aren't used for notifs yet
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        read: false,
        createdAt: new Date(),
      };
      setNotifications((prev) => [newNotification, ...prev]);
    },
    []
  );

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    } catch (e) { console.error(e); }
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    // Implement API call ideally
    notifications.forEach(async (n) => {
      if (!n.read) {
        try { await fetch(`/api/notifications/${n.id}/read`, { method: 'POST' }); } catch (e) { }
      }
    });
  }, [notifications]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
