import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        
        @media (max-width: 768px) {
          .hero-content {
            flex-direction: column !important;
            text-align: center !important;
          }
          .hero-text {
            align-items: center !important;
          }
          .hero-visual {
            margin-top: 2rem !important;
            transform: scale(0.85) !important;
          }
          .hero-buttons {
            justify-content: center !important;
          }
          .hero-stats {
            justify-content: center !important;
          }
        }
        
        @media (max-width: 480px) {
          .hero-visual {
            transform: scale(0.7) !important;
          }
        }
      `}} />
      <section
      style={{
        background: "linear-gradient(135deg, #065f46 0%, #16a34a 50%, #22c55e 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "-60px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "60%",
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background: "rgba(249,115,22,0.12)",
        }}
      />

      <div
        className="hero-content"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "3rem 1.5rem",
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          gap: "2.5rem",
          flexWrap: "wrap",
        }}
      >
        <div
          className="hero-text animate-fade-in-up"
          style={{
            flex: "1 1 300px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              padding: "0.4rem 1rem",
              borderRadius: "9999px",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "#ffffff",
              marginBottom: "1.5rem",
            }}
          >
            🔥 New Arrivals Available Now
          </div>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              margin: "0 0 1.25rem",
            }}
          >
            Discover Quality
            <br />
            Products at{" "}
            <span
              style={{
                color: "#fbbf24",
                textDecoration: "underline",
                textDecorationColor: "rgba(251,191,36,0.4)",
                textUnderlineOffset: "6px",
              }}
            >
              Amazing Prices
            </span>
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.7,
              margin: "0 0 2rem",
              maxWidth: "520px",
            }}
          >
            From everyday essentials to trending gadgets — shop from our curated
            collection or grab exclusive partner deals. Fast delivery guaranteed.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }} className="hero-buttons">
            <Link
              href="/products"
              className="btn"
              style={{
                background: "#ffffff",
                color: "#16a34a",
                fontWeight: 700,
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                padding: "0.85rem 2rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              Browse Products
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/products"
              className="btn"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "0.85rem 2rem",
                textDecoration: "none",
              }}
            >
              View Deals 🏷️
            </Link>
          </div>

          {/* Stats */}
          <div
            className="hero-stats"
            style={{
              display: "flex",
              gap: "2.5rem",
              marginTop: "3rem",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "500+", label: "Products" },
              { value: "12K+", label: "Customers" },
              { value: "24/7", label: "Support" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: "#ffffff",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Visual Block - Product Showcase */}
        <div 
          className="hero-visual animate-fade-in-up"
          style={{ 
            flex: "1 1 280px", 
            display: "flex", 
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            minHeight: "320px"
          }}
        >
          {/* Subtle glow behind */}
          <div style={{ position: "absolute", top: "20%", left: "10%", right: "10%", bottom: "20%", background: "#fbbf24", filter: "blur(80px)", opacity: 0.2, borderRadius: "50%" }} />
          
          {/* Product Cards Stack */}
          <div style={{ position: "relative", width: "min(280px, 90vw)", height: "320px" }}>
            {/* Card 3 - Background */}
            <div style={{
              position: "absolute",
              top: "40px",
              left: "min(20px, 5vw)",
              width: "min(240px, 85vw)",
              height: "280px",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.2)",
              transform: "rotate(-8deg)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)"
            }} />
            
            {/* Card 2 - Middle */}
            <div style={{
              position: "absolute",
              top: "20px",
              left: "min(30px, 7vw)",
              width: "min(240px, 85vw)",
              height: "280px",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.3)",
              transform: "rotate(4deg)",
              boxShadow: "0 15px 50px rgba(0,0,0,0.2)"
            }} />
            
            {/* Card 1 - Front (Main Product Card) */}
            <div style={{
              position: "absolute",
              top: "0",
              left: "min(20px, 5vw)",
              width: "min(240px, 85vw)",
              height: "280px",
              background: "linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)",
              borderRadius: "20px",
              border: "2px solid rgba(255,255,255,0.5)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              {/* Product Icon */}
              <div style={{
                width: "100%",
                height: "140px",
                background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "4rem",
                marginBottom: "1rem"
              }}>
                📱
              </div>
              
              {/* Product Info */}
              <div>
                <div style={{
                  fontSize: "0.75rem",
                  color: "#16a34a",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.25rem"
                }}>
                  Featured Product
                </div>
                <div style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: "0.5rem"
                }}>
                  Premium Gadgets
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <span style={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "#16a34a"
                  }}>
                    $25.00
                  </span>
                  <div style={{
                    width: "36px",
                    height: "36px",
                    background: "#16a34a",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem"
                  }}>
                    🛒
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div style={{
              position: "absolute",
              top: "-10px",
              right: "10px",
              width: "50px",
              height: "50px",
              background: "#fbbf24",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              boxShadow: "0 8px 20px rgba(251,191,36,0.4)",
              animation: "float 3s ease-in-out infinite"
            }}>
              ⭐
            </div>
            
            <div style={{
              position: "absolute",
              bottom: "20px",
              right: "-10px",
              width: "40px",
              height: "40px",
              background: "#ffffff",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
              transform: "rotate(15deg)",
              animation: "float 4s ease-in-out infinite"
            }}>
              🎁
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
