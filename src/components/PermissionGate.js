/**
 * Permission Check Component
 * 
 * Conditionally renders children based on user permissions
 */

import { useUser } from '../contexts/UserContext';

/**
 * PermissionGate - Shows children only if user has permission
 * @param {string} permission - Permission ID to check
 * @param {React.ReactNode} children - Content to show if permitted
 * @param {React.ReactNode} fallback - Content to show if not permitted (optional)
 */
export const PermissionGate = ({ permission, children, fallback = null }) => {
  const { hasPermission } = useUser();
  
  if (!permission) return children;
  
  return hasPermission(permission) ? children : fallback;
};

/**
 * PermissionCheck - Shows children only if user has ANY of the permissions
 * @param {string[]} permissions - Array of permission IDs
 * @param {React.ReactNode} children - Content to show if permitted
 * @param {React.ReactNode} fallback - Content to show if not permitted (optional)
 */
export const AnyPermission = ({ permissions = [], children, fallback = null }) => {
  const { hasAnyPermission } = useUser();
  
  if (permissions.length === 0) return children;
  
  return hasAnyPermission(...permissions) ? children : fallback;
};

/**
 * AllPermissions - Shows children only if user has ALL of the permissions
 * @param {string[]} permissions - Array of permission IDs
 * @param {React.ReactNode} children - Content to show if permitted
 * @param {React.ReactNode} fallback - Content to show if not permitted (optional)
 */
export const AllPermissions = ({ permissions = [], children, fallback = null }) => {
  const { hasAllPermissions } = useUser();
  
  if (permissions.length === 0) return children;
  
  return hasAllPermissions(...permissions) ? children : fallback;
};

export default PermissionGate;
