import React from 'react';
import { Plus, Star, MapPin, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, items } = useCart();
  
  const isInCart = items.some(item => item.product.id === product.id);
  
  const formatDistance = (distance?: number | null) => {
    if (!distance || !Number.isFinite(distance)) return null;
    if (distance < 1) return `${(distance * 1000).toFixed(0)}m`;
    return `${distance.toFixed(1)}km`;
  };

  const distanceText = formatDistance(product.distance);

  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 card-elevated">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary to-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Discount badge */}
        {product.discount && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-lg deal-badge text-white text-xs font-bold shadow-lg">
              -{product.discount}%
            </span>
          </div>
        )}

        {/* Distance badge */}
        {distanceText && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-lg glass text-xs font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-primary" />
              {distanceText}
            </span>
          </div>
        )}

        {/* Quick add button - visible on hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button
            onClick={() => addToCart(product)}
            disabled={!product.inStock || isInCart}
            className={cn(
              "w-full rounded-xl font-semibold shadow-lg",
              isInCart ? "bg-primary/80" : "bg-primary hover:bg-primary/90"
            )}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Store info */}
        <div className="flex items-center gap-2 mb-2">
          <img
            src={product.store.logo}
            alt={product.store.name}
            className="w-5 h-5 rounded-full object-cover ring-2 ring-border"
          />
          <span className="text-xs text-muted-foreground font-medium truncate">{product.store.name}</span>
        </div>

        {/* Product name */}
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-accent/10">
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            <span className="text-xs font-bold text-accent">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          {/* Mobile add button */}
          <Button
            size="icon"
            onClick={() => addToCart(product)}
            className={cn(
              "w-10 h-10 rounded-xl md:hidden",
              isInCart ? "bg-primary/80" : "bg-primary hover:bg-primary/90"
            )}
            disabled={!product.inStock || isInCart}
          >
            {isInCart ? <Check className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
          </Button>
        </div>

        {/* Stock status */}
        {!product.inStock && (
          <div className="mt-2 text-xs font-medium text-destructive">Out of Stock</div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;