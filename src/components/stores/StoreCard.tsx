import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { Store } from '@/types';

interface StoreCardProps {
  store: Store;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  return (
    <Link
      to={`/stores/${store.id}`}
      className="flex gap-3 bg-card rounded-xl p-3 border border-border hover:border-primary/30 transition-colors"
    >
      <img
        src={store.logo}
        alt={store.name}
        className="w-16 h-16 rounded-lg object-cover shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-semibold truncate">{store.name}</h3>
          {store.isOpen ? (
            <span className="text-xs text-primary font-medium shrink-0">Open</span>
          ) : (
            <span className="text-xs text-muted-foreground shrink-0">Closed</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-accent text-accent" />
            <span>{store.rating}</span>
          </div>
          <span>•</span>
          <span>{store.distance}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{store.deliveryTime}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground truncate">{store.address}</p>
      </div>
    </Link>
  );
};

export default StoreCard;