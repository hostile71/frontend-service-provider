/**
 * Settings API Service
 * 
 * Handles all settings-related API calls
 * - System settings management
 * - Theme configurations
 * - User preferences
 * - Application configuration
 */

import apiClient from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import { demoThemes, demoSettings, demoUserPreferences, demoAppConfig } from '../data/demoApiData';

const settingsService = {
    // ==================== GENERAL SETTINGS ====================

    /**
     * Get all system settings
     * @param {Object} params - Query parameters (category, page, limit, isPublic)
     * @returns {Promise<Object>} Settings list with pagination
     */
    getSettings: async (params = {}) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.SETTINGS.GENERAL.LIST, { params });
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to fetch settings');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Get settings error:', error);
            console.log('Using demo settings data as fallback');
            return {
                success: true,
                message: 'Using demo data (API unavailable)',
                data: demoSettings.data,
            };
        }
    },

    /**
     * Get single setting by key
     * @param {string} key - Setting key (e.g., 'app_name')
     * @returns {Promise<Object>} Setting data
     */
    getSetting: async (key) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.SETTINGS.GENERAL.GET(key));
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to fetch setting');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Get setting error:', error);
            throw error;
        }
    },

    /**
     * Update setting by key
     * @param {string} key - Setting key
     * @param {Object} settingData - Setting data (value)
     * @returns {Promise<Object>} Updated setting
     */
    updateSetting: async (key, settingData) => {
        try {
            const response = await apiClient.put(
                API_ENDPOINTS.SETTINGS.GENERAL.UPDATE(key),
                settingData
            );
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to update setting');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Update setting error:', error);
            throw error;
        }
    },

    // ==================== THEMES ====================

    /**
     * Get all theme configurations
     * @param {Object} params - Query parameters (isActive, page, limit)
     * @returns {Promise<Object>} Themes list with pagination
     */
    getThemes: async (params = {}) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.SETTINGS.THEMES.LIST, { params });
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to fetch themes');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Get themes error:', error);
            console.log('Using demo themes data as fallback');
            return {
                success: true,
                message: 'Using demo data (API unavailable)',
                data: demoThemes.data,
            };
        }
    },

    /**
     * Get single theme by name
     * @param {string} name - Theme name (e.g., 'DEFAULT', 'PURPLE')
     * @returns {Promise<Object>} Theme data
     */
    getTheme: async (name) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.SETTINGS.THEMES.GET(name));
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to fetch theme');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Get theme error:', error);
            throw error;
        }
    },

    /**
     * Create new theme
     * @param {Object} themeData - Theme data (name, label, primary_color, accent_color, secondary_color, is_dark_mode, css_variables)
     * @returns {Promise<Object>} Created theme
     */
    createTheme: async (themeData) => {
        try {
            const response = await apiClient.post(
                API_ENDPOINTS.SETTINGS.THEMES.CREATE,
                themeData
            );
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to create theme');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Create theme error:', error);
            throw error;
        }
    },

    /**
     * Update theme
     * @param {string} name - Theme name
     * @param {Object} themeData - Theme data to update
     * @returns {Promise<Object>} Updated theme
     */
    updateTheme: async (name, themeData) => {
        try {
            const response = await apiClient.put(
                API_ENDPOINTS.SETTINGS.THEMES.UPDATE(name),
                themeData
            );
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to update theme');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Update theme error:', error);
            throw error;
        }
    },

    /**
     * Delete theme
     * @param {string} name - Theme name
     * @returns {Promise<Object>} Deletion result
     */
    deleteTheme: async (name) => {
        try {
            const response = await apiClient.delete(
                API_ENDPOINTS.SETTINGS.THEMES.DELETE(name)
            );
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to delete theme');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Delete theme error:', error);
            throw error;
        }
    },

    // ==================== USER PREFERENCES ====================

    /**
     * Get current user's preferences
     * @returns {Promise<Object>} User preferences data
     */
    getUserPreferences: async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.SETTINGS.PREFERENCES.GET);
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to fetch user preferences');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Get user preferences error:', error);
            console.log('Using demo user preferences data as fallback');
            return {
                success: true,
                message: 'Using demo data (API unavailable)',
                data: demoUserPreferences.data,
            };
        }
    },

    /**
     * Update user preferences
     * @param {Object} preferencesData - Preferences data (theme_preference, language_preference, currency_preference, date_format, time_format, number_format, week_start_day, enable_notifications, enable_push_notifications)
     * @returns {Promise<Object>} Updated preferences
     */
    updateUserPreferences: async (preferencesData) => {
        try {
            const response = await apiClient.put(
                API_ENDPOINTS.SETTINGS.PREFERENCES.UPDATE,
                preferencesData
            );
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to update user preferences');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Update user preferences error:', error);
            throw error;
        }
    },

    // ==================== APPLICATION CONFIGURATION ====================

    /**
     * Get application configuration
     * @param {Object} params - Query parameters (includeSecrets)
     * @returns {Promise<Object>} Application configuration data
     */
    getAppConfig: async (params = {}) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.SETTINGS.APP_CONFIG.GET, { params });
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to fetch app configuration');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Get app config error:', error);
            console.log('Using demo app config data as fallback');
            return {
                success: true,
                message: 'Using demo data (API unavailable)',
                data: demoAppConfig.data,
            };
        }
    },

    /**
     * Update application configuration
     * @param {Object} configData - Configuration data (app_name, app_version, app_logo, sms_gateway_provider, sms_gateway_key, firebase_fcm_key, maintenance_mode, support_email, support_phone)
     * @returns {Promise<Object>} Updated configuration
     */
    updateAppConfig: async (configData) => {
        try {
            const response = await apiClient.put(
                API_ENDPOINTS.SETTINGS.APP_CONFIG.UPDATE,
                configData
            );
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to update app configuration');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Update app config error:', error);
            throw error;
        }
    },
};

export default settingsService;
