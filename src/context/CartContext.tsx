'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  type: 'exam' | 'course' | 'bundle' | 'product';
  university?: string;
  code?: string;
  year?: number;
  category?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tibeb_cart');
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCart(items);
    localStorage.setItem('tibeb_cart', JSON.stringify(items));
  };

  const addToCart = (item: CartItem) => {
    if (cart.some(i => i.id === item.id)) {
      setIsCartOpen(true);
      return;
    }
    const updated = [...cart, item];
    saveCart(updated);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    const updated = cart.filter(i => i.id !== id);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const isInCart = (id: string) => {
    return cart.some(i => i.id === id);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
