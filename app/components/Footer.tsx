import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#111827",
        color: "#9ca3af",
        padding: "3rem 1.5rem 2rem",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2rem",
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ marginBottom: "1rem" }}>
            <Image
              src="/1000282492.png"
              alt="MarketNest"
              width={180}
              height={56}
              style={{ objectFit: "contain", height: "56px", width: "auto" }}
            />
          </div>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.6, maxWidth: "280px" }}>
            Your trusted marketplace for quality products at unbeatable prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: "#fff", fontWeight: 600, marginBottom: "1rem", fontSize: "0.95rem" }}>
            Quick Links
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <Link href="/" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }}>
              Home
            </Link>
            <Link href="/products" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }}>
              Products
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: "#fff", fontWeight: 600, marginBottom: "1rem", fontSize: "0.95rem" }}>
            Get In Touch
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.875rem" }}>
            <a
              href="https://wa.me/234XXXXXXXXXX?text=Hello%20I%20have%20a%20question"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#16a34a", textDecoration: "none", transition: "opacity 0.2s" }}
            >
              💬 WhatsApp Us
            </a>
            <span>📧 support@marketnest.com</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "2rem auto 0",
          paddingTop: "1.5rem",
          borderTop: "1px solid #1f2937",
          textAlign: "center",
          fontSize: "0.8rem",
          color: "#6b7280",
        }}
      >
        © {new Date().getFullYear()} MarketNest. All rights reserved.
      </div>
    </footer>
  );
}
