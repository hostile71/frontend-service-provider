/**
 * Notification API Service
 * 
 * Handles all notification-related API calls:
 * - Get notifications (paginated)
 * - Get unread count
 * - Get grouped notifications
 * - Mark as read (single & all)
 * - Delete notifications (single & all)
 */

import apiClient from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

const notificationService = {
  /**
   * Get all notifications (paginated)
   * @param {number} page - Page number (default 1)
   * @param {number} perPage - Items per page (default 15)
   * @returns {Promise<Object>} Notifications response
   */
  getNotifications: async (page = 1, perPage = 15) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.NOTIFICATIONS.LIST}?page=${page}&per_page=${perPage}`
      );

      return response.data;
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      throw error;
    }
  },

  /**
   * Get unread notification count
   * @returns {Promise<Object>} Unread count response
   */
  getUnreadCount: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching unread count:', error);
      throw error;
    }
  },

  /**
   * Get notifications grouped by type
   * @returns {Promise<Object>} Grouped notifications response
   */
  getGroupedNotifications: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.GROUPED);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching grouped notifications:', error);
      throw error;
    }
  },

  /**
   * Mark single notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} Response
   */
  markAsRead: async (notificationId) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId)
      );
      return response.data;
    } catch (error) {
      console.error(`❌ Error marking notification ${notificationId} as read:`, error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   * @returns {Promise<Object>} Response
   */
  markAllAsRead: async () => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
      return response.data;
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Delete single notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} Response
   */
  deleteNotification: async (notificationId) => {
    try {
      const response = await apiClient.delete(
        API_ENDPOINTS.NOTIFICATIONS.DELETE(notificationId)
      );
      return response.data;
    } catch (error) {
      console.error(`❌ Error deleting notification ${notificationId}:`, error);
      throw error;
    }
  },

  /**
   * Delete all notifications
   * @returns {Promise<Object>} Response
   */
  deleteAll: async () => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE_ALL);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting all notifications:', error);
      throw error;
    }
  },
};

export default notificationService;
