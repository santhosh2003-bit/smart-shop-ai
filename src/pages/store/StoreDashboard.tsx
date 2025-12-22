import React from 'react';
import { Link } from 'react-router-dom';
import { Package, DollarSign, ShoppingCart, TrendingUp, Plus, Eye, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import StoreLayout from '@/components/store/StoreLayout';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';

const StoreDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getStoresByOwner, getProductsByOwner } = useStore();

  const userStores = user ? getStoresByOwner(user.id) : [];
  const userProducts = user ? getProductsByOwner(user.id) : [];
  const approvedStore = userStores.find(s => s.status === 'approved');
  const pendingStore = userStores.find(s => s.status === 'pending');
  const hasStore = userStores.length > 0;

  const stats = [
    {
      title: 'Total Products',
      value: userProducts.length,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Revenue',
      value: `$${userProducts.reduce((sum, p) => sum + p.price * 10, 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Orders Today',
      value: Math.floor(Math.random() * 20) + 5,
      icon: ShoppingCart,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Views Today',
      value: Math.floor(Math.random() * 500) + 100,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ];

  return (
    <StoreLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Store Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}!
            </p>
          </div>
          {approvedStore && (
            <Link to="/store-dashboard/products">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Link>
          )}
        </div>

        {/* Store Status Alerts */}
        {!hasStore && (
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <AlertTitle className="text-yellow-600">No Store Registered</AlertTitle>
            <AlertDescription className="text-yellow-600">
              You haven't registered a store yet.{' '}
              <Link to="/store-dashboard/store" className="underline font-medium">
                Register your store now
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {pendingStore && (
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <Clock className="w-4 h-4 text-yellow-600" />
            <AlertTitle className="text-yellow-600">Store Pending Approval</AlertTitle>
            <AlertDescription className="text-yellow-600">
              Your store "{pendingStore.name}" is awaiting admin approval. You'll be able to add products once approved.
            </AlertDescription>
          </Alert>
        )}

        {approvedStore && (
          <Alert className="border-primary/50 bg-primary/10">
            <CheckCircle className="w-4 h-4 text-primary" />
            <AlertTitle className="text-primary">Store Approved</AlertTitle>
            <AlertDescription className="text-primary">
              Your store "{approvedStore.name}" is live! You can now add and manage products.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        {approvedStore && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.title} className="card-elevated">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Store Info */}
        {approvedStore && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <img
                    src={approvedStore.logo}
                    alt={approvedStore.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{approvedStore.name}</h3>
                    <p className="text-sm text-muted-foreground">{approvedStore.address}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant={approvedStore.isOpen ? 'default' : 'secondary'}>
                        {approvedStore.isOpen ? 'Open' : 'Closed'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {approvedStore.deliveryTime} delivery
                      </span>
                    </div>
                    <div className="mt-3">
                      <Link to={`/stores/${approvedStore.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Store Page
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Products</CardTitle>
              </CardHeader>
              <CardContent>
                {userProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No products yet</p>
                    <Link to="/store-dashboard/products">
                      <Button variant="link" className="mt-2">
                        Add your first product
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userProducts.slice(0, 4).map((product) => (
                      <div key={product.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                        </div>
                        <Badge variant={product.inStock ? 'default' : 'secondary'}>
                          {product.inStock ? 'In Stock' : 'Out'}
                        </Badge>
                      </div>
                    ))}
                    {userProducts.length > 4 && (
                      <Link to="/store-dashboard/products">
                        <Button variant="ghost" className="w-full">
                          View all {userProducts.length} products
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/store-dashboard/products">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <Package className="w-6 h-6" />
                  <span>Manage Products</span>
                </Button>
              </Link>
              <Link to="/store-dashboard/store">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <Eye className="w-6 h-6" />
                  <span>Store Settings</span>
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <ShoppingCart className="w-6 h-6" />
                  <span>View Shop</span>
                </Button>
              </Link>
              <Link to="/history">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <TrendingUp className="w-6 h-6" />
                  <span>Order History</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </StoreLayout>
  );
};

export default StoreDashboard;
