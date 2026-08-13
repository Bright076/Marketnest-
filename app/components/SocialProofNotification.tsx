"use client";

import { useEffect, useState } from "react";

interface Notification {
  id: string;
  type: "order" | "delivery" | "review";
  name: string;
  location: string;
  product?: string;
  time: string;
  verified?: boolean;
}

// Realistic customer data pool
const CUSTOMER_DATA = [
  // US Customers
  { name: "Michael R.", location: "New York, USA", country: "🇺🇸" },
  { name: "Sarah J.", location: "Los Angeles, USA", country: "🇺🇸" },
  { name: "David K.", location: "Chicago, USA", country: "🇺🇸" },
  { name: "Jennifer L.", location: "Houston, USA", country: "🇺🇸" },
  { name: "Robert M.", location: "Miami, USA", country: "🇺🇸" },
  { name: "Emily S.", location: "Seattle, USA", country: "🇺🇸" },
  { name: "James W.", location: "Boston, USA", country: "🇺🇸" },
  { name: "Lisa T.", location: "Atlanta, USA", country: "🇺🇸" },
  
  // Nigerian Customers
  { name: "Chioma A.", location: "Lagos, Nigeria", country: "🇳🇬" },
  { name: "Tunde O.", location: "Abuja, Nigeria", country: "🇳🇬" },
  { name: "Amara N.", location: "Port Harcourt, Nigeria", country: "🇳🇬" },
  { name: "Ibrahim K.", location: "Kano, Nigeria", country: "🇳🇬" },
  { name: "Blessing E.", location: "Ibadan, Nigeria", country: "🇳🇬" },
  
  // UK Customers
  { name: "Oliver P.", location: "London, UK", country: "🇬🇧" },
  { name: "Emma W.", location: "Manchester, UK", country: "🇬🇧" },
  { name: "Harry B.", location: "Birmingham, UK", country: "🇬🇧" },
  
  // Canadian Customers
  { name: "Sophie L.", location: "Toronto, Canada", country: "🇨🇦" },
  { name: "Lucas M.", location: "Vancouver, Canada", country: "🇨🇦" },
  { name: "Ethan D.", location: "Montreal, Canada", country: "🇨🇦" },
  
  // Other Countries
  { name: "Pierre D.", location: "Paris, France", country: "🇫🇷" },
  { name: "Maria G.", location: "Madrid, Spain", country: "🇪🇸" },
  { name: "Hans M.", location: "Berlin, Germany", country: "🇩🇪" },
  { name: "Yuki T.", location: "Tokyo, Japan", country: "🇯🇵" },
  { name: "Ahmed S.", location: "Dubai, UAE", country: "🇦🇪" },
];

const PRODUCT_CATEGORIES = [
  "Wireless Earbuds",
  "Smart Watch",
  "Phone Case",
  "Portable Charger",
  "Bluetooth Speaker",
  "Camera Accessories",
  "Laptop Stand",
  "USB Cable",
  "Screen Protector",
  "Phone Holder",
  "Gaming Headset",
  "Fitness Tracker",
  "Tablet Case",
  "Power Bank",
  "Wall Charger"
];

const REVIEW_MESSAGES = [
  "⭐⭐⭐⭐⭐ \"Great quality, fast shipping!\"",
  "⭐⭐⭐⭐⭐ \"Exactly as described. Very satisfied!\"",
  "⭐⭐⭐⭐⭐ \"Amazing product! Highly recommend!\"",
  "⭐⭐⭐⭐⭐ \"Fast delivery and excellent service!\"",
  "⭐⭐⭐⭐⭐ \"Perfect! Will order again!\"",
];

function generateNotification(): Notification {
  const customer = CUSTOMER_DATA[Math.floor(Math.random() * CUSTOMER_DATA.length)];
  const types: Notification["type"][] = ["order", "delivery", "review"];
  const type = types[Math.floor(Math.random() * types.length)];
  
  // Time ago variations
  const timeOptions = [
    "2 minutes ago",
    "5 minutes ago",
    "8 minutes ago",
    "12 minutes ago",
    "15 minutes ago",
    "23 minutes ago",
    "1 hour ago",
    "2 hours ago"
  ];
  
  return {
    id: `notif-${Date.now()}-${Math.random()}`,
    type,
    name: customer.name,
    location: `${customer.country} ${customer.location}`,
    product: PRODUCT_CATEGORIES[Math.floor(Math.random() * PRODUCT_CATEGORIES.length)],
    time: timeOptions[Math.floor(Math.random() * timeOptions.length)],
    verified: Math.random() > 0.3 // 70% chance of verified
  };
}

export default function SocialProofNotification() {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Don't show on admin pages
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return;
    }

    // Show first notification after 10 seconds
    const initialDelay = setTimeout(() => {
      showNotification();
    }, 10000);

    return () => clearTimeout(initialDelay);
  }, []);

  const showNotification = () => {
    if (hasInteracted) return; // Don't show if user has closed any notification

    const newNotif = generateNotification();
    setNotification(newNotif);
    setIsVisible(true);

    // Auto-hide after 8 seconds
    setTimeout(() => {
      hideNotification();
    }, 8000);

    // Schedule next notification (random between 3-6 minutes)
    const nextDelay = Math.random() * (360000 - 180000) + 180000; // 3-6 minutes
    setTimeout(() => {
      showNotification();
    }, nextDelay);
  };

  const hideNotification = () => {
    setIsVisible(false);
    setTimeout(() => {
      setNotification(null);
    }, 300);
  };

  const handleClose = () => {
    setHasInteracted(true);
    hideNotification();
  };

  if (!notification) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: isVisible ? "24px" : "-200px",
        left: "24px",
        zIndex: 9999,
        maxWidth: "380px",
        width: "calc(100% - 48px)",
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
        padding: "16px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default"
      }}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "transparent",
          border: "none",
          color: "#9ca3af",
          fontSize: "20px",
          cursor: "pointer",
          padding: "4px",
          lineHeight: 1,
          transition: "color 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#374151"}
        onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}
      >
        ×
      </button>

      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        {/* Icon */}
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: notification.type === "delivery" 
              ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
              : notification.type === "review"
              ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
              : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            flexShrink: 0
          }}
        >
          {notification.type === "delivery" ? "📦" : notification.type === "review" ? "⭐" : "🛒"}
        </div>

        {/* Content */}
        <div style={{ flex: 1, paddingRight: "20px" }}>
          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "4px"
          }}>
            <span style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#111827"
            }}>
              {notification.name}
            </span>
            {notification.verified && (
              <span
                style={{
                  fontSize: "16px",
                  lineHeight: 1
                }}
                title="Verified Purchase"
              >
                ✓
              </span>
            )}
            <span style={{
              fontSize: "12px",
              color: "#6b7280"
            }}>
              {notification.location}
            </span>
          </div>

          {/* Message */}
          <div style={{
            fontSize: "13px",
            color: "#374151",
            marginBottom: "6px",
            lineHeight: 1.4
          }}>
            {notification.type === "order" && (
              <>
                Just ordered <strong>{notification.product}</strong>
              </>
            )}
            {notification.type === "delivery" && (
              <>
                Received <strong>{notification.product}</strong>
              </>
            )}
            {notification.type === "review" && (
              <>
                {REVIEW_MESSAGES[Math.floor(Math.random() * REVIEW_MESSAGES.length)]}
              </>
            )}
          </div>

          {/* Time */}
          <div style={{
            fontSize: "11px",
            color: "#9ca3af",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}>
            <span>🕐</span>
            {notification.time}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "#f3f4f6",
          borderRadius: "0 0 16px 16px",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            height: "100%",
            background: notification.type === "delivery" 
              ? "#10b981"
              : notification.type === "review"
              ? "#f59e0b"
              : "#3b82f6",
            animation: "progress 8s linear forwards"
          }}
        />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `
      }} />
    </div>
  );
}
