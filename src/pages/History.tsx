import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, RefreshCcw, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const History: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user) return;
        const res = await fetch(`/api/orders?userId=${user.id}`);
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load order history');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-primary/10 text-primary';
      case 'out_for_delivery': return 'bg-accent/10 text-accent';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'out_for_delivery': return 'On the way';
      case 'preparing': return 'Preparing';
      default: return 'Pending';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Loading history...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Order History - DealFinder</title>
        <meta name="description" content="View your past orders and track current deliveries." />
      </Helmet>

      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground mb-8">View and reorder your past purchases</p>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-dashed">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="font-medium text-lg">No orders yet</p>
            <Link to="/products">
              <Button className="mt-4" variant="outline">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-card rounded-2xl p-6 card-elevated animate-fade-in"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <Package className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                {/* Items preview */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {order.items && order.items.map((item: any, idx: number) => (
                    <img
                      key={idx}
                      src={item.image || (item.product ? item.product.image : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c')}
                      alt={item.productName || 'Product'}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                  ))}
                </div>

                {/* Footer */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {order.items ? order.items.length : 0} item{order.items && order.items.length !== 1 ? 's' : ''} • {order.storeName}
                    </p>
                    <p className="font-bold">${Number(order.total).toFixed(2)}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                      <RefreshCcw className="w-4 h-4" />
                      Reorder
                    </Button>
                    {order.status !== 'delivered' && (
                      <Link to={`/tracking/${order.id}`}>
                        <Button className="gap-2">
                          Track Order
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default History;
