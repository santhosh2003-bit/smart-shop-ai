import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin } from 'lucide-react';
import { Store } from '@/types';

interface StoreCardProps {
  store: Store;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  return (
    <Link
      to={`/stores/${store.id}`}
      className="group flex gap-4 bg-card rounded-xl p-4 border border-border hover:border-primary/20 transition-all hover:shadow-md"
    >
      {/* Logo */}
      <img
        src={store.logo}
        alt={store.name}
        className="w-16 h-16 rounded-xl object-cover shrink-0"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {store.name}
          </h3>
          {store.isOpen ? (
            <span className="shrink-0 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
              Open
            </span>
          ) : (
            <span className="shrink-0 px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-medium">
              Closed
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3 mt-1.5 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            <span className="font-medium text-xs">{store.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{store.deliveryTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{store.distance} • {store.address}</span>
        </div>
      </div>
    </Link>
  );
};

export default StoreCard;