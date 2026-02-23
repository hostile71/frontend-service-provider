/**
 * Notification Context
 * 
 * Manages notification state and provides methods for:
 * - Fetching notifications
 * - Managing read status
 * - Deleting notifications
 * - Polling for unread count
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notification.service';

export const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  // State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.getNotifications(page, 15);
      
      // Ensure we get an array
      const notificationsData = Array.isArray(response?.data) 
        ? response.data 
        : Array.isArray(response?.data?.data) 
        ? response.data.data 
        : [];
      
      if (page === 1) {
        setNotifications(notificationsData);
      } else {
        setNotifications(prev => [...prev, ...notificationsData]);
      }
      
      setCurrentPage(page);
      setHasMore(!!response?.links?.next);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
      // Ensure notifications is always an array
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount();
      // API returns unread_count under response.data
      setUnreadCount(response.data?.unread_count || 0);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, []);

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
      
      // Fetch updated unread count
      await fetchUnreadCount();
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError(err.message);
    }
  }, [fetchUnreadCount]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
      );
      
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
      setError(err.message);
    }
  }, []);

  // Delete single notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      
      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Fetch updated unread count
      await fetchUnreadCount();
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError(err.message);
    }
  }, [fetchUnreadCount]);

  // Delete all notifications
  const deleteAll = useCallback(async () => {
    try {
      await notificationService.deleteAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Error deleting all notifications:', err);
      setError(err.message);
    }
  }, []);

  // Load more notifications
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchNotifications(currentPage + 1);
    }
  }, [hasMore, loading, currentPage, fetchNotifications]);

  // Initial load and polling setup
  useEffect(() => {
    // Initial fetch
    fetchNotifications(1);
    fetchUnreadCount();

    // Poll for unread count every 30 seconds
    const pollInterval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [fetchNotifications, fetchUnreadCount]);

  const value = {
    notifications,
    unreadCount,
    loading,
    hasMore,
    error,
    currentPage,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAll,
    loadMore,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
