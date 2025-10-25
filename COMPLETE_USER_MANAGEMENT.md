# Complete User Management Implementation

## Overview
Full CRUD implementation for managing users (customers, providers, and admin users) with all required fields and role management.

---

## User Fields

### All Users (Common Fields)
```javascript
{
  first_name: string,
  last_name: string,
  profile_picture: File,
  email: string,
  mobile_no: string,
  address: string,
  password: string (optional, min 8 chars),
  identification_number: string,
  type: 'admin' | 'provider' | 'customer',
  status: 'pending' | 'active' | 'inactive' | 'block',
  role_id: number (foreign key to roles table)
}
```

### Provider-Specific Fields
```javascript
{
  company_name: string,
  business_license: string,
  specialization: string,
  experience: string,
  certifications: string (textarea)
}
```

---

## API Endpoints

### Users API
- **GET** `/api/users` - List all users (with type filter: customer, provider, admin)
- **GET** `/api/users/{id}` - Get single user details
- **POST** `/api/users` - Create new user
- **POST** `/api/users/{id}` - Update user (uses POST for FormData support)
- **DELETE** `/api/users/{id}` - Delete user

### Roles API
- **GET** `/api/roles` - Get all available roles

---

## Roles Structure

### API Response Format
```json
{
  "status": true,
  "code": 200,
  "message": "Roles retrieved successfully",
  "data": [
    {
      "id": 1,
      "role_name": "Super Admin",
      "role_key": "super_admin"
    },
    {
      "id": 2,
      "role_name": "Admin",
      "role_key": "admin"
    },
    {
      "id": 3,
      "role_name": "Provider",
      "role_key": "provider"
    },
    {
      "id": 4,
      "role_name": "customer",
      "role_key": "customer"
    }
  ]
}
```

---

## Files Created/Modified

### New Files

#### 1. `src/services/role.service.js`
```javascript
- getAll() - Fetches all roles from /api/roles
```

#### 2. `src/hooks/useUsers.js`
```javascript
- useUsers(params) - List users with pagination
- useUser(id) - Get single user details
- useCreateUser() - Create user mutation
- useUpdateUser() - Update user mutation
- useDeleteUser() - Delete user mutation
```

#### 3. `src/components/ui/UserEditModal.js`
Complete edit form with:
- Profile picture upload (with preview)
- All user fields (basic + provider-specific)
- Role dropdown (fetched from API)
- Password update section (optional)
- FormData submission for file upload
- Backend error handling
- Loading states

#### 4. `src/components/ui/UserDetailModal.js`
View-only modal showing:
- Profile picture with fallback
- All user information
- Provider-specific sections
- Role information
- Statistics (if available)
- Timestamps

### Modified Files

#### 1. `src/config/api.config.js`
Added:
```javascript
ROLES: {
  LIST: '/api/roles',
}
```

#### 2. `src/services/user.service.js`
Updated `update()` method:
```javascript
- Detects FormData
- Sets Content-Type: multipart/form-data
- Properly handles file uploads
```

#### 3. `src/services/index.js`
Added:
```javascript
export { default as roleService } from './role.service';
```

#### 4. `src/components/pages/UserManagement.js`
Integrated:
- UserDetailModal for viewing
- UserEditModal for editing
- useDeleteUser hook for deletion
- Profile images in table
- Real-time refresh after operations

#### 5. `src/components/pages/ServiceProviders.js`
Integrated:
- UserDetailModal for viewing
- UserEditModal for editing
- useDeleteUser hook for deletion
- Profile images in table
- Real-time refresh after operations

---

## UserEditModal Features

### 1. Profile Picture Section
- Upload new image (JPEG, PNG, JPG, GIF, WEBP)
- Max size: 2MB
- Preview with fallback to user icon
- Remove/reset functionality
- Proper FormData handling

### 2. Basic Information Section
Fields:
- First Name (required)
- Last Name (required)
- Email (required, validated)
- Phone Number (required)
- Identification Number
- Status (dropdown: pending, active, inactive, block)
- User Type (dropdown: admin, provider, customer)
- Role (dropdown from API)
- Address (textarea)

### 3. Password Update Section (Optional)
- New Password (min 8 characters)
- Confirm Password (must match)
- Only sent if password is being changed
- Clear validation messages

### 4. Provider-Specific Section
Shown only when `userType === 'provider'`:
- Company Name
- Business License
- Specialization
- Experience
- Certifications (textarea)

### 5. Form Features
- Real-time validation
- Backend error display (inline with fields)
- Loading states during submission
- Success callback after update
- Automatic table refresh

---

## Role Dropdown Implementation

### Features
- Fetches roles from `/api/roles` on modal open
- Caches for 10 minutes (React Query)
- Displays role_name in dropdown
- Sends role_id to backend
- Shows "Loading roles..." while fetching
- Disabled while loading
- "Select Role" placeholder option

### Code Example
```javascript
// Fetch roles
const { data: rolesData, isLoading: rolesLoading } = useQuery({
  queryKey: ['roles'],
  queryFn: () => roleService.getAll(),
  enabled: isOpen,
  staleTime: 1000 * 60 * 10,
});

// Dropdown
<select name="role_id" value={formData.role_id}>
  <option value="">Select Role</option>
  {roles.map((role) => (
    <option key={role.id} value={role.id}>
      {role.role_name}
    </option>
  ))}
</select>
```

---

## FormData Submission

### Proper Headers Configuration
```javascript
// In user.service.js
const config = {};
if (userData instanceof FormData) {
  config.headers = {
    'Content-Type': 'multipart/form-data',
  };
}

const response = await apiClient.post(
  API_ENDPOINTS.USERS.UPDATE(id), 
  userData, 
  config
);
```

### What Gets Sent
```javascript
const submitData = new FormData();

// Basic fields (always)
submitData.append('first_name', 'John');
submitData.append('last_name', 'Doe');
submitData.append('email', 'john@example.com');
submitData.append('mobile_no', '+96812345678');
submitData.append('identification_number', 'ID123456');
submitData.append('type', 'customer');
submitData.append('status', 'active');
submitData.append('role_id', '4'); // From roles dropdown

// Optional fields
if (address) submitData.append('address', 'Full address');
if (password) submitData.append('password', 'newpass123');
if (password) submitData.append('password_confirmation', 'newpass123');

// File (only if new file selected)
if (profilePicture instanceof File) {
  submitData.append('profile_picture', profilePictureFile);
}

// Provider-specific (only for providers)
if (userType === 'provider') {
  submitData.append('company_name', 'Company LLC');
  submitData.append('business_license', 'LIC123456');
  submitData.append('specialization', 'Plumbing');
  submitData.append('experience', '5 years');
  submitData.append('certifications', 'Cert1, Cert2');
}
```

---

## Validation Rules

### Frontend Validation
```javascript
{
  first_name: 'required|string',
  last_name: 'required|string',
  email: 'required|email',
  mobile_no: 'required|string',
  password: 'optional|min:8',
  password_confirmation: 'required_with:password|same:password',
  profile_picture: 'optional|image|max:2MB',
  role_id: 'optional|number'
}
```

### Backend Validation (Laravel)
```php
[
  'first_name' => 'sometimes|string|max:255',
  'last_name' => 'sometimes|string|max:255',
  'password' => 'sometimes|string|min:8',
  'mobile_no' => 'nullable|string|max:20',
  'identification_number' => 'sometimes|string|unique:users,identification_number,' . $user->id,
  'type' => 'sometimes|in:admin,provider,customer',
  'status' => 'sometimes|in:pending,active,inactive,block',
  'role_id' => 'nullable|exists:roles,id',
  'profile_picture' => 'sometimes|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
  
  // Provider-specific
  'company_name' => 'sometimes|string|max:255',
  'business_license' => 'sometimes|string|max:255',
  'specialization' => 'sometimes|string|max:255',
  'experience' => 'sometimes|string|max:255',
  'certifications' => 'sometimes|string'
]
```

---

## User Types & Roles

### User Types (Enum)
- `admin` - System administrators
- `provider` - Service providers
- `customer` - Regular customers

### Role Assignment
- Each user has a `type` field (enum)
- Each user has a `role_id` field (foreign key)
- Roles provide fine-grained permissions
- Types provide coarse-grained categorization

### Example Mapping
```
Super Admin (role_id: 1) + type: admin
Admin (role_id: 2) + type: admin
Provider (role_id: 3) + type: provider
Customer (role_id: 4) + type: customer
```

---

## Provider-Specific Fields Handling

### When to Show
```javascript
{userType === 'provider' && (
  <div className="bg-purple-50 p-4 rounded-lg">
    <h4>Business Information</h4>
    {/* Provider fields */}
  </div>
)}
```

### When to Send
```javascript
if (userType === 'provider') {
  if (formData.company_name) submitData.append('company_name', formData.company_name);
  if (formData.business_license) submitData.append('business_license', formData.business_license);
  if (formData.specialization) submitData.append('specialization', formData.specialization);
  if (formData.experience) submitData.append('experience', formData.experience);
  if (formData.certifications) submitData.append('certifications', formData.certifications);
}
```

---

## Usage Examples

### View User
```javascript
const handleView = (user) => {
  setSelectedUser(user);
  setShowDetailModal(true);
};

<UserDetailModal
  isOpen={showDetailModal}
  onClose={() => setShowDetailModal(false)}
  userId={selectedUser?.id}
  userType="customer" // or "provider" or "admin"
/>
```

### Edit User
```javascript
const handleEdit = (user) => {
  setSelectedUser(user);
  setShowEditModal(true);
};

<UserEditModal
  isOpen={showEditModal}
  onClose={() => setShowEditModal(false)}
  user={selectedUser}
  userType="customer" // or "provider"
  onSuccess={() => {
    queryClient.invalidateQueries(['users']);
  }}
/>
```

### Delete User
```javascript
const deleteUserMutation = useDeleteUser();

const handleDelete = (user) => {
  if (window.confirm(`Delete ${user.first_name} ${user.last_name}?`)) {
    deleteUserMutation.mutate(user.id);
  }
};
```

---

## React Query Integration

### Cache Keys
```javascript
['roles'] // All roles (cached 10 min)
['users', userId] // Single user
['users', type, page, perPage, search] // User list
```

### Automatic Invalidation
```javascript
// After successful update/delete
queryClient.invalidateQueries({ queryKey: ['users'] });
queryClient.invalidateQueries({ queryKey: ['users', userId] });
```

---

## Error Handling

### Display Backend Errors
```javascript
// Backend returns
{
  "errors": {
    "email": ["The email has already been taken."],
    "identification_number": ["The identification number must be unique."]
  }
}

// Frontend displays
{errors.email && (
  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
)}
```

---

## Best Practices Followed

1. ✅ **Single Source of Truth** - Roles fetched from API, not hardcoded
2. ✅ **Proper File Upload** - FormData with correct headers
3. ✅ **Validation** - Frontend + Backend validation
4. ✅ **Caching** - React Query for efficient data fetching
5. ✅ **Type Safety** - Proper prop types and validation
6. ✅ **UX** - Loading states, error messages, confirmations
7. ✅ **Security** - Permission-based UI rendering
8. ✅ **Performance** - Conditional field rendering, query caching
9. ✅ **Maintainability** - Modular code, clear separation of concerns
10. ✅ **Accessibility** - Proper labels, semantic HTML

---

## Testing Checklist

### Basic Operations
- [ ] View customer details
- [ ] View provider details
- [ ] View admin details
- [ ] Edit customer (all fields)
- [ ] Edit provider (all fields including business info)
- [ ] Delete user with confirmation

### Role Management
- [ ] Roles dropdown loads correctly
- [ ] Can select and save role
- [ ] Role displays in detail view

### Profile Picture
- [ ] Upload new image
- [ ] Preview shows immediately
- [ ] Remove image resets to original
- [ ] File validation works (type & size)
- [ ] Image saves to backend correctly

### Password Update
- [ ] Can update password
- [ ] Password confirmation validation
- [ ] Leaving blank keeps current password
- [ ] Min 8 characters validation

### Provider Fields
- [ ] Provider fields only show for providers
- [ ] Can edit all provider-specific fields
- [ ] Fields save correctly

### Validation
- [ ] Required field validation
- [ ] Email format validation
- [ ] Backend errors display correctly
- [ ] Form prevents submission with errors

### Permission-Based UI
- [ ] View button shows with correct permission
- [ ] Edit button shows with correct permission
- [ ] Delete button shows with correct permission

---

## Conclusion

Complete user management system with:
- ✅ Full CRUD operations for all user types
- ✅ Role management via dropdown (API-driven)
- ✅ Profile picture upload with preview
- ✅ Provider-specific fields
- ✅ Password update functionality
- ✅ Comprehensive validation
- ✅ Permission-based access control
- ✅ Excellent UX with loading states and error handling

The implementation follows React best practices, uses modern hooks (React Query), and provides a seamless experience for managing customers, providers, and admin users.
