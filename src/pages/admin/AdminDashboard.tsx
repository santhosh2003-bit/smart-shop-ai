import React from 'react';
import {
  Package,
  Store,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import { products, stores } from '@/data/mockData';

const stats = [
  {
    title: 'Total Products',
    value: products.length.toString(),
    change: '+12%',
    trend: 'up',
    icon: Package,
  },
  {
    title: 'Active Stores',
    value: stores.length.toString(),
    change: '+3%',
    trend: 'up',
    icon: Store,
  },
  {
    title: 'Total Users',
    value: '1,234',
    change: '+8%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Revenue',
    value: '$12,345',
    change: '-2%',
    trend: 'down',
    icon: DollarSign,
  },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', amount: 45.99, status: 'delivered' },
  { id: 'ORD-002', customer: 'Jane Smith', amount: 32.50, status: 'pending' },
  { id: 'ORD-003', customer: 'Mike Johnson', amount: 78.00, status: 'processing' },
  { id: 'ORD-004', customer: 'Sarah Williams', amount: 25.99, status: 'delivered' },
];

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, Admin!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      stat.trend === 'up' ? 'text-primary' : 'text-destructive'
                    }`}
                  >
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Orders & Quick Stats */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.amount.toFixed(2)}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'delivered'
                            ? 'bg-primary/10 text-primary'
                            : order.status === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-600'
                            : 'bg-blue-500/10 text-blue-600'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Active Deals</span>
                    <span className="font-bold">{products.filter((p) => p.discount).length}</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{
                        width: `${(products.filter((p) => p.discount).length / products.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">In Stock Products</span>
                    <span className="font-bold">{products.filter((p) => p.inStock).length}</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${(products.filter((p) => p.inStock).length / products.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Open Stores</span>
                    <span className="font-bold">{stores.filter((s) => s.isOpen).length}</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${(stores.filter((s) => s.isOpen).length / stores.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
