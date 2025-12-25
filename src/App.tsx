import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { StoreProvider } from "@/context/StoreContext";
import LiveChat from "@/components/chat/LiveChat";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Deals from "./pages/Deals";
import Stores from "./pages/Stores";
import StoreDetails from "./pages/StoreDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Tracking from "./pages/Tracking";
import History from "./pages/History";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminStores from "./pages/admin/AdminStores";
import StoreDashboard from "./pages/store/StoreDashboard";
import StoreProducts from "./pages/store/StoreProducts";
import StoreSettings from "./pages/store/StoreSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <StoreProvider>
            <NotificationProvider>
              <CartProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/deals" element={<Deals />} />
                      <Route path="/stores" element={<Stores />} />
                      <Route path="/stores/:id" element={<StoreDetails />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/tracking/:id" element={<Tracking />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/products" element={<AdminProducts />} />
                      <Route path="/admin/stores" element={<AdminStores />} />
                      <Route path="/store-dashboard" element={<StoreDashboard />} />
                      <Route path="/store-dashboard/products" element={<StoreProducts />} />
                      <Route path="/store-dashboard/store" element={<StoreSettings />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <LiveChat />
                  </BrowserRouter>
                </TooltipProvider>
              </CartProvider>
            </NotificationProvider>
          </StoreProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
