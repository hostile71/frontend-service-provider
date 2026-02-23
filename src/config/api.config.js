/**
 * API Configuration
 * 
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  BASE_URL: 'http://localhost/backend-service-provider',
  // BASE_URL: 'https://backend.servi-online.com',
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Polling Configuration
export const POLLING_CONFIG = {
  NOTIFICATION_INTERVAL: 5000, // 10 seconds (in milliseconds) - change this to adjust polling frequency
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
  // Roles
  ROLES: {
    LIST: '/api/roles',
  },
  // Categories
  CATEGORIES: {
    LIST: '/api/categories',
    GET: (id) => `/api/categories/${id}`,
    CREATE: '/api/categories',
    UPDATE: (id) => `/api/categories/${id}`,
    DELETE: (id) => `/api/categories/${id}`,
  },
  // Subcategories (nested under categories or standalone)
  SUBCATEGORIES: {
    LIST: '/api/sub-categories',
    GET: (id) => `/api/sub-categories/${id}`,
    CREATE: '/api/sub-categories',
    UPDATE: (id) => `/api/sub-categories/${id}`,
    DELETE: (id) => `/api/sub-categories/${id}`,
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
  // Localization
  LOCALIZATION: {
    TRANSLATIONS: {
      LIST: '/api/v1/localization/translations',
      GET: (id) => `/api/v1/localization/translations/${id}`,
      CREATE: '/api/v1/localization/translations',
      UPDATE: (id) => `/api/v1/localization/translations/${id}`,
      DELETE: (id) => `/api/v1/localization/translations/${id}`,
      CATEGORIES: '/api/v1/localization/categories',
    },
    LANGUAGES: {
      LIST: '/api/v1/localization/languages',
      GET: (code) => `/api/v1/localization/languages/${code}`,
      CREATE: '/api/v1/localization/languages',
      UPDATE: (code) => `/api/v1/localization/languages/${code}`,
      DELETE: (code) => `/api/v1/localization/languages/${code}`,
    },
  },
  // Settings
  SETTINGS: {
    GENERAL: {
      LIST: '/api/v1/settings',
      GET: (key) => `/api/v1/settings/${key}`,
      UPDATE: (key) => `/api/v1/settings/${key}`,
    },
    THEMES: {
      LIST: '/api/v1/settings/themes',
      GET: (name) => `/api/v1/settings/themes/${name}`,
      CREATE: '/api/v1/settings/themes',
      UPDATE: (name) => `/api/v1/settings/themes/${name}`,
      DELETE: (name) => `/api/v1/settings/themes/${name}`,
    },
    PREFERENCES: {
      GET: '/api/v1/settings/preferences',
      UPDATE: '/api/v1/settings/preferences',
    },
    APP_CONFIG: {
      GET: '/api/v1/settings/app-config',
      UPDATE: '/api/v1/settings/app-config',
    },
  },
  // Security
  SECURITY: {
    OVERVIEW: '/api/v1/security/overview',
    SETTINGS: {
      LIST: '/api/v1/security/settings',
      GET: (name) => `/api/v1/security/settings/${name}`,
      UPDATE: (name) => `/api/v1/security/settings/${name}`,
    },
    PASSWORD_POLICY: {
      GET: '/api/v1/security/password-policy',
      UPDATE: '/api/v1/security/password-policy',
    },
    LOGS: {
      LIST: '/api/v1/security/logs',
      GET: (id) => `/api/v1/security/logs/${id}`,
      DELETE: '/api/v1/security/logs',
    },
    FAILED_ATTEMPTS: {
      LIST: '/api/v1/security/failed-attempts',
      UNBLOCK: (id) => `/api/v1/security/failed-attempts/${id}/unblock`,
    },
    SESSIONS: {
      LIST: '/api/v1/security/sessions',
      DELETE: (sessionId) => `/api/v1/security/sessions/${sessionId}`,
      DELETE_ALL: '/api/v1/security/sessions',
    },
  },
  // Notifications
  NOTIFICATIONS: {
    LIST: '/api/v1/notifications',
    UNREAD_COUNT: '/api/v1/notifications/unread-count',
    GROUPED: '/api/v1/notifications/grouped',
    MARK_READ: (id) => `/api/v1/notifications/${id}/read`,
    MARK_ALL_READ: '/api/v1/notifications/mark-all-read',
    DELETE: (id) => `/api/v1/notifications/${id}`,
    DELETE_ALL: '/api/v1/notifications',
  },
};

export default API_CONFIG;
