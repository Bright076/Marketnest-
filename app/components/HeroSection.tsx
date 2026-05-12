"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [counts, setCounts] = useState({ products: 0, customers: 0, support: 0 });

  useEffect(() => {
    const targets = { products: 500, customers: 12000, support: 24 };
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        products: Math.floor(targets.products * progress),
        customers: Math.floor(targets.customers * progress),
        support: Math.floor(targets.support * progress),
      });

      if (currentStep >= steps) {
        setCounts({
          products: targets.products,
          customers: targets.customers,
          support: targets.support,
        });
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number, suffix: string) => {
    if (suffix === "K+") {
      return `${(num / 1000).toFixed(1)}K+`;
    }
    if (suffix === "/7") {
      return `${num}/7`;
    }
    return `${num}+`;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        @media (max-width: 768px) {
          .hero-content {
            flex-direction: column !important;
            text-align: center !important;
          }
          .hero-text {
            align-items: center !important;
          }
          .hero-buttons {
            justify-content: center !important;
          }
          .hero-stats {
            justify-content: center !important;
          }
        }
      `}} />
      <section
        style={{
          position: "relative",
          minHeight: "600px",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Background Image with Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 0,
          }}
        />
        
        {/* Lighter Overlay for better background visibility */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(6, 95, 70, 0.7) 0%, rgba(22, 163, 74, 0.65) 50%, rgba(34, 197, 94, 0.6) 100%)",
            zIndex: 1,
          }}
        />

        {/* Decorative Elements */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(251, 191, 36, 0.1)",
            filter: "blur(60px)",
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
            filter: "blur(50px)",
            zIndex: 2,
          }}
        />

        {/* Content */}
        <div
          className="hero-content"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "4rem 1.5rem",
            position: "relative",
            zIndex: 3,
            width: "100%",
          }}
        >
          <div
            className="hero-text animate-fade-in-up"
            style={{
              maxWidth: "700px",
            }}
          >
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                padding: "0.5rem 1.2rem",
                borderRadius: "9999px",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: "1.5rem",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>🔥</span>
              <span>New Arrivals Available Now</span>
            </div>

            {/* Main Heading */}
            <h1
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
                margin: "0 0 1.5rem",
                textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              }}
            >
              Your One-Stop
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Shopping Destination
              </span>
            </h1>

            {/* Subheading */}
            <p
              style={{
                fontSize: "1.2rem",
                color: "rgba(255, 255, 255, 0.95)",
                lineHeight: 1.7,
                margin: "0 0 2.5rem",
                maxWidth: "600px",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              Discover quality products at unbeatable prices. From everyday essentials to trending gadgets — shop with confidence and enjoy fast delivery.
            </p>

            {/* CTA Buttons */}
            <div
              style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}
              className="hero-buttons"
            >
              <Link
                href="/products"
                style={{
                  background: "#ffffff",
                  color: "#16a34a",
                  fontWeight: 700,
                  fontSize: "1rem",
                  padding: "1rem 2.5rem",
                  borderRadius: "12px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                  transition: "all 0.3s",
                  border: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.2)";
                }}
              >
                <span>Shop Now</span>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/products"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "1rem",
                  padding: "1rem 2.5rem",
                  borderRadius: "12px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                }}
              >
                <span>View Deals</span>
                <span style={{ fontSize: "1.2rem" }}>🏷️</span>
              </Link>
            </div>

            {/* Stats with counting animation */}
            <div
              className="hero-stats"
              style={{
                display: "flex",
                gap: "3rem",
                flexWrap: "wrap",
                padding: "2rem 0",
              }}
            >
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  padding: "1.5rem 2rem",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  minWidth: "140px",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: "#ffffff",
                    marginBottom: "0.3rem",
                    textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {formatNumber(counts.products, "+")}
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Products
                </div>
              </div>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  padding: "1.5rem 2rem",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  minWidth: "140px",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: "#ffffff",
                    marginBottom: "0.3rem",
                    textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {formatNumber(counts.customers, "K+")}
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Customers
                </div>
              </div>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  padding: "1.5rem 2rem",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  minWidth: "140px",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: "#ffffff",
                    marginBottom: "0.3rem",
                    textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {formatNumber(counts.support, "/7")}
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
