import React from 'react';
import { Plus, Star, Heart } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group bg-card rounded-2xl overflow-hidden card-elevated animate-fade-in">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Offer badge */}
        {product.offer && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg deal-badge text-xs font-semibold text-accent-foreground">
            {product.offer}
          </span>
        )}

        {/* Discount badge */}
        {product.discount && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold">
            -{product.discount}%
          </span>
        )}

        {/* Wishlist button */}
        <button className="absolute bottom-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Store info */}
        <div className="flex items-center gap-2 mb-2">
          <img
            src={product.store.logo}
            alt={product.store.name}
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="text-xs text-muted-foreground">{product.store.name}</span>
        </div>

        {/* Product name */}
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price and Add button */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">${product?.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <Button
            size="icon"
            onClick={() => addToCart(product)}
            className={cn(
              "w-9 h-9 rounded-xl",
              product.inStock ? "bg-primary hover:bg-primary/90" : "bg-muted"
            )}
            disabled={!product.inStock}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
