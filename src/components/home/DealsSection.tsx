import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';
import { products } from '@/data/mockData';

const DealsSection: React.FC = () => {
  const dealProducts = products.filter(p => p.discount);

  return (
    <section className="py-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg deal-badge flex items-center justify-center">
                <Timer className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="text-sm font-medium text-accent">Limited Time</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Today's Best Deals</h2>
            <p className="text-muted-foreground mt-1">Grab these amazing offers before they're gone!</p>
          </div>
          <Link to="/deals">
            <Button variant="outline" className="gap-2">
              View All Deals
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Countdown timer banner */}
        <div className="deal-badge rounded-2xl p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-accent-foreground">
            <div>
              <h3 className="text-xl font-bold">Flash Sale Ends In</h3>
              <p className="text-accent-foreground/80 text-sm">Don't miss out on these exclusive discounts!</p>
            </div>
            <div className="flex gap-3">
              {[
                { value: '05', label: 'Hours' },
                { value: '23', label: 'Mins' },
                { value: '47', label: 'Secs' },
              ].map((item, i) => (
                <div key={i} className="bg-background/20 rounded-xl p-3 text-center min-w-[60px]">
                  <span className="text-2xl font-bold block">{item.value}</span>
                  <span className="text-xs opacity-80">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {dealProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
