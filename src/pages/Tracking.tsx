import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import LiveTracker from '@/components/tracking/LiveTracker';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Tracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) {
          throw new Error('Order not found');
        }
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        toast.error('Failed to load order details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-20 text-center">Loading...</div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold">Order not found</h1>
          <Link to="/">
            <Button className="mt-4">Go Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Track Your Order - DealFinder</title>
      </Helmet>

      <div className="container mx-auto py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Track Order</h1>
            <p className="text-muted-foreground">{order.id}</p>
          </div>
        </div>

        {/* Live tracker */}
        <LiveTracker order={order} />

        {/* Order details */}
        <div className="bg-card rounded-2xl p-6 mt-6 card-elevated">
          <h3 className="font-semibold mb-4">Order Details</h3>

          {/* Store info */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
            {order.store.logo && (
              <img
                src={order.store.logo}
                alt={order.store.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
            )}
            <div>
              <p className="font-medium">{order.store.name}</p>
              <p className="text-sm text-muted-foreground">{order.store.address}</p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3">
                {item.product.image && (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-border mt-4 pt-4">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery address */}
        <div className="bg-card rounded-2xl p-6 mt-6 card-elevated">
          <h3 className="font-semibold mb-2">Delivery Address</h3>
          <p className="text-muted-foreground">{order.deliveryAddress}</p>
        </div>
      </div>
    </Layout>
  );
};

export default Tracking;
