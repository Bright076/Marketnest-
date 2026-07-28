"use client";

import { useCart } from "../context/CartContext";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ButtonSpinner } from "./LoadingSpinner";

interface ProductCardProps {
  id?: number;
  name: string;
  price: string;
  image: string;
  type: "local" | "cj";
  description?: string;
  category?: string;
}

export default function ProductCard({
  id = Date.now(),
  name,
  price,
  image,
  type,
  description,
  category = "electronics",
}: ProductCardProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Not logged in - show alert and redirect to login
        if (confirm("You need to login to add items to cart. Would you like to login now?")) {
          router.push("/login");
        }
        return;
      }
      
      // User is logged in - proceed with adding to cart
      addToCart({ id, name, price, image, type, description, category });
      alert(`🛒 Added "${name}" to cart!`);
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

        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f97316" }}>
            {price}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
            padding: "0.8rem",
            background: "#fff7ed",
            borderRadius: "12px",
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "#9a3412"
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "1rem" }}>🌍</span> International Shipping
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
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
