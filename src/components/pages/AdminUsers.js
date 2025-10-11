import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import DataTable from '../ui/DataTable';

const AdminUsers = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();

  // Mock admin users data
  const mockAdminUsers = [
    {
      id: 1,
      name: 'Rabius Sani',
      email: 'rabius@admin.com',
      role: 'Super Admin',
      lastLogin: '2024-08-18 10:30',
      status: 'active',
      permissions: 'All',
      createdDate: '2024-01-01'
    },
    {
      id: 2,
      name: 'Admin User 2',
      email: 'admin2@admin.com',
      role: 'Admin',
      lastLogin: '2024-08-17 14:20',
      status: 'active',
      permissions: 'Limited',
      createdDate: '2024-02-15'
    },
    {
      id: 3,
      name: 'Manager User',
      email: 'manager@admin.com',
      role: 'Manager',
      lastLogin: '2024-08-16 09:15',
      status: 'inactive',
      permissions: 'Read Only',
      createdDate: '2024-03-10'
    }
  ];

  const columns = [
    { key: 'name', label: t('name') },
    { key: 'email', label: t('email') },
    { key: 'role', label: t('role') },
    { key: 'lastLogin', label: 'Last Login' },
    { key: 'status', label: t('status') },
    { key: 'permissions', label: 'Permissions' },
    { key: 'createdDate', label: 'Created Date' }
  ];

  const handleAddAdminUser = () => {
    setModalType('admin-user');
    setShowModal(true);
  };

  return (
    <DataTable
      data={mockAdminUsers}
      columns={columns}
      title={t('adminUsers')}
      onAdd={handleAddAdminUser}
      searchFields={['name', 'email', 'role']}
    />
  );
};

export default AdminUsers;