import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import StoreCard from '@/components/stores/StoreCard';
import { stores } from '@/data/mockData';

const Stores: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Nearby Stores - DealFinder</title>
        <meta name="description" content="Find stores near you with fast delivery and great deals. Browse top-rated local stores." />
      </Helmet>

      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-primary mb-2">
            <MapPin className="w-5 h-5" />
            <span className="text-sm font-medium">Delivering to Downtown, New York</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Stores Near You</h1>
          <p className="text-muted-foreground">Discover {stores.length} stores delivering to your area</p>
        </div>

        {/* Quick filters */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 -mx-4 px-4">
          {['All Stores', 'Open Now', 'Fast Delivery', 'Top Rated', 'New'].map((filter, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                i === 0
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card hover:bg-secondary card-elevated'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Stats banner */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap justify-around gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{stores.length}+</p>
              <p className="text-sm text-muted-foreground">Active Stores</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">10-15 min</p>
              <p className="text-sm text-muted-foreground">Avg. Delivery</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">4.7★</p>
              <p className="text-sm text-muted-foreground">Avg. Rating</p>
            </div>
          </div>
        </div>

        {/* Stores grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Stores;
