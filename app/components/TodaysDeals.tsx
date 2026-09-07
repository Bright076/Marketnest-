"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useRouter } from "next/navigation";
import { ButtonSpinner } from "./LoadingSpinner";

interface DealProduct {
  id: string;
  title: string;
  image_url: string;
  original_price: number;
  deal_price: number;
  deal_ends_at: string;
  category: string;
  product_type: string;
}

export default function TodaysDeals() {
  const [deals, setDeals] = useState<DealProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('products')
        .select('id, title, image_url, original_price, deal_price, deal_ends_at, category, product_type')
        .eq('is_deal', true)
        .gt('deal_ends_at', now)
        .gt('stock', 0)
        .order('deal_ends_at', { ascending: true })
        .limit(8);

      if (error) throw error;
      setDeals(data || []);
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = (original: number, deal: number) => {
    return Math.round(((original - deal) / original) * 100);
  };

  const calculateTimeLeft = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const handleAddToCart = async (deal: DealProduct) => {
    setAddingToCart(deal.id);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Guest checkout enabled - no login required
      // if (!user) {
      //   toast.warning("Please login to add items to cart");
      //   setTimeout(() => router.push("/login"), 1500);
      //   return;
      // }
      
      addToCart({
        id: deal.id,
        name: deal.title,
        price: `$${deal.deal_price.toFixed(2)}`,
        image: deal.image_url,
        type: deal.product_type as "local" | "cj",
        category: deal.category,
      });
      
      toast.success(`Added "${deal.title}" to cart!`);
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <section style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "3rem 1.5rem",
        width: "100%"
      }}>
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #f97316",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem"
          }} />
          <p>Loading deals...</p>
        </div>
      </section>
    );
  }

  if (deals.length === 0) {
    return (
      <section style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "3rem 1.5rem",
        width: "100%"
      }}>
        <h2 style={{
          fontSize: "clamp(1.5rem, 4vw, 1.85rem)",
          fontWeight: 800,
          color: "#111827",
          marginBottom: "2rem",
          letterSpacing: "-0.02em",
        }}>
          ⚡ Today's Deals
        </h2>
        
        <div style={{
          textAlign: "center",
          padding: "3rem 2rem",
          background: "#fef2f2",
          borderRadius: "16px",
          border: "2px dashed #fecaca"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎯</div>
          <h3 style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "0.5rem"
          }}>
            No deals available right now
          </h3>
          <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
            Check back soon for our next amazing deals!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "3rem 1.5rem",
      width: "100%"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "2.5rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div>
          <h2 style={{
            fontSize: "clamp(1.5rem, 4vw, 1.85rem)",
            fontWeight: 800,
            color: "#111827",
            margin: "0 0 0.4rem",
            letterSpacing: "-0.02em",
          }}>
            ⚡ Today's Deals
          </h2>
          <p style={{ color: "#6b7280", fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)", margin: 0 }}>
            Limited time offers - grab them before they're gone!
          </p>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1.5rem",
        width: "100%"
      }}>
        {deals.map((deal) => {
          const discount = calculateDiscount(deal.original_price, deal.deal_price);
          const timeLeft = calculateTimeLeft(deal.deal_ends_at);
          const isAdding = addingToCart === deal.id;

          return (
            <div
              key={deal.id}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
                display: "flex",
                flexDirection: "column",
                border: "2px solid rgba(249, 115, 22, 0.2)",
                transition: "all 0.3s",
                position: "relative"
              }}
            >
              {/* Discount Badge */}
              <div style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                padding: "0.5rem 0.75rem",
                borderRadius: "12px",
                fontSize: "0.85rem",
                fontWeight: 800,
                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
                zIndex: 10
              }}>
                {discount}% OFF
              </div>

              {/* Product Image */}
              <div style={{
                background: "#f8fafc",
                padding: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "220px",
              }}>
                <img
                  src={deal.image_url}
                  alt={deal.title}
                  style={{
                    objectFit: "contain",
                    maxHeight: "200px",
                    width: "auto",
                    maxWidth: "100%",
                  }}
                />
              </div>

              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", flexGrow: 1 }}>
                {/* Product Title */}
                <h3 style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#111827",
                  lineHeight: 1.4,
                  margin: 0,
                  minHeight: "2.8rem"
                }}>
                  {deal.title}
                </h3>

                {/* Pricing */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{
                    fontSize: "1.1rem",
                    color: "#9ca3af",
                    textDecoration: "line-through"
                  }}>
                    ${deal.original_price.toFixed(2)}
                  </span>
                  <span style={{
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    color: "#dc2626"
                  }}>
                    ${deal.deal_price.toFixed(2)}
                  </span>
                </div>

                {/* Timer */}
                <div style={{
                  padding: "0.75rem 1rem",
                  background: "#fef2f2",
                  borderRadius: "10px",
                  border: "2px solid #fecaca",
                  textAlign: "center"
                }}>
                  <div style={{
                    fontSize: "0.75rem",
                    color: "#991b1b",
                    fontWeight: 600,
                    marginBottom: "0.25rem"
                  }}>
                    ⏰ DEAL ENDS IN
                  </div>
                  <div style={{
                    fontSize: "0.95rem",
                    color: "#dc2626",
                    fontWeight: 800
                  }}>
                    {timeLeft}
                  </div>
                </div>

                <div style={{ flexGrow: 1 }} />

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(deal)}
                  disabled={isAdding}
                  style={{
                    width: "100%",
                    background: isAdding ? "#9ca3af" : "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                    color: "white",
                    padding: "0.875rem",
                    borderRadius: "12px",
                    fontWeight: 700,
                    border: "none",
                    cursor: isAdding ? "not-allowed" : "pointer",
                    fontSize: "0.95rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.5rem",
                    boxShadow: isAdding ? "none" : "0 4px 15px rgba(220, 38, 38, 0.3)",
                    transition: "all 0.3s",
                  }}
                >
                  {isAdding && <ButtonSpinner />}
                  {!isAdding && "🛒"}
                  {isAdding ? "Adding..." : "Grab This Deal"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
