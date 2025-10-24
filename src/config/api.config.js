/**
 * API Configuration
 * 
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  BASE_URL: 'http://localhost/backend-service-provider',
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/login',
    VERIFY_2FA: '/api/verify-2fa',
    LOGOUT: '/api/logout',
    REFRESH_TOKEN: '/api/refresh-token',
    RESEND_CODE: '/api/resend-code',
  },
  // Users
  USERS: {
    LIST: '/api/users',
    GET: (id) => `/api/users/${id}`,
    CREATE: '/api/users',
    UPDATE: (id) => `/api/users/${id}`,
    DELETE: (id) => `/api/users/${id}`,
    PROFILE: '/api/profile',
    UPDATE_PROFILE: '/api/profile/update',
    MENUS: '/api/user/menus',
  },
  // Service Providers
  PROVIDERS: {
    LIST: '/api/providers',
    GET: (id) => `/api/providers/${id}`,
    CREATE: '/api/providers',
    UPDATE: (id) => `/api/providers/${id}`,
    DELETE: (id) => `/api/providers/${id}`,
  },
  // Services
  SERVICES: {
    LIST: '/api/services',
    GET: (id) => `/api/services/${id}`,
    CREATE: '/api/services',
    UPDATE: (id) => `/api/services/${id}`,
    DELETE: (id) => `/api/services/${id}`,
  },
  // Bookings
  BOOKINGS: {
    LIST: '/api/bookings',
    GET: (id) => `/api/bookings/${id}`,
    CREATE: '/api/bookings',
    UPDATE: (id) => `/api/bookings/${id}`,
    DELETE: (id) => `/api/bookings/${id}`,
  },
  // Payments
  PAYMENTS: {
    LIST: '/api/payments',
    GET: (id) => `/api/payments/${id}`,
    CREATE: '/api/payments',
  },
};

export default API_CONFIG;
