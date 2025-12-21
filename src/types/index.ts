export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  store: Store;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  offer?: string;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  distance: string;
  deliveryTime: string;
  address: string;
  isOpen: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  total: number;
  createdAt: Date;
  estimatedDelivery: string;
  store: Store;
  deliveryAddress: string;
  trackingSteps: TrackingStep[];
}

export interface TrackingStep {
  title: string;
  description: string;
  time?: string;
  completed: boolean;
  current?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
}
