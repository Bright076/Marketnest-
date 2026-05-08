"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const hasCJProduct = cart.some((item) => item.type === "cj");

    if (hasCJProduct) {
      // Directs to standard form checkout path
      router.push("/checkout");
    } else {
      // 100% Local Product order skips checkout
      let orderText = "Hello, I want to order:\\n";
      cart.forEach((item) => {
        orderText += `- ${item.name} x${item.quantity}\\n`;
      });
      orderText += `\\nTotal: $${cartTotal.toFixed(2)}`;
      
      const encoded = encodeURIComponent(orderText);
      window.location.href = `https://wa.me/234XXXXXXXXXX?text=${encoded}`;
    }
  };

  if (cart.length === 0) {
    return (
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "5rem 1.5rem", textAlign: "center" }}>
        <h2>Your Cart is Empty</h2>
        <Link href="/products" style={{ display: "inline-block", marginTop: "1rem", padding: "0.8rem 2rem", background: "#374151", color: "white", borderRadius: "8px", textDecoration: "none" }}>
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <h1 style={{ marginBottom: "2rem" }}>Shopping Cart</h1>
      
      <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "1fr", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {cart.map((item) => (
            <div key={item.id} style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", padding: "1.5rem", background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", alignItems: "center" }}>
              <Image src={item.image} alt={item.name} width={80} height={80} unoptimized style={{ objectFit: "contain", background: "#f8fafc", padding: "8px", borderRadius: "8px" }} />
              <div style={{ flexGrow: 1 }}>
                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>{item.name}</h4>
                <div style={{ color: "#6b7280", fontSize: "0.9rem", fontWeight: 600 }}>{item.price}</div>
                <div style={{ marginTop: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", padding: "3px 8px", borderRadius: "6px", background: item.type === "local" ? "#dcfce7" : "#ffedd5", color: item.type === "local" ? "#166534" : "#9a3412", fontWeight: 700 }}>
                    {item.type === "local" ? "LOCAL" : "GLOBAL"}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: "0.5rem 1rem", border: "none", background: "#f3f4f6", cursor: "pointer" }}>-</button>
                  <span style={{ padding: "0 1rem", fontWeight: 600 }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: "0.5rem 1rem", border: "none", background: "#f3f4f6", cursor: "pointer" }}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ padding: "0.5rem", color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ background: "white", padding: "2rem", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.4rem" }}>Order Summary</h2>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "1.1rem" }}>
            <span>Subtotal</span>
            <span style={{ fontWeight: 700 }}>${cartTotal.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", fontSize: "1.1rem" }}>
            <span>Delivery</span>
            <span style={{ color: "#6b7280" }}>Calculated Next</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "1.5rem", borderTop: "1px solid #e5e7eb", marginBottom: "2rem", fontSize: "1.3rem", fontWeight: 800 }}>
             <span>Total</span>
             <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            style={{ width: "100%", padding: "1rem", background: "#111827", color: "white", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}
          >
            {cart.some(i => i.type === "cj") ? "Proceed to Secure Checkout" : "Order via WhatsApp"}
          </button>
          <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.85rem", color: "#6b7280" }}>
             {cart.some(i => i.type === "cj") ? "Contains Global items. Full checkout required." : "All items are Local. Fast checkout via WhatsApp!"}
          </div>
        </div>
      </div>
    </section>
  );
}
