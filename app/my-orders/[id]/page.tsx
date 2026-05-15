"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";
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
  updated_at: string;
  products?: {
    title: string;
    description: string;
    image_url: string;
    category: string;
    product_type: string;
  };
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndLoadOrder();
  }, [orderId]);

  const checkAuthAndLoadOrder = async () => {
    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("Please login to view order details");
        router.push("/login");
        return;
      }

      // Load order
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            title,
            description,
            image_url,
            category,
            product_type
          )
        `)
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      if (!data) {
        alert("Order not found");
        router.push("/my-orders");
        return;
      }

      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
      alert('Failed to load order details');
      router.push("/my-orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; icon: string; label: string }> = {
      pending: { bg: '#fef3c7', text: '#92400e', icon: '⏳', label: 'Order Pending' },
      processing: { bg: '#dbeafe', text: '#1e40af', icon: '⚙️', label: 'Processing' },
      shipped: { bg: '#e0e7ff', text: '#4338ca', icon: '🚚', label: 'Shipped' },
      delivered: { bg: '#dcfce7', text: '#166534', icon: '✓', label: 'Delivered' },
      cancelled: { bg: '#fee2e2', text: '#991b1b', icon: '✗', label: 'Cancelled' }
    };
    return statusMap[status] || { bg: '#f3f4f6', text: '#374151', icon: '📦', label: status };
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

  const statusInfo = getStatusInfo(order.order_status);

  return (
    <div style={{ minHeight: "100vh", paddingTop: "60px", background: "#f9fafb" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Back Button */}
        <Link href="/my-orders" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "#16a34a",
          fontWeight: 600,
          textDecoration: "none",
          marginBottom: "1.5rem",
          transition: "all 0.2s"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.gap = "0.75rem";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.gap = "0.5rem";
        }}>
          ← Back to My Orders
        </Link>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#111827", marginBottom: "0.5rem" }}>
            Order Details
          </h1>
          <p style={{ fontSize: "1rem", color: "#6b7280", fontFamily: "monospace" }}>
            Order ID: {order.id}
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem"
        }}>
          {/* Left Column - Product & Status */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Product Card */}
            <div style={{
              background: "#ffffff",
              padding: "1.5rem",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
            }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
                Product Information
              </h2>

              {order.products && (
                <>
                  {order.products.image_url && (
                    <div style={{
                      width: "100%",
                      height: "250px",
                      background: "#f9fafb",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.5rem",
                      overflow: "hidden"
                    }}>
                      <img
                        src={order.products.image_url}
                        alt={order.products.title}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain"
                        }}
                      />
                    </div>
                  )}

                  <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "0.75rem" }}>
                    {order.products.title}
                  </h3>

                  {order.products.description && (
                    <p style={{ fontSize: "0.95rem", color: "#6b7280", marginBottom: "1rem", lineHeight: "1.6" }}>
                      {order.products.description}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                    <span style={{
                      padding: "0.5rem 1rem",
                      background: "#f0fdf4",
                      color: "#166534",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      fontWeight: 600
                    }}>
                      {order.products.category}
                    </span>
                    <span style={{
                      padding: "0.5rem 1rem",
                      background: order.products.product_type === 'local' ? '#dcfce7' : '#dbeafe',
                      color: order.products.product_type === 'local' ? '#166534' : '#1e40af',
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      fontWeight: 600
                    }}>
                      {order.products.product_type === 'local' ? '🇳🇬 Local' : '🌍 Global'}
                    </span>
                  </div>

                  <div style={{
                    padding: "1.25rem",
                    background: "#f0fdf4",
                    borderRadius: "12px",
                    border: "2px solid #bbf7d0"
                  }}>
                    <p style={{ fontSize: "0.9rem", color: "#166534", marginBottom: "0.25rem" }}>Total Amount</p>
                    <p style={{ fontSize: "2.5rem", fontWeight: 900, color: "#16a34a", margin: 0 }}>
                      ${Number(order.amount_paid).toFixed(2)}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Order Status Timeline */}
            <div style={{
              background: "#ffffff",
              padding: "1.5rem",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
            }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
                Order Status
              </h2>

              <div style={{
                padding: "1.5rem",
                background: statusInfo.bg,
                borderRadius: "12px",
                border: `2px solid ${statusInfo.text}40`,
                textAlign: "center",
                marginBottom: "1.5rem"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{statusInfo.icon}</div>
                <p style={{ fontSize: "1.5rem", fontWeight: 700, color: statusInfo.text, margin: 0 }}>
                  {statusInfo.label}
                </p>
              </div>

              {/* Status Timeline */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => {
                  const isCompleted = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.order_status) >= index;
                  const isCurrent = order.order_status === status;
                  
                  return (
                    <div key={status} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: isCompleted ? '#16a34a' : '#e5e7eb',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        color: isCompleted ? '#ffffff' : '#9ca3af',
                        fontSize: "1.1rem",
                        flexShrink: 0
                      }}>
                        {isCompleted ? '✓' : index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontSize: "1rem",
                          fontWeight: isCurrent ? 700 : 600,
                          color: isCompleted ? '#111827' : '#9ca3af',
                          margin: 0,
                          textTransform: "capitalize"
                        }}>
                          {status}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Delivery & Payment */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Delivery Information */}
            <div style={{
              background: "#ffffff",
              padding: "1.5rem",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
            }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
                Delivery Information
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>Customer Name</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                    {order.customer_name}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>Phone Number</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                    {order.customer_phone}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>Delivery Address</p>
                  <p style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "#111827",
                    margin: 0,
                    lineHeight: "1.6",
                    padding: "1rem",
                    background: "#f9fafb",
                    borderRadius: "8px"
                  }}>
                    {order.customer_address}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div style={{
              background: "#ffffff",
              padding: "1.5rem",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
            }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
                Payment Information
              </h2>

              <div style={{
                padding: "1.25rem",
                background: order.payment_status === 'paid' ? '#dcfce7' : '#fef3c7',
                borderRadius: "12px",
                border: `2px solid ${order.payment_status === 'paid' ? '#bbf7d0' : '#fde047'}`,
                marginBottom: "1.5rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "2rem" }}>
                    {order.payment_status === 'paid' ? '💳' : '⏳'}
                  </span>
                  <p style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: order.payment_status === 'paid' ? '#166534' : '#92400e',
                    margin: 0,
                    textTransform: "capitalize"
                  }}>
                    {order.payment_status}
                  </p>
                </div>
                <p style={{
                  fontSize: "0.9rem",
                  color: order.payment_status === 'paid' ? '#166534' : '#92400e',
                  margin: 0
                }}>
                  {order.payment_status === 'paid' 
                    ? 'Payment has been received' 
                    : 'Payment will be collected upon delivery'}
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6b7280" }}>Subtotal</span>
                  <span style={{ fontWeight: 600, color: "#111827" }}>
                    ${Number(order.amount_paid).toFixed(2)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6b7280" }}>Delivery Fee</span>
                  <span style={{ fontWeight: 600, color: "#16a34a" }}>FREE</span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "0.75rem",
                  borderTop: "2px solid #e5e7eb"
                }}>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>Total</span>
                  <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#16a34a" }}>
                    ${Number(order.amount_paid).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Dates */}
            <div style={{
              background: "#ffffff",
              padding: "1.5rem",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
            }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
                Order Timeline
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Order Placed</p>
                  <p style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                    {new Date(order.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Last Updated</p>
                  <p style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                    {new Date(order.updated_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
