import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin } from 'lucide-react';
import { Store } from '@/types';
import { cn } from '@/lib/utils';

interface StoreCardProps {
  store: Store;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  return (
    <Link
      to={`/stores/${store.id}`}
      className="group bg-card rounded-2xl overflow-hidden card-elevated animate-fade-in"
    >
      {/* Header with logo */}
      <div className="relative h-24 bg-gradient-to-br from-primary/10 to-accent/10">
        <img
          src={store.logo}
          alt={store.name}
          className="absolute bottom-0 left-4 translate-y-1/2 w-16 h-16 rounded-xl object-cover border-4 border-card shadow-lg"
        />
        {store.isOpen ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg fresh-badge text-xs font-semibold text-primary-foreground">
            Open Now
          </span>
        ) : (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
            Closed
          </span>
        )}
      </div>

      {/* Content */}
      <div className="pt-10 p-4">
        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
          {store.name}
        </h3>
        
        <div className="flex items-center gap-4 mt-2 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-medium">{store.rating}</span>
            <span className="text-muted-foreground">({store.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{store.deliveryTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{store.distance} • {store.address}</span>
        </div>
      </div>
    </Link>
  );
};

export default StoreCard;
