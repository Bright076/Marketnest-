"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { checkAdminAccess } from "@/lib/adminAuth";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(path);
  };

  const NavLink = ({ href, emoji, label }: { href: string; emoji: string; label: string }) => {
    const active = isActive(href);
    
    return (
      <Link 
        href={href}
        onClick={() => setMobileMenuOpen(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          textDecoration: "none",
          color: active ? "#16a34a" : "#374151",
          fontWeight: 600,
          marginBottom: "0.5rem",
          background: active ? "#f0fdf4" : "transparent",
          border: active ? "1px solid #bbf7d0" : "1px solid transparent",
          transition: "all 0.2s"
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.background = "#f9fafb";
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        <span>{emoji}</span> {label}
      </Link>
    );
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
      {/* Mobile Header */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "60px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1rem",
        zIndex: 100
      }}
      className="mobile-header">
        <h1 style={{
          fontSize: "1.25rem",
          fontWeight: 900,
          background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          margin: 0
        }}>
          MarketNest
        </h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            padding: "0.5rem",
            background: "transparent",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1.5rem",
            lineHeight: 1
          }}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar */}
      <aside style={{
        width: "260px",
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        padding: "2rem 0",
        position: "fixed",
        height: "100vh",
        overflowY: "auto",
        transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease-in-out",
        zIndex: 99
      }}
      className="sidebar">
        {/* Logo - Desktop Only */}
        <div style={{ padding: "0 1.5rem", marginBottom: "2rem" }} className="desktop-logo">
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
          <NavLink href="/admin" emoji="📊" label="Dashboard" />
          <NavLink href="/admin/cj-products" emoji="🌍" label="CJ Product Import" />
          <NavLink href="/admin/products" emoji="📦" label="My Products" />
          <NavLink href="/admin/orders" emoji="🛒" label="Orders" />
          <NavLink href="/admin/notifications" emoji="🔔" label="Notifications" />
          <NavLink href="/admin/cj-test" emoji="🔌" label="CJ API Test" />
          <NavLink href="/" emoji="🏠" label="View Store" />
        </nav>

        {/* Logout Button */}
        <div style={{ padding: "0 1rem", marginTop: "2rem" }}>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            style={{
              width: "100%",
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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "fixed",
            top: "60px",
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 98
          }}
          className="mobile-overlay"
        />
      )}

      {/* Main Content */}
      <main style={{
        marginLeft: "260px",
        flex: 1,
        padding: "2rem",
        minHeight: "100vh"
      }}
      className="main-content">
        {children}
      </main>

      {/* Responsive Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 769px) {
          .mobile-header {
            display: none !important;
          }
          .sidebar {
            transform: translateX(0) !important;
          }
        }
        
        @media (max-width: 768px) {
          .desktop-logo {
            display: none !important;
          }
          .sidebar {
            top: 60px !important;
            height: calc(100vh - 60px) !important;
            padding-top: 1rem !important;
          }
          .main-content {
            margin-left: 0 !important;
            padding: 1rem !important;
            padding-top: calc(60px + 1rem) !important;
          }
          .mobile-overlay {
            display: block;
          }
        }
      `}} />
    </div>
  );
}
