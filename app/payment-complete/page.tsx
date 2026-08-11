"use client";

import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  amount_paid: number;
  order_status: string;
  payment_status: string;
  currency: string;
  flutterwave_transaction_id?: string;
  paid_at?: string;
  created_at: string;
  products?: {
    title: string;
    image_url: string;
  };
}

function PaymentCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'failed'>('pending');

  useEffect(() => {
    if (orderId) {
      checkPaymentStatus();
      // Set up polling to check payment status every 3 seconds for up to 30 seconds
      const pollInterval = setInterval(checkPaymentStatus, 3000);
      const timeout = setTimeout(() => {
        clearInterval(pollInterval);
        setCheckingPayment(false);
      }, 30000);

      return () => {
        clearInterval(pollInterval);
        clearTimeout(timeout);
      };
    } else {
      router.push('/');
    }
  }, [orderId]);

  const checkPaymentStatus = async () => {
    try {
      // Find orders by merchant_order_id (which is the first order's ID)
      const { data: ordersList, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            title,
            image_url
          )
        `)
        .eq('merchant_order_id', orderId);

      if (error) throw error;

      if (!ordersList || ordersList.length === 0) {
        throw new Error('Order not found');
      }

      setOrders(ordersList);

      // Check payment status
      const firstOrder = ordersList[0];
      if (firstOrder.payment_status === 'paid') {
        setPaymentStatus('paid');
        setCheckingPayment(false);
      } else if (firstOrder.payment_status === 'failed') {
        setPaymentStatus('failed');
        setCheckingPayment(false);
      }

    } catch (error) {
      console.error('Error loading order:', error);
      setPaymentStatus('failed');
      setCheckingPayment(false);
    } finally {
      setLoading(false);
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
          <p style={{ color: "#6b7280" }}>Loading...</p>
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

  if (checkingPayment) {
    return (
      <div style={{ minHeight: "100vh", paddingTop: "60px", background: "#f9fafb" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              width: "100px",
              height: "100px",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)"
            }}>
              <div style={{
                width: "50px",
                height: "50px",
                border: "4px solid rgba(255, 255, 255, 0.3)",
                borderTop: "4px solid #ffffff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }} />
            </div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#111827", marginBottom: "0.5rem" }}>
              Verifying Your Payment...
            </h1>
            <p style={{ fontSize: "1.1rem", color: "#6b7280", marginBottom: "2rem" }}>
              Please wait while we confirm your payment with the bank
            </p>
          </div>

          <div style={{
            background: "#ffffff",
            padding: "2rem",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            textAlign: "center"
          }}>
            <p style={{ fontSize: "1rem", color: "#6b7280", lineHeight: 1.8 }}>
              This usually takes a few seconds. Please don't close this page.
            </p>
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}} />
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed' || orders.length === 0) {
    return (
      <div style={{ minHeight: "100vh", paddingTop: "60px", background: "#f9fafb" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              width: "100px",
              height: "100px",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              boxShadow: "0 8px 24px rgba(239, 68, 68, 0.3)"
            }}>
              <span style={{ fontSize: "3rem", color: "#ffffff" }}>✕</span>
            </div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#111827", marginBottom: "0.5rem" }}>
              Payment Failed
            </h1>
            <p style={{ fontSize: "1.1rem", color: "#6b7280" }}>
              We couldn't confirm your payment
            </p>
          </div>

          <div style={{
            background: "#ffffff",
            padding: "2rem",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            marginBottom: "1.5rem"
          }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: "1rem" }}>
              What happened?
            </h3>
            <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#6b7280", lineHeight: "1.8" }}>
              <li>Payment may have been cancelled</li>
              <li>There might have been an issue with your card</li>
              <li>The transaction may not have been completed</li>
            </ul>
          </div>

          <div style={{ display: "grid", gap: "1rem" }}>
            <Link href="/checkout" style={{
              padding: "1rem",
              background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: 700,
              textDecoration: "none",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)"
            }}>
              Try Again
            </Link>
            <Link href="/products" style={{
              padding: "1rem",
              background: "#ffffff",
              color: "#16a34a",
              border: "2px solid #16a34a",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: 700,
              textDecoration: "none",
              textAlign: "center"
            }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Payment successful
  const firstOrder = orders[0];
  const totalAmount = orders.reduce((sum, order) => sum + Number(order.amount_paid), 0);

  return (
    <div style={{ minHeight: "100vh", paddingTop: "60px", background: "#f9fafb" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Success Animation */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "100px",
            height: "100px",
            background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            boxShadow: "0 8px 24px rgba(22, 163, 74, 0.3)",
            animation: "scaleIn 0.5s ease-out"
          }}>
            <span style={{ fontSize: "3rem", color: "#ffffff" }}>✓</span>
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#111827", marginBottom: "0.5rem" }}>
            Payment Successful!
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#6b7280" }}>
            Thank you for your order, {firstOrder.customer_name}
          </p>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scaleIn {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}} />

        {/* Order Details Card */}
        <div style={{
          background: "#ffffff",
          padding: "2rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          marginBottom: "1.5rem",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
            Order Details
          </h2>

          {/* Order ID */}
          <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#f9fafb", borderRadius: "8px" }}>
            <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Order ID</p>
            <p style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", fontFamily: "monospace", margin: 0 }}>
              {firstOrder.merchant_order_id || firstOrder.id}
            </p>
          </div>

          {/* Transaction ID */}
          {firstOrder.flutterwave_transaction_id && (
            <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#f9fafb", borderRadius: "8px" }}>
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Transaction ID</p>
              <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#111827", fontFamily: "monospace", margin: 0 }}>
                {firstOrder.flutterwave_transaction_id}
              </p>
            </div>
          )}

          {/* Products */}
          {orders.map((order, index) => (
            <div key={order.id} style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1.5rem",
              padding: "1rem",
              background: "#f9fafb",
              borderRadius: "12px"
            }}>
              {order.products?.image_url && (
                <img
                  src={order.products.image_url}
                  alt={order.products.title}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                    borderRadius: "8px"
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
                  {order.products?.title || 'Product'}
                </h3>
                <p style={{ fontSize: "1.25rem", fontWeight: 900, color: "#16a34a", margin: 0 }}>
                  ${Number(order.amount_paid).toFixed(2)} USD
                </p>
              </div>
            </div>
          ))}

          {/* Total */}
          <div style={{
            padding: "1rem",
            background: "#f0fdf4",
            borderRadius: "8px",
            border: "2px solid #bbf7d0",
            marginBottom: "1.5rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#166534" }}>Total Paid</span>
              <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#16a34a" }}>
                ${totalAmount.toFixed(2)} USD
              </span>
            </div>
          </div>

          {/* Delivery Info */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: "1rem" }}>
              Delivery Information
            </h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <div>
                <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Name</p>
                <p style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                  {firstOrder.customer_name}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Phone</p>
                <p style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                  {firstOrder.customer_phone}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Address</p>
                <p style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                  {firstOrder.customer_address}
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem"
          }}>
            <div style={{
              padding: "1rem",
              background: "#f0fdf4",
              borderRadius: "8px",
              border: "1px solid #bbf7d0"
            }}>
              <p style={{ fontSize: "0.85rem", color: "#166534", marginBottom: "0.25rem" }}>Order Status</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#16a34a", margin: 0, textTransform: "capitalize" }}>
                {firstOrder.order_status}
              </p>
            </div>
            <div style={{
              padding: "1rem",
              background: "#f0fdf4",
              borderRadius: "8px",
              border: "1px solid #bbf7d0"
            }}>
              <p style={{ fontSize: "0.85rem", color: "#166534", marginBottom: "0.25rem" }}>Payment Status</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#16a34a", margin: 0, textTransform: "capitalize" }}>
                {firstOrder.payment_status}
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div style={{
          background: "#f0fdf4",
          padding: "1.5rem",
          borderRadius: "12px",
          border: "1px solid #bbf7d0",
          marginBottom: "1.5rem"
        }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#166534", marginBottom: "0.75rem" }}>
            📦 What's Next?
          </h3>
          <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#166534", lineHeight: "1.8" }}>
            <li>Your order is being processed</li>
            <li>You'll receive updates via email and phone</li>
            <li>Track your order status in "My Orders"</li>
            <li>Delivery typically takes 3-7 business days</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem"
        }}>
          <Link href="/my-orders" style={{
            padding: "1rem",
            background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: 700,
            textDecoration: "none",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)"
          }}>
            View My Orders
          </Link>
          <Link href="/products" style={{
            padding: "1rem",
            background: "#ffffff",
            color: "#16a34a",
            border: "2px solid #16a34a",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: 700,
            textDecoration: "none",
            textAlign: "center"
          }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCompletePage() {
  return (
    <Suspense fallback={
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
          <p style={{ color: "#6b7280" }}>Loading...</p>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}} />
      </div>
    }>
      <PaymentCompleteContent />
    </Suspense>
  );
}
