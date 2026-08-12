"use client";

import { useState, useEffect } from "react";
import HeroSection from "./components/HeroSection";
import ProductCard from "./components/ProductCard";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  selling_price: number;
  image_url: string;
  stock: number;
  category: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      // Load only CJ products from database
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_type', 'cj')
        .gt('stock', 0) // Only show products with stock
        .order('created_at', { ascending: false })
        .limit(8); // Show first 8 products

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeroSection />

      {/* Free Shipping Banner */}
      <div style={{
        background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
        padding: "1.5rem 1rem",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(22, 163, 74, 0.2)",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "clamp(1rem, 3vw, 2rem)",
          color: "#ffffff",
          width: "100%"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: "fit-content" }}>
            <span style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)" }}>🚚</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 800, fontSize: "clamp(0.9rem, 3vw, 1.1rem)" }}>FREE SHIPPING</div>
              <div style={{ fontSize: "clamp(0.75rem, 2.5vw, 0.85rem)", opacity: 0.9 }}>On All Orders</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: "fit-content" }}>
            <span style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)" }}>✅</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 800, fontSize: "clamp(0.9rem, 3vw, 1.1rem)" }}>QUALITY GUARANTEED</div>
              <div style={{ fontSize: "clamp(0.75rem, 2.5vw, 0.85rem)", opacity: 0.9 }}>100% Authentic Products</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: "fit-content" }}>
            <span style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)" }}>🌍</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 800, fontSize: "clamp(0.9rem, 3vw, 1.1rem)" }}>GLOBAL DELIVERY</div>
              <div style={{ fontSize: "clamp(0.75rem, 2.5vw, 0.85rem)", opacity: 0.9 }}>Worldwide Shipping</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "5rem 1.5rem",
          width: "100%"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
            gap: "1rem",
            width: "100%"
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 4vw, 1.85rem)",
                fontWeight: 800,
                color: "#111827",
                margin: "0 0 0.4rem",
                letterSpacing: "-0.02em",
              }}
            >
              Featured Products
            </h2>
            <p style={{ color: "#6b7280", fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)", margin: 0 }}>
              Quality products from around the world
            </p>
          </div>
          <Link
            href="/products"
            style={{
              color: "#16a34a",
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              transition: "gap 0.2s",
            }}
          >
            View All Products
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
            <div style={{
              width: "60px",
              height: "60px",
              border: "4px solid #e5e7eb",
              borderTop: "4px solid #16a34a",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem"
            }} />
            <p>Loading products...</p>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}} />
          </div>
        ) : products.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
              width: "100%"
            }}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={parseInt(product.id)}
                name={product.title}
                price={`$${product.selling_price.toFixed(2)}`}
                image={product.image_url}
                type="cj"
              />
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: "center", 
            padding: "3rem",
            color: "#6b7280",
            background: "#f9fafb",
            borderRadius: "16px",
            border: "2px dashed #e5e7eb"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
            <p style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.5rem", color: "#111827" }}>
              No products available yet
            </p>
            <p style={{ fontSize: "0.9rem" }}>
              Products will appear here once the admin imports them from CJDropShipping
            </p>
          </div>
        )}
      </section>

      {/* Trust Banner */}
      <section
        style={{
          background: "#f0fdf4",
          borderTop: "1px solid #bbf7d0",
          borderBottom: "1px solid #bbf7d0",
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden"
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "3rem 1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
            gap: "2rem",
            textAlign: "center",
            width: "100%"
          }}
        >
          {[
            { icon: "🚚", title: "Fast Delivery", desc: "7-15 business days" },
            { icon: "🛡️", title: "Secure Shopping", desc: "100% protected" },
            { icon: "💬", title: "24/7 Support", desc: "Email support" },
            { icon: "🌍", title: "Global Products", desc: "Worldwide shipping" },
          ].map((item) => (
            <div key={item.title} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.8rem" }}>{item.icon}</span>
              <h4 style={{ fontWeight: 700, color: "#111827", margin: 0, fontSize: "0.95rem" }}>
                {item.title}
              </h4>
              <p style={{ color: "#6b7280", margin: 0, fontSize: "0.8rem" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

