"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  id: string;
  customer_name: string;
  amount_paid: number;
  order_status: string;
  payment_status: string;
  created_at: string;
  products?: {
    title: string;
    image_url: string;
    category: string;
  };
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    checkAuthAndLoadOrders();
  }, [filter]);

  const checkAuthAndLoadOrders = async () => {
    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("Please login to view your orders");
        router.push("/login");
        return;
      }

      // Load user's orders
      let query = supabase
        .from('orders')
        .select(`
          *,
          products (
            title,
            image_url,
            category
          )
        `)
        .eq('user_id', user.id)
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      pending: { bg: '#fef3c7', text: '#92400e', icon: '⏳' },
      processing: { bg: '#dbeafe', text: '#1e40af', icon: '⚙️' },
      shipped: { bg: '#e0e7ff', text: '#4338ca', icon: '🚚' },
      delivered: { bg: '#dcfce7', text: '#166534', icon: '✓' },
      cancelled: { bg: '#fee2e2', text: '#991b1b', icon: '✗' }
    };
    return colors[status] || { bg: '#f3f4f6', text: '#374151', icon: '📦' };
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
          <p style={{ color: "#6b7280" }}>Loading your orders...</p>
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

  return (
    <div style={{ minHeight: "100vh", paddingTop: "60px", background: "#f9fafb" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#111827", marginBottom: "0.5rem" }}>
            My Orders
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#6b7280" }}>
            Track and manage your orders
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
          flexWrap: "wrap",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
        }}>
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: "0.625rem 1.25rem",
                borderRadius: "8px",
                border: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                background: filter === status ? 'linear-gradient(135deg, #16a34a 0%, #059669 100%)' : '#f3f4f6',
                color: filter === status ? '#ffffff' : '#374151',
                transition: "all 0.2s",
                boxShadow: filter === status ? '0 2px 8px rgba(22, 163, 74, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (filter !== status) {
                  e.currentTarget.style.background = '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== status) {
                  e.currentTarget.style.background = '#f3f4f6';
                }
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
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>📦</div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
              No orders found
            </h3>
            <p style={{ fontSize: "1.1rem", color: "#6b7280", marginBottom: "2rem" }}>
              {filter === 'all' ? "You haven't placed any orders yet" : `No ${filter} orders`}
            </p>
            <Link href="/products" style={{
              padding: "1rem 2rem",
              background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
              color: "#ffffff",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "1.1rem",
              textDecoration: "none",
              display: "inline-block",
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
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gap: "1.5rem"
          }}>
            {orders.map((order) => {
              const statusInfo = getStatusColor(order.order_status);
              
              return (
                <div key={order.id} style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e5e7eb",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
                  <div style={{ padding: "1.5rem" }}>
                    {/* Order Header */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "1.5rem",
                      flexWrap: "wrap",
                      gap: "1rem"
                    }}>
                      <div>
                        <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                          Order ID
                        </p>
                        <p style={{
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          color: "#111827",
                          fontFamily: "monospace",
                          margin: 0
                        }}>
                          {order.id.slice(0, 13)}...
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                          Order Date
                        </p>
                        <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div style={{
                      display: "flex",
                      gap: "1.5rem",
                      marginBottom: "1.5rem",
                      padding: "1rem",
                      background: "#f9fafb",
                      borderRadius: "12px"
                    }}>
                      {order.products?.image_url && (
                        <img
                          src={order.products.image_url}
                          alt={order.products.title}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "contain",
                            borderRadius: "8px",
                            background: "#ffffff"
                          }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          color: "#111827",
                          marginBottom: "0.5rem"
                        }}>
                          {order.products?.title || 'Product'}
                        </h3>
                        {order.products?.category && (
                          <p style={{
                            fontSize: "0.9rem",
                            color: "#6b7280",
                            marginBottom: "0.75rem"
                          }}>
                            {order.products.category}
                          </p>
                        )}
                        <p style={{
                          fontSize: "1.75rem",
                          fontWeight: 900,
                          color: "#16a34a",
                          margin: 0
                        }}>
                          ${Number(order.amount_paid).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "1rem"
                    }}>
                      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                        {/* Order Status */}
                        <div style={{
                          padding: "0.625rem 1.25rem",
                          borderRadius: "8px",
                          background: statusInfo.bg,
                          border: `1px solid ${statusInfo.text}20`,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}>
                          <span style={{ fontSize: "1.25rem" }}>{statusInfo.icon}</span>
                          <span style={{
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            color: statusInfo.text,
                            textTransform: "capitalize"
                          }}>
                            {order.order_status}
                          </span>
                        </div>

                        {/* Payment Status */}
                        <div style={{
                          padding: "0.625rem 1.25rem",
                          borderRadius: "8px",
                          background: order.payment_status === 'paid' ? '#dcfce7' : '#fef3c7',
                          border: `1px solid ${order.payment_status === 'paid' ? '#16653420' : '#92400e20'}`,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}>
                          <span style={{ fontSize: "1.25rem" }}>
                            {order.payment_status === 'paid' ? '💳' : '⏳'}
                          </span>
                          <span style={{
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            color: order.payment_status === 'paid' ? '#166534' : '#92400e',
                            textTransform: "capitalize"
                          }}>
                            {order.payment_status}
                          </span>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <Link href={`/my-orders/${order.id}`} style={{
                        padding: "0.75rem 1.5rem",
                        background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
                        color: "#ffffff",
                        borderRadius: "10px",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        boxShadow: "0 2px 8px rgba(22, 163, 74, 0.3)",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(22, 163, 74, 0.3)";
                      }}>
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
