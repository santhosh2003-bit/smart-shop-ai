import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';
import CategoryCard from '@/components/products/CategoryCard';
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
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Location indicator */}
        {userLocation && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Showing products near your location</span>
          </div>
        )}

        {/* Category pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !activeCategory
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            All
          </button>
          {categories.slice(0, 6).map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-card rounded-xl p-4 mb-6 border border-border animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-sm">Filters</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowFilters(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={filters.onlyDeals}
                  onChange={(e) => setFilters({ ...filters, onlyDeals: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary"
                />
                Deals Only
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary"
                />
                In Stock
              </label>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                className="h-8 px-3 rounded-lg border border-border bg-background text-sm"
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
          <h2 className="text-xl font-bold">Products Near You</h2>
          <Link to="/products">
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              See All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No products found matching your filters
          </div>
        )}
      </div>
    </section>
  );
};

export default DealsSection;