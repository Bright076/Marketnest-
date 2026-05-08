import ProductCard from "../../components/ProductCard";
import { products } from "../../data/products";

export default function LocalProductsPage() {
  const localProducts = products.filter((p) => p.type === "local");

  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
      <div className="animate-fade-in-up" style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, color: "#16a34a", margin: "0 0 0.75rem", letterSpacing: "-0.02em" }}>
          Local Deals 🇳🇬
        </h1>
        <p style={{ color: "#6b7280", fontSize: "1.05rem", maxWidth: "520px", margin: "0 auto", lineHeight: 1.6 }}>
          Explore our exclusively curated local items with fast delivery and pay-on-delivery options.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "2rem" }}>
        {localProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
