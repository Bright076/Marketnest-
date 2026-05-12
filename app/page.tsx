"use client";

import { useState } from "react";
import HeroSection from "./components/HeroSection";
import ProductCard from "./components/ProductCard";
import CategoryBar from "./components/CategoryBar";
import { products } from "./data/products";
import Link from "next/link";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter products based on selected category
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <>
      <CategoryBar 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory}
      />
      <HeroSection />

      {/* Featured Products Section */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "5rem 1.5rem",
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
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.85rem",
                fontWeight: 800,
                color: "#111827",
                margin: "0 0 0.4rem",
                letterSpacing: "-0.02em",
              }}
            >
              Featured Products
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.95rem", margin: 0 }}>
              Hand-picked products just for you
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.75rem",
          }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                type={product.type}
              />
            ))
          ) : (
            <div style={{ 
              gridColumn: "1 / -1", 
              textAlign: "center", 
              padding: "3rem",
              color: "#6b7280"
            }}>
              <p style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                No products found in this category
              </p>
              <p style={{ fontSize: "0.9rem" }}>
                Try selecting a different category or view all products
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Trust Banner */}
      <section
        style={{
          background: "#f0fdf4",
          borderTop: "1px solid #bbf7d0",
          borderBottom: "1px solid #bbf7d0",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "3rem 1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            textAlign: "center",
          }}
        >
          {[
            { icon: "🚚", title: "Fast Delivery", desc: "1–2 business days" },
            { icon: "🛡️", title: "Secure Shopping", desc: "100% protected" },
            { icon: "💬", title: "24/7 Support", desc: "WhatsApp & Email" },
            { icon: "↩️", title: "Easy Returns", desc: "30-day policy" },
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

