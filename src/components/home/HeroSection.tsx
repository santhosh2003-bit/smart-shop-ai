import React from 'react';
import { MapPin } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Deliver to</p>
            <p className="font-semibold text-foreground">Current Location</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;