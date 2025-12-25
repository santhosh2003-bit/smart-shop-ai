import React, { useState } from 'react';
import CategoryCard from '@/components/products/CategoryCard';
import ProductCard from '@/components/products/ProductCard';
import { useStore } from '@/context/StoreContext';

const CategoriesSection: React.FC = () => {
  const { categories, products } = useStore();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredProducts = activeCategory
    ? products.filter(p => p.category === categories.find(c => c.id === activeCategory)?.name)
    : products;

  return (
    <section className="py-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
          <p className="text-muted-foreground mt-1">Browse products from your favorite categories</p>
        </div>

        {/* Categories carousel */}
        <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide -mx-4 px-4">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all min-w-[100px] shrink-0 ${!activeCategory
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'bg-card hover:bg-secondary card-elevated'
              }`}
          >
            <span className="text-3xl">🛒</span>
            <span className="text-xs font-medium">All Items</span>
            <span className={`text-xs ${!activeCategory ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              {products.length} items
            </span>
          </button>
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isActive={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            />
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
