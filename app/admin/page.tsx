"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Stats {
  productsCount: number;
  ordersCount: number;
  pendingOrders: number;
  totalRevenue: number;
}

interface RecentOrder {
  id: string;
  customer_name: string;
  amount_paid: number;
  order_status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    productsCount: 0,
    ordersCount: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Get orders count
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Get pending orders count
      const { count: pendingOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('order_status', 'pending');

      // Get total revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('amount_paid')
        .eq('payment_status', 'paid');

      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.amount_paid), 0) || 0;

      // Get recent orders
      const { data: recentOrdersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        productsCount: productsCount || 0,
        ordersCount: ordersCount || 0,
        pendingOrders: pendingOrders || 0,
        totalRevenue
      });

      setRecentOrders(recentOrdersData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
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
        <p style={{ color: "#6b7280" }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
          Dashboard Overview
        </h1>
        <p style={{ color: "#6b7280" }}>
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1.5rem",
        marginBottom: "2rem"
      }}>
        {/* Products Count */}
        <div style={{
          background: "#ffffff",
          padding: "1.5rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span style={{ fontSize: "2rem" }}>📦</span>
            <span style={{ fontSize: "0.85rem", color: "#16a34a", fontWeight: 600 }}>Total</span>
          </div>
          <h3 style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", margin: "0 0 0.25rem" }}>
            {stats.productsCount}
          </h3>
          <p style={{ color: "#6b7280", fontSize: "0.9rem", margin: 0 }}>Products</p>
        </div>

        {/* Orders Count */}
        <div style={{
          background: "#ffffff",
          padding: "1.5rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span style={{ fontSize: "2rem" }}>🛒</span>
            <span style={{ fontSize: "0.85rem", color: "#2563eb", fontWeight: 600 }}>All Time</span>
          </div>
          <h3 style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", margin: "0 0 0.25rem" }}>
            {stats.ordersCount}
          </h3>
          <p style={{ color: "#6b7280", fontSize: "0.9rem", margin: 0 }}>Orders</p>
        </div>

        {/* Pending Orders */}
        <div style={{
          background: "#ffffff",
          padding: "1.5rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span style={{ fontSize: "2rem" }}>⏳</span>
            <span style={{ fontSize: "0.85rem", color: "#f97316", fontWeight: 600 }}>Pending</span>
          </div>
          <h3 style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", margin: "0 0 0.25rem" }}>
            {stats.pendingOrders}
          </h3>
          <p style={{ color: "#6b7280", fontSize: "0.9rem", margin: 0 }}>Pending Orders</p>
        </div>

        {/* Total Revenue */}
        <div style={{
          background: "#ffffff",
          padding: "1.5rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span style={{ fontSize: "2rem" }}>💰</span>
            <span style={{ fontSize: "0.85rem", color: "#16a34a", fontWeight: 600 }}>Paid</span>
          </div>
          <h3 style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", margin: "0 0 0.25rem" }}>
            ${stats.totalRevenue.toFixed(2)}
          </h3>
          <p style={{ color: "#6b7280", fontSize: "0.9rem", margin: 0 }}>Total Revenue</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{
        background: "#ffffff",
        padding: "1.5rem",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", margin: 0 }}>
            Recent Orders
          </h2>
          <Link href="/admin/orders" style={{
            color: "#16a34a",
            fontWeight: 600,
            fontSize: "0.9rem",
            textDecoration: "none"
          }}>
            View All →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p style={{ color: "#6b7280", textAlign: "center", padding: "2rem" }}>
            No orders yet
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>
                    Customer
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>
                    Amount
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>
                    Status
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "1rem 0.75rem", fontWeight: 600, color: "#111827" }}>
                      {order.customer_name}
                    </td>
                    <td style={{ padding: "1rem 0.75rem", color: "#111827" }}>
                      ${Number(order.amount_paid).toFixed(2)}
                    </td>
                    <td style={{ padding: "1rem 0.75rem" }}>
                      <span style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        background: order.order_status === 'delivered' ? '#dcfce7' : 
                                   order.order_status === 'pending' ? '#fef3c7' : '#dbeafe',
                        color: order.order_status === 'delivered' ? '#166534' : 
                               order.order_status === 'pending' ? '#92400e' : '#1e40af'
                      }}>
                        {order.order_status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 0.75rem", color: "#6b7280", fontSize: "0.9rem" }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
