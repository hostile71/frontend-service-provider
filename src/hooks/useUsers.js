/**
 * Custom hooks for User management with React Query
 * 
 * Provides hooks for:
 * - Fetching users list with pagination
 * - Fetching single user by ID
 * - Creating new user
 * - Updating user
 * - Deleting user
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services';
import { useToast } from '../contexts/ToastContext';

/**
 * Hook to fetch users list with pagination and filters
 * @param {Object} params - Query parameters (page, per_page, search, type)
 * @returns {Object} React Query result
 */
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ['users', params.type, params.page, params.per_page, params.search],
    queryFn: () => userService.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (response) => response.data, // Return only the data part
  });
};

/**
 * Hook to fetch single user by ID
 * @param {number} id - User ID
 * @param {Object} options - Query options
 * @returns {Object} React Query result
 */
export const useUser = (id, options = {}) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getById(id),
    enabled: !!id, // Only fetch if ID is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (response) => response.data, // Return only the data part
    ...options,
  });
};

/**
 * Hook to create new user
 * @returns {Object} Mutation object
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (userData) => userService.create(userData),
    onSuccess: (response) => {
      // Invalidate all user queries to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      if (toast) {
        toast.success(response.message || 'User created successfully');
      }
    },
    onError: (error) => {
      if (toast) {
        toast.error(error.message || 'Failed to create user');
      }
    },
  });
};

/**
 * Hook to update user
 * @returns {Object} Mutation object
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, userData }) => userService.update(id, userData),
    onSuccess: (response, variables) => {
      // Invalidate all user queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      // Update the specific user cache
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
      
      if (toast) {
        toast.success(response.message || 'User updated successfully');
      }
    },
    onError: (error) => {
      if (toast) {
        toast.error(error.message || 'Failed to update user');
      }
    },
  });
};

/**
 * Hook to delete user
 * @returns {Object} Mutation object
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id) => userService.delete(id),
    onSuccess: (response) => {
      // Invalidate all user queries to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      if (toast) {
        toast.success(response.message || 'User deleted successfully');
      }
    },
    onError: (error) => {
      if (toast) {
        toast.error(error.message || 'Failed to delete user');
      }
    },
  });
};
