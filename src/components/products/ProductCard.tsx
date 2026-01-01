import React from 'react';
import { Plus, Star, Check } from 'lucide-react';
import { Product } from '@/types';
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
    <div className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Discount */}
        {product.discount && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-bold">
            {product.discount}% OFF
          </div>
        )}

        {/* Add button */}
        <button
          onClick={() => addToCart(product)}
          disabled={!product.inStock || isInCart}
          className={cn(
            "absolute bottom-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all",
            isInCart 
              ? "bg-primary text-primary-foreground" 
              : product.inStock 
                ? "bg-white text-primary hover:bg-primary hover:text-white"
                : "bg-muted text-muted-foreground"
          )}
        >
          {isInCart ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span>{product.store.name}</span>
          {distanceText && <span>• {distanceText}</span>}
        </div>

        <h3 className="font-semibold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            <span className="font-medium">{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;