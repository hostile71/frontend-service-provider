/**
 * Subcategory API Service
 *
 * Handles subcategory-related API calls
 */

import apiClient from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

const subcategoryService = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SUBCATEGORIES.LIST, { params });
      const { status, message, data } = response.data;
      if (!status) throw new Error(message || 'Failed to fetch subcategories');
      return { success: true, message, data };
    } catch (error) {
      console.error('Get subcategories error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SUBCATEGORIES.GET(id));
      const { status, message, data } = response.data;
      if (!status) throw new Error(message || 'Failed to fetch subcategory');
      return { success: true, message, data };
    } catch (error) {
      console.error('Get subcategory error:', error);
      throw error;
    }
  },

  create: async (payload) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SUBCATEGORIES.CREATE, payload);
      const { status, message, data } = response.data;
      if (!status) throw new Error(message || 'Failed to create subcategory');
      return { success: true, message, data };
    } catch (error) {
      console.error('Create subcategory error:', error);
      throw error;
    }
  },

  update: async (id, payload) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SUBCATEGORIES.UPDATE(id), payload);
      const { status, message, data } = response.data;
      if (!status) throw new Error(message || 'Failed to update subcategory');
      return { success: true, message, data };
    } catch (error) {
      console.error('Update subcategory error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.SUBCATEGORIES.DELETE(id));
      const { status, message, data } = response.data;
      if (!status) throw new Error(message || 'Failed to delete subcategory');
      return { success: true, message, data };
    } catch (error) {
      console.error('Delete subcategory error:', error);
      throw error;
    }
  },
};

export default subcategoryService;
