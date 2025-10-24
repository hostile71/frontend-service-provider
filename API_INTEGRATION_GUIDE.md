# API Integration Guide

## Overview
This guide explains how to integrate the backend APIs with the React frontend, including pagination, search, and permission-based action buttons.

## API Structure

### Common Response Format
All APIs return responses in this format:
```json
{
  "status": true,
  "code": 200,
  "message": "Success message",
  "request_time": "2025-10-24 20:06:30",
  "response_time": "2025-10-24 20:06:30",
  "duration": "5.45 ms",
  "data": {
    // Actual data here
  },
  "errors": null
}
```

### Paginated Response Format
For list endpoints with pagination:
```json
{
  "data": {
    "current_page": 1,
    "data": [...],  // Array of items
    "first_page_url": "http://localhost/api/endpoint?page=1",
    "from": 1,
    "last_page": 2,
    "last_page_url": "http://localhost/api/endpoint?page=2",
    "next_page_url": "http://localhost/api/endpoint?page=2",
    "path": "http://localhost/api/endpoint",
    "per_page": 10,
    "prev_page_url": null,
    "to": 10,
    "total": 16
  }
}
```

## Endpoint Patterns

### Categories
- **List:** `GET /api/categories`
  - Query params: `page`, `per_page`, `search`
- **Single View:** `GET /api/categories/{id}`
- **Create:** `POST /api/categories`
- **Update:** `POST /api/categories/{id}`
- **Delete:** `DELETE /api/categories/{id}`

### Users
- **Customer List:** `GET /api/users?type=customer`
- **Provider List:** `GET /api/users?type=provider`
- **Admin List:** `GET /api/users?type=admin`
- **Single View:** `GET /api/users/{id}`
- **Create:** `POST /api/users` (with `type` field in body)
- **Update:** `POST /api/users/{id}`
- **Delete:** `DELETE /api/users/{id}`

## Implementation

### 1. Service Layer
Create a service file for each entity in `src/services/`:

```javascript
// src/services/category.service.js
import apiClient from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

const categoryService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.LIST, { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.GET(id));
    return response.data;
  },
  
  create: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.CATEGORIES.CREATE, data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await apiClient.post(API_ENDPOINTS.CATEGORIES.UPDATE(id), data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.CATEGORIES.DELETE(id));
    return response.data;
  },
};

export default categoryService;
```

### 2. React Query Hooks
Create custom hooks in `src/hooks/`:

```javascript
// src/hooks/useCategories.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services';

export const categoryKeys = {
  all: ['categories'],
  lists: () => [...categoryKeys.all, 'list'],
  list: (params) => [...categoryKeys.lists(), { params }],
  detail: (id) => [...categoryKeys.all, 'detail', id],
};

export const useCategories = (params = {}) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};
```

### 3. Component Implementation

```javascript
// src/components/pages/Categories.js
import React, { useState } from 'react';
import { useCategories, useDeleteCategory } from '../../hooks/useCategories';
import ApiDataTable from '../ui/ApiDataTable';

const Categories = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useCategories({
    page: currentPage,
    per_page: perPage,
    search: searchQuery,
  });

  const deleteMutation = useDeleteCategory();

  const handlePageChange = (page, newPerPage) => {
    if (newPerPage) {
      setPerPage(newPerPage);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const columns = ['Name', 'Status', 'Description'];
  
  const permissions = {
    view: 'category-view',
    create: 'category-create',
    edit: 'category-edit',
    delete: 'category-delete',
  };

  return (
    <ApiDataTable
      data={data?.data?.data || []}
      pagination={data?.data ? {
        current_page: data.data.current_page,
        last_page: data.data.last_page,
        per_page: data.data.per_page,
        total: data.data.total,
        from: data.data.from,
        to: data.data.to,
      } : null}
      columns={columns}
      title="Categories"
      onPageChange={handlePageChange}
      onSearch={handleSearch}
      isLoading={isLoading}
      permissions={permissions}
      itemType="category"
    />
  );
};
```

## Permission-Based Actions

### Permission Configuration
Define permissions for each entity:

```javascript
const categoryPermissions = {
  view: 'category-view',      // Permission ID for view action
  create: 'category-create',  // Permission ID for create action
  edit: 'category-edit',      // Permission ID for edit action
  delete: 'category-delete',  // Permission ID for delete action
};
```

### How Permissions Work
1. The `ApiDataTable` component receives permission IDs
2. It uses the `useUser` hook to check if the current user has each permission
3. Action buttons are shown/hidden based on permission checks
4. The entire Actions column is hidden if user has no permissions

### Permission Checking
```javascript
import { useUser } from '../../contexts/UserContext';

const { hasPermission } = useUser();

// Check single permission
if (hasPermission('category-edit')) {
  // Show edit button
}

// Check multiple permissions (any)
if (hasAnyPermission('category-edit', 'category-view')) {
  // Show if user has either permission
}

// Check multiple permissions (all)
if (hasAllPermissions('category-edit', 'category-delete')) {
  // Show only if user has both permissions
}
```

## Pagination Features

### API Pagination
- **Current Page:** `current_page`
- **Total Pages:** `last_page`
- **Items Per Page:** `per_page`
- **Total Items:** `total`
- **Range:** `from` and `to`

### UI Features
- First/Last page navigation
- Previous/Next page navigation
- Page number buttons (shows 5 at a time)
- Per-page selector (5, 10, 25, 50, 100)
- Results count display

## Search Implementation

### Debounced Search
The search input is debounced (500ms) to avoid excessive API calls:

```javascript
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500);
  return () => clearTimeout(timer);
}, [searchTerm]);

useEffect(() => {
  if (onSearch) {
    onSearch(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);
```

### Search Parameters
Send search query as a parameter:
```javascript
const { data } = useCategories({
  page: 1,
  per_page: 10,
  search: 'keyword',
});
```

## User Type Filtering

For user endpoints, add the `type` parameter:

```javascript
// Customers
const { data } = useQuery({
  queryKey: ['users', 'customer', page],
  queryFn: () => userService.getAll({
    type: 'customer',
    page,
    per_page: 10,
  }),
});

// Providers
const { data } = useQuery({
  queryKey: ['users', 'provider', page],
  queryFn: () => userService.getAll({
    type: 'provider',
    page,
    per_page: 10,
  }),
});

// Admins
const { data } = useQuery({
  queryKey: ['users', 'admin', page],
  queryFn: () => userService.getAll({
    type: 'admin',
    page,
    per_page: 10,
  }),
});
```

## Loading States

The `ApiDataTable` component handles loading states:

```javascript
{isLoading ? (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3">Loading...</span>
  </div>
) : (
  // Render data
)}
```

## Error Handling

Errors are handled in the service layer and interceptors:

```javascript
const deleteMutation = useMutation({
  mutationFn: (id) => categoryService.delete(id),
  onSuccess: () => {
    showToast('Deleted successfully', 'success');
  },
  onError: (error) => {
    showToast(error.message || 'Delete failed', 'error');
  },
});
```

## Custom Cell Rendering

For entity-specific field rendering:

```javascript
const renderCustomCell = (item, column, value, fieldKey) => {
  if (column === 'Name') {
    return <span>{item.first_name} {item.last_name}</span>;
  }
  if (column === 'Role') {
    return <span className="capitalize">{item.role?.role_name}</span>;
  }
  return undefined; // Use default rendering
};

<ApiDataTable
  renderCustomCell={renderCustomCell}
  // ... other props
/>
```

## Files Created/Modified

### New Files
1. `src/services/category.service.js` - Category API service
2. `src/hooks/useCategories.js` - Category React Query hooks
3. `src/components/ui/ApiDataTable.js` - API-integrated data table component

### Modified Files
1. `src/config/api.config.js` - Added CATEGORIES endpoints
2. `src/services/index.js` - Exported categoryService
3. `src/components/ui/index.js` - Exported ApiDataTable
4. `src/components/pages/Categories.js` - Integrated with API
5. `src/components/pages/UserManagement.js` - Integrated with API (type=customer)
6. `src/components/pages/ServiceProviders.js` - Integrated with API (type=provider)

## Testing Checklist

- [ ] List page loads with pagination
- [ ] Search filters results
- [ ] Page navigation works (first, prev, next, last)
- [ ] Per-page selector updates results
- [ ] Create button appears for users with create permission
- [ ] Edit button appears for users with edit permission
- [ ] Delete button appears for users with delete permission
- [ ] View button appears for users with view permission
- [ ] Actions column hidden if user has no permissions
- [ ] Delete confirmation works
- [ ] Loading state displays during API calls
- [ ] Error messages display on API failures
- [ ] Success messages display on successful operations

## Next Steps

1. Create similar implementations for other entities (Services, Bookings, Payments)
2. Implement form modals for Create/Edit operations
3. Add advanced filters (status, date range, etc.)
4. Implement bulk operations
5. Add export functionality (CSV, PDF)
6. Implement sorting by column headers
