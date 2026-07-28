"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "../components/ProductCard";

interface Product {
  id: string;
  title: string;
  description: string;
  image_url: string;
  selling_price: number;
  category: string;
  stock: number;
  product_type: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "60px",
            height: "60px",
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #16a34a",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem"
          }} />
          <p style={{ color: "#6b7280" }}>Loading products...</p>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  return (
    <section style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "3rem 1.5rem 5rem",
      position: "relative"
    }}>
      {/* Page Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "2rem"
      }}>
        <h1 style={{
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
          fontWeight: 800,
          color: "#111827",
          margin: "0 0 0.75rem",
          letterSpacing: "-0.02em"
        }}>
          All Products
        </h1>
        <p style={{
          color: "#6b7280",
          fontSize: "1.05rem",
          maxWidth: "520px",
          margin: "0 auto 1.5rem",
          lineHeight: 1.6
        }}>
          Browse our collection of quality international products
        </p>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "0.75rem 1rem",
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            fontSize: "1rem",
            outline: "none",
            transition: "all 0.2s"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#16a34a";
            e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e5e7eb";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{
          background: "#ffffff",
          padding: "4rem 2rem",
          borderRadius: "16px",
          border: "2px dashed #e5e7eb",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📦</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
            {searchQuery ? "No products found" : "No products available yet"}
          </h3>
          <p style={{ color: "#6b7280" }}>
            {searchQuery ? "Try adjusting your search" : "Products will appear here once the admin imports them"}
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.75rem"
        }}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={parseInt(product.id)}
              name={product.title}
              price={`$${product.selling_price.toFixed(2)}`}
              image={product.image_url}
              type="cj"
              description={product.description}
            />
          ))}
        </div>
      )}
    </section>
  );
}
