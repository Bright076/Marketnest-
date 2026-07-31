"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface OrderDetails {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_country: string;
  customer_state: string;
  customer_city: string;
  customer_address: string;
  customer_postal_code: string | null;
  order_notes: string | null;
  quantity: number;
  amount_paid: number;
  currency: string;
  payment_method: string;
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
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (*)
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

  const copyDeliveryAddress = () => {
    if (!order) return;

    const fullAddress = `${order.customer_name}
${order.customer_phone}
${order.customer_address}
${order.customer_city}, ${order.customer_state}
${order.customer_country}${order.customer_postal_code ? '\n' + order.customer_postal_code : ''}`;

    navigator.clipboard.writeText(fullAddress).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const sendCustomerNotification = async () => {
    if (!order) return;

    setSendingNotification(true);
    try {
      const response = await fetch('/api/customer/order-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          customerEmail: order.customer_email,
          customerName: order.customer_name,
          orderStatus: order.order_status,
          paymentStatus: order.payment_status,
          totalAmount: order.amount_paid,
          currency: order.currency,
          productTitle: order.products?.title || 'Your order'
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Customer notification sent successfully!');
      } else {
        throw new Error(result.error || 'Failed to send notification');
      }
    } catch (error: any) {
      console.error('Error sending notification:', error);
      alert('❌ Failed to send notification: ' + error.message);
    } finally {
      setSendingNotification(false);
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
              Order Details
            </h1>
            <p style={{ color: "#6b7280", fontFamily: "monospace", fontSize: "0.9rem" }}>
              Order ID: {order.id}
            </p>
          </div>
          <button
            onClick={sendCustomerNotification}
            disabled={sendingNotification}
            style={{
              padding: "0.75rem 1.5rem",
              background: sendingNotification ? "#9ca3af" : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: sendingNotification ? "not-allowed" : "pointer",
              boxShadow: sendingNotification ? "none" : "0 4px 12px rgba(59, 130, 246, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            {sendingNotification ? '⏳ Sending...' : '📧 Send Customer Notification'}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Customer Information */}
        <div style={{
          background: "#ffffff",
          padding: "1.5rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
        }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            👤 Customer Information
          </h2>
          
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Full Name</div>
            <div style={{ fontWeight: 600, color: "#111827", fontSize: "1.05rem" }}>{order.customer_name}</div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Email Address</div>
            <a href={`mailto:${order.customer_email}`} style={{ fontWeight: 600, color: "#16a34a", fontSize: "1.05rem", textDecoration: "none" }}>
              {order.customer_email}
            </a>
          </div>

          <div>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Phone Number</div>
            <a href={`tel:${order.customer_phone}`} style={{ fontWeight: 600, color: "#16a34a", fontSize: "1.05rem", textDecoration: "none" }}>
              {order.customer_phone}
            </a>
          </div>
        </div>

        {/* Delivery Information */}
        <div style={{
          background: "#ffffff",
          padding: "1.5rem",
          borderRadius: "16px",
          border: "2px solid #3b82f6",
          boxShadow: "0 2px 8px rgba(59, 130, 246, 0.15)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              🚚 Delivery Information
            </h2>
            <button
              onClick={copyDeliveryAddress}
              style={{
                padding: "0.5rem 1rem",
                background: copySuccess ? "#dcfce7" : "#f0fdf4",
                color: copySuccess ? "#166534" : "#16a34a",
                border: copySuccess ? "2px solid #86efac" : "2px solid #bbf7d0",
                borderRadius: "6px",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {copySuccess ? '✓ Copied!' : '📋 Copy Address'}
            </button>
          </div>
          
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Country</div>
            <div style={{ fontWeight: 600, color: "#111827" }}>{order.customer_country}</div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>State/Province</div>
            <div style={{ fontWeight: 600, color: "#111827" }}>{order.customer_state}</div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>City</div>
            <div style={{ fontWeight: 600, color: "#111827" }}>{order.customer_city}</div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Full Delivery Address</div>
            <div style={{ fontWeight: 600, color: "#111827", lineHeight: 1.6 }}>{order.customer_address}</div>
          </div>

          {order.customer_postal_code && (
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Postal/ZIP Code</div>
              <div style={{ fontWeight: 600, color: "#111827" }}>{order.customer_postal_code}</div>
            </div>
          )}

          {order.order_notes && (
            <div style={{
              marginTop: "1.5rem",
              padding: "1rem",
              background: "#fef3c7",
              borderRadius: "8px",
              border: "1px solid #fde047"
            }}>
              <div style={{ fontSize: "0.85rem", color: "#92400e", marginBottom: "0.5rem", fontWeight: 600 }}>📝 Order Notes</div>
              <div style={{ color: "#92400e", fontStyle: "italic", lineHeight: 1.6 }}>{order.order_notes}</div>
            </div>
          )}
        </div>

        {/* Order Information */}
        <div style={{
          background: "#ffffff",
          padding: "1.5rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
        }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            📦 Order Information
          </h2>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Order ID</div>
            <div style={{ fontWeight: 600, color: "#111827", fontFamily: "monospace", fontSize: "0.9rem" }}>{order.id}</div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Order Date</div>
            <div style={{ fontWeight: 600, color: "#111827" }}>
              {new Date(order.created_at).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Quantity</div>
            <div style={{ fontWeight: 600, color: "#111827", fontSize: "1.1rem" }}>{order.quantity || 1}</div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Currency</div>
            <div style={{ fontWeight: 600, color: "#111827" }}>{order.currency}</div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Payment Method</div>
            <div style={{ fontWeight: 600, color: "#111827", textTransform: "capitalize" }}>{order.payment_method}</div>
          </div>

          <div style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#f0fdf4",
            borderRadius: "12px",
            border: "2px solid #bbf7d0"
          }}>
            <div style={{ fontSize: "0.85rem", color: "#166534", marginBottom: "0.25rem" }}>Total Amount</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#16a34a" }}>
              ${Number(order.amount_paid).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Product Information */}
      {order.products && (
        <div style={{
          background: "#ffffff",
          padding: "1.5rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          marginBottom: "1.5rem"
        }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            🛍️ Ordered Products
          </h2>

          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
            {order.products.image_url && (
              <div style={{ flex: "0 0 auto" }}>
                <img
                  src={order.products.image_url}
                  alt={order.products.title}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "contain",
                    borderRadius: "12px",
                    border: "2px solid #e5e7eb"
                  }}
                />
              </div>
            )}

            <div style={{ flex: 1, minWidth: "250px" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "0.75rem" }}>
                {order.products.title}
              </h3>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                <div>
                  <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Category: </span>
                  <span style={{ fontWeight: 600, color: "#111827" }}>{order.products.category}</span>
                </div>
                <div>
                  <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Product ID: </span>
                  <span style={{ fontWeight: 600, color: "#111827", fontFamily: "monospace", fontSize: "0.85rem" }}>{order.products.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Management */}
      <div style={{
        background: "#ffffff",
        padding: "1.5rem",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
      }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          📊 Update Status
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          <div>
            <label style={{
              display: "block",
              fontSize: "0.9rem",
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

          <div>
            <label style={{
              display: "block",
              fontSize: "0.9rem",
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
        </div>

        <div style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "#eff6ff",
          borderRadius: "8px",
          border: "1px solid #bfdbfe"
        }}>
          <p style={{ fontSize: "0.9rem", color: "#1e40af", margin: 0, lineHeight: 1.6 }}>
            💡 <strong>Tip:</strong> After updating the order status, use the "Send Customer Notification" button to inform the customer about the update.
          </p>
        </div>
      </div>
    </div>
  );
}
