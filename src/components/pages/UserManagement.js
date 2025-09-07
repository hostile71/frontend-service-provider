import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import { mockUsers } from '../../data/mockData';
import { USER_ROLES } from '../../constants';
import DataTable from '../ui/DataTable';

const UserManagement = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();

  const handleAddUser = () => {
    setModalType('user');
    setShowModal(true);
  };

  const customerColumns = [
    t('name'), 
    t('email'), 
    t('phone'), 
    t('totalBookings'), 
    t('totalSpent'), 
    t('status'), 
    t('joinDate')
  ];

  const customers = mockUsers.filter(u => u.role === USER_ROLES.CUSTOMER);

  return (
    <DataTable
      data={customers}
      columns={customerColumns}
      title={t('customerManagement')}
      onAdd={handleAddUser}
      searchFields={['name', 'email', 'phone']}
      itemType="customer"
    />
  );
};

export default UserManagement;
