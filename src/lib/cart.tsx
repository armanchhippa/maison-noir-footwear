import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { CartItem, Product } from './supabase';

type CartContextType = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (product: Product, size: number, sizeSystem: 'US' | 'UK' | 'EU', color: string, qty?: number) => void;
  remove: (index: number) => void;
  updateQty: (index: number, qty: number) => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const add = useCallback(
    (product: Product, size: number, sizeSystem: 'US' | 'UK' | 'EU', color: string, qty = 1) => {
      setItems((prev) => {
        const idx = prev.findIndex(
          (i) => i.product_id === product.id && i.size === size && i.sizeSystem === sizeSystem && i.color === color,
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          return next;
        }
        return [
          ...prev,
          {
            product_id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image_url: product.image_url,
            size,
            sizeSystem,
            color,
            qty,
          },
        ];
      });
      setIsOpen(true);
    },
    [],
  );

  const remove = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQty = useCallback((index: number, qty: number) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, qty: Math.max(1, qty) } : item)));
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, isOpen, open, close, add, remove, updateQty, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
