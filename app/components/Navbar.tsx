"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { supabase } from "@/lib/supabaseClient";
import { checkAdminAccess } from "@/lib/adminAuth";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    checkUser();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, "User:", session?.user?.email);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkIfAdmin();
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    console.log("Navbar - Current user:", session?.user?.email || "Not logged in");
    setUser(session?.user ?? null);
    if (session?.user) {
      await checkIfAdmin();
    }
  };

  const checkIfAdmin = async () => {
    const { isAdmin: adminStatus } = await checkAdminAccess();
    setIsAdmin(adminStatus);
  };

  // Determine profile link based on admin status
  const profileLink = user ? (isAdmin ? "/admin" : "/dashboard") : "/login";

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .desktop-links {
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }
        .mobile-toggle {
          display: none;
        }
        @media (max-width: 768px) {
          .desktop-links {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}} />
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "60px",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <Image
              src="/1000282492.png"
              alt="MarketNest"
              width={200}
              height={48}
              style={{ objectFit: "contain", height: "auto", maxHeight: "48px", maxWidth: "50vw" }}
              priority
            />
          </Link>

          {/* Desktop links */}
          <div
            className="desktop-links"
            style={{
              gap: "2.5rem",
            }}
          >
            <Link href="/" style={{ textDecoration: "none", color: "#374151", fontWeight: 600, fontSize: "0.95rem" }}>
              Home
            </Link>
            <Link href="/products" style={{ textDecoration: "none", color: "#374151", fontWeight: 600, fontSize: "0.95rem" }}>
              All Products
            </Link>
            <Link href="/products/local" style={{ textDecoration: "none", color: "#16a34a", fontWeight: 600, fontSize: "0.95rem" }}>
              Local Deals 🇳🇬
            </Link>
            <Link href="/products/global" style={{ textDecoration: "none", color: "#f97316", fontWeight: 600, fontSize: "0.95rem" }}>
              Global Deals 🌍
            </Link>
          </div>

          {/* Global Action items */}
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            {/* Profile Icon - Always show */}
            <Link 
              href={profileLink}
              style={{ 
                textDecoration: "none", 
                color: "#374151", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                padding: "0.5rem",
                position: "relative"
              }}
              title={user ? (isAdmin ? "Go to Admin Dashboard" : "Go to Dashboard") : "Login"}
            >
              {user ? (
                // Logged in - show avatar with first letter
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: isAdmin 
                      ? "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)" 
                      : "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    border: "2px solid #e5e7eb",
                  }}
                >
                  {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                </div>
              ) : (
                // Not logged in - show profile icon
                <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </Link>

            {/* Unified Cart Icon */}
            <Link href="/cart" style={{ textDecoration: "none", position: "relative", color: "#374151", display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5rem" }}>
              <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {totalItems > 0 && (
                <span style={{ position: "absolute", top: "0px", right: "0px", background: "#ef4444", color: "white", borderRadius: "9999px", padding: "0.15rem 0.45rem", fontSize: "0.7rem", fontWeight: 800 }}>
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem",
                height: "42px",
                width: "42px"
              }}
              aria-label="Toggle navigation menu"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", justifyContent: "center", width: "100%" }}>
                <span
                  style={{
                    display: "block",
                    width: "100%",
                    height: "2.5px",
                    background: "#374151",
                    borderRadius: "2px",
                    transition: "all 0.3s",
                    transform: mobileOpen ? "rotate(45deg) translate(6px, 6px)" : "none",
                  }}
                />
                <span
                  style={{
                    display: "block",
                    width: "100%",
                    height: "2.5px",
                    background: "#374151",
                    borderRadius: "2px",
                    transition: "all 0.3s",
                    opacity: mobileOpen ? 0 : 1,
                  }}
                />
                <span
                  style={{
                    display: "block",
                    width: "100%",
                    height: "2.5px",
                    background: "#374151",
                    borderRadius: "2px",
                    transition: "all 0.3s",
                    transform: mobileOpen ? "rotate(-45deg) translate(6px, -6px)" : "none",
                  }}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div
            style={{
              padding: "1rem 1.5rem 1.5rem",
              background: "#ffffff",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              style={{ textDecoration: "none", color: "#374151", fontWeight: 600, fontSize: "1.1rem", padding: "0.5rem 0", borderBottom: "1px solid #f3f4f6" }}
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              style={{ textDecoration: "none", color: "#374151", fontWeight: 600, fontSize: "1.1rem", padding: "0.5rem 0", borderBottom: "1px solid #f3f4f6" }}
            >
              All Products
            </Link>
            <Link
              href="/products/local"
              onClick={() => setMobileOpen(false)}
              style={{ textDecoration: "none", color: "#16a34a", fontWeight: 600, fontSize: "1.1rem", padding: "0.5rem 0", borderBottom: "1px solid #f3f4f6" }}
            >
              Local Deals 🇳🇬
            </Link>
            <Link
              href="/products/global"
              onClick={() => setMobileOpen(false)}
              style={{ textDecoration: "none", color: "#f97316", fontWeight: 600, fontSize: "1.1rem", padding: "0.5rem 0" }}
            >
              Global Deals 🌍
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
