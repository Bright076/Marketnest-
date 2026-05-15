"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAccess } from "@/lib/adminAuth";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    verifyAdmin();
  }, []);

  const verifyAdmin = async () => {
    const { isAdmin } = await checkAdminAccess();
    
    if (!isAdmin) {
      router.push("/");
      return;
    }
    
    setIsAdmin(true);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "#f9fafb"
      }}>
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
          <p style={{ color: "#6b7280" }}>Verifying admin access...</p>
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

  if (!isAdmin) {
    return null;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      {/* Sidebar */}
      <aside style={{
        width: "260px",
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        padding: "2rem 0",
        position: "fixed",
        height: "100vh",
        overflowY: "auto"
      }}>
        {/* Logo */}
        <div style={{ padding: "0 1.5rem", marginBottom: "2rem" }}>
          <h1 style={{
            fontSize: "1.5rem",
            fontWeight: 900,
            background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            MarketNest
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "0.25rem" }}>
            Admin Dashboard
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ padding: "0 1rem" }}>
          <Link href="/admin" style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            textDecoration: "none",
            color: "#374151",
            fontWeight: 600,
            marginBottom: "0.5rem",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f0fdf4";
            e.currentTarget.style.color = "#16a34a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#374151";
          }}>
            <span>📊</span> Dashboard
          </Link>

          <Link href="/admin/products" style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            textDecoration: "none",
            color: "#374151",
            fontWeight: 600,
            marginBottom: "0.5rem",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f0fdf4";
            e.currentTarget.style.color = "#16a34a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#374151";
          }}>
            <span>📦</span> Products
          </Link>

          <Link href="/admin/orders" style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            textDecoration: "none",
            color: "#374151",
            fontWeight: 600,
            marginBottom: "0.5rem",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f0fdf4";
            e.currentTarget.style.color = "#16a34a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#374151";
          }}>
            <span>🛒</span> Orders
          </Link>

          <Link href="/" style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            textDecoration: "none",
            color: "#374151",
            fontWeight: 600,
            marginBottom: "0.5rem",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f0fdf4";
            e.currentTarget.style.color = "#16a34a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#374151";
          }}>
            <span>🏠</span> View Store
          </Link>
        </nav>

        {/* Logout Button */}
        <div style={{ padding: "0 1rem", marginTop: "auto", position: "absolute", bottom: "2rem", width: "100%" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "calc(100% - 2rem)",
              padding: "0.75rem 1rem",
              background: "#fef2f2",
              color: "#dc2626",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#dc2626";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fef2f2";
              e.currentTarget.style.color = "#dc2626";
            }}
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: "260px",
        flex: 1,
        padding: "2rem",
        minHeight: "100vh"
      }}>
        {children}
      </main>
    </div>
  );
}
