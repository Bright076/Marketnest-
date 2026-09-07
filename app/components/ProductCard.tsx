"use client";

import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ButtonSpinner } from "./LoadingSpinner";

interface ProductCardProps {
  id?: string | number;  // Support both UUID strings and numbers
  name: string;
  price: string;
  image: string;
  type: "local" | "cj";
  description?: string;
  category?: string;
  is_deal?: boolean;
  deal_price?: number;
  deal_ends_at?: string;
  original_price?: number;
}

export default function ProductCard({
  id = Date.now().toString(),  // Default to string timestamp
  name,
  price,
  image,
  type,
  description,
  category = "electronics",
  is_deal = false,
  deal_price,
  deal_ends_at,
  original_price,
}: ProductCardProps) {
  const router = useRouter();
  const toast = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if deal is active
  const now = new Date();
  const isActiveDeal = is_deal && deal_ends_at && new Date(deal_ends_at) > now;
  
  // Display price (deal price if active, otherwise regular price)
  const displayPrice = isActiveDeal && deal_price 
    ? `$${deal_price.toFixed(2)}` 
    : price;
    
  // Calculate discount percentage
  const discountPercentage = isActiveDeal && original_price && deal_price
    ? Math.round(((original_price - deal_price) / original_price) * 100)
    : 0;
  
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsLoggedIn(!!user);
  };
  
  const { addToCart } = useCart();
  
  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      // Add to cart regardless of login status (guest checkout enabled)
      addToCart({ id, name, price, image, type, description, category });
      toast.success(`Added "${name}" to cart!`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="card-hover"
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
        display: "flex",
        flexDirection: "column",
        border: "2px solid rgba(249, 115, 22, 0.1)",
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          background: "#f8fafc",
          padding: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "260px",
          position: "relative",
        }}
      >
        <img
          src={image}
          alt={name}
          style={{
            objectFit: "contain",
            maxHeight: "240px",
            width: "auto",
            maxWidth: "100%",
            mixBlendMode: "multiply"
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "8px",
              fontSize: "0.75rem",
              fontWeight: 700,
              backgroundImage: "linear-gradient(to right, #f97316, #ea580c)",
              color: "#ffffff",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            🌍 Global
          </div>
          {isActiveDeal && discountPercentage > 0 && (
            <div
              style={{
                padding: "0.4rem 0.8rem",
                borderRadius: "8px",
                fontSize: "0.75rem",
                fontWeight: 700,
                backgroundImage: "linear-gradient(to right, #dc2626, #991b1b)",
                color: "#ffffff",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              ⚡ {discountPercentage}% OFF
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", flexGrow: 1 }}>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", lineHeight: 1.4, margin: "0 0 0.4rem 0", minHeight: "2.8rem" }}>
            {name}
          </h3>
          {description && (
            <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: 0, lineHeight: 1.4 }}>
              {description}
            </p>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          {isActiveDeal && original_price && (
            <span style={{ 
              fontSize: "1.1rem", 
              fontWeight: 600, 
              color: "#9ca3af",
              textDecoration: "line-through"
            }}>
              ${original_price.toFixed(2)}
            </span>
          )}
          <span style={{ fontSize: "1.5rem", fontWeight: 800, color: isActiveDeal ? "#dc2626" : "#f97316" }}>
            {displayPrice}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
            padding: "0.8rem",
            background: "#f0fdf4",
            borderRadius: "12px",
            fontSize: "0.85rem",
            fontWeight: 600,
            border: "2px solid #bbf7d0"
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#166534" }}>
            <span style={{ fontSize: "1.1rem" }}>✅</span> FREE Shipping
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#9a3412" }}>
            <span style={{ fontSize: "1rem" }}>📦</span> Quality Products
          </span>
        </div>

        <div style={{ flexGrow: 1 }} />

        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="card-hover"
          style={{ 
            width: "100%", 
            background: isLoading ? "#9ca3af" : "#f97316", 
            color: "white", 
            padding: "0.75rem", 
            borderRadius: "12px", 
            fontWeight: 600, 
            border: "none", 
            cursor: isLoading ? "not-allowed" : "pointer",
            fontSize: "0.95rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: isLoading ? "none" : "0 4px 15px rgba(249, 115, 22, 0.3)",
            opacity: isLoading ? 0.7 : 1,
            transition: "all 0.3s",
          }}
        >
          {isLoading && <ButtonSpinner />}
          {!isLoading && (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          )}
          {isLoading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
