# Quick Start: Adding New API-Integrated Entity

This is a quick reference for adding a new entity (e.g., Services, Bookings) with API integration.

## Step 1: Add Endpoint Configuration
**File:** `src/config/api.config.js`

```javascript
export const API_ENDPOINTS = {
  // ... existing endpoints
  
  // Add your new entity
  SERVICES: {
    LIST: '/api/services',
    GET: (id) => `/api/services/${id}`,
    CREATE: '/api/services',
    UPDATE: (id) => `/api/services/${id}`,
    DELETE: (id) => `/api/services/${id}`,
  },
};
```

## Step 2: Create Service File
**File:** `src/services/service.service.js`

```javascript
import apiClient from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api.config';

const serviceService = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SERVICES.LIST, { params });
      const { status, message, data } = response.data;
      
      if (!status) {
        throw new Error(message || 'Failed to fetch services');
      }
      
      return { success: true, message, data };
    } catch (error) {
      console.error('Get services error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SERVICES.GET(id));
      const { status, message, data } = response.data;
      
      if (!status) {
        throw new Error(message || 'Failed to fetch service');
      }
      
      return { success: true, message, data };
    } catch (error) {
      console.error('Get service error:', error);
      throw error;
    }
  },

  create: async (serviceData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SERVICES.CREATE, serviceData);
      const { status, message, data } = response.data;
      
      if (!status) {
        throw new Error(message || 'Failed to create service');
      }
      
      return { success: true, message, data };
    } catch (error) {
      console.error('Create service error:', error);
      throw error;
    }
  },

  update: async (id, serviceData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SERVICES.UPDATE(id), serviceData);
      const { status, message, data } = response.data;
      
      if (!status) {
        throw new Error(message || 'Failed to update service');
      }
      
      return { success: true, message, data };
    } catch (error) {
      console.error('Update service error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.SERVICES.DELETE(id));
      const { status, message, data } = response.data;
      
      if (!status) {
        throw new Error(message || 'Failed to delete service');
      }
      
      return { success: true, message, data };
    } catch (error) {
      console.error('Delete service error:', error);
      throw error;
    }
  },
};

export default serviceService;
```

## Step 3: Export Service
**File:** `src/services/index.js`

```javascript
export { default as serviceService } from './service.service';
```

## Step 4: Create React Query Hooks
**File:** `src/hooks/useServices.js`

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '../services';

export const serviceKeys = {
  all: ['services'],
  lists: () => [...serviceKeys.all, 'list'],
  list: (params) => [...serviceKeys.lists(), { params }],
  details: () => [...serviceKeys.all, 'detail'],
  detail: (id) => [...serviceKeys.details(), id],
};

export const useServices = (params = {}) => {
  return useQuery({
    queryKey: serviceKeys.list(params),
    queryFn: () => serviceService.getAll(params),
    staleTime: 5 * 60 * 1000,
    enabled: true,
  });
};

export const useService = (id) => {
  return useQuery({
    queryKey: serviceKeys.detail(id),
    queryFn: () => serviceService.getById(id),
    enabled: !!id,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceData) => serviceService.create(serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => serviceService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => serviceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
};
```

## Step 5: Create/Update Page Component
**File:** `src/components/pages/ServiceManagement.js`

```javascript
import React, { useState } from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { useServices, useDeleteService } from '../../hooks/useServices';
import ApiDataTable from '../ui/ApiDataTable';

const ServiceManagement = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();
  const { showToast } = useToast();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useServices({
    page: currentPage,
    per_page: perPage,
    search: searchQuery,
  });

  const deleteMutation = useDeleteService();

  const handleAddService = () => {
    setModalType('service');
    setShowModal(true);
  };

  const handlePageChange = (page, newPerPage) => {
    if (newPerPage && newPerPage !== perPage) {
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

  const handleDelete = async (item) => {
    if (window.confirm(`${t('confirmDelete')} "${item.name}"?`)) {
      try {
        await deleteMutation.mutateAsync(item.id);
        showToast(t('deleteSuccess'), 'success');
      } catch (error) {
        showToast(error.message || t('deleteError'), 'error');
      }
    }
  };

  const columns = [
    t('name'),
    'Category',
    t('price'),
    t('status'),
    'Provider',
  ];

  const permissions = {
    view: 'service-view',
    create: 'service-create',
    edit: 'service-edit',
    delete: 'service-delete',
  };

  // Optional: Custom cell renderer for service-specific fields
  const renderCustomCell = (item, column, value, fieldKey) => {
    if (column === 'Category') {
      return <span>{item.category?.name || '-'}</span>;
    }
    if (column === 'Provider') {
      return <span>{item.provider?.name || '-'}</span>;
    }
    return undefined; // Use default rendering
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
      title={t('serviceManagement')}
      onAdd={handleAddService}
      onPageChange={handlePageChange}
      onSearch={handleSearch}
      onDelete={handleDelete}
      isLoading={isLoading}
      permissions={permissions}
      itemType="service"
      renderCustomCell={renderCustomCell}
    />
  );
};

export default ServiceManagement;
```

## Common Permission IDs

Based on your backend structure, use these permission ID patterns:

```javascript
// Categories
const categoryPermissions = {
  view: 'category-view',
  create: 'category-create',
  edit: 'category-edit',
  delete: 'category-delete',
};

// Users
const userPermissions = {
  view: 'user-view',
  create: 'user-create',
  edit: 'user-edit',
  delete: 'user-delete',
};

// Providers
const providerPermissions = {
  view: 'provider-view',
  create: 'provider-create',
  edit: 'provider-edit',
  delete: 'provider-delete',
};

// Services
const servicePermissions = {
  view: 'service-view',
  create: 'service-create',
  edit: 'service-edit',
  delete: 'service-delete',
};

// Bookings
const bookingPermissions = {
  view: 'booking-view',
  create: 'booking-create',
  edit: 'booking-edit',
  delete: 'booking-delete',
};

// Payments
const paymentPermissions = {
  view: 'payment-view',
  create: 'payment-create',
  edit: 'payment-edit',
  delete: 'payment-delete',
};
```

## Query Parameters Reference

Common query parameters for list endpoints:

```javascript
{
  page: 1,              // Current page number
  per_page: 10,         // Items per page (5, 10, 25, 50, 100)
  search: 'keyword',    // Search query
  status: 'active',     // Filter by status
  type: 'customer',     // Filter by type (for users)
  category_id: 5,       // Filter by category
  provider_id: 10,      // Filter by provider
  from_date: '2025-01-01',  // Filter by date range
  to_date: '2025-12-31',    // Filter by date range
}
```

## Checklist for New Entity

- [ ] Add endpoints to `api.config.js`
- [ ] Create service file in `src/services/`
- [ ] Export service from `src/services/index.js`
- [ ] Create React Query hooks in `src/hooks/`
- [ ] Create/update page component
- [ ] Define permission IDs
- [ ] Add custom cell renderer if needed
- [ ] Test list, create, edit, delete operations
- [ ] Test pagination and search
- [ ] Test permission-based action buttons
- [ ] Handle loading and error states

## Tips

1. **Consistent Naming:** Use plural for service files (e.g., `category.service.js`, `service.service.js`)
2. **Query Keys:** Always include parameters in query keys for proper cache invalidation
3. **Error Handling:** Always wrap API calls in try-catch blocks
4. **Loading States:** Use the `isLoading` prop from useQuery for loading indicators
5. **Optimistic Updates:** Consider using optimistic updates for better UX
6. **Cache Time:** Adjust `staleTime` based on data freshness requirements
7. **Permissions:** Always check backend for correct permission IDs
