/**
 * Role API Service
 * 
 * Handles all role-related API calls
 */

import apiClient from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

const roleService = {
  /**
   * Get all roles
   * @returns {Promise<Object>} Roles list
   */
  getAll: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ROLES.LIST);

      const { status, message, data } = response.data;

      if (!status) {
        throw new Error(message || 'Failed to fetch roles');
      }

      return {
        success: true,
        message,
        data,
      };
    } catch (error) {
      console.error('Get roles error:', error);
      throw error;
    }
  },
};

export default roleService;
