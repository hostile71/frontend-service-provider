/**
 * Localization API Service
 * 
 * Handles all localization-related API calls
 * - Translations management
 * - Languages management
 */

import apiClient from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import { demoLanguages, demoTranslations } from '../data/demoApiData';

const localizationService = {
    // ==================== TRANSLATIONS ====================

    /**
     * Get all translations with pagination and filters
     * @param {Object} params - Query parameters (page, limit, search, category, status, sortBy, order)
     * @returns {Promise<Object>} Translations list with pagination
     */
    getTranslations: async (params = {}) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.LOCALIZATION.TRANSLATIONS.LIST, { params });
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to fetch translations');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Get translations error:', error);
            console.log('Using demo translations data as fallback');
            return {
                success: true,
                message: 'Using demo data (API unavailable)',
                data: demoTranslations.data,
            };
        }
    },

    /**
     * Get single translation by ID
     * @param {number} id - Translation ID
     * @returns {Promise<Object>} Translation data
     */
    getTranslation: async (id) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.LOCALIZATION.TRANSLATIONS.GET(id));
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to fetch translation');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Get translation error:', error);
            throw error;
        }
    },

    /**
     * Create new translation
     * @param {Object} translationData - Translation data (key, english, arabic, category, status, description)
     * @returns {Promise<Object>} Created translation
     */
    createTranslation: async (translationData) => {
        try {
            const response = await apiClient.post(
                API_ENDPOINTS.LOCALIZATION.TRANSLATIONS.CREATE,
                translationData
            );
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to create translation');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Create translation error:', error);
            throw error;
        }
    },

    /**
     * Update translation
     * @param {number} id - Translation ID
     * @param {Object} translationData - Translation data to update
     * @returns {Promise<Object>} Updated translation
     */
    updateTranslation: async (id, translationData) => {
        try {
            const response = await apiClient.put(
                API_ENDPOINTS.LOCALIZATION.TRANSLATIONS.UPDATE(id),
                translationData
            );
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to update translation');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Update translation error:', error);
            throw error;
        }
    },

    /**
     * Delete translation
     * @param {number} id - Translation ID
     * @returns {Promise<Object>} Deletion result
     */
    deleteTranslation: async (id) => {
        try {
            const response = await apiClient.delete(
                API_ENDPOINTS.LOCALIZATION.TRANSLATIONS.DELETE(id)
            );
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to delete translation');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Delete translation error:', error);
            throw error;
        }
    },

    /**
     * Get translation categories
     * @param {Object} params - Query parameters (page, limit)
     * @returns {Promise<Object>} Categories list
     */
    getCategories: async (params = {}) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.LOCALIZATION.TRANSLATIONS.CATEGORIES, { params });
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to fetch categories');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Get categories error:', error);
            throw error;
        }
    },

    // ==================== LANGUAGES ====================

    /**
     * Get all languages
     * @param {Object} params - Query parameters (isActive, page, limit)
     * @returns {Promise<Object>} Languages list with pagination
     */
    getLanguages: async (params = {}) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.LOCALIZATION.LANGUAGES.LIST, { params });
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to fetch languages');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Get languages error:', error);
            console.log('Using demo languages data as fallback');
            return {
                success: true,
                message: 'Using demo data (API unavailable)',
                data: demoLanguages.data,
            };
        }
    },

    /**
     * Get single language by code
     * @param {string} code - Language code (e.g., 'en', 'ar')
     * @returns {Promise<Object>} Language data
     */
    getLanguage: async (code) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.LOCALIZATION.LANGUAGES.GET(code));
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to fetch language');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Get language error:', error);
            throw error;
        }
    },

    /**
     * Create new language
     * @param {Object} languageData - Language data (code, name, native_name, flag, is_active)
     * @returns {Promise<Object>} Created language
     */
    createLanguage: async (languageData) => {
        try {
            const response = await apiClient.post(
                API_ENDPOINTS.LOCALIZATION.LANGUAGES.CREATE,
                languageData
            );
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to create language');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Create language error:', error);
            throw error;
        }
    },

    /**
     * Update language
     * @param {string} code - Language code
     * @param {Object} languageData - Language data to update
     * @returns {Promise<Object>} Updated language
     */
    updateLanguage: async (code, languageData) => {
        try {
            const response = await apiClient.put(
                API_ENDPOINTS.LOCALIZATION.LANGUAGES.UPDATE(code),
                languageData
            );
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to update language');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Update language error:', error);
            throw error;
        }
    },

    /**
     * Delete language
     * @param {string} code - Language code
     * @returns {Promise<Object>} Deletion result
     */
    deleteLanguage: async (code) => {
        try {
            const response = await apiClient.delete(
                API_ENDPOINTS.LOCALIZATION.LANGUAGES.DELETE(code)
            );
            const { status, message, data } = response.data;

            if (!status) {
                throw new Error(message || 'Failed to delete language');
            }

            return {
                success: true,
                message,
                data,
            };
        } catch (error) {
            console.error('Delete language error:', error);
            throw error;
        }
    },
};

export default localizationService;
