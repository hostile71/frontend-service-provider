import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import { mockBookings } from '../../data/mockData';
import { STATUS_TYPES } from '../../constants';
import DataTable from '../ui/DataTable';

const CompletedBookings = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();

  // Filter only completed bookings
  const completedBookings = mockBookings.filter(booking => 
    booking.status === STATUS_TYPES.COMPLETED || booking.status === 'completed'
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
    'Completion Date',
    t('rating')
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('completedBookings')}</h1>
        <p className="text-gray-600">
          View and analyze all successfully completed service bookings and customer feedback.
        </p>
      </div>
      
      <DataTable
        data={completedBookings}
        columns={bookingColumns}
        title={`${t('completedBookings')} (${completedBookings.length})`}
        onAdd={handleAddBooking}
        searchFields={['customer', 'service', 'provider', 'location']}
        itemType="booking"
      />
    </div>
  );
};

export default CompletedBookings;
