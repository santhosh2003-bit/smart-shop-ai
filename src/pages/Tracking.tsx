import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import LiveTracker from '@/components/tracking/LiveTracker';
import { Button } from '@/components/ui/button';
import { sampleOrder } from '@/data/mockData';

const Tracking: React.FC = () => {
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
            <p className="text-muted-foreground">{sampleOrder.id}</p>
          </div>
        </div>

        {/* Live tracker */}
        <LiveTracker order={sampleOrder} />

        {/* Order details */}
        <div className="bg-card rounded-2xl p-6 mt-6 card-elevated">
          <h3 className="font-semibold mb-4">Order Details</h3>
          
          {/* Store info */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
            <img
              src={sampleOrder.store.logo}
              alt={sampleOrder.store.name}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <p className="font-medium">{sampleOrder.store.name}</p>
              <p className="text-sm text-muted-foreground">{sampleOrder.store.address}</p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            {sampleOrder.items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-border mt-4 pt-4">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${sampleOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery address */}
        <div className="bg-card rounded-2xl p-6 mt-6 card-elevated">
          <h3 className="font-semibold mb-2">Delivery Address</h3>
          <p className="text-muted-foreground">{sampleOrder.deliveryAddress}</p>
        </div>
      </div>
    </Layout>
  );
};

export default Tracking;
