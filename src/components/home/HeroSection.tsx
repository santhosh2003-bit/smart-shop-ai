import React from 'react';
import { Search, MapPin, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-b from-primary/5 to-background py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Location badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <MapPin className="w-4 h-4" />
            Detecting your location...
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Best Deals
            <span className="text-gradient-fresh"> Near You</span>
          </h1>
          
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Discover products from stores around you with the best prices
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 h-12 rounded-xl"
              />
            </div>
            <Button size="lg" className="rounded-xl h-12 px-6">
              <Zap className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;