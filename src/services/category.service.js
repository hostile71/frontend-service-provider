/**
 * Category API Service
 * 
 * Handles all category-related API calls
 */

import apiClient from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

const categoryService = {
  /**
   * Get all categories with pagination and search
   * @param {Object} params - Query parameters (page, search, per_page, etc.)
   * @returns {Promise<Object>} Categories list with pagination
   */
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.LIST, { params });

      const { status, message, data } = response.data;

      if (!status) {
        throw new Error(message || 'Failed to fetch categories');
      }

      return {
        success: true,
        message,
        data,
      };
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },

  /**
   * Get category by ID
   * @param {number} id - Category ID
   * @returns {Promise<Object>} Category data
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.GET(id));

      const { status, message, data } = response.data;

      if (!status) {
        throw new Error(message || 'Failed to fetch category');
      }

      return {
        success: true,
        message,
        data,
      };
    } catch (error) {
      console.error('Get category error:', error);
      throw error;
    }
  },

  /**
   * Create new category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Created category
   */
  create: async (categoryData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CATEGORIES.CREATE, categoryData);

      const { status, message, data } = response.data;

      if (!status) {
        throw new Error(message || 'Failed to create category');
      }

      return {
        success: true,
        message,
        data,
      };
    } catch (error) {
      console.error('Create category error:', error);
      throw error;
    }
  },

  /**
   * Update category
   * @param {number} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise<Object>} Updated category
   */
  update: async (id, categoryData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CATEGORIES.UPDATE(id), categoryData);

      const { status, message, data } = response.data;

      if (!status) {
        throw new Error(message || 'Failed to update category');
      }

      return {
        success: true,
        message,
        data,
      };
    } catch (error) {
      console.error('Update category error:', error);
      throw error;
    }
  },

  /**
   * Delete category
   * @param {number} id - Category ID
   * @returns {Promise<Object>} Deletion response
   */
  delete: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.CATEGORIES.DELETE(id));

      const { status, message, data } = response.data;

      if (!status) {
        throw new Error(message || 'Failed to delete category');
      }

      return {
        success: true,
        message,
        data,
      };
    } catch (error) {
      console.error('Delete category error:', error);
      throw error;
    }
  },
};

export default categoryService;
