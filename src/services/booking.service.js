/**
 * Booking Service
 * 
 * Handles all booking-related API calls
 */

import apiClient from '../lib/apiClient';

const bookingService = {
    /**
     * Get all bookings with optional filters
     * @param {Object} params - Query parameters (page, per_page, status, search_text)
     * @returns {Promise} - API response with bookings data
     */
    getAll: async (params = {}) => {
        const response = await apiClient.get('/api/bookings', { params });
        return response.data;
    },

    /**
     * Get booking statistics
     * @returns {Promise} - API response with statistics
     */
    getStatistics: async () => {
        const response = await apiClient.get('/api/bookings/statistics');
        return response.data;
    },

    /**
     * Get a single booking by ID
     * @param {number} id - Booking ID
     * @returns {Promise} - API response with booking data
     */
    getById: async (id) => {
        const response = await apiClient.get(`/api/bookings/${id}`);
        return response.data;
    },

    /**
     * Create a new booking
     * @param {Object} bookingData - Booking data
     * @returns {Promise} - API response
     */
    create: async (bookingData) => {
        const response = await apiClient.post('/api/bookings', bookingData);
        return response.data;
    },

    /**
     * Update an existing booking
     * @param {number} id - Booking ID
     * @param {Object} bookingData - Updated booking data
     * @returns {Promise} - API response
     */
    update: async (id, bookingData) => {
        const response = await apiClient.post(`/api/bookings/${id}`, bookingData);
        return response.data;
    },

    /**
     * Delete a booking
     * @param {number} id - Booking ID
     * @returns {Promise} - API response
     */
    delete: async (id) => {
        const response = await apiClient.delete(`/api/bookings/${id}`);
        return response.data;
    },

    /**
     * Update booking status
     * @param {number} id - Booking ID
     * @param {string} status - New status (pending, confirmed, completed, cancelled)
     * @returns {Promise} - API response
     */
    updateStatus: async (id, status) => {
        const response = await apiClient.patch(`/api/bookings/${id}/status`, { status });
        return response.data;
    },
};

export default bookingService;
