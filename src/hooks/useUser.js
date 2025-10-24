/**
 * User React Query Hooks
 * 
 * Custom hooks using TanStack Query for user operations:
 * - useProfile
 * - useUserMenus
 * - useUsers
 * - useUser
 * - useCreateUser
 * - useUpdateUser
 * - useDeleteUser
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../services/user.service';

// Query Keys
export const userKeys = {
  all: ['users'],
  profile: () => [...userKeys.all, 'profile'],
  menus: () => [...userKeys.all, 'menus'],
  lists: () => [...userKeys.all, 'list'],
  list: (filters) => [...userKeys.lists(), { filters }],
  details: () => [...userKeys.all, 'detail'],
  detail: (id) => [...userKeys.details(), id],
};

/**
 * Hook to get current user profile
 * @returns {Object} Query object with profile data
 */
export const useProfile = () => {
  // Check authentication dynamically
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const verified = typeof window !== 'undefined' ? localStorage.getItem('2faVerified') : null;
  const isAuthenticated = !!(token && verified === 'true');

  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => userService.getProfile(),
    enabled: isAuthenticated, // Only run if authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    // Clear data when query becomes disabled
    placeholderData: undefined,
    // Don't keep previous data when disabled
    keepPreviousData: false,
    onSuccess: (data) => {
      console.log('✅ Profile loaded:', data);
    },
    onError: (error) => {
      console.error('❌ Failed to load profile:', error);
    },
  });
};

/**
 * Hook to get user menus with permissions
 * @returns {Object} Query object with menu structure and permissions
 */
export const useUserMenus = () => {
  // Check authentication dynamically
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const verified = typeof window !== 'undefined' ? localStorage.getItem('2faVerified') : null;
  const isAuthenticated = !!(token && verified === 'true');

  return useQuery({
    queryKey: userKeys.menus(),
    queryFn: () => userService.getUserMenus(),
    enabled: isAuthenticated, // Only run if authenticated
    staleTime: 10 * 60 * 1000, // 10 minutes - menus don't change often
    retry: 2,
    // Clear data when query becomes disabled
    placeholderData: undefined,
    // Don't keep previous data when disabled
    keepPreviousData: false,
    onSuccess: (data) => {
      console.log('✅ User menus loaded:', data);
      console.log('📋 Permissions:', data.permissions);
    },
    onError: (error) => {
      console.error('❌ Failed to load user menus:', error);
    },
  });
};

/**
 * Hook to get all users
 * @param {Object} params - Query parameters
 * @returns {Object} Query object with users list
 */
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getAll(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    onError: (error) => {
      console.error('❌ Failed to load users:', error);
    },
  });
};

/**
 * Hook to get user by ID
 * @param {number} id - User ID
 * @returns {Object} Query object with user data
 */
export const useUser = (id) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getById(id),
    enabled: !!id, // Only run if ID exists
    staleTime: 2 * 60 * 1000,
    onError: (error) => {
      console.error('❌ Failed to load user:', error);
    },
  });
};

/**
 * Hook to create new user
 * @returns {Object} Mutation object
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) => userService.create(userData),
    onSuccess: (data) => {
      console.log('✅ User created successfully:', data);
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('❌ Failed to create user:', error);
    },
  });
};

/**
 * Hook to update user
 * @returns {Object} Mutation object
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }) => userService.update(id, userData),
    onSuccess: (data, variables) => {
      console.log('✅ User updated successfully:', data);
      // Invalidate specific user and users list
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('❌ Failed to update user:', error);
    },
  });
};

/**
 * Hook to delete user
 * @returns {Object} Mutation object
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => userService.delete(id),
    onSuccess: (data, id) => {
      console.log('✅ User deleted successfully:', data);
      // Remove user from cache and invalidate list
      queryClient.removeQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('❌ Failed to delete user:', error);
    },
  });
};

/**
 * Hook to check if user has permission
 * @param {string} permissionId - Permission ID to check
 * @returns {boolean} Whether user has permission
 */
export const usePermission = (permissionId) => {
  const { data: menusData } = useUserMenus();
  
  if (!menusData?.permissions) return false;
  
  return userService.hasPermission(menusData.permissions, permissionId);
};

/**
 * Hook to get user's permissions object
 * @returns {Object} Permissions object
 */
export const usePermissions = () => {
  const { data: menusData } = useUserMenus();
  return menusData?.permissions || {};
};

/**
 * Hook to update current user profile
 * @returns {Object} Mutation object
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => userService.updateProfile(formData),
    onSuccess: (data) => {
      console.log('✅ Profile updated successfully:', data);
      // Invalidate profile query to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
    onError: (error) => {
      console.error('❌ Failed to update profile:', error);
    },
  });
};
