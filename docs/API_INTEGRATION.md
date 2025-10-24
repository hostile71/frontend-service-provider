# API Integration Guide

## Overview

This application uses **TanStack Query (React Query)** for server state management and **Axios** for HTTP requests. The API integration is structured for maintainability, scalability, and ease of use.

## Architecture

```
src/
├── config/
│   └── api.config.js          # API base URL and endpoints configuration
├── lib/
│   └── apiClient.js           # Axios instance with interceptors
├── services/
│   ├── auth.service.js        # Authentication API methods
│   └── index.js               # Services barrel export
└── hooks/
    └── useAuth.js             # React Query hooks for authentication
```

## Configuration

### API Base URL

Edit `src/config/api.config.js` to change the backend URL:

```javascript
export const API_CONFIG = {
  BASE_URL: 'http://localhost/backend-service-provider',
  // Change to production URL when deploying:
  // BASE_URL: 'https://api.yourproduction.com',
};
```

### Environment Variables (Optional)

Create `.env` file in project root:

```env
VITE_API_BASE_URL=http://localhost/backend-service-provider
VITE_API_TIMEOUT=30000
```

Then update `api.config.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost/backend-service-provider',
  TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 30000,
};
```

## Usage

### 1. Authentication Flow

#### Login
```javascript
import { useLogin } from '../hooks/useAuth';

const Login = () => {
  const loginMutation = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({
      email: 'user@example.com',
      password: 'password123'
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {loginMutation.isPending && <p>Loading...</p>}
      {loginMutation.isError && <p>{loginMutation.error.message}</p>}
      <button type="submit" disabled={loginMutation.isPending}>
        Login
      </button>
    </form>
  );
};
```

#### 2FA Verification
```javascript
import { useVerify2FA } from '../hooks/useAuth';

const TwoFactorAuth = () => {
  const verify2FAMutation = useVerify2FA();

  const handleSubmit = (code) => {
    verify2FAMutation.mutate({
      email: 'user@example.com',
      code: code
    });
  };

  return (
    <>
      {verify2FAMutation.isPending && <p>Verifying...</p>}
      {verify2FAMutation.isError && <p>{verify2FAMutation.error.message}</p>}
    </>
  );
};
```

### 2. Creating New Services

#### Step 1: Add Endpoints to Config

Edit `src/config/api.config.js`:

```javascript
export const API_ENDPOINTS = {
  // ... existing endpoints
  USERS: {
    LIST: '/api/users',
    GET: (id) => `/api/users/${id}`,
    CREATE: '/api/users',
    UPDATE: (id) => `/api/users/${id}`,
    DELETE: (id) => `/api/users/${id}`,
  },
};
```

#### Step 2: Create Service File

Create `src/services/user.service.js`:

```javascript
import apiClient from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

const userService = {
  // Get all users
  getAll: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.LIST, { params });
    return response.data;
  },

  // Get single user
  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.GET(id));
    return response.data;
  },

  // Create user
  create: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.USERS.CREATE, userData);
    return response.data;
  },

  // Update user
  update: async (id, userData) => {
    const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE(id), userData);
    return response.data;
  },

  // Delete user
  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
    return response.data;
  },
};

export default userService;
```

#### Step 3: Create React Query Hooks

Create `src/hooks/useUsers.js`:

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../services/user.service';

// Query keys
export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  list: (filters) => [...userKeys.lists(), { filters }],
  details: () => [...userKeys.all, 'detail'],
  detail: (id) => [...userKeys.details(), id],
};

// Get all users
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getAll(params),
  });
};

// Get single user
export const useUser = (id) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getById(id),
    enabled: !!id, // Only run if id exists
  });
};

// Create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) => userService.create(userData),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => userService.update(id, data),
    onSuccess: (data, variables) => {
      // Invalidate both list and detail
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};
```

#### Step 4: Use in Components

```javascript
import { useUsers, useCreateUser, useDeleteUser } from '../hooks/useUsers';

const UserManagement = () => {
  // Fetch users
  const { data: users, isLoading, isError, error } = useUsers();
  
  // Create user mutation
  const createUserMutation = useCreateUser();
  
  // Delete user mutation
  const deleteUserMutation = useDeleteUser();

  const handleCreateUser = (userData) => {
    createUserMutation.mutate(userData, {
      onSuccess: () => {
        console.log('User created successfully!');
      },
    });
  };

  const handleDeleteUser = (id) => {
    deleteUserMutation.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <button onClick={() => handleDeleteUser(user.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
```

## API Response Format

### Expected Response Structure

```javascript
// Success Response
{
  "success": true,
  "data": { /* your data */ },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field1": ["Error 1", "Error 2"],
    "field2": ["Error 3"]
  }
}
```

### Handling Different Response Formats

If your API uses different response formats, update the interceptors in `src/lib/apiClient.js`:

```javascript
// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Extract data from nested response
    // Example: if API returns { data: { result: {...} } }
    return response.data.result || response.data;
  },
  // ... error handling
);
```

## Authentication Token

### Token Storage

Tokens are stored in localStorage:
- `authToken` - JWT token
- `userEmail` - User email
- `2faVerified` - 2FA verification status

### Token Injection

Tokens are automatically injected into request headers via interceptor in `apiClient.js`:

```javascript
config.headers.Authorization = `Bearer ${token}`;
```

### Token Refresh (Optional)

To implement token refresh:

```javascript
// In apiClient.js interceptor
if (error.response?.status === 401) {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (refreshToken) {
    try {
      const response = await axios.post('/api/refresh-token', { refreshToken });
      const newToken = response.data.token;
      localStorage.setItem('authToken', newToken);
      
      // Retry original request
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return axios(error.config);
    } catch (refreshError) {
      // Refresh failed, logout
      localStorage.clear();
      window.location.href = '/login';
    }
  }
}
```

## Error Handling

### Global Error Handling

Errors are handled globally in the axios interceptor. Custom error messages can be shown:

```javascript
// In component
const { isError, error } = useUsers();

if (isError) {
  return <div>Error: {error.message}</div>;
}
```

### Validation Errors

```javascript
// In mutation
createUserMutation.mutate(userData, {
  onError: (error) => {
    if (error.status === 422) {
      // Validation errors
      console.log(error.errors);
      // Display field-specific errors
      setFieldErrors(error.errors);
    }
  }
});
```

## React Query DevTools

DevTools are enabled in development mode. Access them via the floating icon in the bottom corner.

To disable:
```javascript
// In App.js, remove:
<ReactQueryDevtools initialIsOpen={false} />
```

## Best Practices

1. **Use Query Keys Properly**
   - Create a query keys factory for each resource
   - Use consistent key structure

2. **Handle Loading States**
   ```javascript
   if (isLoading) return <Spinner />;
   if (isError) return <ErrorMessage error={error} />;
   ```

3. **Optimistic Updates**
   ```javascript
   const mutation = useMutation({
     onMutate: async (newData) => {
       // Cancel outgoing refetches
       await queryClient.cancelQueries({ queryKey: ['users'] });
       
       // Snapshot previous value
       const previousUsers = queryClient.getQueryData(['users']);
       
       // Optimistically update
       queryClient.setQueryData(['users'], (old) => [...old, newData]);
       
       // Return context with snapshot
       return { previousUsers };
     },
     onError: (err, newData, context) => {
       // Rollback on error
       queryClient.setQueryData(['users'], context.previousUsers);
     },
   });
   ```

4. **Prefetching**
   ```javascript
   const queryClient = useQueryClient();
   
   // Prefetch on hover
   const handleMouseEnter = (id) => {
     queryClient.prefetchQuery({
       queryKey: userKeys.detail(id),
       queryFn: () => userService.getById(id),
     });
   };
   ```

## Testing Backend Connection

To test if backend is running:

```javascript
// Add to auth.service.js
const authService = {
  // ... existing methods
  
  testConnection: async () => {
    try {
      const response = await apiClient.get('/api/health');
      console.log('✅ Backend connected:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      return false;
    }
  },
};
```

Use in component:
```javascript
useEffect(() => {
  authService.testConnection();
}, []);
```

## Troubleshooting

### CORS Issues

If you get CORS errors, ensure backend allows your frontend origin:

```php
// PHP Laravel example
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

### Network Errors

Check:
1. Backend server is running
2. Correct API_BASE_URL in config
3. Network tab in browser DevTools
4. Backend logs

### 401 Unauthorized

- Token might be expired
- Check token format in Authorization header
- Verify backend expects `Bearer {token}` format

## Next Steps

1. Create services for: Users, Providers, Services, Bookings, Payments
2. Add pagination to list queries
3. Implement infinite scroll with `useInfiniteQuery`
4. Add request caching strategies
5. Implement offline support with React Query persist
