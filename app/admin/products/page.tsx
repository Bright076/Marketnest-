"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  title: string;
  selling_price: number;
  category: string;
  stock: number;
  product_type: string;
  image_url: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "local" | "cj">("all");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setDeleting(id);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== id));
      alert('Product deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product: ' + error.message);
    } finally {
      setDeleting(null);
    }
  };

  const filteredProducts = products.filter(product => {
    if (filter === "all") return true;
    return product.product_type === filter;
  });

  const localProducts = products.filter(p => p.product_type === 'local');
  const cjProducts = products.filter(p => p.product_type === 'cj');

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
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
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
            Products Management
          </h1>
          <p style={{ color: "#6b7280" }}>
            Manage local and international products
          </p>
        </div>
        <Link href="/admin/products/add" style={{
          padding: "0.75rem 1.5rem",
          background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
          color: "#ffffff",
          borderRadius: "12px",
          fontWeight: 600,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)",
          transition: "all 0.2s"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.3)";
        }}>
          <span>➕</span> Add Product
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: "flex",
        gap: "0.5rem",
        marginBottom: "2rem",
        background: "#ffffff",
        padding: "0.5rem",
        borderRadius: "12px",
        border: "1px solid #e5e7eb"
      }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            background: filter === "all" ? "linear-gradient(135deg, #16a34a 0%, #059669 100%)" : "transparent",
            color: filter === "all" ? "#ffffff" : "#6b7280",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          All Products ({products.length})
        </button>
        <button
          onClick={() => setFilter("local")}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            background: filter === "local" ? "linear-gradient(135deg, #16a34a 0%, #059669 100%)" : "transparent",
            color: filter === "local" ? "#ffffff" : "#6b7280",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          🇳🇬 Local Products ({localProducts.length})
        </button>
        <button
          onClick={() => setFilter("cj")}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            background: filter === "cj" ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)" : "transparent",
            color: filter === "cj" ? "#ffffff" : "#6b7280",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          🌍 CJ Products ({cjProducts.length})
        </button>
      </div>

      {/* Info Boxes */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        <div style={{
          background: "#f0fdf4",
          padding: "1.5rem",
          borderRadius: "12px",
          border: "2px solid #bbf7d0"
        }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#166534", marginBottom: "0.5rem" }}>
            🇳🇬 Local Products
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#166534", margin: 0 }}>
            Manually added, manually priced, WhatsApp orders. Full CRUD control.
          </p>
        </div>
        <div style={{
          background: "#fff7ed",
          padding: "1.5rem",
          borderRadius: "12px",
          border: "2px solid #fed7aa"
        }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#9a3412", marginBottom: "0.5rem" }}>
            🌍 CJ Products
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#9a3412", margin: 0 }}>
            From CJDropShipping API, auto-priced with markup, cart checkout system.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{
          background: "#ffffff",
          padding: "4rem 2rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📦</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
            No {filter === "all" ? "" : filter === "local" ? "local" : "CJ"} products yet
          </h3>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
            {filter === "local" || filter === "all" 
              ? "Get started by adding your first product" 
              : "CJ products will appear here when fetched from the API"}
          </p>
          {(filter === "local" || filter === "all") && (
            <Link href="/admin/products/add" style={{
              padding: "0.75rem 1.5rem",
              background: "#16a34a",
              color: "#ffffff",
              borderRadius: "12px",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-block"
            }}>
              Add Product
            </Link>
          )}
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem"
        }}>
          {filteredProducts.map((product) => (
            <div key={product.id} style={{
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
              e.currentTarget.style.transform = "translateY(0)";
            }}>
              {/* Product Image */}
              <div style={{
                height: "200px",
                background: "#f9fafb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
              }}>
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain"
                    }}
                  />
                ) : (
                  <span style={{ fontSize: "4rem" }}>📦</span>
                )}
                <div style={{
                  position: "absolute",
                  top: "0.75rem",
                  right: "0.75rem",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  background: product.product_type === 'local' ? '#dcfce7' : '#dbeafe',
                  color: product.product_type === 'local' ? '#166534' : '#1e40af'
                }}>
                  {product.product_type === 'local' ? '🇳🇬 Local' : '🌍 CJ'}
                </div>
              </div>

              {/* Product Info */}
              <div style={{ padding: "1.25rem" }}>
                <h3 style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: "0.5rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}>
                  {product.title}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#16a34a" }}>
                    ${Number(product.selling_price).toFixed(2)}
                  </span>
                  <span style={{
                    padding: "0.25rem 0.5rem",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    background: product.stock > 0 ? '#dcfce7' : '#fef2f2',
                    color: product.stock > 0 ? '#166534' : '#dc2626'
                  }}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "1rem" }}>
                  {product.category}
                </p>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {product.product_type === 'local' ? (
                    <>
                      <Link href={`/admin/products/edit/${product.id}`} style={{
                        flex: 1,
                        padding: "0.625rem",
                        background: "#f0fdf4",
                        color: "#16a34a",
                        border: "1px solid #bbf7d0",
                        borderRadius: "8px",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        textDecoration: "none",
                        textAlign: "center",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#16a34a";
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#f0fdf4";
                        e.currentTarget.style.color = "#16a34a";
                      }}>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.title)}
                        disabled={deleting === product.id}
                        style={{
                          flex: 1,
                          padding: "0.625rem",
                          background: "#fef2f2",
                          color: "#dc2626",
                          border: "1px solid #fecaca",
                          borderRadius: "8px",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          cursor: deleting === product.id ? "not-allowed" : "pointer",
                          transition: "all 0.2s",
                          opacity: deleting === product.id ? 0.5 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (deleting !== product.id) {
                            e.currentTarget.style.background = "#dc2626";
                            e.currentTarget.style.color = "#ffffff";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (deleting !== product.id) {
                            e.currentTarget.style.background = "#fef2f2";
                            e.currentTarget.style.color = "#dc2626";
                          }
                        }}
                      >
                        {deleting === product.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </>
                  ) : (
                    <div style={{
                      width: "100%",
                      padding: "0.625rem",
                      background: "#fff7ed",
                      color: "#9a3412",
                      border: "1px solid #fed7aa",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      textAlign: "center"
                    }}>
                      CJ Product (View Only)
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
