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

interface VisitStats {
  totalVisits: number;
  todayVisits: number;
  dailyStats: Array<{
    date: string;
    count: number;
    dayName: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    productsCount: 0,
    ordersCount: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [visitStats, setVisitStats] = useState<VisitStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingVisits, setLoadingVisits] = useState(true);

  useEffect(() => {
    loadDashboardData();
    loadVisitStats();
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

  const loadVisitStats = async () => {
    try {
      const response = await fetch('/api/visit-stats');
      const result = await response.json();

      if (result.success) {
        setVisitStats(result.data);
      }
    } catch (error) {
      console.error('Error loading visit stats:', error);
    } finally {
      setLoadingVisits(false);
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

      {/* Visitors Analytics */}
      <div style={{
        background: "#ffffff",
        padding: "1.5rem",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        marginBottom: "2rem"
      }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
          👥 Visitors Analytics
        </h2>

        {loadingVisits ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "3px solid #e5e7eb",
              borderTop: "3px solid #16a34a",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 0.5rem"
            }} />
            <p style={{ fontSize: "0.85rem" }}>Loading visitor stats...</p>
          </div>
        ) : visitStats ? (
          <>
            {/* Visit Summary Cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "1.5rem"
            }}>
              {/* Total Visits */}
              <div style={{
                padding: "1rem",
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                borderRadius: "12px",
                border: "2px solid #bae6fd"
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>👁️</div>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0c4a6e", margin: "0 0 0.25rem" }}>
                  {visitStats.totalVisits.toLocaleString()}
                </h3>
                <p style={{ color: "#0369a1", fontSize: "0.85rem", margin: 0, fontWeight: 600 }}>
                  Total Visits
                </p>
              </div>

              {/* Today's Visits */}
              <div style={{
                padding: "1rem",
                background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                borderRadius: "12px",
                border: "2px solid #bbf7d0"
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🔥</div>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#14532d", margin: "0 0 0.25rem" }}>
                  {visitStats.todayVisits.toLocaleString()}
                </h3>
                <p style={{ color: "#166534", fontSize: "0.85rem", margin: 0, fontWeight: 600 }}>
                  Today's Visits
                </p>
              </div>
            </div>

            {/* Daily Breakdown */}
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: "1rem" }}>
                📊 Last 7 Days Breakdown
              </h3>
              
              <div style={{ overflowX: "auto" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${visitStats.dailyStats.length}, 1fr)`,
                  gap: "0.75rem",
                  minWidth: "500px"
                }}>
                  {visitStats.dailyStats.map((day, index) => {
                    const maxVisits = Math.max(...visitStats.dailyStats.map(d => d.count), 1);
                    const barHeight = (day.count / maxVisits) * 120;
                    const isToday = new Date(day.date).toDateString() === new Date().toDateString();

                    return (
                      <div key={day.date} style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}>
                        {/* Visit Count */}
                        <div style={{
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          color: isToday ? "#16a34a" : "#111827"
                        }}>
                          {day.count}
                        </div>

                        {/* Bar */}
                        <div style={{
                          width: "100%",
                          height: "120px",
                          background: "#f3f4f6",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "flex-end",
                          padding: "4px",
                          position: "relative"
                        }}>
                          <div style={{
                            width: "100%",
                            height: `${barHeight}px`,
                            background: isToday 
                              ? "linear-gradient(135deg, #16a34a 0%, #059669 100%)"
                              : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                            borderRadius: "6px",
                            transition: "height 0.3s ease",
                            minHeight: day.count > 0 ? "8px" : "0"
                          }} />
                        </div>

                        {/* Day Label */}
                        <div style={{ textAlign: "center" }}>
                          <div style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: isToday ? "#16a34a" : "#6b7280"
                          }}>
                            {day.dayName}
                          </div>
                          <div style={{
                            fontSize: "0.65rem",
                            color: "#9ca3af",
                            marginTop: "2px"
                          }}>
                            {new Date(day.date).getDate()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "2rem",
            background: "#fef2f2",
            borderRadius: "12px",
            border: "2px dashed #fecaca"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📊</div>
            <p style={{ color: "#991b1b", fontWeight: 600, marginBottom: "0.25rem" }}>
              No visit data available
            </p>
            <p style={{ color: "#6b7280", fontSize: "0.85rem", margin: 0 }}>
              Visit tracking will start once the database migration is complete
            </p>
          </div>
        )}
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
