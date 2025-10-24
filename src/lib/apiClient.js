/**
 * Axios HTTP Client Instance
 * 
 * Pre-configured axios instance with interceptors for:
 * - Base URL
 * - Request/Response transformations
 * - Error handling
 * - Authentication token injection
 */

import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    // If token exists, add to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }

    // Backend returns: { status, code, message, data, errors }
    // If status is false, treat as error
    if (response.data?.status === false) {
      const error = new Error(response.data.message || 'Request failed');
      error.response = response;
      error.apiError = true;
      throw error;
    }

    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      // Log error in development
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ API Error:', {
          url: error.config?.url,
          status,
          message: data?.message || error.message,
          data,
        });
      }

      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - Clear auth and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('2faVerified');
          
          // Only redirect if not already on login/2fa page
          if (!window.location.pathname.includes('/login') && 
              !window.location.pathname.includes('/verify-2fa')) {
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden - User doesn't have permission
          console.error('Access forbidden:', data?.message);
          break;

        case 404:
          // Not found
          console.error('Resource not found:', data?.message);
          break;

        case 422:
          // Validation error
          console.error('Validation error:', data?.errors || data?.message);
          break;

        case 500:
          // Server error
          console.error('Server error:', data?.message);
          break;

        default:
          console.error('API Error:', data?.message || error.message);
      }

      // Return formatted error matching backend structure
      return Promise.reject({
        status,
        message: data?.message || 'An error occurred',
        errors: data?.errors || null,
        code: data?.code || status,
        data: data,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('❌ Network Error: No response from server');
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection and ensure backend is running.',
        errors: null,
      });
    } else {
      // Something else happened
      console.error('❌ Error:', error.message);
      return Promise.reject({
        status: 0,
        message: error.message || 'An unexpected error occurred',
        errors: null,
      });
    }
  }
);

export default apiClient;
