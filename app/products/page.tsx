"use client";

import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

export default function ProductsPage() {
  const [filter, setFilter] = useState<"all" | "local" | "cj">("all");

  const displayedProducts = products.filter(
    (product) => filter === "all" || product.type === filter
  );

  return (
    <section
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "3rem 1.5rem 5rem",
        position: "relative"
      }}
    >
      {/* Page Header */}
      <div
        className="animate-fade-in-up"
        style={{
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 800,
            color: "#111827",
            margin: "0 0 0.75rem",
            letterSpacing: "-0.02em",
          }}
        >
          Our Product Collection
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: "1.05rem",
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Explore quality products from our store and exclusive deals from trusted partners.
        </p>
      </div>

      {/* Dynamic Filter Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.8rem",
          marginBottom: "3rem",
          flexWrap: "wrap",
          position: "sticky",
          top: "72px",
          zIndex: 40,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          padding: "1rem 0"
        }}
      >
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "0.5rem 1.4rem",
            borderRadius: "9999px",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
            background: filter === "all" ? "#374151" : "#f3f4f6",
            color: filter === "all" ? "#fff" : "#4b5563",
            border: "none",
            boxShadow: filter === "all" ? "0 4px 10px rgba(0,0,0,0.15)" : "none"
          }}
        >
          🏷️ All Products
        </button>
        <button
          onClick={() => setFilter("local")}
          style={{
            padding: "0.5rem 1.4rem",
            borderRadius: "9999px",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
            background: filter === "local" ? "#16a34a" : "#f0fdf4",
            color: filter === "local" ? "#fff" : "#166534",
            border: filter === "local" ? "none" : "1px solid #bbf7d0",
            boxShadow: filter === "local" ? "0 4px 15px rgba(22,163,74,0.3)" : "none"
          }}
        >
          🇳🇬 Local Deals
        </button>
        <button
          onClick={() => setFilter("cj")}
          style={{
            padding: "0.5rem 1.4rem",
            borderRadius: "9999px",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
            background: filter === "cj" ? "#f97316" : "#fff7ed",
            color: filter === "cj" ? "#fff" : "#9a3412",
            border: filter === "cj" ? "none" : "1px solid #fed7aa",
            boxShadow: filter === "cj" ? "0 4px 15px rgba(249,115,22,0.3)" : "none"
          }}
        >
          🌍 Global Deals
        </button>
      </div>

      {/* Products Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "2rem",
        }}
      >
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            type={product.type}
            description={product.description}
          />
        ))}
      </div>
    </section>
  );
}
