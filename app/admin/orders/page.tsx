"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  amount_paid: number;
  payment_status: string;
  order_status: string;
  created_at: string;
  products?: {
    title: string;
    image_url: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          products (
            title,
            image_url
          )
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('order_status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, order_status: newStatus } : order
      ));

      alert('Order status updated!');
    } catch (error: any) {
      console.error('Error updating order:', error);
      alert('Failed to update order: ' + error.message);
    }
  };

  const updatePaymentStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, payment_status: newStatus } : order
      ));

      alert('Payment status updated!');
    } catch (error: any) {
      console.error('Error updating payment:', error);
      alert('Failed to update payment: ' + error.message);
    }
  };

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
        <p style={{ color: "#6b7280" }}>Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
          Orders Management
        </h1>
        <p style={{ color: "#6b7280" }}>
          View and manage customer orders
        </p>
      </div>

      {/* Filters */}
      <div style={{
        background: "#ffffff",
        padding: "1rem",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        marginBottom: "1.5rem",
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap"
      }}>
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              background: filter === status ? '#16a34a' : '#f3f4f6',
              color: filter === status ? '#ffffff' : '#374151',
              transition: "all 0.2s"
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div style={{
          background: "#ffffff",
          padding: "4rem 2rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📦</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
            No orders found
          </h3>
          <p style={{ color: "#6b7280" }}>
            {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
          </p>
        </div>
      ) : (
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          overflow: "hidden"
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f9fafb" }}>
                <tr>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280", borderBottom: "2px solid #e5e7eb" }}>
                    Order ID
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280", borderBottom: "2px solid #e5e7eb" }}>
                    Customer
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280", borderBottom: "2px solid #e5e7eb" }}>
                    Product
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280", borderBottom: "2px solid #e5e7eb" }}>
                    Amount
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280", borderBottom: "2px solid #e5e7eb" }}>
                    Payment
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280", borderBottom: "2px solid #e5e7eb" }}>
                    Order Status
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280", borderBottom: "2px solid #e5e7eb" }}>
                    Date
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280", borderBottom: "2px solid #e5e7eb" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const orderStatusColor = getStatusColor(order.order_status);
                  const paymentStatusColor = getStatusColor(order.payment_status);
                  
                  return (
                    <tr key={order.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "1rem", fontSize: "0.85rem", color: "#6b7280", fontFamily: "monospace" }}>
                        {order.id.slice(0, 8)}...
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div style={{ fontWeight: 600, color: "#111827", marginBottom: "0.25rem" }}>
                          {order.customer_name}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                          {order.customer_phone}
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          {order.products?.image_url && (
                            <img
                              src={order.products.image_url}
                              alt={order.products.title}
                              style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px" }}
                            />
                          )}
                          <span style={{ fontSize: "0.9rem", color: "#111827" }}>
                            {order.products?.title || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "1rem", fontWeight: 700, color: "#16a34a" }}>
                        ${Number(order.amount_paid).toFixed(2)}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <select
                          value={order.payment_status}
                          onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                          style={{
                            padding: "0.375rem 0.75rem",
                            borderRadius: "6px",
                            border: "1px solid #e5e7eb",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            background: paymentStatusColor.bg,
                            color: paymentStatusColor.text,
                            cursor: "pointer"
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                        </select>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <select
                          value={order.order_status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          style={{
                            padding: "0.375rem 0.75rem",
                            borderRadius: "6px",
                            border: "1px solid #e5e7eb",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            background: orderStatusColor.bg,
                            color: orderStatusColor.text,
                            cursor: "pointer"
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.85rem", color: "#6b7280" }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          style={{
                            padding: "0.5rem 1rem",
                            background: "#f0fdf4",
                            color: "#16a34a",
                            borderRadius: "6px",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            textDecoration: "none",
                            display: "inline-block"
                          }}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
