import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, ChevronRight, Bike } from 'lucide-react';
import { Store } from '@/types';

interface StoreCardProps {
  store: Store;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  return (
    <Link
      to={`/stores/${store.id}`}
      className="group block bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 card-elevated"
    >
      {/* Cover image / banner area */}
      <div className="relative h-24 bg-gradient-to-r from-primary/20 to-accent/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          {store.isOpen ? (
            <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-pulse" />
              Open Now
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold">
              Closed
            </span>
          )}
        </div>
        
        {/* Logo - positioned to overlap */}
        <div className="absolute -bottom-8 left-4">
          <img
            src={store.logo}
            alt={store.name}
            className="w-16 h-16 rounded-2xl object-cover border-4 border-card shadow-lg group-hover:scale-105 transition-transform"
          />
        </div>
      </div>

      {/* Content */}
      <div className="pt-10 px-4 pb-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {store.name}
          </h3>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
        </div>
        
        {/* Stats row */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-accent/10">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-bold text-accent">{store.rating}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{store.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Bike className="w-4 h-4" />
            <span className="text-sm font-medium">{store.distance}</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="text-sm line-clamp-1">{store.address}</span>
        </div>
      </div>
    </Link>
  );
};

export default StoreCard;