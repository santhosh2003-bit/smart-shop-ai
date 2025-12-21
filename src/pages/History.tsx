import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, RefreshCcw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { sampleOrder, products } from '@/data/mockData';

const History: React.FC = () => {
  // Mock order history
  const orders = [
    sampleOrder,
    {
      ...sampleOrder,
      id: 'ORD-2024-002',
      status: 'delivered' as const,
      createdAt: new Date(Date.now() - 86400000 * 2),
      items: [{ product: products[2], quantity: 3 }],
      total: 11.97,
    },
    {
      ...sampleOrder,
      id: 'ORD-2024-003',
      status: 'delivered' as const,
      createdAt: new Date(Date.now() - 86400000 * 5),
      items: [{ product: products[4], quantity: 1 }, { product: products[5], quantity: 2 }],
      total: 21.97,
    },
  ];

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

  return (
    <Layout>
      <Helmet>
        <title>Order History - DealFinder</title>
        <meta name="description" content="View your past orders and track current deliveries." />
      </Helmet>

      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground mb-8">View and reorder your past purchases</p>

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
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.createdAt.toLocaleDateString('en-US', {
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
                {order.items.map((item) => (
                  <img
                    key={item.product.id}
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''} • {order.store.name}
                  </p>
                  <p className="font-bold">${order.total.toFixed(2)}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="gap-2">
                    <RefreshCcw className="w-4 h-4" />
                    Reorder
                  </Button>
                  {order.status !== 'delivered' && (
                    <Link to="/tracking">
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
      </div>
    </Layout>
  );
};

export default History;
