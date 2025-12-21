import React from 'react';
import { Search, Zap, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 lg:py-24">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-slide-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              AI-Powered Deal Discovery
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Find the Best
              <span className="block text-gradient-fresh">Deals Near You</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Upload product images, discover promotions, and get personalized offers from stores in your area. Fast delivery guaranteed!
            </p>

            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products or upload an image..."
                  className="pl-12 h-14 rounded-xl text-base"
                />
              </div>
              <Button size="xl" className="rounded-xl">
                Search Deals
              </Button>
            </div>

            {/* Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-primary" />
                </div>
                <span>10 min delivery</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-accent" />
                </div>
                <span>Live tracking</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <span>Best prices</span>
              </div>
            </div>
          </div>

          {/* Hero image/illustration */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Floating product cards */}
              <div className="absolute top-0 left-0 w-48 glass rounded-2xl p-4 animate-float shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop"
                  alt="Fresh Apples"
                  className="w-full aspect-square rounded-xl object-cover mb-2"
                />
                <p className="font-semibold text-sm">Fresh Apples</p>
                <p className="text-xs text-muted-foreground">29% OFF</p>
              </div>

              <div className="absolute top-1/4 right-0 w-48 glass rounded-2xl p-4 animate-float shadow-lg" style={{ animationDelay: '1s' }}>
                <img
                  src="https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop"
                  alt="Organic Milk"
                  className="w-full aspect-square rounded-xl object-cover mb-2"
                />
                <p className="font-semibold text-sm">Organic Milk</p>
                <p className="text-xs text-muted-foreground">Buy 2 Get 1 Free</p>
              </div>

              <div className="absolute bottom-0 left-1/4 w-48 glass rounded-2xl p-4 animate-float shadow-lg" style={{ animationDelay: '2s' }}>
                <img
                  src="https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop"
                  alt="Farm Eggs"
                  className="w-full aspect-square rounded-xl object-cover mb-2"
                />
                <p className="font-semibold text-sm">Farm Eggs</p>
                <p className="text-xs text-muted-foreground">Flash Sale</p>
              </div>

              {/* Central circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full fresh-badge flex items-center justify-center shadow-xl">
                <span className="text-4xl font-bold text-primary-foreground">50+</span>
              </div>
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-8 text-sm font-medium text-primary">
                Active Deals
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
