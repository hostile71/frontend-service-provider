# User and Provider Add Modals Implementation

## Overview
Created two new modal components for adding users and providers with all necessary fields, auto-selected user types, and complete validation.

---

## Files Created

### 1. UserAddModal.js
**Location:** `src/components/ui/UserAddModal.js`

**Purpose:** Add new customer users

**Key Features:**
- ✅ Auto-selected type: **"customer"** (displayed as disabled field)
- ✅ Profile picture upload with preview
- ✅ All user fields matching edit modal
- ✅ Password required (min 8 characters)
- ✅ Role dropdown from API
- ✅ FormData submission for file upload
- ✅ Backend error handling
- ✅ Loading states

**Fields Included:**
```javascript
{
  // Basic Information (Required)
  first_name: string *,
  last_name: string *,
  email: string *,
  mobile_no: string *,
  
  // Optional Basic Fields
  identification_number: string,
  address: string,
  
  // System Fields
  type: 'customer' (auto-selected, disabled),
  status: 'active' | 'pending' | 'inactive' | 'block',
  role_id: number (dropdown from API),
  
  // Security (Required for new user)
  password: string * (min 8 chars),
  password_confirmation: string *,
  
  // Media
  profile_picture: File (optional)
}
```

### 2. ProviderAddModal.js
**Location:** `src/components/ui/ProviderAddModal.js`

**Purpose:** Add new service provider users

**Key Features:**
- ✅ Auto-selected type: **"provider"** (displayed as disabled field)
- ✅ Profile picture upload with preview
- ✅ All user fields + provider-specific fields
- ✅ Password required (min 8 characters)
- ✅ Role dropdown from API
- ✅ Business information section
- ✅ Professional information section
- ✅ FormData submission for file upload
- ✅ Backend error handling
- ✅ Loading states

**Fields Included:**
```javascript
{
  // Basic Information (same as UserAddModal)
  first_name: string *,
  last_name: string *,
  email: string *,
  mobile_no: string *,
  identification_number: string,
  address: string,
  
  // System Fields
  type: 'provider' (auto-selected, disabled),
  status: 'active' | 'pending' | 'inactive' | 'block',
  role_id: number (dropdown from API),
  
  // Security (Required for new user)
  password: string * (min 8 chars),
  password_confirmation: string *,
  
  // Provider-Specific Fields
  company_name: string,
  business_license: string,
  specialization: string,
  experience: string,
  certifications: string (textarea),
  
  // Media
  profile_picture: File (optional)
}
```

---

## Key Differences from Edit Modal

### UserAddModal & ProviderAddModal
1. **Password Required:** New users must have a password (not optional)
2. **No Pre-filled Data:** Form starts empty
3. **Type Field Disabled:** Auto-selected based on modal type
4. **Form Reset:** Resets when modal opens
5. **Button Text:** "Create Customer" / "Create Provider" instead of "Save Changes"

### UserEditModal
1. **Password Optional:** Can leave blank to keep current password
2. **Pre-filled Data:** Loads existing user data
3. **Type Field Editable:** Can change user type
4. **Form Initialization:** Loads from user prop
5. **Button Text:** "Save Changes"

---

## User Type Auto-Selection

### Customer Modal (UserAddModal)
```jsx
<label>User Type</label>
<input
  type="text"
  value="Customer"
  disabled
  className="bg-gray-100 text-gray-600"
/>
<input type="hidden" name="type" value="customer" />
```

### Provider Modal (ProviderAddModal)
```jsx
<label>User Type</label>
<input
  type="text"
  value="Provider"
  disabled
  className="bg-gray-100 text-gray-600"
/>
<input type="hidden" name="type" value="provider" />
```

---

## Validation Rules

### Common Validation (Both Modals)
```javascript
{
  first_name: 'required',
  last_name: 'required',
  email: 'required|email',
  mobile_no: 'required',
  password: 'required|min:8',
  password_confirmation: 'required|same:password'
}
```

### Backend Validation (Laravel)
```php
[
  'first_name' => 'required|string|max:255',
  'last_name' => 'required|string|max:255',
  'email' => 'required|email|unique:users,email',
  'mobile_no' => 'required|string|max:20',
  'password' => 'required|string|min:8|confirmed',
  'type' => 'required|in:admin,provider,customer',
  'status' => 'nullable|in:pending,active,inactive,block',
  'role_id' => 'nullable|exists:roles,id',
  'identification_number' => 'nullable|string|unique:users,identification_number',
  'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
  
  // Provider-specific (only validated if type=provider)
  'company_name' => 'nullable|string|max:255',
  'business_license' => 'nullable|string|max:255',
  'specialization' => 'nullable|string|max:255',
  'experience' => 'nullable|string|max:255',
  'certifications' => 'nullable|string'
]
```

---

## API Integration

### Endpoint
```
POST /api/users
```

### Request (FormData)
```javascript
const submitData = new FormData();

// Required fields
submitData.append('first_name', 'John');
submitData.append('last_name', 'Doe');
submitData.append('email', 'john@example.com');
submitData.append('mobile_no', '+96812345678');
submitData.append('type', 'customer'); // or 'provider'
submitData.append('status', 'active');
submitData.append('password', 'password123');
submitData.append('password_confirmation', 'password123');

// Optional fields
if (identification_number) submitData.append('identification_number', value);
if (address) submitData.append('address', value);
if (role_id) submitData.append('role_id', value);

// File (if selected)
if (profilePicture instanceof File) {
  submitData.append('profile_picture', profilePicture);
}

// Provider-specific (only for ProviderAddModal)
if (company_name) submitData.append('company_name', value);
if (business_license) submitData.append('business_license', value);
// ... other provider fields
```

### Response
```json
{
  "status": true,
  "code": 201,
  "message": "User created successfully",
  "data": {
    "id": 123,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "type": "customer",
    "status": "active",
    "profile_picture": "uploads/users/123/profile.jpg",
    "created_at": "2025-10-25T10:30:00.000000Z"
  }
}
```

---

## Usage Examples

### UserManagement.js (Customer Page)
```javascript
import { UserAddModal } from '../ui';

function UserManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const queryClient = useQueryClient();

  const handleAddSuccess = () => {
    queryClient.invalidateQueries(['users']);
    setShowAddModal(false);
  };

  return (
    <>
      <button onClick={() => setShowAddModal(true)}>
        Add Customer
      </button>

      <UserAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />
    </>
  );
}
```

### ServiceProviders.js (Provider Page)
```javascript
import { ProviderAddModal } from '../ui';

function ServiceProviders() {
  const [showAddModal, setShowAddModal] = useState(false);
  const queryClient = useQueryClient();

  const handleAddSuccess = () => {
    queryClient.invalidateQueries(['users']);
    setShowAddModal(false);
  };

  return (
    <>
      <button onClick={() => setShowAddModal(true)}>
        Add Provider
      </button>

      <ProviderAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />
    </>
  );
}
```

---

## React Query Integration

### Hook Used
```javascript
import { useCreateUser } from '../../hooks/useUsers';

const createUserMutation = useCreateUser();
```

### Mutation Flow
1. **Submit:** `createUserMutation.mutateAsync(submitData)`
2. **API Call:** `userService.create(submitData)`
3. **Success:** 
   - Invalidates `['users']` cache
   - Shows success toast
   - Calls `onSuccess()` callback
   - Closes modal
4. **Error:**
   - Shows error toast
   - Displays backend validation errors inline

---

## Export Configuration

Updated `src/components/ui/index.js`:
```javascript
export { default as UserAddModal } from './UserAddModal';
export { default as ProviderAddModal } from './ProviderAddModal';
```

---

## Profile Picture Upload

### Features
- Visual preview before upload
- File type validation (JPEG, PNG, JPG, GIF, WEBP)
- File size validation (max 2MB)
- Remove button to clear selection
- Fallback to user icon if no image

### Code Example
```javascript
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Type validation
    if (!file.type.match(/image\/(jpeg|png|jpg|gif|webp)/)) {
      setErrors({ profile_picture: 'Invalid file type' });
      return;
    }
    
    // Size validation
    if (file.size > 2048 * 1024) { // 2MB
      setErrors({ profile_picture: 'File too large' });
      return;
    }
    
    setProfilePicture(file);
    setProfilePicturePreview(URL.createObjectURL(file));
  }
};
```

---

## Error Handling

### Frontend Validation
- Required field checks
- Email format validation
- Password length (min 8)
- Password confirmation match
- File type and size validation

### Backend Error Display
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
  <p className="text-red-500 text-sm">{errors.email}</p>
)}
```

---

## UI/UX Features

### Loading States
- Disabled form during submission
- Spinner on submit button
- "Creating..." text during mutation
- Role dropdown shows "Loading roles..."

### Visual Sections
1. **Profile Picture** - Blue gradient background
2. **Basic Information** - Gray background
3. **Password** - Yellow background (indicates required)
4. **Business Information** - Purple background (provider only)

### Form Reset
- Automatically resets when modal opens
- Clears all fields and errors
- Removes profile picture preview
- Resets to default values

---

## Comparison Matrix

| Feature | UserAddModal | ProviderAddModal | UserEditModal |
|---------|-------------|------------------|---------------|
| User Type | customer (auto) | provider (auto) | Editable dropdown |
| Password | Required | Required | Optional |
| Business Fields | ❌ No | ✅ Yes | Conditional |
| Pre-filled Data | ❌ No | ❌ No | ✅ Yes |
| Button Text | Create Customer | Create Provider | Save Changes |
| Form Reset | On open | On open | On user change |
| Profile Picture | Optional | Optional | Optional |
| Role Dropdown | ✅ Yes | ✅ Yes | ✅ Yes |

---

## Testing Checklist

### UserAddModal
- [ ] Opens when "Add Customer" clicked
- [ ] Type field shows "Customer" (disabled)
- [ ] All fields start empty
- [ ] Required field validation works
- [ ] Email format validation works
- [ ] Password min length validation works
- [ ] Password confirmation match validation works
- [ ] Profile picture upload works
- [ ] Role dropdown loads from API
- [ ] Submit creates new customer
- [ ] Success closes modal and refreshes table
- [ ] Backend errors display correctly
- [ ] Cancel closes without saving

### ProviderAddModal
- [ ] Opens when "Add Provider" clicked
- [ ] Type field shows "Provider" (disabled)
- [ ] All fields start empty
- [ ] Business information section visible
- [ ] All validations work (same as UserAddModal)
- [ ] Profile picture upload works
- [ ] Role dropdown loads from API
- [ ] Submit creates new provider
- [ ] Provider-specific fields submit correctly
- [ ] Success closes modal and refreshes table
- [ ] Backend errors display correctly
- [ ] Cancel closes without saving

---

## Conclusion

Complete implementation of user and provider add modals with:
- ✅ Auto-selected user types (customer/provider)
- ✅ All fields matching edit modal
- ✅ Password required for new users
- ✅ Profile picture upload
- ✅ Role dropdown from API
- ✅ Provider-specific fields (conditional)
- ✅ Complete validation (frontend + backend)
- ✅ FormData submission for file upload
- ✅ Error handling and display
- ✅ Loading states and UX feedback
- ✅ React Query integration
- ✅ Automatic cache invalidation

The modals are ready to be integrated into UserManagement and ServiceProviders pages! 🎉
