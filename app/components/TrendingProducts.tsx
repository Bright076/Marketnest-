"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "./ProductCard";

interface TrendingProduct {
  id: string;
  title: string;
  selling_price: number;
  image_url: string;
  stock: number;
  category: string;
  product_type: string;
  description?: string;
  is_deal: boolean;
  deal_price?: number;
  deal_ends_at?: string;
  original_price?: number;
}

export default function TrendingProducts() {
  const [products, setProducts] = useState<TrendingProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingProducts();
  }, []);

  const loadTrendingProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_trending', true)
        .gt('stock', 0)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading trending products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "3rem 1.5rem",
        width: "100%"
      }}>
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #16a34a",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem"
          }} />
          <p>Loading trending products...</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "3rem 1.5rem",
        width: "100%"
      }}>
        <h2 style={{
          fontSize: "clamp(1.5rem, 4vw, 1.85rem)",
          fontWeight: 800,
          color: "#111827",
          marginBottom: "2rem",
          letterSpacing: "-0.02em",
        }}>
          🔥 Trending Products
        </h2>
        
        <div style={{
          textAlign: "center",
          padding: "3rem 2rem",
          background: "#f0fdf4",
          borderRadius: "16px",
          border: "2px dashed #bbf7d0"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📈</div>
          <h3 style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "0.5rem"
          }}>
            Nothing trending yet
          </h3>
          <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
            Check back soon to see what's popular on MarketNest!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "3rem 1.5rem",
      width: "100%"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "2.5rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div>
          <h2 style={{
            fontSize: "clamp(1.5rem, 4vw, 1.85rem)",
            fontWeight: 800,
            color: "#111827",
            margin: "0 0 0.4rem",
            letterSpacing: "-0.02em",
          }}>
            🔥 Trending Products
          </h2>
          <p style={{ color: "#6b7280", fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)", margin: 0 }}>
            Most popular products right now
          </p>
        </div>
        {/* Trending badge */}
        <div style={{
          padding: "0.5rem 1rem",
          background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
          color: "#ffffff",
          borderRadius: "12px",
          fontSize: "0.85rem",
          fontWeight: 700,
          boxShadow: "0 4px 12px rgba(22, 163, 74, 0.2)"
        }}>
          {products.length} Trending {products.length === 1 ? 'Item' : 'Items'}
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1.5rem",
        width: "100%"
      }}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.title}
            price={`${product.selling_price.toFixed(2)}`}
            image={product.image_url}
            type={product.product_type as "local" | "cj"}
            description={product.description}
            category={product.category}
            is_deal={product.is_deal}
            deal_price={product.deal_price}
            deal_ends_at={product.deal_ends_at}
            original_price={product.original_price}
          />
        ))}
      </div>
    </section>
  );
}
