"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
      alert('Product not found');
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      if (confirm("You need to login to purchase. Would you like to login now?")) {
        router.push("/login");
      }
      return;
    }

    // Redirect to checkout with product info
    router.push(`/checkout?product=${productId}&quantity=${quantity}`);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", paddingTop: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
          <p style={{ color: "#6b7280" }}>Loading product...</p>
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

  if (!product) {
    return null;
  }

  const totalPrice = Number(product.selling_price) * quantity;

  return (
    <div style={{ minHeight: "100vh", paddingTop: "60px", background: "#f9fafb" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Back Button */}
        <Link href="/products" style={{
          color: "#16a34a",
          fontWeight: 600,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "2rem"
        }}>
          ← Back to Products
        </Link>

        {/* Product Details */}
        <div style={{
          background: "#ffffff",
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "3rem",
            padding: "3rem"
          }}>
            {/* Product Image */}
            <div>
              <div style={{
                background: "#f9fafb",
                borderRadius: "16px",
                padding: "3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "400px",
                position: "relative"
              }}>
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "400px",
                      objectFit: "contain"
                    }}
                  />
                ) : (
                  <span style={{ fontSize: "8rem" }}>📦</span>
                )}
                <div style={{
                  position: "absolute",
                  top: "1.5rem",
                  right: "1.5rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  background: product.product_type === 'local' ? '#dcfce7' : '#dbeafe',
                  color: product.product_type === 'local' ? '#166534' : '#1e40af'
                }}>
                  {product.product_type === 'local' ? '🇳🇬 Local Product' : '🌍 Global Product'}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div style={{
                padding: "0.5rem 1rem",
                background: "#f0fdf4",
                color: "#166534",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 600,
                display: "inline-block",
                marginBottom: "1rem"
              }}>
                {product.category}
              </div>

              <h1 style={{
                fontSize: "2.5rem",
                fontWeight: 900,
                color: "#111827",
                marginBottom: "1rem",
                lineHeight: 1.2
              }}>
                {product.title}
              </h1>

              <p style={{
                fontSize: "1.1rem",
                color: "#6b7280",
                lineHeight: 1.7,
                marginBottom: "2rem"
              }}>
                {product.description || "No description available"}
              </p>

              {/* Price */}
              <div style={{
                background: "#f0fdf4",
                padding: "1.5rem",
                borderRadius: "16px",
                marginBottom: "2rem",
                border: "2px solid #bbf7d0"
              }}>
                <div style={{ fontSize: "0.9rem", color: "#166534", marginBottom: "0.5rem" }}>
                  Price
                </div>
                <div style={{ fontSize: "3rem", fontWeight: 900, color: "#16a34a" }}>
                  ${Number(product.selling_price).toFixed(2)}
                </div>
              </div>

              {/* Stock Status */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "2rem"
              }}>
                <span style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  background: product.stock > 0 ? '#dcfce7' : '#fee2e2',
                  color: product.stock > 0 ? '#166534' : '#991b1b'
                }}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <>
                  <div style={{ marginBottom: "2rem" }}>
                    <label style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: "0.75rem"
                    }}>
                      Quantity
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "8px",
                          border: "2px solid #e5e7eb",
                          background: "#ffffff",
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          color: "#374151"
                        }}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                        style={{
                          width: "80px",
                          height: "48px",
                          textAlign: "center",
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          border: "2px solid #e5e7eb",
                          borderRadius: "8px",
                          outline: "none"
                        }}
                      />
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "8px",
                          border: "2px solid #e5e7eb",
                          background: "#ffffff",
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          color: "#374151"
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div style={{
                    padding: "1rem 1.5rem",
                    background: "#f9fafb",
                    borderRadius: "12px",
                    marginBottom: "2rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span style={{ fontSize: "1rem", fontWeight: 600, color: "#6b7280" }}>
                      Total:
                    </span>
                    <span style={{ fontSize: "2rem", fontWeight: 900, color: "#16a34a" }}>
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={handleBuyNow}
                    style={{
                      width: "100%",
                      padding: "1.25rem",
                      background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      cursor: "pointer",
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
                    }}
                  >
                    🛒 Buy Now
                  </button>
                </>
              )}

              {product.stock === 0 && (
                <div style={{
                  padding: "1.5rem",
                  background: "#fee2e2",
                  border: "2px solid #fecaca",
                  borderRadius: "12px",
                  textAlign: "center"
                }}>
                  <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#991b1b", margin: 0 }}>
                    Out of Stock
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
