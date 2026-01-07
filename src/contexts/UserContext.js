/**
 * User Context
 * 
 * Provides user profile, menus, and permissions throughout the app
 */

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useProfile, useUserMenus, userKeys } from '../hooks/useUser';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const queryClient = useQueryClient();
  
  // Track authentication state with useState to trigger re-renders
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('authToken');
    const verified = localStorage.getItem('2faVerified');
    return !!(token && verified === 'true');
  });

  // Listen for storage changes (when localStorage is cleared on logout)
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const verified = localStorage.getItem('2faVerified');
      const authStatus = !!(token && verified === 'true');
      
      if (authStatus !== isAuthenticated) {
        console.log('🔄 Authentication status changed:', authStatus);
        setIsAuthenticated(authStatus);
        
        // CRITICAL: When auth becomes false, clear the query cache immediately
        if (!authStatus) {
          console.log('🗑️ Clearing user query cache...');
          queryClient.setQueryData(userKeys.profile(), undefined);
          queryClient.setQueryData(userKeys.menus(), undefined);
          queryClient.removeQueries({ queryKey: userKeys.all });
        }
      }
    };

    // Check auth status very frequently (10ms) to catch logout immediately
    const interval = setInterval(checkAuth, 10);

    // Also listen for storage events (when localStorage changes in other tabs)
    window.addEventListener('storage', checkAuth);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkAuth);
    };
  }, [isAuthenticated, queryClient]);

  // Only fetch profile and menus if authenticated
  const profileQuery = useProfile();
  const menusQuery = useUserMenus();

  // Debug: Log menu data changes
  useEffect(() => {
    console.log('📊 UserContext state:', {
      isAuthenticated,
      hasProfileData: !!(profileQuery.data?.data),
      hasMenuData: !!(menusQuery.data?.menus),
      menuCount: menusQuery.data?.menus?.length || 0,
      permissionCount: Object.keys(menusQuery.data?.permissions || {}).length,
      // Show what the context will actually return
      willReturnMenus: isAuthenticated ? (menusQuery.data?.menus?.length || 0) : 0,
      willReturnProfile: isAuthenticated ? !!(profileQuery.data?.data) : false
    });
  }, [isAuthenticated, profileQuery.data, menusQuery.data]);

  const value = useMemo(() => {
    // CRITICAL: When not authenticated, return empty state regardless of cache
    if (!isAuthenticated) {
      return {
        isAuthenticated: false,
        profile: null,
        profileLoading: false,
        profileError: null,
        refetchProfile: profileQuery.refetch,
        menus: [],
        permissions: {},
        menusLoading: false,
        menusError: null,
        refetchMenus: menusQuery.refetch,
        assetUrl: null, // No asset URL when not authenticated
        hasPermission: () => false,
        hasAnyPermission: () => false,
        hasAllPermissions: () => false,
      };
    }

    // When authenticated, return actual data
    return {
      isAuthenticated: true,
      profile: profileQuery.data?.data || null,
      profileLoading: profileQuery.isLoading,
      profileError: profileQuery.error,
      refetchProfile: profileQuery.refetch,
      menus: menusQuery.data?.menus || [],
      permissions: menusQuery.data?.permissions || {},
      menusLoading: menusQuery.isLoading,
      menusError: menusQuery.error,
      refetchMenus: menusQuery.refetch,
      assetUrl: profileQuery.data?.data?.asset_url || null, // Global asset URL from profile
      hasPermission: (permissionId) => {
        return !!(menusQuery.data?.permissions?.[permissionId]);
      },
      hasAnyPermission: (...permissionIds) => {
        return permissionIds.some(id => menusQuery.data?.permissions?.[id]);
      },
      hasAllPermissions: (...permissionIds) => {
        return permissionIds.every(id => menusQuery.data?.permissions?.[id]);
      },
    };
  }, [
    isAuthenticated,
    profileQuery.data?.data,
    menusQuery.data?.menus,
    menusQuery.data?.permissions,
    profileQuery.isLoading,
    menusQuery.isLoading,
    profileQuery.error,
    menusQuery.error,
    profileQuery.refetch,
    menusQuery.refetch
  ]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export default UserContext;
