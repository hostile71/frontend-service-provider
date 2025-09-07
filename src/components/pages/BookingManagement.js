import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { mockBookings } from '../../data/mockData';
import DataTable from '../ui/DataTable';

const BookingManagement = () => {
  const { t } = useLocalization();

  const bookingColumns = [
    t('customer'), 
    'Service', 
    t('provider'), 
    'Date', 
    'Time', 
    'Location', 
    t('status'), 
    'Amount'
  ];

  return (
    <DataTable
      data={mockBookings}
      columns={bookingColumns}
      title={t('bookingManagement')}
      searchFields={['customer', 'service', 'provider', 'location']}
      itemType="booking"
    />
  );
};

export default BookingManagement;
