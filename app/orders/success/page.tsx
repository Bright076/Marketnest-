"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  amount_paid: number;
  order_status: string;
  payment_status: string;
  created_at: string;
  products?: {
    title: string;
    image_url: string;
  };
}

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    } else {
      router.push('/');
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            title,
            image_url
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
      alert('Failed to load order details');
      router.push('/');
    } finally {
      setLoading(false);
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
          <p style={{ color: "#6b7280" }}>Loading order details...</p>
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

  if (!order) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", paddingTop: "60px", background: "#f9fafb" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Success Animation */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "100px",
            height: "100px",
            background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            boxShadow: "0 8px 24px rgba(22, 163, 74, 0.3)",
            animation: "scaleIn 0.5s ease-out"
          }}>
            <span style={{ fontSize: "3rem" }}>✓</span>
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#111827", marginBottom: "0.5rem" }}>
            Order Placed Successfully!
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#6b7280" }}>
            Thank you for your order, {order.customer_name}
          </p>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scaleIn {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}} />

        {/* Order Details Card */}
        <div style={{
          background: "#ffffff",
          padding: "2rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          marginBottom: "1.5rem",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
            Order Details
          </h2>

          {/* Order ID */}
          <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#f9fafb", borderRadius: "8px" }}>
            <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Order ID</p>
            <p style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", fontFamily: "monospace", margin: 0 }}>
              {order.id}
            </p>
          </div>

          {/* Product Info */}
          {order.products && (
            <div style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1.5rem",
              padding: "1rem",
              background: "#f9fafb",
              borderRadius: "12px"
            }}>
              {order.products.image_url && (
                <img
                  src={order.products.image_url}
                  alt={order.products.title}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                    borderRadius: "8px"
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
                  {order.products.title}
                </h3>
                <p style={{ fontSize: "1.5rem", fontWeight: 900, color: "#16a34a", margin: 0 }}>
                  ${Number(order.amount_paid).toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Delivery Info */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: "1rem" }}>
              Delivery Information
            </h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <div>
                <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Name</p>
                <p style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                  {order.customer_name}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Phone</p>
                <p style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                  {order.customer_phone}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Address</p>
                <p style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                  {order.customer_address}
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem"
          }}>
            <div style={{
              padding: "1rem",
              background: "#fef3c7",
              borderRadius: "8px",
              border: "1px solid #fde047"
            }}>
              <p style={{ fontSize: "0.85rem", color: "#92400e", marginBottom: "0.25rem" }}>Order Status</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#92400e", margin: 0, textTransform: "capitalize" }}>
                {order.order_status}
              </p>
            </div>
            <div style={{
              padding: "1rem",
              background: "#fef3c7",
              borderRadius: "8px",
              border: "1px solid #fde047"
            }}>
              <p style={{ fontSize: "0.85rem", color: "#92400e", marginBottom: "0.25rem" }}>Payment Status</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#92400e", margin: 0, textTransform: "capitalize" }}>
                {order.payment_status}
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div style={{
          background: "#f0fdf4",
          padding: "1.5rem",
          borderRadius: "12px",
          border: "1px solid #bbf7d0",
          marginBottom: "1.5rem"
        }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#166534", marginBottom: "0.75rem" }}>
            📦 What's Next?
          </h3>
          <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#166534", lineHeight: "1.8" }}>
            <li>We'll process your order within 24 hours</li>
            <li>You'll receive a confirmation call shortly</li>
            <li>Payment will be collected upon delivery</li>
            <li>Track your order status in "My Orders"</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem"
        }}>
          <Link href="/my-orders" style={{
            padding: "1rem",
            background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: 700,
            textDecoration: "none",
            textAlign: "center",
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
            View My Orders
          </Link>
          <Link href="/products" style={{
            padding: "1rem",
            background: "#ffffff",
            color: "#16a34a",
            border: "2px solid #16a34a",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: 700,
            textDecoration: "none",
            textAlign: "center",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f0fdf4";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
          }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
