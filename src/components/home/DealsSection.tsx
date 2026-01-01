import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';

const DealsSection: React.FC = () => {
  const { products, categories } = useStore();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
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
    <section className="py-6">
      <div className="container mx-auto px-4">
        {/* Categories horizontal scroll */}
        <div className="mb-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex flex-col items-center gap-2 min-w-[72px] p-3 rounded-xl transition-all ${
                !activeCategory ? 'bg-primary/10' : 'hover:bg-secondary'
              }`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
                !activeCategory ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              }`}>
                🛒
              </div>
              <span className={`text-xs font-medium ${!activeCategory ? 'text-primary' : 'text-muted-foreground'}`}>
                All
              </span>
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex flex-col items-center gap-2 min-w-[72px] p-3 rounded-xl transition-all ${
                  activeCategory === category.id ? 'bg-primary/10' : 'hover:bg-secondary'
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
                  activeCategory === category.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                }`}>
                  {category.icon}
                </div>
                <span className={`text-xs font-medium text-center ${
                  activeCategory === category.id ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Location + Filter bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            {userLocation && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Near you</span>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 rounded-full"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-secondary/50 rounded-xl p-4 mb-5 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Filters</span>
              <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-secondary rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm bg-card px-3 py-2 rounded-lg border border-border">
                <input
                  type="checkbox"
                  checked={filters.onlyDeals}
                  onChange={(e) => setFilters({ ...filters, onlyDeals: e.target.checked })}
                  className="w-4 h-4 rounded accent-primary"
                />
                Deals Only
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm bg-card px-3 py-2 rounded-lg border border-border">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                  className="w-4 h-4 rounded accent-primary"
                />
                In Stock
              </label>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                className="h-9 px-3 rounded-lg border border-border bg-card text-sm"
              >
                <option value={0}>Any Rating</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>
          </div>
        )}

        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Products</h2>
          <Link to="/products" className="text-sm text-primary font-medium flex items-center gap-1">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredProducts.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No products found</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DealsSection;