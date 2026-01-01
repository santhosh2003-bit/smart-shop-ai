import React from 'react';
import { Plus, Star } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const formatDistance = (distance?: number | null) => {
    if (!distance || !Number.isFinite(distance)) return null;
    if (distance < 1) return `${(distance * 1000).toFixed(0)}m`;
    return `${distance.toFixed(1)}km`;
  };

  const distanceText = formatDistance(product.distance);

  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border">
      {/* Image */}
      <div className="relative aspect-square bg-secondary/50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.discount && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-destructive text-destructive-foreground text-xs font-bold">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <span className="truncate">{product.store.name}</span>
          {distanceText && (
            <>
              <span>•</span>
              <span>{distanceText}</span>
            </>
          )}
        </div>

        <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 fill-accent text-accent" />
          <span className="text-xs font-medium">{product.rating}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through ml-1">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
              product.inStock 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "bg-muted text-muted-foreground"
            )}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;