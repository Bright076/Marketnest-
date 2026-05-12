"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "../data/products";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Only load cart from localStorage if it exists
    // This ensures new users start with an empty cart
    const savedCart = localStorage.getItem("marketnest_cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Ensure it's a valid array
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        } else {
          // Invalid cart data, start fresh
          setCart([]);
          localStorage.removeItem("marketnest_cart");
        }
      } catch (e) {
        console.error("Cart parse error", e);
        // If parsing fails, start with empty cart
        setCart([]);
        localStorage.removeItem("marketnest_cart");
      }
    } else {
      // No saved cart, start with empty cart
      setCart([]);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("marketnest_cart", JSON.stringify(cart));
    }
  }, [cart, isClient]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => {
    const priceStr = item.price.replace("$", "").replace(",", "");
    const price = parseFloat(priceStr) || 0;
    return total + price * item.quantity;
  }, 0);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
