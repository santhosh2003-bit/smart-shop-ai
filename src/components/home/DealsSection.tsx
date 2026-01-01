import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';

const DealsSection: React.FC = () => {
  const { products, categories } = useStore();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filters] = useState({
    onlyDeals: false,
    inStock: true,
    minRating: 0,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast.success('Location detected! Showing nearest deals first.');
        },
        () => {
          console.log('Location access denied, using default sort');
        }
      );
    }
  }, []);

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filteredProducts = products
    .map(p => {
      if (userLocation) {
        let targetLat, targetLng;
        if (p.latitude && p.longitude) {
          targetLat = p.latitude;
          targetLng = p.longitude;
        } else if (p.store?.latitude && p.store?.longitude) {
          targetLat = p.store.latitude;
          targetLng = p.store.longitude;
        }
        if (targetLat && targetLng) {
          const distance = getDistance(userLocation.lat, userLocation.lng, targetLat, targetLng);
          return { ...p, distance };
        }
      }
      return { ...p, distance: null };
    })
    .filter(p => {
      const matchesCategory = !activeCategory ||
        p.category === categories.find(c => c.id === activeCategory)?.name;
      const matchesDeals = !filters.onlyDeals || p.discount;
      const matchesStock = !filters.inStock || p.inStock;
      const matchesRating = p.rating >= filters.minRating;
      return matchesCategory && matchesDeals && matchesStock && matchesRating;
    })
    .sort((a, b) => {
      if (a.distance && b.distance) {
        const distDiff = a.distance - b.distance;
        if (Math.abs(distDiff) > 1) return distDiff;
      }
      return a.price - b.price;
    });

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
              !activeCategory
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-secondary hover:bg-secondary/80 text-foreground'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary hover:bg-secondary/80 text-foreground'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        {/* Featured section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold">Today's Picks</h2>
          </div>
          <Link to="/products">
            <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="font-medium">No products available</p>
            <p className="text-sm">Check back soon for new items</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DealsSection;