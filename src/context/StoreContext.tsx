import React, { createContext, useContext, useState, useEffect } from 'react';
import { Store, Product, Category } from '@/types';
import { toast } from 'sonner';

// Static categories for now, could be dynamic later
const initialCategories: Category[] = [
  { id: '1', name: 'Fruits & Veg', icon: '🍎', productCount: 120 },
  { id: '2', name: 'Dairy & Bread', icon: '🥛', productCount: 85 },
  { id: '3', name: 'Snacks', icon: '🍪', productCount: 65 },
  { id: '4', name: 'Beverages', icon: '🥤', productCount: 45 },
  { id: '5', name: 'Personal Care', icon: '🧴', productCount: 90 },
  { id: '6', name: 'Household', icon: '🧹', productCount: 55 },
];

interface StoreContextType {
  stores: Store[];
  products: Product[];
  categories: Category[];
  addStore: (store: Omit<Store, 'id' | 'rating' | 'reviewCount'> | FormData) => Promise<Store>;
  updateStore: (id: string, data: Partial<Store> | FormData) => void;
  deleteStore: (id: string) => void;
  approveStore: (id: string) => void;
  rejectStore: (id: string) => void;
  getStoresByOwner: (ownerId: string) => Store[];
  getApprovedStores: () => Store[];
  getPendingStores: () => Store[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'> | FormData) => void;
  updateProduct: (id: string, data: Partial<Product> | FormData) => void;
  deleteProduct: (id: string) => void;
  getProductsByStore: (storeId: string) => Product[];
  getProductsByOwner: (ownerId: string) => Product[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const fetchData = async () => {
    try {
      const [storesRes, productsRes] = await Promise.all([
        fetch('/api/stores'),
        fetch('/api/products')
      ]);

      if (storesRes.ok) {
        setStores(await storesRes.json());
      }
      if (productsRes.ok) {
        setProducts(await productsRes.json());
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      toast.error('Failed to load data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addStore = async (storeData: Omit<Store, 'id' | 'rating' | 'reviewCount'> | FormData): Promise<Store> => {
    try {
      const isFormData = storeData instanceof FormData;
      const headers: Record<string, string> = isFormData ? {} : { 'Content-Type': 'application/json' };
      const body = isFormData ? storeData : JSON.stringify(storeData);

      const res = await fetch('/api/stores', {
        method: 'POST',
        headers,
        body,
      });
      const newStore = await res.json();
      setStores(prev => [newStore, ...prev]);
      return newStore;
    } catch (error) {
      toast.error('Failed to create store');
      throw error;
    }
  };

  const updateStore = async (id: string, data: Partial<Store> | FormData) => {
    try {
      const isFormData = data instanceof FormData;
      const headers: Record<string, string> = isFormData ? {} : { 'Content-Type': 'application/json' };
      const body = isFormData ? data : JSON.stringify(data);

      const res = await fetch(`/api/stores/${id}`, {
        method: 'PUT',
        headers,
        body,
      });
      if (res.ok) {
        const updated = await res.json();
        setStores(prev => prev.map(s => s.id === id ? updated : s));
      }
    } catch (error) {
      toast.error('Failed to update store');
    }
  };

  const deleteStore = async (id: string) => {
    try {
      await fetch(`/api/stores/${id}`, { method: 'DELETE' });
      setStores(prev => prev.filter(s => s.id !== id));
      setProducts(prev => prev.filter(p => p.store.id !== id));
      toast.success('Store deleted successfully');
    } catch (error) {
      toast.error('Failed to delete store');
    }
  };

  const approveStore = async (id: string) => {
    updateStore(id, { status: 'approved' });
    toast.success('Store approved successfully');
  };

  const rejectStore = async (id: string) => {
    updateStore(id, { status: 'rejected' });
    toast.info('Store rejected');
  };

  const getStoresByOwner = (ownerId: string) => {
    return stores.filter(s => s.ownerId === ownerId);
  };

  const getApprovedStores = () => {
    return stores.filter(s => s.status === 'approved');
  };

  const getPendingStores = () => {
    return stores.filter(s => s.status === 'pending');
  };

  const addProduct = async (productData: any) => {
    try {
      const isFormData = productData instanceof FormData;
      const headers: Record<string, string> = isFormData ? {} : { 'Content-Type': 'application/json' };
      const body = isFormData ? productData : JSON.stringify(productData);

      const res = await fetch('/api/products', {
        method: 'POST',
        headers,
        body,
      });

      if (!res.ok) throw new Error('Failed to add product');

      const newProduct = await res.json();
      setProducts(prev => [newProduct, ...prev]);
      toast.success('Product added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add product');
    }
  };

  const updateProduct = async (id: string, data: any) => {
    try {
      const isFormData = data instanceof FormData;
      const headers: Record<string, string> = isFormData ? {} : { 'Content-Type': 'application/json' };
      const body = isFormData ? data : JSON.stringify(data);

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers,
        body,
      });

      if (!res.ok) throw new Error('Failed to update product');

      const updated = await res.json();
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
      toast.success('Product updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update product');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const getProductsByStore = (storeId: string) => {
    return products.filter(p => p.store.id === storeId);
  };

  const getProductsByOwner = (ownerId: string) => {
    const ownerStoreIds = stores.filter(s => s.ownerId === ownerId).map(s => s.id);
    return products.filter(p => p.store && ownerStoreIds.includes(p.store.id));
  };

  return (
    <StoreContext.Provider
      value={{
        stores,
        products,
        categories: initialCategories,
        addStore: addStore as any,
        updateStore,
        deleteStore,
        approveStore,
        rejectStore,
        getStoresByOwner,
        getApprovedStores,
        getPendingStores,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductsByStore,
        getProductsByOwner,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
