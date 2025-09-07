import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import { mockBookings } from '../../data/mockData';
import { STATUS_TYPES } from '../../constants';
import DataTable from '../ui/DataTable';

const PendingBookings = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();

  // Filter only pending bookings
  const pendingBookings = mockBookings.filter(booking => 
    booking.status === STATUS_TYPES.PENDING || booking.status === 'pending'
  );

  const handleAddBooking = () => {
    setModalType('booking');
    setShowModal(true);
  };

  const bookingColumns = [
    t('customer'), 
    'Service', 
    t('provider'), 
    'Date', 
    'Time', 
    'Location', 
    t('status'), 
    'Amount',
    'Priority'
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('pendingBookings')}</h1>
        <p className="text-gray-600">
          Manage and track all pending service bookings that require attention.
        </p>
      </div>
      
      <DataTable
        data={pendingBookings}
        columns={bookingColumns}
        title={`${t('pendingBookings')} (${pendingBookings.length})`}
        onAdd={handleAddBooking}
        searchFields={['customer', 'service', 'provider', 'location']}
        itemType="booking"
      />
    </div>
  );
};

export default PendingBookings;
