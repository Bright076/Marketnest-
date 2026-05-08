"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  const router = useRouter();

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cart");
    }
  }, [cart, router]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    stateCity: "",
    address: "",
    postalCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentConfirm = () => {
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Please fill out the required delivery info (Name, Phone, Address) before confirming payment.");
      return;
    }

    let orderText = "Hello, I have paid for my order.\\n\\n*Order Details:*\\n";
    cart.forEach((item) => {
      orderText += `- ${item.name} x${item.quantity}\\n`;
    });
    orderText += `\\n*Total Amount:* $${cartTotal.toFixed(2)}\\n`;
    orderText += `*Status:* Payment claimed\\n\\n`;
    
    orderText += `*Customer details:*\\n`;
    orderText += `Name: ${formData.fullName}\\n`;
    orderText += `Phone: ${formData.phone}\\n`;
    orderText += `Email: ${formData.email}\\n`;
    
    orderText += `\\n*Delivery Address:*\\n`;
    orderText += `${formData.address}\\n`;
    orderText += `${formData.stateCity}, ${formData.postalCode}\\n`;
    orderText += `${formData.country}`;

    const encoded = encodeURIComponent(orderText);
    window.location.href = `https://wa.me/234XXXXXXXXXX?text=${encoded}`;
  };

  if (cart.length === 0) return null;

  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem", minHeight: "80vh" }}>
      <h1 style={{ marginBottom: "2rem", fontSize: "2rem" }}>Secure Checkout</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem" }}>
        
        {/* Delivery Details Form */}
        <div>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "1.5rem", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem" }}>Delivery Information</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.9rem", fontWeight: 500 }}>Full Name *</label>
              <input type="text" name="fullName" onChange={handleChange} required style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db" }} />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.9rem", fontWeight: 500 }}>Email Address</label>
                <input type="email" name="email" onChange={handleChange} style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.9rem", fontWeight: 500 }}>Phone / WhatsApp *</label>
                <input type="tel" name="phone" onChange={handleChange} required style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db" }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.9rem", fontWeight: 500 }}>Full Street Address *</label>
              <input type="text" name="address" onChange={handleChange} required style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.9rem", fontWeight: 500 }}>City / State</label>
                <input type="text" name="stateCity" onChange={handleChange} style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.9rem", fontWeight: 500 }}>Postal Code</label>
                <input type="text" name="postalCode" onChange={handleChange} style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.9rem", fontWeight: 500 }}>Country</label>
                <input type="text" name="country" onChange={handleChange} style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary & Payment Section */}
        <div>
          <div style={{ background: "#f8fafc", padding: "2rem", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.4rem", marginBottom: "1.5rem" }}>Order Summary</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                  <span>{item.name} <span style={{ color: "#6b7280" }}>x{item.quantity}</span></span>
                  <span style={{ fontWeight: 600 }}>{item.price}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid #d1d5db", fontSize: "1.2rem", fontWeight: 800 }}>
               <span>Total to Pay</span>
               <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", border: "2px solid #16a34a" }}>
            <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#166534" }}>Pay via Bank Transfer (Wise)</h2>
            <p style={{ fontSize: "0.95rem", color: "#4b5563", marginBottom: "1.5rem" }}>
              Please transfer exactly <strong>${cartTotal.toFixed(2)}</strong> to the following account details to complete your order.
            </p>
            
            <div style={{ background: "#f3f4f6", padding: "1.5rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
              <div style={{ marginBottom: "0.5rem" }}><span style={{ color: "#6b7280", fontSize: "0.85rem", display: "inline-block", width: "120px" }}>Account Name:</span> <strong style={{ fontFamily: "monospace", fontSize: "0.95rem" }}>MarketNest Global Ltd</strong></div>
              <div style={{ marginBottom: "0.5rem" }}><span style={{ color: "#6b7280", fontSize: "0.85rem", display: "inline-block", width: "120px" }}>Account Number:</span> <strong style={{ fontFamily: "monospace", fontSize: "0.95rem" }}>1234 5678 9012</strong></div>
              <div><span style={{ color: "#6b7280", fontSize: "0.85rem", display: "inline-block", width: "120px" }}>Bank Country:</span> <strong style={{ fontSize: "0.95rem" }}>United States (US)</strong></div>
            </div>

            <p style={{ fontSize: "0.85rem", color: "#6b7280", fontStyle: "italic", marginBottom: "1.5rem", lineHeight: 1.5 }}>
              Instruction: After payment, click &quot;I Have Paid&quot; below to confirm your order and send your details to our WhatsApp team.
            </p>

            <button
              onClick={handlePaymentConfirm}
              style={{ width: "100%", padding: "1.1rem", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}
            >
              ✅ I Have Paid
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
