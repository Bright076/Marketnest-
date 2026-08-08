"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    loadNotifications();
    subscribeToNotifications();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
    }
  };

  const loadNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToNotifications = () => {
    const channel = supabase
      .channel('notifications_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      order_confirmed: '✅',
      payment_received: '💳',
      processing: '⏳',
      shipped: '🚚',
      out_for_delivery: '📦',
      delivered: '🎉',
      cancelled: '❌',
      promotional_offer: '🎁',
      general_announcement: '📢'
    };
    return icons[type] || '🔔';
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.is_read).length;

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
          <p style={{ color: "#6b7280" }}>Loading notifications...</p>
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

  return (
    <div style={{ minHeight: "100vh", paddingTop: "60px", background: "#f9fafb" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/dashboard" style={{
            color: "#16a34a",
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem"
          }}>
            ← Back to Dashboard
          </Link>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#111827", marginBottom: "0.5rem" }}>
                Notifications
              </h1>
              <p style={{ color: "#6b7280" }}>
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)"
                }}
              >
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{
          background: "#ffffff",
          padding: "0.75rem",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          marginBottom: "1.5rem",
          display: "flex",
          gap: "0.5rem"
        }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: "0.5rem 1.5rem",
              background: filter === 'all' ? '#16a34a' : 'transparent',
              color: filter === 'all' ? '#ffffff' : '#6b7280',
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            style={{
              padding: "0.5rem 1.5rem",
              background: filter === 'unread' ? '#16a34a' : 'transparent',
              color: filter === 'unread' ? '#ffffff' : '#6b7280',
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div style={{
            background: "#ffffff",
            padding: "4rem 2rem",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
              {filter === 'unread' ? '✅' : '🔔'}
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
              {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
            </h3>
            <p style={{ color: "#6b7280" }}>
              {filter === 'unread' ? 'You have no unread notifications.' : 'You will receive notifications about your orders here.'}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  background: notification.is_read ? "#ffffff" : "#f0fdf4",
                  padding: "1.5rem",
                  borderRadius: "16px",
                  border: `2px solid ${notification.is_read ? "#e5e7eb" : "#bbf7d0"}`,
                  transition: "all 0.2s",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
                }}
              >
                <div style={{ display: "flex", gap: "1.25rem" }}>
                  <div style={{ fontSize: "2.5rem", flexShrink: 0 }}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", marginBottom: "0.75rem" }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        color: "#111827",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}>
                        {notification.title}
                        {!notification.is_read && (
                          <span style={{
                            width: "10px",
                            height: "10px",
                            background: "#16a34a",
                            borderRadius: "50%",
                            flexShrink: 0
                          }} />
                        )}
                      </h3>
                      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                        {!notification.is_read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            style={{
                              padding: "0.375rem 0.75rem",
                              background: "#dcfce7",
                              color: "#16a34a",
                              border: "1px solid #bbf7d0",
                              borderRadius: "6px",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              whiteSpace: "nowrap"
                            }}
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          style={{
                            padding: "0.375rem 0.75rem",
                            background: "#fee2e2",
                            color: "#ef4444",
                            border: "1px solid #fecaca",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            whiteSpace: "nowrap"
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p style={{
                      margin: "0 0 0.75rem 0",
                      fontSize: "0.95rem",
                      color: "#6b7280",
                      lineHeight: 1.6
                    }}>
                      {notification.message}
                    </p>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.85rem",
                      color: "#9ca3af"
                    }}>
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {formatDateTime(notification.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
