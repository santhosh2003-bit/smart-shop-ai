import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Store, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StoreCard from '@/components/stores/StoreCard';
import { useStore } from '@/context/StoreContext';

const StoresSection: React.FC = () => {
  const { stores } = useStore();
  
  return (
    <section className="py-10 bg-gradient-to-b from-secondary/50 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/70">
                <Store className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Popular Stores</h2>
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Discover top-rated stores in your area
            </p>
          </div>
          <Link to="/stores">
            <Button variant="outline" className="gap-2 rounded-xl">
              View All Stores <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Stores grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {stores.slice(0, 6).map((store, index) => (
            <div key={store.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <StoreCard store={store} />
            </div>
          ))}
        </div>

        {stores.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Store className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No stores available</h3>
            <p className="text-muted-foreground">Check back later for new stores</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default StoresSection;