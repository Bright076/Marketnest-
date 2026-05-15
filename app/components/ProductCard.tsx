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
}

export default function ProductCard({
  id = Date.now(),
  name,
  price,
  image,
  type,
  description,
}: ProductCardProps) {
  const isLocal = type === "local";
  const badgeText = isLocal ? "Local Deal 🇳🇬" : "Global Deal 🌍";
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
      addToCart({ id, name, price, image, type, description });
      alert(`🛒 Added "${name}" to cart!`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppOrder = async () => {
    setIsLoading(true);
    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Not logged in - show alert and redirect to login
        if (confirm("You need to login to order via WhatsApp. Would you like to login now?")) {
          router.push("/login");
        }
        return;
      }
      
      // User is logged in - proceed with WhatsApp order
      const message = `Hi! I'm interested in ordering:\n\n*${name}*\nPrice: ${price}\n${description ? `Description: ${description}\n` : ''}\nPlease let me know the availability and delivery details.`;
      const whatsappUrl = `https://wa.me/qr/7LOW7YQ4C4C4O1?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
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
        border: isLocal ? "2px solid rgba(22, 163, 74, 0.1)" : "2px solid rgba(249, 115, 22, 0.1)"
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
            backgroundImage: isLocal ? "linear-gradient(to right, #16a34a, #15803d)" : "linear-gradient(to right, #f97316, #ea580c)",
            color: "#ffffff",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {badgeText}
        </div>
      </div>

      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", flexGrow: 1 }}>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", lineHeight: 1.4, margin: "0 0 0.4rem 0" }}>
            {name}
          </h3>
          {description && (
            <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: 0, lineHeight: 1.4 }}>
              {description}
            </p>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "1.5rem", fontWeight: 800, color: isLocal ? "#16a34a" : "#f97316" }}>
            {price}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
            padding: "0.8rem",
            background: isLocal ? "#f0fdf4" : "#fff7ed",
            borderRadius: "12px",
            fontSize: "0.85rem",
            fontWeight: 500,
            color: isLocal ? "#166534" : "#9a3412"
          }}
        >
          {isLocal ? (
            <>
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontSize: "1rem" }}>🚚</span> Fast Delivery (1–3 days)
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontSize: "1rem" }}>💰</span> Pay on Delivery
              </span>
            </>
          ) : (
            <>
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontSize: "1rem" }}>🌍</span> Shipping (7–15 days)
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontSize: "1rem" }}>💳</span> Payment Required
              </span>
            </>
          )}
        </div>

        <div style={{ flexGrow: 1 }} />

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={isLocal ? handleWhatsAppOrder : handleAddToCart}
            disabled={isLoading}
            className="card-hover"
            style={{ 
              width: "100%", 
              background: isLoading ? "#9ca3af" : (isLocal ? "#16a34a" : "#f97316"), 
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
              boxShadow: isLoading ? "none" : (isLocal ? "0 4px 15px rgba(22, 163, 74, 0.3)" : "0 4px 15px rgba(249, 115, 22, 0.3)"),
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading && <ButtonSpinner />}
            {isLocal ? (
             <>
               {!isLoading && (
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                 </svg>
               )}
               {isLoading ? "Processing..." : "Message on WhatsApp"}
             </>
            ) : (
              <>
               {!isLoading && (
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                 </svg>
               )}
               {isLoading ? "Adding..." : "Add to Cart"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
