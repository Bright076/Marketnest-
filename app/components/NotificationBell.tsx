"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkUser();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      loadNotifications();
      subscribeToNotifications();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    setLoading(false);
  };

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const subscribeToNotifications = () => {
    // Subscribe to realtime changes
    const channel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Notification change:', payload);
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

      // Update local state
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
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

      const deletedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading || !user) {
    return null;
  }

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "relative",
          padding: "0.5rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#374151"
        }}
        aria-label="Notifications"
      >
        <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            background: "#ef4444",
            color: "white",
            borderRadius: "9999px",
            padding: "0.15rem 0.4rem",
            fontSize: "0.7rem",
            fontWeight: 800,
            minWidth: "18px",
            textAlign: "center"
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 0.5rem)",
          right: 0,
          width: "380px",
          maxWidth: "90vw",
          maxHeight: "500px",
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
          border: "1px solid #e5e7eb",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column"
        }}>
          {/* Header */}
          <div style={{
            padding: "1rem 1.25rem",
            borderBottom: "2px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h3 style={{
              margin: 0,
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#111827"
            }}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  padding: "0.35rem 0.75rem",
                  background: "#f0fdf4",
                  color: "#16a34a",
                  border: "1px solid #bbf7d0",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "0.5rem"
          }}>
            {notifications.length === 0 ? (
              <div style={{
                padding: "3rem 1rem",
                textAlign: "center",
                color: "#9ca3af"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🔔</div>
                <p style={{ margin: 0, fontSize: "0.95rem" }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                  style={{
                    padding: "0.875rem",
                    margin: "0.25rem 0",
                    borderRadius: "8px",
                    background: notification.is_read ? "#ffffff" : "#f0fdf4",
                    border: `1px solid ${notification.is_read ? "#f3f4f6" : "#bbf7d0"}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    position: "relative"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = notification.is_read ? "#f9fafb" : "#dcfce7";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = notification.is_read ? "#ffffff" : "#f0fdf4";
                  }}
                >
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{
                        margin: "0 0 0.25rem 0",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "#111827",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}>
                        {notification.title}
                        {!notification.is_read && (
                          <span style={{
                            width: "8px",
                            height: "8px",
                            background: "#16a34a",
                            borderRadius: "50%",
                            flexShrink: 0
                          }} />
                        )}
                      </h4>
                      <p style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "0.85rem",
                        color: "#6b7280",
                        lineHeight: 1.5
                      }}>
                        {notification.message}
                      </p>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <span style={{
                          fontSize: "0.75rem",
                          color: "#9ca3af"
                        }}>
                          {formatTime(notification.created_at)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          style={{
                            padding: "0.25rem 0.5rem",
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            fontWeight: 600
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: "0.75rem 1.25rem",
            borderTop: "2px solid #e5e7eb",
            textAlign: "center"
          }}>
            <Link
              href="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              style={{
                color: "#16a34a",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none"
              }}
            >
              View All Notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
