import React from 'react';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  isActive?: boolean;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 p-4 rounded-2xl transition-all min-w-[100px]',
        isActive
          ? 'bg-primary text-primary-foreground shadow-lg scale-105'
          : 'bg-card hover:bg-secondary card-elevated'
      )}
    >
      <span className="text-3xl">{category.icon}</span>
      <span className="text-xs font-medium text-center line-clamp-2">{category.name}</span>
      <span className={cn(
        'text-xs',
        isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
      )}>
        {category.productCount} items
      </span>
    </button>
  );
};

export default CategoryCard;
