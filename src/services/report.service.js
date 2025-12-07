/**
 * Report Service
 * 
 * Handles all report-related API calls
 */

import apiClient from '../lib/apiClient';

const reportService = {
    /**
     * Get dashboard statistics
     * @param {string} period - Period filter (today, yesterday, last_7_days, last_30_days, etc.)
     * @returns {Promise} - API response with dashboard stats
     */
    getDashboard: async (period = 'last_7_days') => {
        const response = await apiClient.get('/api/reports/dashboard', { params: { period } });
        return response.data;
    },

    /**
     * Get daily booking report
     * @param {string} period - Period filter
     * @returns {Promise} - API response with daily booking data
     */
    getDailyBooking: async (period = 'last_30_days') => {
        const response = await apiClient.get('/api/reports/daily-booking', { params: { period } });
        return response.data;
    },

    /**
     * Get monthly revenue report
     * @param {string} period - Period filter
     * @returns {Promise} - API response with monthly revenue data
     */
    getMonthlyRevenue: async (period = 'last_12_months') => {
        const response = await apiClient.get('/api/reports/monthly-revenue', { params: { period } });
        return response.data;
    },

    /**
     * Get top services report
     * @param {string} period - Period filter
     * @param {number} limit - Number of top services to return
     * @returns {Promise} - API response with top services data
     */
    getTopServices: async (period = 'last_30_days', limit = 10) => {
        const response = await apiClient.get('/api/reports/top-services', { params: { period, limit } });
        return response.data;
    },

    /**
     * Get customer engagement report
     * @param {string} period - Period filter
     * @returns {Promise} - API response with customer engagement data
     */
    getCustomerEngagement: async (period = 'last_30_days') => {
        const response = await apiClient.get('/api/reports/customer-engagement', { params: { period } });
        return response.data;
    },

    /**
     * Get provider performance report
     * @param {string} period - Period filter
     * @returns {Promise} - API response with provider performance data
     */
    getProviderPerformance: async (period = 'last_30_days') => {
        const response = await apiClient.get('/api/reports/provider-performance', { params: { period } });
        return response.data;
    },

    /**
     * Export report to Excel
     * @param {string} type - Report type (dashboard, daily_booking, monthly_revenue, etc.)
     * @param {string} period - Period filter
     * @returns {Promise} - API response with Excel data structure
     */
    exportExcel: async (type, period) => {
        const response = await apiClient.get('/api/reports/export-excel', { params: { type, period } });
        return response.data;
    },

    /**
     * Export report to CSV
     * @param {string} type - Report type
     * @param {string} period - Period filter
     * @returns {Promise} - CSV file blob
     */
    exportCSV: async (type, period) => {
        const response = await apiClient.get('/api/reports/export-csv', {
            params: { type, period },
            responseType: 'blob'
        });
        return response.data;
    },

    /**
     * Get user analytics
     * @param {number} userId - User ID
     * @param {string} period - Period filter or custom date range
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Promise} - API response with user analytics
     */
    getUserAnalytics: async (userId, period = null, startDate = null, endDate = null) => {
        const params = { user_id: userId };
        if (period) params.period = period;
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        const response = await apiClient.get('/api/reports/user-analytics', { params });
        return response.data;
    },

    /**
     * Get provider analytics
     * @param {number} providerId - Provider ID
     * @param {string} period - Period filter or custom date range
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Promise} - API response with provider analytics
     */
    getProviderAnalytics: async (providerId, period = null, startDate = null, endDate = null) => {
        const params = { provider_id: providerId };
        if (period) params.period = period;
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        const response = await apiClient.get('/api/reports/provider-analytics', { params });
        return response.data;
    },

    /**
     * Get service analytics
     * @param {number} serviceId - Service ID
     * @param {string} period - Period filter or custom date range
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Promise} - API response with service analytics
     */
    getServiceAnalytics: async (serviceId, period = null, startDate = null, endDate = null) => {
        const params = { service_id: serviceId };
        if (period) params.period = period;
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        const response = await apiClient.get('/api/reports/service-analytics', { params });
        return response.data;
    },

    /**
     * Get revenue report with advanced filtering
     * @param {Object} filters - Filter options
     * @returns {Promise} - API response with revenue report
     */
    getRevenueReport: async (filters = {}) => {
        const response = await apiClient.get('/api/reports/revenue', { params: filters });
        return response.data;
    },
};

export default reportService;

