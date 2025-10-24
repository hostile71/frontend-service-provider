import React, { useState, useCallback } from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { useUser } from '../../contexts/UserContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services';
import { useDeleteUser } from '../../hooks/useUsers';
import ApiDataTable from '../ui/ApiDataTable';
import UserDetailModal from '../ui/UserDetailModal';
import UserEditModal from '../ui/UserEditModal';
import { User } from 'lucide-react';

const ServiceProviders = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();
  const { assetUrl } = useUser(); // Get asset URL from user context
  const toast = useToast();
  const queryClient = useQueryClient();
  
  // State for pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Delete mutation
  const deleteUserMutation = useDeleteUser();

  // Fetch providers (type=provider)
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['users', 'provider', currentPage, perPage, searchQuery],
    queryFn: () => userService.getAll({
      type: 'provider',
      page: currentPage,
      per_page: perPage,
      search: searchQuery,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });

  const handleAddProvider = () => {
    setModalType('provider');
    setShowModal(true);
  };

  const handlePageChange = useCallback((page, newPerPage) => {
    if (newPerPage !== null && newPerPage !== undefined && newPerPage !== perPage) {
      setPerPage(newPerPage);
      setCurrentPage(1);
    } else if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [currentPage, perPage]);

  const handleSearch = useCallback((query) => {
    if (query !== searchQuery) {
      setSearchQuery(query);
      setCurrentPage(1);
    }
  }, [searchQuery]);

  // Action handlers
  const handleView = useCallback((provider) => {
    setSelectedProvider(provider);
    setShowDetailModal(true);
  }, []);

  const handleEdit = useCallback((provider) => {
    setSelectedProvider(provider);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((provider) => {
    if (window.confirm(`Are you sure you want to delete ${provider.first_name} ${provider.last_name}?`)) {
      deleteUserMutation.mutate(provider.id);
    }
  }, [deleteUserMutation]);

  const providerColumns = [
    t('name'), 
    t('email'), 
    t('phone'), 
    'Completed Services', 
    t('rating'), 
    t('status')
  ];

  // Permission IDs for provider CRUD operations (matching API response)
  const providerPermissions = {
    view: 'provider.view',
    create: 'provider.create',
    edit: 'provider.edit',
    delete: 'provider.delete',
  };

  // Custom cell renderer for provider-specific fields
  const renderCustomCell = (item, column, value, fieldKey) => {
    if (column === t('name')) {
      const profileImageUrl = item.profile_picture 
        ? `${assetUrl}/${item.profile_picture}` 
        : null;

      return (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-10 w-10">
            {profileImageUrl ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={profileImageUrl}
                alt={`${item.first_name} ${item.last_name}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
              style={{ display: profileImageUrl ? 'none' : 'flex' }}
            >
              <User className="h-5 w-5 text-gray-500" />
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {item.first_name} {item.last_name}
            </div>
            <div className="text-sm text-gray-500">
              {item.identification_number || '-'}
            </div>
          </div>
        </div>
      );
    }
    if (column === t('phone')) {
      return <span className="text-sm text-gray-900">{item.mobile_no || '-'}</span>;
    }
    if (column === 'Completed Services') {
      return <span className="text-sm text-gray-900">{item.completed_services || 0}</span>;
    }
    return undefined; // Use default rendering
  };

  return (
    <>
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
        columns={providerColumns}
        title={t('serviceProviderManagement')}
        onAdd={handleAddProvider}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading || isFetching}
        permissions={providerPermissions}
        itemType="provider"
        renderCustomCell={renderCustomCell}
      />

      {/* Provider Detail Modal */}
      <UserDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedProvider(null);
        }}
        userId={selectedProvider?.id}
        userType="provider"
      />

      {/* Provider Edit Modal */}
      <UserEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProvider(null);
        }}
        user={selectedProvider}
        userType="provider"
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['users', 'provider'] });
        }}
      />
    </>
  );
};

export default ServiceProviders;
