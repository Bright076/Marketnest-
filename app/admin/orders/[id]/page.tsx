"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface OrderDetails {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  amount_paid: number;
  payment_status: string;
  order_status: string;
  created_at: string;
  products?: {
    id: string;
    title: string;
    image_url: string;
    selling_price: number;
    category: string;
  };
  profiles?: {
    full_name: string;
    email: string;
    phone: string;
  };
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (*),
          profiles (*)
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
      alert('Failed to load order');
      router.push('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (field: 'order_status' | 'payment_status', value: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ [field]: value })
        .eq('id', orderId);

      if (error) throw error;

      setOrder(prev => prev ? { ...prev, [field]: value } : null);
      alert('Status updated successfully!');
    } catch (error: any) {
      console.error('Error updating status:', error);
      alert('Failed to update status: ' + error.message);
    }
  };

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
        <p style={{ color: "#6b7280" }}>Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      pending: { bg: '#fef3c7', text: '#92400e' },
      processing: { bg: '#dbeafe', text: '#1e40af' },
      shipped: { bg: '#e0e7ff', text: '#4338ca' },
      delivered: { bg: '#dcfce7', text: '#166534' },
      cancelled: { bg: '#fee2e2', text: '#991b1b' },
      paid: { bg: '#dcfce7', text: '#166534' },
      failed: { bg: '#fee2e2', text: '#991b1b' }
    };
    return colors[status] || { bg: '#f3f4f6', text: '#374151' };
  };

  const orderStatusColor = getStatusColor(order.order_status);
  const paymentStatusColor = getStatusColor(order.payment_status);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/admin/orders" style={{
          color: "#16a34a",
          fontWeight: 600,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem"
        }}>
          ← Back to Orders
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
          Order Details
        </h1>
        <p style={{ color: "#6b7280", fontFamily: "monospace" }}>
          Order ID: {order.id}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {/* Customer Information */}
        <div style={{
          background: "#ffffff",
          padding: "1.5rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb"
        }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
            👤 Customer Information
          </h2>
          
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Name</div>
            <div style={{ fontWeight: 600, color: "#111827" }}>{order.customer_name}</div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Phone</div>
            <div style={{ fontWeight: 600, color: "#111827" }}>{order.customer_phone}</div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Address</div>
            <div style={{ fontWeight: 600, color: "#111827" }}>{order.customer_address}</div>
          </div>

          {order.profiles && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Email</div>
                <div style={{ fontWeight: 600, color: "#111827" }}>{order.profiles.email}</div>
              </div>
            </>
          )}

          <div>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Order Date</div>
            <div style={{ fontWeight: 600, color: "#111827" }}>
              {new Date(order.created_at).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div style={{
          background: "#ffffff",
          padding: "1.5rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb"
        }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
            📦 Product Information
          </h2>

          {order.products ? (
            <>
              {order.products.image_url && (
                <div style={{ marginBottom: "1rem", textAlign: "center" }}>
                  <img
                    src={order.products.image_url}
                    alt={order.products.title}
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      objectFit: "contain",
                      borderRadius: "12px"
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Product Name</div>
                <div style={{ fontWeight: 600, color: "#111827" }}>{order.products.title}</div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Category</div>
                <div style={{ fontWeight: 600, color: "#111827" }}>{order.products.category}</div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Price</div>
                <div style={{ fontWeight: 700, color: "#16a34a", fontSize: "1.5rem" }}>
                  ${Number(order.products.selling_price).toFixed(2)}
                </div>
              </div>
            </>
          ) : (
            <p style={{ color: "#6b7280" }}>Product information not available</p>
          )}
        </div>

        {/* Order Status */}
        <div style={{
          background: "#ffffff",
          padding: "1.5rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb"
        }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
            📊 Order Status
          </h2>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "0.5rem"
            }}>
              Order Status
            </label>
            <select
              value={order.order_status}
              onChange={(e) => updateStatus('order_status', e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "2px solid #e5e7eb",
                fontSize: "1rem",
                fontWeight: 600,
                background: orderStatusColor.bg,
                color: orderStatusColor.text,
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "0.5rem"
            }}>
              Payment Status
            </label>
            <select
              value={order.payment_status}
              onChange={(e) => updateStatus('payment_status', e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "2px solid #e5e7eb",
                fontSize: "1rem",
                fontWeight: 600,
                background: paymentStatusColor.bg,
                color: paymentStatusColor.text,
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div style={{
            padding: "1rem",
            background: "#f0fdf4",
            borderRadius: "12px",
            border: "2px solid #bbf7d0"
          }}>
            <div style={{ fontSize: "0.85rem", color: "#166534", marginBottom: "0.25rem" }}>
              Total Amount
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#16a34a" }}>
              ${Number(order.amount_paid).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
