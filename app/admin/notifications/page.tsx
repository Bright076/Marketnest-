"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface User {
  id: string;
  email: string;
  full_name: string;
}

export default function AdminNotificationsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipient: 'all',
    specificUserId: '',
    title: '',
    message: '',
    type: 'general_announcement'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // First try to get non-admin users
      let { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .neq('role', 'admin')
        .order('full_name');

      // If that fails or returns empty, try without role filter
      if (error || !data || data.length === 0) {
        console.log('Trying to load all profiles...');
        const result = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .order('full_name');
        
        if (result.error) throw result.error;
        data = result.data;
      }
      
      console.log('Loaded users:', data);
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Failed to load customers. Check console for details.');
    }
  };

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.recipient === 'all') {
        // Send to all users
        const notifications = users.map(user => ({
          user_id: user.id,
          title: formData.title,
          message: formData.message,
          type: formData.type,
          is_read: false
        }));

        const { error } = await supabase
          .from('notifications')
          .insert(notifications);

        if (error) throw error;

        alert(`✅ Notification sent to ${users.length} customers!`);
      } else {
        // Send to specific user
        const { error } = await supabase
          .from('notifications')
          .insert([{
            user_id: formData.specificUserId,
            title: formData.title,
            message: formData.message,
            type: formData.type,
            is_read: false
          }]);

        if (error) throw error;

        const selectedUser = users.find(u => u.id === formData.specificUserId);
        alert(`✅ Notification sent to ${selectedUser?.full_name || 'customer'}!`);
      }

      // Reset form
      setFormData({
        recipient: 'all',
        specificUserId: '',
        title: '',
        message: '',
        type: 'general_announcement'
      });
    } catch (error: any) {
      console.error('Error sending notification:', error);
      alert('❌ Failed to send notification: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const notificationTypes = [
    { value: 'order_confirmed', label: '✅ Order Confirmed', icon: '✅' },
    { value: 'payment_received', label: '💳 Payment Received', icon: '💳' },
    { value: 'processing', label: '⏳ Processing', icon: '⏳' },
    { value: 'shipped', label: '🚚 Shipped', icon: '🚚' },
    { value: 'out_for_delivery', label: '📦 Out for Delivery', icon: '📦' },
    { value: 'delivered', label: '🎉 Delivered', icon: '🎉' },
    { value: 'cancelled', label: '❌ Cancelled', icon: '❌' },
    { value: 'promotional_offer', label: '🎁 Promotional Offer', icon: '🎁' },
    { value: 'general_announcement', label: '📢 General Announcement', icon: '📢' }
  ];

  const quickTemplates = [
    {
      title: 'Flash Sale Alert',
      message: 'Don\'t miss out! Get 20% off on all products for the next 24 hours. Use code: FLASH20',
      type: 'promotional_offer'
    },
    {
      title: 'New Products Available',
      message: 'Check out our latest collection of products just added to the store!',
      type: 'general_announcement'
    },
    {
      title: 'System Maintenance Notice',
      message: 'We\'ll be performing system maintenance on [DATE] from [TIME] to [TIME]. The site may be temporarily unavailable.',
      type: 'general_announcement'
    },
    {
      title: 'Thank You Message',
      message: 'Thank you for being a valued customer! We appreciate your continued support.',
      type: 'general_announcement'
    }
  ];

  const applyTemplate = (template: typeof quickTemplates[0]) => {
    setFormData({
      ...formData,
      title: template.title,
      message: template.message,
      type: template.type
    });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
          Send Notifications
        </h1>
        <p style={{ color: "#6b7280" }}>
          Send notifications to your customers
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
        {/* Notification Form */}
        <div style={{
          background: "#ffffff",
          padding: "2rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
        }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
            Create Notification
          </h2>

          {/* Debug Info */}
          {users.length === 0 && (
            <div style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              background: "#fef3c7",
              borderRadius: "8px",
              border: "1px solid #fde047"
            }}>
              <p style={{ fontSize: "0.85rem", color: "#92400e", margin: 0 }}>
                ⚠️ No customers found. Check browser console for details, or verify that users have signed up.
              </p>
            </div>
          )}

          <form onSubmit={sendNotification}>
            {/* Recipient Selection */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "0.5rem"
              }}>
                Send To *
              </label>
              <select
                required
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value, specificUserId: '' })}
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
                <option value="all">All Customers ({users.length})</option>
                <option value="specific">Specific Customer</option>
              </select>
            </div>

            {/* Specific User Selection */}
            {formData.recipient === 'specific' && (
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  Select Customer *
                </label>
                <select
                  required
                  value={formData.specificUserId}
                  onChange={(e) => setFormData({ ...formData, specificUserId: e.target.value })}
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
                  <option value="">Choose a customer...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name || 'No name'} ({user.email || 'No email'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Notification Type */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "0.5rem"
              }}>
                Notification Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                {notificationTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "0.5rem"
              }}>
                Notification Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter notification title..."
                maxLength={255}
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

            {/* Message */}
            <div style={{ marginBottom: "2rem" }}>
              <label style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "0.5rem"
              }}>
                Message *
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Enter your notification message..."
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
              <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: "0.5rem" }}>
                {formData.message.length} characters
              </div>
            </div>

            {/* Preview */}
            {(formData.title || formData.message) && (
              <div style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                background: "#f9fafb",
                borderRadius: "8px",
                border: "1px solid #e5e7eb"
              }}>
                <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem", fontWeight: 600 }}>
                  Preview:
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <div style={{ fontSize: "1.5rem" }}>
                    {notificationTypes.find(t => t.value === formData.type)?.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "0.95rem", fontWeight: 700, color: "#111827" }}>
                      {formData.title || 'Notification Title'}
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.5 }}>
                      {formData.message || 'Notification message will appear here...'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "1rem",
                background: loading ? "#9ca3af" : "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.05rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 12px rgba(22, 163, 74, 0.3)"
              }}
            >
              {loading ? 'Sending...' : formData.recipient === 'all' ? `Send to All Customers (${users.length})` : 'Send Notification'}
            </button>
          </form>
        </div>

        {/* Quick Templates */}
        <div style={{
          background: "#ffffff",
          padding: "2rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
        }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
            Quick Templates
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {quickTemplates.map((template, index) => (
              <div
                key={index}
                onClick={() => applyTemplate(template)}
                style={{
                  padding: "1rem",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0fdf4";
                  e.currentTarget.style.borderColor = "#bbf7d0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f9fafb";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem", fontWeight: 700, color: "#111827" }}>
                  {template.title}
                </h4>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.5 }}>
                  {template.message.substring(0, 100)}{template.message.length > 100 ? '...' : ''}
                </p>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#eff6ff",
            borderRadius: "8px",
            border: "1px solid #bfdbfe"
          }}>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", fontWeight: 700, color: "#1e40af" }}>
              💡 Auto-Notifications
            </h4>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#1e40af", lineHeight: 1.6 }}>
              Order status notifications are sent automatically when you update an order status. Use this form to send custom announcements and promotional offers.
            </p>
          </div>

          {/* Stats */}
          <div style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#f0fdf4",
            borderRadius: "8px",
            border: "1px solid #bbf7d0"
          }}>
            <div style={{ fontSize: "0.85rem", color: "#166534", marginBottom: "0.5rem", fontWeight: 600 }}>
              Customer Stats
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#16a34a" }}>
                  {users.length}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#166534" }}>
                  Total Customers
                </div>
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#16a34a" }}>
                  {users.filter(u => u.full_name).length}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#166534" }}>
                  Active Users
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
