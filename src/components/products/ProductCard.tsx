import React from 'react';
import { Plus, Star, MapPin } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const formatDistance = (distance?: number | null) => {
    if (!distance || !Number.isFinite(distance)) return null;
    if (distance < 1) return `${(distance * 1000).toFixed(0)}m away`;
    return `${distance.toFixed(1)}km away`;
  };

  const distanceText = formatDistance(product.distance);

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/20 transition-all hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Discount badge */}
        {product.discount && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-destructive text-destructive-foreground text-xs font-bold">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Store & Distance */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <img
              src={product.store.logo}
              alt={product.store.name}
              className="w-4 h-4 rounded-full object-cover shrink-0"
            />
            <span className="text-xs text-muted-foreground truncate">{product.store.name}</span>
          </div>
          {distanceText && (
            <div className="flex items-center gap-0.5 text-xs text-primary shrink-0">
              <MapPin className="w-3 h-3" />
              <span>{distanceText}</span>
            </div>
          )}
        </div>

        {/* Product name */}
        <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-1.5 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price and Add button */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-foreground">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <Button
            size="icon"
            onClick={() => addToCart(product)}
            className={cn(
              "w-8 h-8 rounded-lg",
              product.inStock ? "bg-primary hover:bg-primary/90" : "bg-muted"
            )}
            disabled={!product.inStock}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;