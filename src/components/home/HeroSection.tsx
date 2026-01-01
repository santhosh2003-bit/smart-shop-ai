import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent">
      <div className="relative container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
            Shop Local,
            <br />
            <span className="text-white/90">Save Big</span>
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-md">
            The best deals from stores near you, delivered in minutes
          </p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="What are you looking for?"
              className="pl-12 h-14 rounded-2xl bg-background border-0 shadow-xl text-base"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;