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
  const [currentUserId, setCurrentUserId] = useState<string | null | undefined>(undefined);

  // Load cart based on current user
  useEffect(() => {
    setIsClient(true);
    
    const loadUserCart = async () => {
      console.log('🛒 Loading user cart...');
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || null;
      
      console.log('🔐 Current user ID:', userId || 'guest');
      setCurrentUserId(userId);
      
      // Use user-specific cart key
      const cartKey = userId ? `marketnest_cart_${userId}` : "marketnest_cart_guest";
      console.log('🔑 Using cart key:', cartKey);
      
      const savedCart = localStorage.getItem(cartKey);
      
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            console.log('✅ Loaded cart:', parsedCart.length, 'items');
            setCart(parsedCart);
          } else {
            console.log('⚠️ Invalid cart data, clearing');
            setCart([]);
            localStorage.removeItem(cartKey);
          }
        } catch (e) {
          console.error("Cart parse error", e);
          setCart([]);
          localStorage.removeItem(cartKey);
        }
      } else {
        console.log('📭 No saved cart found, starting empty');
        setCart([]);
      }
    };
    
    loadUserCart();
    
    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event);
      const newUserId = session?.user?.id || null;
      console.log('👤 New user ID:', newUserId || 'guest');
      
      if (event === 'SIGNED_OUT') {
        // Clear cart on logout
        console.log('🚪 User logged out, clearing cart');
        setCart([]);
        setCurrentUserId(null);
        // Also clear from localStorage
        if (typeof window !== 'undefined') {
          const keys = Object.keys(localStorage);
          keys.forEach(key => {
            if (key.startsWith('marketnest_cart_')) {
              console.log('🗑️ Clearing cart key:', key);
              localStorage.removeItem(key);
            }
          });
        }
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        // User logged in or session updated, load their cart
        console.log('🔓 User session active, loading cart for:', newUserId);
        setCurrentUserId(newUserId);
        const cartKey = newUserId ? `marketnest_cart_${newUserId}` : "marketnest_cart_guest";
        console.log('🔑 Loading cart with key:', cartKey);
        
        const savedCart = localStorage.getItem(cartKey);
        
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart)) {
              console.log('✅ Loaded cart for user:', parsedCart.length, 'items');
              setCart(parsedCart);
            } else {
              console.log('⚠️ Invalid cart data for user, clearing');
              setCart([]);
            }
          } catch (e) {
            console.error('❌ Cart parse error:', e);
            setCart([]);
          }
        } else {
          console.log('📭 No saved cart for this user, starting empty');
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
      console.log('💾 Saving cart to:', cartKey, '|', cart.length, 'items');
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
