import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import CategoryCard from '@/components/products/CategoryCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/context/StoreContext';

const Products: React.FC = () => {
  const { products, categories } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    onlyDeals: false,
    inStock: true,
    minRating: 0,
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory ||
      p.category === categories.find(c => c.id === activeCategory)?.name;
    const matchesDeals = !filters.onlyDeals || p.discount;
    const matchesStock = !filters.inStock || p.inStock;
    const matchesRating = p.rating >= filters.minRating;

    return matchesSearch && matchesCategory && matchesDeals && matchesStock && matchesRating;
  });

  return (
    <Layout>
      <Helmet>
        <title>All Products - DealFinder</title>
        <meta name="description" content="Browse our complete collection of products with amazing deals and discounts." />
      </Helmet>

      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">Discover {products.length}+ products with the best prices</p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl"
            />
          </div>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            className="gap-2 h-12"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-card rounded-2xl p-6 mb-8 animate-slide-up card-elevated">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onlyDeals}
                  onChange={(e) => setFilters({ ...filters, onlyDeals: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm">Only Deals</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm">In Stock</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm">Min Rating:</span>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                  className="h-9 px-3 rounded-lg border border-border bg-background text-sm"
                >
                  <option value={0}>All</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide -mx-4 px-4">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all min-w-[100px] shrink-0 ${!activeCategory
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-card hover:bg-secondary card-elevated'
              }`}
          >
            <span className="text-2xl">🛒</span>
            <span className="text-xs font-medium">All</span>
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

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          Showing {filteredProducts.length} products
        </p>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg font-medium mb-2">No products found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Products;
