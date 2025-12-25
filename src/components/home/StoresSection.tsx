import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StoreCard from '@/components/stores/StoreCard';
import { useStore } from '@/context/StoreContext';

const StoresSection: React.FC = () => {
  const { stores } = useStore();
  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg fresh-badge flex items-center justify-center">
                <Store className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-primary">Near You</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Popular Stores</h2>
            <p className="text-muted-foreground mt-1">Discover top-rated stores delivering to your area</p>
          </div>
          <Link to="/stores">
            <Button variant="outline" className="gap-2">
              View All Stores
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Stores grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoresSection;
