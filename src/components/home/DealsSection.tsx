import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, SlidersHorizontal, Timer, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';
import { Input } from '../ui/input';
const DealsSection: React.FC = () => {
  const { products, categories } = useStore();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    onlyDeals: false,
    inStock: true,
    minRating: 0,
  });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false)
  useEffect(() => {
    // AI Feature: Detect Location for smart sorting
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast.info('Location detected! Showing nearest deals first.');
        },
        (error) => {
          console.log('Location access denied, using default sort');
        }
      );
    }
  }, []);


  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const dealProducts = products
    .map(p => {
      // Enrich product with calculated distance if location available
      if (userLocation) {

        // Priority: Product location > Store location > Mock location
        let targetLat, targetLng;

        if (p.latitude && p.longitude) {
          // Product has its own location
          targetLat = p.latitude;
          targetLng = p.longitude;
        } else if (p.store?.latitude && p.store?.longitude) {
          // Use store location
          targetLat = p.store.latitude;
          targetLng = p.store.longitude;
        } else if (p.store?.id) {
          // Fallback to mock location for demo

          targetLat = null;
          targetLng = null;
        }

        if (targetLat && targetLng) {
          const distance = getDistance(userLocation.lat, userLocation.lng, targetLat, targetLng);

          return { ...p, distance };
        }
      }
      return { ...p, distance: null }; // Far away default
    })
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !activeCategory ||
        p.category === categories.find(c => c.id === activeCategory)?.name;
      const matchesDeals = !filters.onlyDeals || p.discount;
      const matchesStock = !filters.inStock || p.inStock;
      const matchesRating = p.rating >= filters.minRating;

      return matchesSearch && matchesCategory && matchesDeals && matchesStock && matchesRating;
    })
    .sort((a, b) => {
      if (a.distance && b.distance) {
        const distDiff = a.distance - b.distance;
        if (Math.abs(distDiff) > 1) {
          return distDiff;
        }
      }

      // If reasonably same distance, cheaper one wins
      return a.price - b.price;
    });
  const [timeLeft, setTimeLeft] = React.useState({ hours: 0, mins: 0, secs: 0 });
  const [targetTime, setTargetTime] = React.useState<Date | null>(null);

  React.useEffect(() => {
    // Fetch timer from backend
    fetch('/api/deals/timer')
      .then(res => res.json())
      .then(data => {
        setTargetTime(new Date(data.endTime));
      })
      .catch(err => console.error("Failed to fetch timer:", err));
  }, []);

  React.useEffect(() => {
    if (!targetTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetTime.getTime() - now.getTime();

      if (difference <= 0) {
        // Reset or stop? For now hold at 0
        setTimeLeft({ hours: 0, mins: 0, secs: 0 });
        // Optionally refetch or reset logic (e.g. backend could auto-reset)
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((difference / 1000 / 60) % 60);
        const secs = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, mins, secs });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    <section className="py-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg deal-badge flex items-center justify-center">
                <Timer className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="text-sm font-medium text-accent">Limited Time</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Today's Best Deals</h2>
            <p className="text-muted-foreground mt-1">Grab these amazing offers before they're gone!</p>
          </div>
          <Link to="/deals">
            <Button variant="outline" className="gap-2">
              View All Deals
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Countdown timer banner */}
        <div className="deal-badge rounded-2xl p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-accent-foreground">
            <div>
              <h3 className="text-xl font-bold">Flash Sale Ends In</h3>
              <p className="text-accent-foreground/80 text-sm">Don't miss out on these exclusive discounts!</p>
            </div>
            <div className="flex gap-3">
              {[
                { value: timeLeft.hours.toString().padStart(2, '0'), label: 'Hours' },
                { value: timeLeft.mins.toString().padStart(2, '0'), label: 'Mins' },
                { value: timeLeft.secs.toString().padStart(2, '0'), label: 'Secs' },
              ].map((item, i) => (
                <div key={i} className="bg-background/20 rounded-xl p-3 text-center min-w-[60px]">
                  <span className="text-2xl font-bold block">{item.value}</span>
                  <span className="text-xs opacity-80">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl"
            />
          </div>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            className="gap-2 h-12"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
        </div>
        {/* Filter panel */}
        {showFilters && (
          <div className="bg-card rounded-2xl p-6 mb-8 animate-slide-up card-elevated">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onlyDeals}
                  onChange={(e) => setFilters({ ...filters, onlyDeals: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm">Only Deals</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm">In Stock</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm">Min Rating:</span>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                  className="h-9 px-3 rounded-lg border border-border bg-background text-sm"
                >
                  <option value={0}>All</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        )}
        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {dealProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
