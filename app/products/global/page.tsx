import ProductCard from "../../components/ProductCard";
import { products } from "../../data/products";

export default function GlobalProductsPage() {
  const globalProducts = products.filter((p) => p.type === "cj");

  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
      <div className="animate-fade-in-up" style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, color: "#f97316", margin: "0 0 0.75rem", letterSpacing: "-0.02em" }}>
          Global Deals 🌍
        </h1>
        <p style={{ color: "#6b7280", fontSize: "1.05rem", maxWidth: "520px", margin: "0 auto", lineHeight: 1.6 }}>
          Shop premium imported gadgets, accessories, and home items at unbeatable prices.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "2rem" }}>
        {globalProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
