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
    customer_country: "United States",
    customer_state: "",
    customer_city: "",
    customer_address: "",
    customer_postal_code: "",
    order_notes: ""
  });
  const currency = "USD"; // Always USD

  useEffect(() => {
    checkAuthAndLoadProfile();
  }, []);

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
          customer_country: "United States",
          customer_state: "",
          customer_city: "",
          customer_address: "",
          customer_postal_code: "",
          order_notes: ""
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

      // Calculate total in USD
      const totalUSD = cartTotal;

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
              quantity: quantity,
              customer_name: formData.customer_name,
              customer_email: formData.customer_email,
              customer_phone: formData.customer_phone,
              customer_country: formData.customer_country,
              customer_state: formData.customer_state,
              customer_city: formData.customer_city,
              customer_address: formData.customer_address,
              customer_postal_code: formData.customer_postal_code || null,
              order_notes: formData.order_notes || null,
              amount_paid: itemTotal,
              currency: "USD",
              payment_method: "vendo_flutterwave",
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

      const orders = await Promise.all(orderPromises);
      const orderIds = orders.map(o => o.id);

      console.log('✅ Orders created:', orderIds);

      // Create payment with Vendo
      console.log('💳 Creating payment with Vendo...');
      
      const paymentResponse = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderIds: orderIds,
          customerInfo: {
            name: formData.customer_name,
            email: formData.customer_email,
            phone: formData.customer_phone
          },
          deliveryInfo: {
            country: formData.customer_country,
            state: formData.customer_state,
            city: formData.customer_city,
            address: formData.customer_address,
            postalCode: formData.customer_postal_code,
            notes: formData.order_notes
          },
          totalAmountUSD: totalUSD
        })
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Failed to create payment');
      }

      console.log('✅ Payment created:', paymentResult.partnerReference);

      // Clear cart before redirect
      clearCart();

      // Redirect to Vendo payment page
      window.location.href = paymentResult.paymentLink;

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

              {/* State/Province */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  State/Province *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customer_state}
                  onChange={(e) => setFormData({ ...formData, customer_state: e.target.value })}
                  placeholder="e.g., California, Lagos, Ontario"
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

              {/* City */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customer_city}
                  onChange={(e) => setFormData({ ...formData, customer_city: e.target.value })}
                  placeholder="e.g., Los Angeles, Ikeja, Toronto"
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

              {/* Address */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  Full Delivery Address *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.customer_address}
                  onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                  placeholder="Enter your complete street address including building/apartment number"
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

              {/* Postal Code */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  Postal/ZIP Code
                </label>
                <input
                  type="text"
                  value={formData.customer_postal_code}
                  onChange={(e) => setFormData({ ...formData, customer_postal_code: e.target.value })}
                  placeholder="Optional"
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

              {/* Order Notes */}
              <div style={{ marginBottom: "2rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  Order Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.order_notes}
                  onChange={(e) => setFormData({ ...formData, order_notes: e.target.value })}
                  placeholder="Any special delivery instructions or notes..."
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

              {/* Payment Notice */}
              <div style={{
                marginBottom: "2rem",
                padding: "1.5rem",
                background: "#f0fdf4",
                borderRadius: "12px",
                border: "2px solid #bbf7d0"
              }}>
                <h3 style={{ 
                  fontSize: "1rem", 
                  fontWeight: 700, 
                  color: "#166534",
                  marginBottom: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  💳 Secure Payment
                </h3>
                <p style={{ 
                  fontSize: "0.9rem", 
                  color: "#166534",
                  margin: 0,
                  lineHeight: 1.6
                }}>
                  You'll be redirected to our secure payment partner to complete your purchase. Your order will be confirmed once payment is successful.
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
                {submitting ? "Processing..." : `Proceed to Payment - $${displayTotal.toFixed(2)} USD`}
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

            {/* Payment Info */}
            <div style={{
              marginTop: "1.5rem",
              padding: "1rem",
              background: "#f0fdf4",
              borderRadius: "8px",
              border: "1px solid #bbf7d0"
            }}>
              <p style={{ fontSize: "0.85rem", color: "#166534", margin: 0 }}>
                💳 <strong>Secure Payment:</strong> You'll complete payment on the next page via Flutterwave.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
