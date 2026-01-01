import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import StoreCard from '@/components/stores/StoreCard';
import { useStore } from '@/context/StoreContext';

const StoresSection: React.FC = () => {
  const { stores } = useStore();
  
  if (stores.length === 0) return null;
  
  return (
    <section className="py-6 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Nearby Stores</h2>
          <Link to="/stores" className="text-sm text-primary font-medium flex items-center gap-1">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {stores.slice(0, 6).map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoresSection;