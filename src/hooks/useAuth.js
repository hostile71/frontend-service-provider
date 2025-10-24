/**
 * Authentication React Query Hooks
 * 
 * Custom hooks using TanStack Query for authentication:
 * - useLogin
 * - useVerify2FA
 * - useLogout
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

/**
 * Hook for user login
 * @returns {Object} Mutation object with login function and state
 */
export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data, variables) => {
      // On successful login, navigate to 2FA verification
      console.log('✅ Login successful, redirecting to 2FA...');
      navigate('/verify-2fa', { 
        state: { 
          email: variables.email,
          requiresVerification: true 
        } 
      });
    },
    onError: (error) => {
      console.error('❌ Login failed:', error);
    },
  });
};

/**
 * Hook for 2FA verification
 * @returns {Object} Mutation object with verify2FA function and state
 */
export const useVerify2FA = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (verificationData) => authService.verify2FA(verificationData),
    onSuccess: (data) => {
      // On successful verification, navigate to dashboard
      console.log('✅ 2FA verification successful, redirecting to dashboard...');
      navigate('/dashboard', { replace: true });
    },
    onError: (error) => {
      console.error('❌ 2FA verification failed:', error);
    },
  });
};

/**
 * Hook for user logout
 * @returns {Object} Mutation object with logout function and state
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      console.log('✅ Logout successful - Clearing all data');
      
      // CRITICAL: Clear React Query cache BEFORE navigation
      // This ensures UserContext sees empty cache immediately
      queryClient.setQueryData(['users', 'profile'], undefined);
      queryClient.setQueryData(['users', 'menus'], undefined);
      queryClient.removeQueries({ queryKey: ['users'] });
      queryClient.clear();
      
      console.log('✅ All queries cleared');
      
      // Navigate to login
      navigate('/login', { replace: true });
    },
    onError: (error) => {
      console.error('❌ Logout failed:', error);
      
      // Clear cache even if API call fails
      queryClient.setQueryData(['users', 'profile'], undefined);
      queryClient.setQueryData(['users', 'menus'], undefined);
      queryClient.removeQueries({ queryKey: ['users'] });
      queryClient.clear();
      
      // Still redirect to login even if API call fails
      navigate('/login', { replace: true });
    },
  });
};

/**
 * Hook for resending 2FA code
 * @returns {Object} Mutation object with resend function and state
 */
export const useResend2FACode = () => {
  return useMutation({
    mutationFn: (email) => authService.resend2FACode(email),
    onSuccess: (data) => {
      console.log('✅ 2FA code resent successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Failed to resend 2FA code:', error);
    },
  });
};
