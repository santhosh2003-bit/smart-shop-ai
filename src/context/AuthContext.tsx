import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'store_owner';
  phone?: string;
  storeId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  { id: '1', email: 'admin@dealfinder.com', password: 'admin123', name: 'Admin User', role: 'admin' },
  { id: '2', email: 'store@dealfinder.com', password: 'store123', name: 'Store Owner', role: 'store_owner', storeId: '1' },
  { id: '3', email: 'user@dealfinder.com', password: 'user123', name: 'John Doe', role: 'user' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('dealfinder-user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('dealfinder-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500)); // Simulate API call

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userData } = foundUser;
      setUser(userData);
      localStorage.setItem('dealfinder-user', JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.name}!`);
      setIsLoading(false);
      return true;
    }

    toast.error('Invalid email or password');
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    if (mockUsers.some((u) => u.email === email)) {
      toast.error('Email already registered');
      setIsLoading(false);
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user',
    };

    mockUsers.push({ ...newUser, password });
    setUser(newUser);
    localStorage.setItem('dealfinder-user', JSON.stringify(newUser));
    toast.success('Account created successfully!');
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dealfinder-user');
    toast.info('Logged out successfully');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('dealfinder-user', JSON.stringify(updated));
      toast.success('Profile updated');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
