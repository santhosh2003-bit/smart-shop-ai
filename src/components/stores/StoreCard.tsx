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
      className="group flex gap-4 bg-card rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <img
        src={store.logo}
        alt={store.name}
        className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
            {store.name}
          </h3>
          <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${
            store.isOpen 
              ? 'bg-primary/10 text-primary' 
              : 'bg-muted text-muted-foreground'
          }`}>
            {store.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-medium text-foreground">{store.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {store.deliveryTime}
          </div>
          <span>{store.distance}</span>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">{store.address}</span>
        </div>
      </div>
    </Link>
  );
};

export default StoreCard;