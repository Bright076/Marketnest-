"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Get the current session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      // Get fresh user data
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      console.log("=== USER DEBUG INFO ===");
      console.log("Full user object:", JSON.stringify(user, null, 2));
      console.log("User metadata:", user.user_metadata);
      console.log("Full name:", user.user_metadata?.full_name);
      console.log("Phone:", user.user_metadata?.phone);
      console.log("Email:", user.email);
      console.log("======================");
      
      setUser(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "4px solid #e5e7eb",
              borderTop: "4px solid #16a34a",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <p style={{ color: "#6b7280", fontSize: "1rem" }}>Loading...</p>
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

  const fullName = user?.user_metadata?.full_name || "User";
  const phone = user?.user_metadata?.phone || "N/A";
  const email = user?.email || "N/A";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        padding: "2rem 1.5rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "1.5rem",
            fontWeight: 900,
            background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textDecoration: "none",
          }}
        >
          MarketNest
        </Link>
        <button
          onClick={handleLogout}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#ffffff",
            color: "#dc2626",
            border: "2px solid #fecaca",
            borderRadius: "12px",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fef2f2";
            e.currentTarget.style.borderColor = "#dc2626";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.borderColor = "#fecaca";
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Welcome Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
            padding: "3rem 2.5rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
                color: "#ffffff",
              }}
            >
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "#111827",
                  margin: "0 0 0.5rem",
                }}
              >
                Welcome back, {fullName}!
              </h1>
              <p style={{ color: "#6b7280", fontSize: "1rem", margin: 0 }}>
                Manage your account and view your orders
              </p>
            </div>
          </div>

          {/* User Info Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              marginTop: "2rem",
            }}
          >
            {/* Full Name Card */}
            <div
              style={{
                background: "#f9fafb",
                padding: "1.5rem",
                borderRadius: "16px",
                border: "2px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.5rem",
                }}
              >
                Full Name
              </div>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {fullName}
              </div>
            </div>

            {/* Email Card */}
            <div
              style={{
                background: "#f9fafb",
                padding: "1.5rem",
                borderRadius: "16px",
                border: "2px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.5rem",
                }}
              >
                Email Address
              </div>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#111827",
                  wordBreak: "break-all",
                }}
              >
                {email}
              </div>
            </div>

            {/* Phone Card */}
            <div
              style={{
                background: "#f9fafb",
                padding: "1.5rem",
                borderRadius: "16px",
                border: "2px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.5rem",
                }}
              >
                Phone Number
              </div>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {phone}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {/* Shop Products */}
          <Link
            href="/products"
            style={{
              background: "#ffffff",
              padding: "2rem",
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
              textDecoration: "none",
              transition: "all 0.3s",
              border: "2px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.12)";
              e.currentTarget.style.borderColor = "#16a34a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🛍️</div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 0.5rem",
              }}
            >
              Shop Products
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.95rem", margin: 0 }}>
              Browse our collection of quality products
            </p>
          </Link>

          {/* View Cart */}
          <Link
            href="/cart"
            style={{
              background: "#ffffff",
              padding: "2rem",
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
              textDecoration: "none",
              transition: "all 0.3s",
              border: "2px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.12)";
              e.currentTarget.style.borderColor = "#16a34a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🛒</div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 0.5rem",
              }}
            >
              View Cart
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.95rem", margin: 0 }}>
              Check your shopping cart items
            </p>
          </Link>

          {/* Back to Home */}
          <Link
            href="/"
            style={{
              background: "#ffffff",
              padding: "2rem",
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
              textDecoration: "none",
              transition: "all 0.3s",
              border: "2px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.12)";
              e.currentTarget.style.borderColor = "#16a34a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🏠</div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 0.5rem",
              }}
            >
              Home Page
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.95rem", margin: 0 }}>
              Return to the main page
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
