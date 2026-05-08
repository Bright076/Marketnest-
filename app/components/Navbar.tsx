"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();

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
