import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import DataTable from '../ui/DataTable';

const Commissions = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();

  // Mock commission data
  const mockCommissions = [
    {
      id: 1,
      provider: 'TechCare Services',
      service: 'AC Repair',
      customer: 'Ahmed Al-Rashid',
      orderAmount: 45,
      commissionRate: 10,
      commissionAmount: 4.5,
      providerPayout: 40.5,
      payoutDate: '2024-08-18',
      status: 'paid',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 2,
      provider: 'CleanPro',
      service: 'House Cleaning',
      customer: 'Sarah Mohammed',
      orderAmount: 30,
      commissionRate: 10,
      commissionAmount: 3.0,
      providerPayout: 27.0,
      payoutDate: '2024-08-17',
      status: 'pending',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 3,
      provider: 'Fix-It-Fast',
      service: 'Plumbing',
      customer: 'Omar Hassan',
      orderAmount: 60,
      commissionRate: 10,
      commissionAmount: 6.0,
      providerPayout: 54.0,
      payoutDate: '2024-08-16',
      status: 'paid',
      paymentMethod: 'Digital Wallet'
    },
    {
      id: 4,
      provider: 'PowerTech',
      service: 'Electrical Work',
      customer: 'Fatima Al-Balushi',
      orderAmount: 25,
      commissionRate: 10,
      commissionAmount: 2.5,
      providerPayout: 22.5,
      payoutDate: '2024-08-15',
      status: 'processing',
      paymentMethod: 'Bank Transfer'
    }
  ];

  const handleAddCommission = () => {
    setModalType('commission');
    setShowModal(true);
  };

  const commissionColumns = [
    t('provider'),
    'Service',
    t('customer'),
    'Order Amount',
    'Commission Rate (%)',
    'Commission Amount',
    'Provider Payout',
    'Payout Date',
    t('status'),
    'Payment Method'
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('commissions')}</h1>
        <p className="text-gray-600">
          Manage commission rates, track earnings, and handle provider payouts.
        </p>
      </div>
      
      <DataTable
        data={mockCommissions}
        columns={commissionColumns}
        title={t('commissions')}
        onAdd={handleAddCommission}
        searchFields={['provider', 'service', 'customer', 'paymentMethod']}
        itemType="commission"
      />
    </div>
  );
};

export default Commissions;
