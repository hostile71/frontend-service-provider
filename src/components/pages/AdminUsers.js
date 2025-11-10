import React, { useState, useCallback } from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { useUser } from '../../contexts/UserContext';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { userService } from '../../services';
import { useDeleteUser } from '../../hooks/useUsers';
import ApiDataTable from '../ui/ApiDataTable';
import UserDetailModal from '../ui/UserDetailModal';
import UserEditModal from '../ui/UserEditModal';
import UserAddModal from '../ui/UserAddModal';
import { User } from 'lucide-react';

const AdminUsers = () => {
  const { t } = useLocalization();
  const { assetUrl } = useUser();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const deleteUserMutation = useDeleteUser();

  // Fetch admin users (type=admin)
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['users', 'admin', currentPage, perPage, searchQuery],
    queryFn: () => userService.getAll({ type: 'admin', page: currentPage, per_page: perPage, search: searchQuery }),
    staleTime: 5 * 60 * 1000,
  });

  const handlePageChange = useCallback((page) => setCurrentPage(page), []);

  const handleSearch = useCallback((query) => {
    if (query !== searchQuery) {
      setSearchQuery(query);
      setCurrentPage(1);
    }
  }, [searchQuery]);

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

  const handleAddUser = useCallback(() => setShowAddModal(true), []);

  const adminColumns = [t('name'), t('email'), t('role'), t('status'), 'Join Date'];

  const renderCustomCell = (item, column) => {
    if (column === t('name')) {
      const profileImageUrl = item.profile_picture ? `${assetUrl}/${item.profile_picture}` : null;
      return (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-10 w-10">
            {profileImageUrl ? (
              <img className="h-10 w-10 rounded-full object-cover" src={profileImageUrl} alt={`${item.first_name} ${item.last_name}`} />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-500" />
              </div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{item.first_name} {item.last_name}</div>
            <div className="text-sm text-gray-500">{item.identification_number || '-'}</div>
          </div>
        </div>
      );
    }
    if (column === 'Join Date') {
      return <span className="text-sm text-gray-900">{new Date(item.created_at).toLocaleDateString()}</span>;
    }
    if (column === t('role')) {
      return <span className="text-sm text-gray-900 capitalize">{item.role?.role_name || item.type || '-'}</span>;
    }
    return undefined;
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
        columns={adminColumns}
        title={t('adminUsers')}
        onAdd={handleAddUser}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading || isFetching}
        permissions={{ view: 'user.view', create: 'user.create', edit: 'user.edit', delete: 'user.delete' }}
        itemType="admin"
        renderCustomCell={renderCustomCell}
      />

      <UserDetailModal
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setSelectedUser(null); }}
        userId={selectedUser?.id}
        userType="admin"
      />

      <UserEditModal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setSelectedUser(null); }}
        user={selectedUser}
        userType="admin"
        disableType={true}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['users', 'admin'] })}
      />

      <UserAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => { queryClient.invalidateQueries({ queryKey: ['users', 'admin'] }); setShowAddModal(false); }}
        defaultType="admin"
        titleLabel="Add New Admin User"
        submitLabel="Create Admin User"
      />
    </>
  );
};

export default AdminUsers;
