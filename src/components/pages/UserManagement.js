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

const UserManagement = () => {
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
  const [selectedUser, setSelectedUser] = useState(null);

  // Delete mutation
  const deleteUserMutation = useDeleteUser();

  // Fetch customers (type=customer)
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['users', 'customer', currentPage, perPage, searchQuery],
    queryFn: () => {
      console.log('🌐 Fetching users with params:', { currentPage, perPage, searchQuery });
      return userService.getAll({
        type: 'customer',
        page: currentPage,
        per_page: perPage,
        search: searchQuery,
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handler functions with useCallback to prevent re-renders
  const handlePageChange = useCallback((page) => {
    console.log('📄 Page change requested:', page);
    setCurrentPage(page);
  }, []);

  const handleSearch = useCallback((query) => {
    console.log('🔍 Search requested:', query);
    if (query !== searchQuery) {
      setSearchQuery(query);
      setCurrentPage(1); // Reset to first page on new search
    }
  }, [searchQuery]);

  // Action handlers
  const handleView = useCallback((user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  }, []);

  const handleEdit = useCallback((user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((user) => {
    if (window.confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)) {
      deleteUserMutation.mutate(user.id);
    }
  }, [deleteUserMutation]);

  const handleAddUser = () => {
    setModalType('user');
    setShowModal(true);
  };

  // Log when query key changes
  console.log('📊 Current query params:', { currentPage, perPage, searchQuery });

  const customerColumns = [
    t('name'), 
    t('email'), 
    t('phone'), 
    'Role',
    t('status'), 
    'Join Date'
  ];

  // Permission IDs for user CRUD operations (matching API response)
  const userPermissions = {
    view: 'user.view',
    create: 'user.create',
    edit: 'user.edit',
    delete: 'user.delete',
  };

  // Custom cell renderer for user-specific fields
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
    if (column === 'Role') {
      return <span className="text-sm text-gray-900 capitalize">{item.role?.role_name || item.type || '-'}</span>;
    }
    if (column === 'Join Date') {
      return <span className="text-sm text-gray-900">{new Date(item.created_at).toLocaleDateString()}</span>;
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
        columns={customerColumns}
        title={t('customerManagement')}
        onAdd={handleAddUser}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading || isFetching}
        permissions={userPermissions}
        itemType="customer"
        renderCustomCell={renderCustomCell}
      />

      {/* User Detail Modal */}
      <UserDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedUser(null);
        }}
        userId={selectedUser?.id}
        userType="customer"
      />

      {/* User Edit Modal */}
      <UserEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        userType="customer"
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['users', 'customer'] });
        }}
      />
    </>
  );
};

export default UserManagement;
