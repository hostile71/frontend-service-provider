/**
 * Booking Hooks
 * 
 * Custom React Query hooks for booking management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services';
import { useToast } from '../contexts/ToastContext';

/**
 * Hook to fetch all bookings with optional filters
 * @param {Object} params - Query parameters (page, per_page, status, search_text)
 * @returns {Object} - React Query result
 */
export const useBookings = (params = {}) => {
    return useQuery({
        queryKey: ['bookings', params],
        queryFn: () => bookingService.getAll(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * Hook to fetch booking statistics
 * @returns {Object} - React Query result
 */
export const useBookingStatistics = () => {
    return useQuery({
        queryKey: ['bookings', 'statistics'],
        queryFn: () => bookingService.getStatistics(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook to fetch a single booking by ID
 * @param {number} id - Booking ID
 * @returns {Object} - React Query result
 */
export const useBooking = (id) => {
    return useQuery({
        queryKey: ['bookings', id],
        queryFn: () => bookingService.getById(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
    });
};

/**
 * Hook to create a new booking
 * @returns {Object} - React Query mutation
 */
export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (bookingData) => bookingService.create(bookingData),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast.success(response.message || 'Booking created successfully');
        },
        onError: (error) => {
            const message = error.response?.data?.message || error.message || 'Failed to create booking';
            toast.error(message);
        },
    });
};

/**
 * Hook to update an existing booking
 * @returns {Object} - React Query mutation
 */
export const useUpdateBooking = () => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: ({ id, ...bookingData }) => bookingService.update(id, bookingData),
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['bookings', variables.id] });
            toast.success(response.message || 'Booking updated successfully');
        },
        onError: (error) => {
            const message = error.response?.data?.message || error.message || 'Failed to update booking';
            toast.error(message);
        },
    });
};

/**
 * Hook to delete a booking
 * @returns {Object} - React Query mutation
 */
export const useDeleteBooking = () => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (id) => bookingService.delete(id),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast.success(response.message || 'Booking deleted successfully');
        },
        onError: (error) => {
            const message = error.response?.data?.message || error.message || 'Failed to delete booking';
            toast.error(message);
        },
    });
};

/**
 * Hook to update booking status
 * @returns {Object} - React Query mutation
 */
export const useUpdateBookingStatus = () => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: ({ id, status }) => bookingService.updateStatus(id, status),
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['bookings', variables.id] });
            toast.success(response.message || 'Booking status updated successfully');
        },
        onError: (error) => {
            const message = error.response?.data?.message || error.message || 'Failed to update booking status';
            toast.error(message);
        },
    });
};
