/**
 * User API Service
 * 
 * Handles all user-related API calls:
 * - Get profile
 * - Get user menus
 * - User CRUD operations
 */

import apiClient from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

const userService = {
  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);

      // Backend returns: { status, code, message, data, errors }
      const { status, message, data } = response.data;

      if (!status) {
        throw new Error(message || 'Failed to fetch profile');
      }

      return {
        success: true,
        message: message || 'Profile retrieved successfully',
        data,
      };
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  /**
   * Update current user profile
   * @param {FormData} formData - Profile data including files
   * @returns {Promise<Object>} Updated user profile data
   */
  updateProfile: async (formData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USERS.UPDATE_PROFILE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Backend returns: { status, code, message, data, errors }
      const { status, message, data } = response.data;

      if (!status) {
        throw new Error(message || 'Failed to update profile');
      }

      return {
        success: true,
        message: message || 'Profile updated successfully',
        data,
      };
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Get user menus based on permissions
   * @returns {Promise<Object>} User menu structure with actions
   */
  getUserMenus: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.MENUS);

      // Backend returns: { status, code, message, data: { success, message, data }, errors }
      const { status, message, data } = response.data;

      if (!status) {
        throw new Error(message || 'Failed to fetch user menus');
      }

      return {
        success: true,
        message: message || 'User menus retrieved successfully',
        menus: data?.data || [], // Extract menu array from nested data
        permissions: userService.extractPermissions(data?.data || []),
      };
    } catch (error) {
      console.error('Get user menus error:', error);
      throw error;
    }
  },

  /**
   * Extract permissions from menu structure
   * Creates a flat map of permissions for easy checking
   * @param {Array} menus - Menu structure from API
   * @returns {Object} Permissions map
   */
  extractPermissions: (menus) => {
    const permissions = {};

    const processMenu = (menu) => {
      // Process actions for current menu
      if (menu.action && Array.isArray(menu.action)) {
        menu.action.forEach(action => {
          permissions[action.id] = {
            type: action.type,
            endpoint: action.endpoint,
            labelKey: action.labelKey,
            icon: action.icon,
          };
        });
      }

      // Process children recursively
      if (menu.children && Array.isArray(menu.children)) {
        menu.children.forEach(child => processMenu(child));
      }
    };

    menus.forEach(menu => processMenu(menu));
    return permissions;
  },

  /**
   * Check if user has specific permission
   * @param {Object} permissions - Permissions object
   * @param {string} permissionId - Permission ID to check
   * @returns {boolean} Whether user has permission
   */
  hasPermission: (permissions, permissionId) => {
    return !!permissions[permissionId];
  },

  /**
   * Get all users
   * @param {Object} params - Query parameters (page, type, search, per_page, etc.)
   * @returns {Promise<Object>} Users list with pagination
   */
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.LIST, { params });

      const { status, message, data } = response.data;

      if (!status) {
        throw new Error(message || 'Failed to fetch users');
      }

      return {
        success: true,
        message,
        data,
      };
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} User data
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.GET(id));

      const { status, message, data } = response.data;

      if (!status) {
        throw new Error(message || 'Failed to fetch user');
      }

      return {
        success: true,
        message,
        data,
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create new user
   * @param {Object|FormData} userData - User data
   * @returns {Promise<Object>} Created user
   */
  create: async (userData) => {
    try {
      // If userData is FormData, we need to set proper headers
      const config = {};
      if (userData instanceof FormData) {
        config.headers = {
          'Content-Type': 'multipart/form-data',
        };
      }

      const response = await apiClient.post(API_ENDPOINTS.USERS.CREATE, userData, config);

      const { status, message, data } = response.data;

      if (!status) {
        throw new Error(message || 'Failed to create user');
      }

      return {
        success: true,
        message,
        data,
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object|FormData} userData - Updated user data
   * @returns {Promise<Object>} Updated user
   */
  update: async (id, userData) => {
    try {
      // If userData is FormData, we need to set proper headers
      const config = {};
      if (userData instanceof FormData) {
        config.headers = {
          'Content-Type': 'multipart/form-data',
        };
      }

      const response = await apiClient.post(API_ENDPOINTS.USERS.UPDATE(id), userData, config);

      const { status, message, data } = response.data;

      if (!status) {
        throw new Error(message || 'Failed to update user');
      }

      return {
        success: true,
        message,
        data,
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise<Object>} Deletion response
   */
  delete: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));

      const { status, message, data } = response.data;

      if (!status) {
        throw new Error(message || 'Failed to delete user');
      }

      return {
        success: true,
        message,
        data,
      };
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
