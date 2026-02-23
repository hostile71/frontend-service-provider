/**
 * Security API Service
 * 
 * Handles all security-related API calls
 * - Security overview and statistics
 * - Security settings management
 * - Password policy management
 * - Security logs
 * - Failed login attempts
 * - Session management
 */

import apiClient from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import { demoSecurityOverview, demoSecuritySettings, demoPasswordPolicy, demoSecurityLogs } from '../data/demoApiData';

const securityService = {
    // ==================== SECURITY OVERVIEW ====================

    /**
     * Get security overview and statistics
     * @returns {Promise<Object>} Security overview with metrics
     */
    getOverview: async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.SECURITY.OVERVIEW);
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to fetch security overview');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Get security overview error:', error);
            console.log('Using demo security overview data as fallback');
            return {
                success: true,
                message: 'Using demo data (API unavailable)',
                data: demoSecurityOverview.data,
            };
        }
    },

    // ==================== SECURITY SETTINGS ====================

    /**
     * Get all security settings
     * @returns {Promise<Object>} Security settings list
     */
    getSettings: async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.SECURITY.SETTINGS.LIST);
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to fetch security settings');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Get security settings error:', error);
            throw error;
        }
    },

    /**
     * Get single security setting by name
     * @param {string} name - Setting name (e.g., 'twoFactorAuth', 'sessionTimeout')
     * @returns {Promise<Object>} Security setting data
     */
    getSetting: async (name) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.SECURITY.SETTINGS.GET(name));
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to fetch security setting');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Get security setting error:', error);
            throw error;
        }
    },

    /**
     * Update security setting
     * @param {string} name - Setting name
     * @param {Object} settingData - Setting data (enabled, settings)
     * @returns {Promise<Object>} Updated setting
     */
    updateSetting: async (name, settingData) => {
        try {
            const response = await apiClient.put(
                API_ENDPOINTS.SECURITY.SETTINGS.UPDATE(name),
                settingData
            );
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to update security setting');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Update security setting error:', error);
            throw error;
        }
    },

    // ==================== PASSWORD POLICY ====================

    /**
     * Get password policy
     * @returns {Promise<Object>} Password policy data
     */
    getPasswordPolicy: async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.SECURITY.PASSWORD_POLICY.GET);
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to fetch password policy');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Get password policy error:', error);
            console.log('Using demo password policy data as fallback');
            return {
                success: true,
                message: 'Using demo data (API unavailable)',
                data: demoPasswordPolicy.data,
            };
        }
    },

    /**
     * Update password policy
     * @param {Object} policyData - Policy data (minimum_length, password_expiry_days, require_uppercase, require_numbers, require_special_characters, prevent_password_reuse, max_reusable_previous_passwords, lockout_threshold, lockout_duration_minutes)
     * @returns {Promise<Object>} Updated policy
     */
    updatePasswordPolicy: async (policyData) => {
        try {
            const response = await apiClient.put(
                API_ENDPOINTS.SECURITY.PASSWORD_POLICY.UPDATE,
                policyData
            );
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to update password policy');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Update password policy error:', error);
            throw error;
        }
    },

    // ==================== SECURITY LOGS ====================

    /**
     * Get security logs with filtering and pagination
     * @param {Object} params - Query parameters (page, limit, startDate, endDate, event, severity, status, userId, ipAddress, sortBy, order)
     * @returns {Promise<Object>} Security logs list with pagination
     */
    getLogs: async (params = {}) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.SECURITY.LOGS.LIST, { params });
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to fetch security logs');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Get security logs error:', error);
            console.log('Using demo security logs data as fallback');
            return {
                success: true,
                message: 'Using demo data (API unavailable)',
                data: demoSecurityLogs.data,
            };
        }
    },

    /**
     * Get single security log
     * @param {number} id - Log ID
     * @returns {Promise<Object>} Security log data
     */
    getLog: async (id) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.SECURITY.LOGS.GET(id));
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to fetch security log');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Get security log error:', error);
            throw error;
        }
    },

    /**
     * Delete security logs older than N days
     * @param {number} olderThanDays - Delete logs older than this many days
     * @returns {Promise<Object>} Deletion result
     */
    deleteLogs: async (olderThanDays) => {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.SECURITY.LOGS.DELETE, {
                params: { olderThanDays },
            });
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to delete security logs');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Delete security logs error:', error);
            throw error;
        }
    },

    // ==================== FAILED LOGIN ATTEMPTS ====================

    /**
     * Get failed login attempts with filtering
     * @param {Object} params - Query parameters (page, limit, email, ipAddress, isBlocked)
     * @returns {Promise<Object>} Failed attempts list with pagination
     */
    getFailedAttempts: async (params = {}) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.SECURITY.FAILED_ATTEMPTS.LIST, { params });
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to fetch failed attempts');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Get failed attempts error:', error);
            throw error;
        }
    },

    /**
     * Unblock email/IP from failed attempts
     * @param {number} id - Failed attempt record ID
     * @returns {Promise<Object>} Unblock result
     */
    unblockAttempt: async (id) => {
        try {
            const response = await apiClient.put(
                API_ENDPOINTS.SECURITY.FAILED_ATTEMPTS.UNBLOCK(id)
            );
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to unblock attempt');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Unblock attempt error:', error);
            throw error;
        }
    },

    // ==================== SESSIONS ====================

    /**
     * Get active sessions
     * @param {Object} params - Query parameters (page, limit, userId)
     * @returns {Promise<Object>} Active sessions list with pagination
     */
    getSessions: async (params = {}) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.SECURITY.SESSIONS.LIST, { params });
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to fetch active sessions');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Get sessions error:', error);
            throw error;
        }
    },

    /**
     * Logout specific session
     * @param {string} sessionId - Session ID to logout
     * @returns {Promise<Object>} Logout result
     */
    logoutSession: async (sessionId) => {
        try {
            const response = await apiClient.delete(
                API_ENDPOINTS.SECURITY.SESSIONS.DELETE(sessionId)
            );
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to logout session');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Logout session error:', error);
            throw error;
        }
    },

    /**
     * Logout all sessions except current
     * @returns {Promise<Object>} Logout result
     */
    logoutAllOtherSessions: async () => {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.SECURITY.SESSIONS.DELETE_ALL);
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to logout all sessions');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Logout all sessions error:', error);
            throw error;
        }
    },
};

export default securityService;
