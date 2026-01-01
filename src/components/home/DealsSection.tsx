import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Filter, X, Flame, Percent, SlidersHorizontal } from 'lucide-react';
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
    <section className="py-10">
      <div className="container mx-auto px-4">
        {/* Section header with location */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-accent to-destructive">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Hot Deals Near You</h2>
            </div>
            {userLocation && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <MapPin className="w-4 h-4 text-primary" />
                <span>Showing products sorted by distance</span>
              </div>
            )}
          </div>
          <Link to="/products">
            <Button variant="outline" className="gap-2 rounded-xl">
              View All Products <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Category tabs with modern styling */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              !activeCategory
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                : 'bg-card border border-border text-foreground hover:bg-secondary'
            }`}
          >
            All Items
          </button>
          {categories.slice(0, 6).map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeCategory === category.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-card border border-border text-foreground hover:bg-secondary'
              }`}
            >
              <span className="text-base">{category.icon}</span>
              {category.name}
            </button>
          ))}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              showFilters
                ? 'bg-accent text-accent-foreground'
                : 'bg-card border border-border text-foreground hover:bg-secondary'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-card rounded-2xl p-5 mb-8 border border-border shadow-lg animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <span className="font-semibold">Filter Options</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setShowFilters(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                  filters.onlyDeals ? 'bg-primary border-primary' : 'border-border group-hover:border-primary'
                }`}>
                  {filters.onlyDeals && <Percent className="w-3 h-3 text-primary-foreground" />}
                </div>
                <input
                  type="checkbox"
                  checked={filters.onlyDeals}
                  onChange={(e) => setFilters({ ...filters, onlyDeals: e.target.checked })}
                  className="sr-only"
                />
                <span className="text-sm font-medium">Deals Only</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                  filters.inStock ? 'bg-primary border-primary' : 'border-border group-hover:border-primary'
                }`}>
                  {filters.inStock && <span className="w-2 h-2 bg-primary-foreground rounded-sm" />}
                </div>
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                  className="sr-only"
                />
                <span className="text-sm font-medium">In Stock Only</span>
              </label>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Min Rating:</span>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                  className="h-10 px-4 rounded-xl border border-border bg-background text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value={0}>Any Rating</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.slice(0, 10).map((product, index) => (
            <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Filter className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or category</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DealsSection;