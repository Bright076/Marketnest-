"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  image_url: string;
  selling_price: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const quantity = parseInt(searchParams.get('quantity') || '1');

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: ""
  });

  useEffect(() => {
    checkAuthAndLoadProduct();
  }, [productId]);

  const checkAuthAndLoadProduct = async () => {
    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("Please login to checkout");
        router.push("/login");
        return;
      }

      // Load user profile to pre-fill form
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFormData({
          customer_name: profile.full_name || "",
          customer_phone: profile.phone || "",
          customer_address: ""
        });
      }

      // Load product
      if (productId) {
        const { data, error } = await supabase
          .from('products')
          .select('id, title, image_url, selling_price')
          .eq('id', productId)
          .single();

        if (error) throw error;
        setProduct(data);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load checkout');
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !product) {
        throw new Error("Missing user or product");
      }

      const totalAmount = Number(product.selling_price) * quantity;

      // Create order
      const { data: order, error } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            product_id: product.id,
            customer_name: formData.customer_name,
            customer_phone: formData.customer_phone,
            customer_address: formData.customer_address,
            amount_paid: totalAmount,
            payment_status: 'pending',
            order_status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Update product stock (reduce by quantity ordered)
      const { data: currentProduct } = await supabase
        .from('products')
        .select('stock')
        .eq('id', product.id)
        .single();

      if (currentProduct && currentProduct.stock > 0) {
        const newStock = Math.max(0, currentProduct.stock - quantity);
        await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', product.id);
      }

      // Redirect to success page
      router.push(`/orders/success?order=${order.id}`);
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert('Failed to create order: ' + error.message);
    } finally {
      setSubmitting(false);
    }
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
          <p style={{ color: "#6b7280" }}>Loading checkout...</p>
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

  const totalAmount = Number(product.selling_price) * quantity;

  return (
    <div style={{ minHeight: "100vh", paddingTop: "60px", background: "#f9fafb" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#111827", marginBottom: "2rem" }}>
          Checkout
        </h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem"
        }}>
          {/* Order Form */}
          <div style={{
            background: "#ffffff",
            padding: "2rem",
            borderRadius: "16px",
            border: "1px solid #e5e7eb"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
              Delivery Information
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none"
                  }}
                />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none"
                  }}
                />
              </div>

              {/* Address */}
              <div style={{ marginBottom: "2rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  Delivery Address *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.customer_address}
                  onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                  placeholder="Enter your full delivery address"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    resize: "vertical"
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: submitting ? "#9ca3af" : "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  boxShadow: submitting ? "none" : "0 4px 12px rgba(22, 163, 74, 0.3)"
                }}
              >
                {submitting ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div style={{
            background: "#ffffff",
            padding: "2rem",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            height: "fit-content"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
              Order Summary
            </h2>

            {/* Product Info */}
            <div style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1.5rem",
              padding: "1rem",
              background: "#f9fafb",
              borderRadius: "12px"
            }}>
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.title}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                    borderRadius: "8px"
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
                  {product.title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                  Quantity: {quantity}
                </p>
                <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "#16a34a", marginTop: "0.5rem" }}>
                  ${Number(product.selling_price).toFixed(2)} each
                </p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div style={{ borderTop: "2px solid #e5e7eb", paddingTop: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ color: "#6b7280" }}>Subtotal</span>
                <span style={{ fontWeight: 600, color: "#111827" }}>${totalAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <span style={{ color: "#6b7280" }}>Delivery</span>
                <span style={{ fontWeight: 600, color: "#16a34a" }}>FREE</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1rem",
                background: "#f0fdf4",
                borderRadius: "8px",
                border: "2px solid #bbf7d0"
              }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#166534" }}>Total</span>
                <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#16a34a" }}>
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Info */}
            <div style={{
              marginTop: "1.5rem",
              padding: "1rem",
              background: "#fef3c7",
              borderRadius: "8px",
              border: "1px solid #fde047"
            }}>
              <p style={{ fontSize: "0.85rem", color: "#92400e", margin: 0 }}>
                💳 Payment will be collected upon delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
