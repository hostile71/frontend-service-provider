/**
 * Promotion API Service
 *
 * Handles promotion-related API calls
 */

import apiClient from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

const promotionService = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PROMOTIONS.LIST, { params });
      const { status, message, data } = response.data;
      if (!status) throw new Error(message || 'Failed to fetch promotions');
      return { success: true, message, data };
    } catch (error) {
      console.error('Get promotions error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PROMOTIONS.GET(id));
      const { status, message, data } = response.data;
      if (!status) throw new Error(message || 'Failed to fetch promotion');
      return { success: true, message, data };
    } catch (error) {
      console.error('Get promotion error:', error);
      throw error;
    }
  },

  create: async (promotionData) => {
    try {
      const config = {};
      if (promotionData instanceof FormData) config.headers = { 'Content-Type': 'multipart/form-data' };
      const response = await apiClient.post(API_ENDPOINTS.PROMOTIONS.CREATE, promotionData, config);
      const { status, message, data } = response.data;
      if (!status) throw new Error(message || 'Failed to create promotion');
      return { success: true, message, data };
    } catch (error) {
      console.error('Create promotion error:', error);
      throw error;
    }
  },

  update: async (id, promotionData) => {
    try {
      const config = {};
      if (promotionData instanceof FormData) config.headers = { 'Content-Type': 'multipart/form-data' };
      const response = await apiClient.post(API_ENDPOINTS.PROMOTIONS.UPDATE(id), promotionData, config);
      const { status, message, data } = response.data;
      if (!status) throw new Error(message || 'Failed to update promotion');
      return { success: true, message, data };
    } catch (error) {
      console.error('Update promotion error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.PROMOTIONS.DELETE(id));
      const { status, message, data } = response.data;
      if (!status) throw new Error(message || 'Failed to delete promotion');
      return { success: true, message, data };
    } catch (error) {
      console.error('Delete promotion error:', error);
      throw error;
    }
  },
};

export default promotionService;
