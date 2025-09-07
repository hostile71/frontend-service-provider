import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import DataTable from '../ui/DataTable';

const Payments = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();

  // Mock payment data
  const mockPayments = [
    {
      id: 1,
      customer: 'Ahmed Al-Rashid',
      service: 'AC Repair',
      provider: 'TechCare Services',
      amount: 45,
      paymentMethod: 'Credit Card',
      transactionId: 'TXN001234567',
      paymentDate: '2024-08-18',
      status: 'completed',
      commission: 4.5,
      providerPayout: 40.5
    },
    {
      id: 2,
      customer: 'Sarah Mohammed',
      service: 'House Cleaning',
      provider: 'CleanPro',
      amount: 30,
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN001234568',
      paymentDate: '2024-08-17',
      status: 'pending',
      commission: 3.0,
      providerPayout: 27.0
    },
    {
      id: 3,
      customer: 'Omar Hassan',
      service: 'Plumbing',
      provider: 'Fix-It-Fast',
      amount: 60,
      paymentMethod: 'Digital Wallet',
      transactionId: 'TXN001234569',
      paymentDate: '2024-08-16',
      status: 'completed',
      commission: 6.0,
      providerPayout: 54.0
    },
    {
      id: 4,
      customer: 'Fatima Al-Balushi',
      service: 'Electrical Work',
      provider: 'PowerTech',
      amount: 25,
      paymentMethod: 'Cash',
      transactionId: 'TXN001234570',
      paymentDate: '2024-08-15',
      status: 'failed',
      commission: 0,
      providerPayout: 0
    }
  ];

  const handleAddPayment = () => {
    setModalType('payment');
    setShowModal(true);
  };

  const paymentColumns = [
    t('customer'),
    'Service',
    t('provider'),
    'Amount',
    'Payment Method',
    'Transaction ID',
    'Payment Date',
    t('status'),
    'Commission',
    'Provider Payout'
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('payments')}</h1>
        <p className="text-gray-600">
          Track and manage all payment transactions, commissions, and provider payouts.
        </p>
      </div>
      
      <DataTable
        data={mockPayments}
        columns={paymentColumns}
        title={t('payments')}
        onAdd={handleAddPayment}
        searchFields={['customer', 'service', 'provider', 'transactionId', 'paymentMethod']}
        itemType="payment"
      />
    </div>
  );
};

export default Payments;
