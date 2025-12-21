import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Timer, Zap, Gift, Percent } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { products } from '@/data/mockData';

const Deals: React.FC = () => {
  const dealProducts = products.filter(p => p.discount);

  return (
    <Layout>
      <Helmet>
        <title>Today's Deals - DealFinder</title>
        <meta name="description" content="Don't miss out on today's best deals and exclusive offers. Limited time discounts on your favorite products." />
      </Helmet>

      <div className="container mx-auto py-8">
        {/* Hero banner */}
        <div className="deal-badge rounded-3xl p-8 md:p-12 mb-12 text-accent-foreground">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6" />
                <span className="text-lg font-semibold">Flash Sale</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Today's Hottest Deals</h1>
              <p className="text-accent-foreground/80">Limited time offers you don't want to miss!</p>
            </div>
            <div className="flex gap-3">
              {[
                { value: '05', label: 'Hours' },
                { value: '23', label: 'Mins' },
                { value: '47', label: 'Secs' },
              ].map((item, i) => (
                <div key={i} className="bg-background/20 rounded-xl p-4 text-center min-w-[70px]">
                  <span className="text-3xl font-bold block">{item.value}</span>
                  <span className="text-sm opacity-80">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deal categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card rounded-2xl p-6 card-elevated group hover:bg-primary hover:text-primary-foreground transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary-foreground/20 flex items-center justify-center mb-4 transition-colors">
              <Timer className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Flash Deals</h3>
            <p className="text-muted-foreground group-hover:text-primary-foreground/80 text-sm">Expires in hours</p>
          </div>
          <div className="bg-card rounded-2xl p-6 card-elevated group hover:bg-accent hover:text-accent-foreground transition-colors">
            <div className="w-12 h-12 rounded-xl bg-accent/10 group-hover:bg-accent-foreground/20 flex items-center justify-center mb-4 transition-colors">
              <Gift className="w-6 h-6 text-accent group-hover:text-accent-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Buy 1 Get 1</h3>
            <p className="text-muted-foreground group-hover:text-accent-foreground/80 text-sm">Double the value</p>
          </div>
          <div className="bg-card rounded-2xl p-6 card-elevated group hover:bg-primary hover:text-primary-foreground transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary-foreground/20 flex items-center justify-center mb-4 transition-colors">
              <Percent className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Up to 50% Off</h3>
            <p className="text-muted-foreground group-hover:text-primary-foreground/80 text-sm">Massive savings</p>
          </div>
        </div>

        {/* Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">All Deals</h2>
          <p className="text-muted-foreground">{dealProducts.length} products on sale</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Deals;
