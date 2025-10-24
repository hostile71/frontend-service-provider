# Dynamic Menu & User Profile Implementation

## Overview
Successfully implemented dynamic menu system and user profile functionality that:
- Fetches user profile from API
- Loads user menus based on permissions
- Displays menus dynamically in sidebar
- Implements permission-based access control
- Stores permissions for CRUD operations

## API Endpoints

### 1. Get Profile
**Endpoint:** `GET /api/profile`

**Response:**
```json
{
  "status": true,
  "code": 200,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 3,
    "first_name": "Landen",
    "last_name": "Murphy",
    "email": "hussainmahamud.swe@gmail.com",
    "role_id": 1,
    "identification_number": "ID0003",
    "type": "super_admin",
    "status": "active",
    "role": {
      "id": 1,
      "role_name": "Super Admin"
    }
  }
}
```

### 2. Get User Menus
**Endpoint:** `GET /api/user/menus`

**Response Structure:**
```json
{
  "status": true,
  "code": 200,
  "message": "Success",
  "data": {
    "success": true,
    "message": "User menu structure retrieved successfully",
    "data": [
      {
        "id": "dashboard",
        "labelKey": "dashboard",
        "icon": "BarChart3",
        "action": [
          {
            "id": "dashboard.view",
            "type": "view",
            "labelKey": "View",
            "endpoint": "dashboard.index",
            "icon": "Eye"
          }
        ],
        "path": "dashboard"
      }
    ]
  }
}
```

## Features Implemented

### ✅ 1. User Profile Service
**File:** `src/services/user.service.js`

```javascript
// Get user profile
getProfile() -> { success, message, data }

// Get user menus with permissions
getUserMenus() -> { success, message, menus, permissions }

// Extract permissions from menu structure
extractPermissions(menus) -> permissions object

// Check if user has permission
hasPermission(permissions, permissionId) -> boolean
```

### ✅ 2. React Query Hooks
**File:** `src/hooks/useUser.js`

```javascript
// Profile hook
useProfile() -> { data, isLoading, error, refetch }

// Menus hook
useUserMenus() -> { data: { menus, permissions }, isLoading, error }

// Permission hooks
usePermission(permissionId) -> boolean
usePermissions() -> permissions object

// CRUD hooks
useUsers(params)
useUser(id)
useCreateUser()
useUpdateUser()
useDeleteUser()
```

### ✅ 3. User Context
**File:** `src/contexts/UserContext.js`

Provides global access to:
- `profile` - User profile data
- `menus` - Dynamic menu structure
- `permissions` - Permissions object
- `hasPermission(id)` - Check single permission
- `hasAnyPermission(...ids)` - Check if has any permission
- `hasAllPermissions(...ids)` - Check if has all permissions

### ✅ 4. Dynamic Sidebar
**File:** `src/components/layout/DynamicSidebar.js`

Features:
- Renders menus from API response
- Maps icon names to Lucide React icons
- Handles nested menu structures
- Shows loading state while fetching
- Supports collapsed/expanded states
- Mobile responsive

### ✅ 5. Icon Mapper
**File:** `src/utils/iconMapper.js`

```javascript
getIconComponent(iconName) -> Lucide Icon Component
```

Maps string icon names (e.g., "BarChart3", "Users") to actual Lucide React icon components.

### ✅ 6. Permission Gate Component
**File:** `src/components/PermissionGate.js`

```jsx
// Show content only if user has permission
<PermissionGate permission="user.create">
  <button>Create User</button>
</PermissionGate>

// Show content if has ANY permission
<AnyPermission permissions={["user.edit", "user.delete"]}>
  <ActionButtons />
</AnyPermission>

// Show content if has ALL permissions
<AllPermissions permissions={["user.edit", "user.approve"]}>
  <ApproveButton />
</AllPermissions>
```

## How It Works

### 1. Application Startup
1. User logs in successfully
2. `UserProvider` wraps the app in `App.js`
3. When protected routes are accessed, two API calls are made in parallel:
   - `GET /api/profile` - Fetch user profile
   - `GET /api/user/menus` - Fetch user menus with permissions

### 2. Menu Rendering
1. API returns menu structure with `id`, `labelKey`, `icon`, `path`, and `children`
2. `DynamicSidebar` maps over the menu array
3. `getIconComponent()` converts icon names to Lucide components
4. Menus are rendered with proper nesting and highlighting

### 3. Permission Extraction
```javascript
const permissions = {
  "dashboard.view": { type: "view", endpoint: "dashboard.index", ... },
  "user.create": { type: "create", endpoint: "users.create", ... },
  "user.edit": { type: "edit", endpoint: "users.edit", ... },
  "user.delete": { type: "delete", endpoint: "users.delete", ... },
  // ... all other permissions
}
```

### 4. Permission Checks
```javascript
// In components
const { hasPermission } = useUser();

// Check before showing button
{hasPermission('user.create') && (
  <button onClick={createUser}>Create User</button>
)}

// Check before API call
if (hasPermission('user.delete')) {
  await deleteUser(id);
}
```

## Usage Examples

### Example 1: User Management Page with Permissions
```jsx
import { useUser } from '../contexts/UserContext';
import { PermissionGate } from '../components/PermissionGate';

const UserManagement = () => {
  const { hasPermission, profile } = useUser();
  
  return (
    <div>
      <h1>User Management</h1>
      
      {/* Only show create button if user has permission */}
      <PermissionGate permission="user.create">
        <button>Create User</button>
      </PermissionGate>
      
      <DataTable
        data={users}
        actions={{
          // Only show edit if has permission
          edit: hasPermission('user.edit'),
          // Only show delete if has permission
          delete: hasPermission('user.delete'),
        }}
      />
    </div>
  );
};
```

### Example 2: Conditional Rendering Based on Permissions
```jsx
import { useUser } from '../contexts/UserContext';

const Dashboard = () => {
  const { profile, hasAnyPermission } = useUser();
  
  return (
    <div>
      <h1>Welcome, {profile?.first_name}!</h1>
      <p>Role: {profile?.role?.role_name}</p>
      
      {/* Show stats only if has view permission for any report */}
      {hasAnyPermission('reports.dashboard', 'reports.user', 'reports.revenue') && (
        <StatsCards />
      )}
    </div>
  );
};
```

### Example 3: Using Profile Data
```jsx
import { useUser } from '../contexts/UserContext';
import { getFullName, getInitials } from '../utils/helpers';

const ProfileDisplay = () => {
  const { profile, profileLoading } = useUser();
  
  if (profileLoading) return <Loader />;
  
  return (
    <div>
      <div className="avatar">
        {getInitials(profile?.first_name, profile?.last_name)}
      </div>
      <h2>{getFullName(profile?.first_name, profile?.last_name)}</h2>
      <p>{profile?.email}</p>
      <span className="badge">{profile?.role?.role_name}</span>
    </div>
  );
};
```

## Permission-Based CRUD Operations

### How Actions Work
Each menu item can have actions:
```json
"action": [
  { "id": "user.view", "type": "view" },
  { "id": "user.create", "type": "create" },
  { "id": "user.edit", "type": "edit" },
  { "id": "user.delete", "type": "delete" }
]
```

If an action is missing (e.g., `user.delete`), the user won't have that permission.

### Checking Permissions in Components
```jsx
const UserActions = ({ user }) => {
  const { hasPermission } = useUser();
  
  return (
    <div>
      {hasPermission('user.view') && (
        <button onClick={() => viewUser(user)}>View</button>
      )}
      
      {hasPermission('user.edit') && (
        <button onClick={() => editUser(user)}>Edit</button>
      )}
      
      {hasPermission('user.delete') && (
        <button onClick={() => deleteUser(user)}>Delete</button>
      )}
    </div>
  );
};
```

## Files Created/Modified

### New Files:
1. `src/services/user.service.js` - User API service
2. `src/hooks/useUser.js` - React Query hooks for users
3. `src/contexts/UserContext.js` - Global user context
4. `src/components/layout/DynamicSidebar.js` - Dynamic menu component
5. `src/utils/iconMapper.js` - Icon string to component mapper
6. `src/components/PermissionGate.js` - Permission check components

### Modified Files:
1. `src/config/api.config.js` - Added profile and menus endpoints
2. `src/services/index.js` - Export userService
3. `src/App.js` - Wrapped with UserProvider
4. `src/components/layout/Layout.js` - Use DynamicSidebar
5. `src/utils/helpers.js` - Added name formatting functions

## Testing

### Test Profile API:
```bash
# Ensure you're logged in (have authToken)
# Profile should load automatically when app starts
```

**Expected:**
- Profile data loads and is accessible via `useUser()` hook
- User information displayed in header (name, role, email)

### Test Menus API:
```bash
# Menus should load automatically when app starts
```

**Expected:**
- Sidebar shows menus from API
- Icons render correctly
- Nested menus expand/collapse
- Active route is highlighted

### Test Permissions:
```bash
# Check different user roles
# Some permissions should be missing
```

**Expected:**
- Actions appear/disappear based on permissions
- Missing permissions hide buttons/features
- Permission checks work correctly

## Error Handling

### Profile Load Failure:
- Shows error in console
- Can manually refetch with `refetchProfile()`

### Menus Load Failure:
- Sidebar shows "Failed to load menu" message
- Can manually refetch with `refetchMenus()`

### Loading States:
- Profile loading: `profileLoading` is true
- Menus loading: `menusLoading` is true
- Sidebar shows spinner while loading

## Next Steps

1. ✅ Profile and menus loading
2. ✅ Dynamic sidebar rendering
3. ✅ Permission system
4. ⏳ Add profile display in Header component
5. ⏳ Implement permission checks in all CRUD operations
6. ⏳ Add permission-based route guards
7. ⏳ Create permission-aware DataTable component
8. ⏳ Add role-based dashboard customization

---
**Status:** ✅ Complete and Ready for Testing
**Date:** October 25, 2025
