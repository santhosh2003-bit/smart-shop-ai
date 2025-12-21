import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Star, Phone, Share2, Heart, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { stores, products } from '@/data/mockData';

const StoreDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);

  const store = stores.find((s) => s.id === id);
  const storeProducts = products.filter((p) => p.store.id === id);

  if (!store) {
    return (
      <Layout>
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Store not found</h1>
          <Link to="/stores">
            <Button>Back to Stores</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary/20 to-accent/20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          
          {/* Breadcrumb */}
          <div className="container mx-auto pt-6 relative z-10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/stores" className="hover:text-primary">Stores</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{store.name}</span>
            </div>
          </div>
        </div>

        {/* Store Info Card */}
        <div className="container mx-auto -mt-20 relative z-10">
          <div className="bg-card rounded-2xl shadow-xl border border-border p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={store.logo}
                alt={store.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-background shadow-lg"
              />
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl md:text-3xl font-bold">{store.name}</h1>
                      {store.isOpen ? (
                        <Badge className="bg-primary/10 text-primary">Open Now</Badge>
                      ) : (
                        <Badge variant="secondary">Closed</Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-foreground">{store.rating}</span>
                        <span>({store.reviewCount.toLocaleString()} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{store.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{store.deliveryTime}</span>
                      </div>
                    </div>
                    
                    <p className="mt-2 text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-4 h-4 shrink-0" />
                      {store.address}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={isFavorite ? 'text-red-500 border-red-500' : ''}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Phone className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-secondary/50 rounded-xl">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{storeProducts.length}</p>
                    <p className="text-sm text-muted-foreground">Products</p>
                  </div>
                  <div className="text-center border-x border-border">
                    <p className="text-2xl font-bold text-accent">Free</p>
                    <p className="text-sm text-muted-foreground">Delivery $25+</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{store.deliveryTime}</p>
                    <p className="text-sm text-muted-foreground">Delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto py-8">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="deals">Deals</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {storeProducts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No products available from this store yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {storeProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="deals" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {storeProducts
                  .filter((p) => p.discount)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="popular" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {storeProducts
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 8)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default StoreDetails;
