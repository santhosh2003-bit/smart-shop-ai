import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StoreCard from '@/components/stores/StoreCard';
import { useStore } from '@/context/StoreContext';

const StoresSection: React.FC = () => {
  const { stores } = useStore();
  
  if (stores.length === 0) return null;
  
  return (
    <section className="py-8 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Popular Stores</h2>
          </div>
          <Link to="/stores">
            <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.slice(0, 6).map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoresSection;