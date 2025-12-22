import React, { createContext, useContext, useState, useEffect } from 'react';
import { Store, Product } from '@/types';
import { stores as initialStores, products as initialProducts, categories } from '@/data/mockData';
import { toast } from 'sonner';

interface StoreContextType {
  stores: Store[];
  products: Product[];
  categories: typeof categories;
  addStore: (store: Omit<Store, 'id' | 'rating' | 'reviewCount'>) => Store;
  updateStore: (id: string, data: Partial<Store>) => void;
  deleteStore: (id: string) => void;
  approveStore: (id: string) => void;
  rejectStore: (id: string) => void;
  getStoresByOwner: (ownerId: string) => Store[];
  getApprovedStores: () => Store[];
  getPendingStores: () => Store[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductsByStore: (storeId: string) => Product[];
  getProductsByOwner: (ownerId: string) => Product[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>(() => {
    const stored = localStorage.getItem('dealfinder-stores');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialStores.map(s => ({ ...s, status: 'approved' as const }));
      }
    }
    return initialStores.map(s => ({ ...s, status: 'approved' as const }));
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem('dealfinder-products');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('dealfinder-stores', JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem('dealfinder-products', JSON.stringify(products));
  }, [products]);

  const addStore = (storeData: Omit<Store, 'id' | 'rating' | 'reviewCount'>): Store => {
    const newStore: Store = {
      ...storeData,
      id: Date.now().toString(),
      rating: 0,
      reviewCount: 0,
    };
    setStores(prev => [newStore, ...prev]);
    return newStore;
  };

  const updateStore = (id: string, data: Partial<Store>) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteStore = (id: string) => {
    setStores(prev => prev.filter(s => s.id !== id));
    setProducts(prev => prev.filter(p => p.store.id !== id));
    toast.success('Store deleted successfully');
  };

  const approveStore = (id: string) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s));
    toast.success('Store approved successfully');
  };

  const rejectStore = (id: string) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, status: 'rejected' } : s));
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

  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      rating: 0,
      reviewCount: 0,
    };
    setProducts(prev => [newProduct, ...prev]);
    toast.success('Product added successfully');
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    toast.success('Product updated successfully');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success('Product deleted successfully');
  };

  const getProductsByStore = (storeId: string) => {
    return products.filter(p => p.store.id === storeId);
  };

  const getProductsByOwner = (ownerId: string) => {
    const ownerStoreIds = stores.filter(s => s.ownerId === ownerId).map(s => s.id);
    return products.filter(p => ownerStoreIds.includes(p.store.id));
  };

  return (
    <StoreContext.Provider
      value={{
        stores,
        products,
        categories,
        addStore,
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
