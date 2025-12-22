import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const total = getTotal();
  const deliveryFee = total > 25 ? 0 : 2.99;
  const finalTotal = total + deliveryFee;

  const handleCheckout = () => {
    toast.success('Order placed successfully!');
    clearCart();
    navigate('/tracking');
  };

  if (items.length === 0) {
    return (
      <Layout>
        <Helmet>
          <title>Your Cart - DealFinder</title>
        </Helmet>
        <div className="container mx-auto py-16 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some products to get started!</p>
          <Link to="/products">
            <Button className="gap-2">
              Browse Products
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{`Your Cart (${items.length}) - DealFinder`}</title>
      </Helmet>

      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-card rounded-2xl p-4 md:p-6 card-elevated animate-fade-in"
              >
                <div className="flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.product.store.name}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                        {item.product.originalPrice && (
                          <p className="text-sm text-muted-foreground line-through">
                            ${(item.product.originalPrice * item.quantity).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 card-elevated sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-primary' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add ${(25 - total).toFixed(2)} more for free delivery
                  </p>
                )}
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Checkout
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Estimated delivery: 10-15 min
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
