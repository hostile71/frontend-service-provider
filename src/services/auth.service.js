/**
 * Authentication API Service
 * 
 * Handles all authentication-related API calls:
 * - Login
 * - 2FA Verification
 * - Logout
 * - Token Refresh
 */

import apiClient from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

const authService = {
  /**
   * Login user with email and password
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Login response
   */
  login: async (credentials) => {
    try {
      // Create FormData for form-data request
      const formData = new FormData();
      formData.append('email', credentials.email);
      formData.append('password', credentials.password);

      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Backend returns: { status, code, message, data, errors }
      const { status, message, data } = response.data;

      if (!status) {
        throw new Error(message || 'Login failed');
      }

      return {
        success: true,
        message: message || 'Login successful',
        data,
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify 2FA code
   * @param {Object} verificationData - 2FA verification data
   * @param {string} verificationData.email - User email
   * @param {string} verificationData.code - 2FA code
   * @returns {Promise<Object>} Verification response with auth token
   */
  verify2FA: async (verificationData) => {
    try {
      // Create FormData for form-data request
      const formData = new FormData();
      formData.append('email', verificationData.email);
      formData.append('code', verificationData.code);

      const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_2FA, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Backend returns: { status, code, message, data: { token }, errors }
      const { status, message, data } = response.data;

      if (!status) {
        throw new Error(message || '2FA verification failed');
      }

      // Store auth token if verification successful
      if (data?.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userEmail', verificationData.email);
        localStorage.setItem('2faVerified', 'true');
      }

      return {
        success: true,
        message: message || '2FA verified successfully',
        token: data?.token,
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user
   * @returns {Promise<Object>} Logout response
   */
  logout: async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);

      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('2faVerified');

      return response.data;
    } catch (error) {
      // Clear local storage even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('2faVerified');
      
      throw error;
    }
  },

  /**
   * Refresh authentication token
   * @returns {Promise<Object>} New token response
   */
  refreshToken: async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);

      // Update token if refresh successful
      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const verified = localStorage.getItem('2faVerified');
    return !!(token && verified === 'true');
  },

  /**
   * Get current user email
   * @returns {string|null} User email
   */
  getCurrentUserEmail: () => {
    return localStorage.getItem('userEmail');
  },

  /**
   * Get authentication token
   * @returns {string|null} Auth token
   */
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  /**
   * Resend 2FA code to user's email
   * @param {string} email - User email
   * @returns {Promise<Object>} Response with success status
   */
  resend2FACode: async (email) => {
    try {
      // Create FormData for form-data request
      const formData = new FormData();
      formData.append('email', email);

      const response = await apiClient.post(API_ENDPOINTS.AUTH.RESEND_CODE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Backend returns: { status, code, message, data, errors }
      const { status, message, data } = response.data;

      if (!status) {
        throw new Error(message || '2FA code resend failed');
      }

      return {
        success: true,
        message: message || '2FA code resent successfully',
        data,
      };
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
