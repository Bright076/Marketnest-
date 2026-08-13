export default function TrustBadges() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      padding: "3rem 1.5rem",
      borderRadius: "0",
      width: "100%"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: 800,
          color: "#166534",
          marginBottom: "2.5rem"
        }}>
          Why Shop With Us?
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem"
        }}>
          {/* Secure Payments */}
          <div style={{
            textAlign: "center",
            padding: "1.5rem"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: "2.5rem"
            }}>
              🔒
            </div>
            <h3 style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "0.5rem"
            }}>
              Secure Payments
            </h3>
            <p style={{
              color: "#6b7280",
              fontSize: "0.95rem",
              lineHeight: 1.6
            }}>
              Multiple payment options including crypto & card payments with bank-level security
            </p>
          </div>

          {/* Fast Delivery */}
          <div style={{
            textAlign: "center",
            padding: "1.5rem"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: "2.5rem"
            }}>
              🚚
            </div>
            <h3 style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "0.5rem"
            }}>
              Fast Worldwide Shipping
            </h3>
            <p style={{
              color: "#6b7280",
              fontSize: "0.95rem",
              lineHeight: 1.6
            }}>
              Quick processing and reliable delivery to over 100+ countries worldwide
            </p>
          </div>

          {/* Quality Guarantee */}
          <div style={{
            textAlign: "center",
            padding: "1.5rem"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: "2.5rem"
            }}>
              ⭐
            </div>
            <h3 style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "0.5rem"
            }}>
              Quality Guaranteed
            </h3>
            <p style={{
              color: "#6b7280",
              fontSize: "0.95rem",
              lineHeight: 1.6
            }}>
              All products are carefully selected and quality-checked before shipping
            </p>
          </div>

          {/* 24/7 Support */}
          <div style={{
            textAlign: "center",
            padding: "1.5rem"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: "2.5rem"
            }}>
              💬
            </div>
            <h3 style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "0.5rem"
            }}>
              24/7 Customer Support
            </h3>
            <p style={{
              color: "#6b7280",
              fontSize: "0.95rem",
              lineHeight: 1.6
            }}>
              Our support team is always here to help with any questions or concerns
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          marginTop: "3rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "2rem",
          padding: "2rem",
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "2.5rem",
              fontWeight: 900,
              color: "#16a34a",
              marginBottom: "0.25rem"
            }}>
              10,000+
            </div>
            <div style={{
              fontSize: "0.9rem",
              color: "#6b7280",
              fontWeight: 600
            }}>
              Happy Customers
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "2.5rem",
              fontWeight: 900,
              color: "#16a34a",
              marginBottom: "0.25rem"
            }}>
              15,000+
            </div>
            <div style={{
              fontSize: "0.9rem",
              color: "#6b7280",
              fontWeight: 600
            }}>
              Orders Delivered
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "2.5rem",
              fontWeight: 900,
              color: "#16a34a",
              marginBottom: "0.25rem"
            }}>
              100+
            </div>
            <div style={{
              fontSize: "0.9rem",
              color: "#6b7280",
              fontWeight: 600
            }}>
              Countries Served
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "2.5rem",
              fontWeight: 900,
              color: "#16a34a",
              marginBottom: "0.25rem"
            }}>
              4.9/5
            </div>
            <div style={{
              fontSize: "0.9rem",
              color: "#6b7280",
              fontWeight: 600
            }}>
              Average Rating
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
