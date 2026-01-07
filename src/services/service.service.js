/**
 * Service API Service
 *
 * Handles service-related API calls
 */

import apiClient from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

const serviceService = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SERVICES.LIST, { params });
      const { status, message, data } = response.data;
      if (!status) throw new Error(message || 'Failed to fetch services');
      return { success: true, message, data };
    } catch (error) {
      console.error('Get services error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SERVICES.GET(id));
      const { status, message, data } = response.data;
      if (!status) throw new Error(message || 'Failed to fetch service');
      return { success: true, message, data };
    } catch (error) {
      console.error('Get service error:', error);
      throw error;
    }
  },

  create: async (serviceData) => {
    try {
      const config = {};
      if (serviceData instanceof FormData) config.headers = { 'Content-Type': 'multipart/form-data' };
      const response = await apiClient.post(API_ENDPOINTS.SERVICES.CREATE, serviceData, config);
      const { status, message, data } = response.data;
      if (!status) throw new Error(message || 'Failed to create service');
      return { success: true, message, data };
    } catch (error) {
      console.error('Create service error:', error);
      throw error;
    }
  },

  update: async (id, serviceData) => {
    try {
      const config = {};
      if (serviceData instanceof FormData) config.headers = { 'Content-Type': 'multipart/form-data' };
      const response = await apiClient.post(API_ENDPOINTS.SERVICES.UPDATE(id), serviceData, config);
      const { status, message, data } = response.data;
      if (!status) throw new Error(message || 'Failed to update service');
      return { success: true, message, data };
    } catch (error) {
      console.error('Update service error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.SERVICES.DELETE(id));
      const { status, message, data } = response.data;
      if (!status) throw new Error(message || 'Failed to delete service');
      return { success: true, message, data };
    } catch (error) {
      console.error('Delete service error:', error);
      throw error;
    }
  },
};

export default serviceService;
