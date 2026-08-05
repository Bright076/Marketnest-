"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "../data/products";
import { supabase } from "@/lib/supabaseClient";

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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Load cart based on current user
  useEffect(() => {
    setIsClient(true);
    
    const loadUserCart = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || null;
      setCurrentUserId(userId);
      
      // Use user-specific cart key
      const cartKey = userId ? `marketnest_cart_${userId}` : "marketnest_cart_guest";
      const savedCart = localStorage.getItem(cartKey);
      
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            setCart(parsedCart);
          } else {
            setCart([]);
            localStorage.removeItem(cartKey);
          }
        } catch (e) {
          console.error("Cart parse error", e);
          setCart([]);
          localStorage.removeItem(cartKey);
        }
      } else {
        setCart([]);
      }
    };
    
    loadUserCart();
    
    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const newUserId = session?.user?.id || null;
      
      if (event === 'SIGNED_OUT') {
        // Clear cart on logout
        setCart([]);
        setCurrentUserId(null);
      } else if (newUserId !== currentUserId) {
        // User changed, load their cart
        setCurrentUserId(newUserId);
        const cartKey = newUserId ? `marketnest_cart_${newUserId}` : "marketnest_cart_guest";
        const savedCart = localStorage.getItem(cartKey);
        
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart)) {
              setCart(parsedCart);
            } else {
              setCart([]);
            }
          } catch (e) {
            setCart([]);
          }
        } else {
          setCart([]);
        }
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Save cart to localStorage with user-specific key
  useEffect(() => {
    if (isClient && currentUserId !== undefined) {
      const cartKey = currentUserId ? `marketnest_cart_${currentUserId}` : "marketnest_cart_guest";
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, isClient, currentUserId]);

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
