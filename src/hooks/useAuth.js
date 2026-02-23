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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data, variables) => {
      // Check if 2FA is required
      const requiresTwoFA = data?.data?.requireTwoFactorAuth || data?.data?.['2fa_enabled'];

      if (requiresTwoFA) {
        // 2FA is enabled: Redirect to verification page
        console.log('✅ Login successful, 2FA required - redirecting to verification...');
        navigate('/verify-2fa', {
          state: {
            email: variables.email,
            requiresVerification: true
          }
        });
      } else {
        // 2FA is disabled: Login directly with token
        console.log('✅ Login successful, no 2FA required - logging in directly...');

        // Store token in localStorage
        const token = data?.data?.token;
        if (token) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(data?.data?.user));
          // Set 2FA verified flag (since 2FA is disabled, it's implicitly verified)
          localStorage.setItem('2faVerified', 'true');
        }

        // Invalidate and refetch queries to update user context
        queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });

        // Redirect to dashboard
        navigate('/dashboard', { replace: true });
      }
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (verificationData) => authService.verify2FA(verificationData),
    onSuccess: (data, verificationData) => {
      // On successful verification, store token and redirect to dashboard
      console.log('✅ 2FA verification successful, logging in...');

      // Store token in localStorage
      const token = data?.data?.token;
      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(data?.data?.user));
        localStorage.setItem('userEmail', verificationData.email);
        localStorage.setItem('2faVerified', 'true');
      }

      // Invalidate and refetch queries to update user context
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });

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
