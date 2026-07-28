"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    customer_country: "United States"
  });
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");
  const currency = "USD"; // Always USD

  useEffect(() => {
    checkAuthAndLoadProfile();
  }, []);

  useEffect(() => {
    // Update payment method based on country
    if (formData.customer_country === "Nigeria") {
      setPaymentMethod("card");
    } else {
      setPaymentMethod("crypto");
    }
  }, [formData.customer_country]);

  const checkAuthAndLoadProfile = async () => {
    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("Please login to checkout");
        router.push("/login");
        return;
      }

      // Load user profile to pre-fill form
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFormData({
          customer_name: profile.full_name || "",
          customer_email: user.email || "",
          customer_phone: profile.phone || "",
          customer_address: "",
          customer_country: "United States"
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Calculate total in USD (no conversion)
      const totalUSD = cartTotal;
      const totalAmount = totalUSD;

      // Create orders for each product in cart
      const orderPromises = cart.map(async (item) => {
        const productId = item.id;
        const quantity = item.quantity;
        const itemPrice = parseFloat(item.price.replace('$', ''));
        const itemTotal = itemPrice * quantity;

        const { data: order, error } = await supabase
          .from('orders')
          .insert([
            {
              user_id: user.id,
              product_id: productId,
              customer_name: formData.customer_name,
              customer_phone: formData.customer_phone,
              customer_address: formData.customer_address,
              amount_paid: itemTotal,
              currency: "USD",
              payment_method: paymentMethod,
              payment_status: 'pending',
              order_status: 'pending'
            }
          ])
          .select()
          .single();

        if (error) throw error;

        // Update product stock
        const { data: currentProduct } = await supabase
          .from('products')
          .select('stock')
          .eq('id', productId)
          .single();

        if (currentProduct && currentProduct.stock > 0) {
          const newStock = Math.max(0, currentProduct.stock - quantity);
          await supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', productId);
        }

        return order;
      });

      await Promise.all(orderPromises);

      // Clear cart
      clearCart();

      // Redirect to success page
      router.push('/orders/success');
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert('Failed to create order: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", paddingTop: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
          <p style={{ color: "#6b7280" }}>Loading checkout...</p>
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

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: "100vh", paddingTop: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
            Your cart is empty
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
            Add some products to your cart to checkout
          </p>
          <Link href="/products" style={{
            padding: "0.75rem 1.5rem",
            background: "#16a34a",
            color: "#ffffff",
            borderRadius: "12px",
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-block"
          }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const totalUSD = cartTotal;
  const displayTotal = totalUSD;

  return (
    <div style={{ minHeight: "100vh", paddingTop: "60px", background: "#f9fafb" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#111827", marginBottom: "2rem" }}>
          Checkout
        </h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem"
        }}>
          {/* Order Form */}
          <div style={{
            background: "#ffffff",
            padding: "2rem",
            borderRadius: "16px",
            border: "1px solid #e5e7eb"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
              Delivery Information
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none"
                  }}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none"
                  }}
                />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none"
                  }}
                />
              </div>

              {/* Country */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  Country *
                </label>
                <select
                  required
                  value={formData.customer_country}
                  onChange={(e) => setFormData({ ...formData, customer_country: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    background: "#ffffff"
                  }}
                >
                  <option value="United States">🇺🇸 United States</option>
                  <option value="Nigeria">🇳🇬 Nigeria</option>
                  <option value="United Kingdom">🇬🇧 United Kingdom</option>
                  <option value="Canada">🇨🇦 Canada</option>
                  <option value="Australia">🇦🇺 Australia</option>
                  <option value="Other">🌍 Other</option>
                </select>
              </div>

              {/* Address */}
              <div style={{ marginBottom: "2rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  Delivery Address *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.customer_address}
                  onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                  placeholder="Enter your full delivery address"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    resize: "vertical"
                  }}
                />
              </div>

              {/* Payment Method Info */}
              <div style={{
                marginBottom: "2rem",
                padding: "1.5rem",
                background: formData.customer_country === "Nigeria" ? "#eff6ff" : "#f0fdf4",
                borderRadius: "12px",
                border: formData.customer_country === "Nigeria" ? "2px solid #bfdbfe" : "2px solid #bbf7d0"
              }}>
                <h3 style={{ 
                  fontSize: "1rem", 
                  fontWeight: 700, 
                  color: formData.customer_country === "Nigeria" ? "#1e40af" : "#166534",
                  marginBottom: "0.75rem" 
                }}>
                  💳 Payment Method
                </h3>
                <p style={{ 
                  fontSize: "0.9rem", 
                  color: formData.customer_country === "Nigeria" ? "#1e40af" : "#166534",
                  margin: 0,
                  lineHeight: 1.6
                }}>
                  {formData.customer_country === "Nigeria" ? (
                    <>
                      <strong>Card Payment (USD)</strong><br />
                      Pay securely with debit/credit card. Amount in US Dollars.
                    </>
                  ) : (
                    <>
                      <strong>Crypto Payment (USD)</strong><br />
                      You will receive wallet address after placing your order.
                    </>
                  )}
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: submitting ? "#9ca3af" : "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  boxShadow: submitting ? "none" : "0 4px 12px rgba(22, 163, 74, 0.3)"
                }}
              >
                {submitting ? "Processing..." : `Place Order ($${displayTotal.toFixed(2)} USD)`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div style={{
            background: "#ffffff",
            padding: "2rem",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            height: "fit-content"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
              Order Summary
            </h2>

            {/* Cart Items */}
            <div style={{ marginBottom: "1.5rem" }}>
              {cart.map((item) => (
                <div key={item.id} style={{
                  display: "flex",
                  gap: "1rem",
                  marginBottom: "1rem",
                  padding: "1rem",
                  background: "#f9fafb",
                  borderRadius: "12px"
                }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "contain",
                      borderRadius: "8px"
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827", marginBottom: "0.25rem" }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                      Qty: {item.quantity} × {item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div style={{ borderTop: "2px solid #e5e7eb", paddingTop: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ color: "#6b7280" }}>Subtotal</span>
                <span style={{ fontWeight: 600, color: "#111827" }}>${totalUSD.toFixed(2)} USD</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <span style={{ color: "#6b7280" }}>Delivery</span>
                <span style={{ fontWeight: 600, color: "#6b7280" }}>Calculated later</span>
              </div>
              
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1rem",
                background: "#f0fdf4",
                borderRadius: "8px",
                border: "2px solid #bbf7d0"
              }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#166534" }}>Total</span>
                <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#16a34a" }}>
                  ${displayTotal.toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* Currency Info */}
            <div style={{
              marginTop: "1.5rem",
              padding: "1rem",
              background: "#fef3c7",
              borderRadius: "8px",
              border: "1px solid #fde047"
            }}>
              <p style={{ fontSize: "0.85rem", color: "#92400e", margin: 0 }}>
                💡 All prices in US Dollars (USD). {formData.customer_country === "Nigeria" ? "Card payment accepted." : "Crypto payment available."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
