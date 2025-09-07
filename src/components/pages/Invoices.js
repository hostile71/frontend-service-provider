import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import DataTable from '../ui/DataTable';

const Invoices = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();

  // Mock invoice data
  const mockInvoices = [
    {
      id: 1,
      invoiceNumber: 'INV-2024-001',
      customer: 'Ahmed Al-Rashid',
      service: 'AC Repair',
      provider: 'TechCare Services',
      amount: 45,
      issueDate: '2024-08-18',
      dueDate: '2024-08-25',
      status: 'paid',
      taxAmount: 2.25,
      totalAmount: 47.25
    },
    {
      id: 2,
      invoiceNumber: 'INV-2024-002',
      customer: 'Sarah Mohammed',
      service: 'House Cleaning',
      provider: 'CleanPro',
      amount: 30,
      issueDate: '2024-08-17',
      dueDate: '2024-08-24',
      status: 'pending',
      taxAmount: 1.5,
      totalAmount: 31.5
    },
    {
      id: 3,
      invoiceNumber: 'INV-2024-003',
      customer: 'Omar Hassan',
      service: 'Plumbing',
      provider: 'Fix-It-Fast',
      amount: 60,
      issueDate: '2024-08-16',
      dueDate: '2024-08-23',
      status: 'overdue',
      taxAmount: 3.0,
      totalAmount: 63.0
    },
    {
      id: 4,
      invoiceNumber: 'INV-2024-004',
      customer: 'Fatima Al-Balushi',
      service: 'Electrical Work',
      provider: 'PowerTech',
      amount: 25,
      issueDate: '2024-08-15',
      dueDate: '2024-08-22',
      status: 'draft',
      taxAmount: 1.25,
      totalAmount: 26.25
    }
  ];

  const handleAddInvoice = () => {
    setModalType('invoice');
    setShowModal(true);
  };

  const invoiceColumns = [
    'Invoice Number',
    t('customer'),
    'Service',
    t('provider'),
    'Amount',
    'Tax Amount',
    'Total Amount',
    'Issue Date',
    'Due Date',
    t('status')
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('invoices')}</h1>
        <p className="text-gray-600">
          Manage customer invoices, track payments, and handle billing operations.
        </p>
      </div>
      
      <DataTable
        data={mockInvoices}
        columns={invoiceColumns}
        title={t('invoices')}
        onAdd={handleAddInvoice}
        searchFields={['invoiceNumber', 'customer', 'service', 'provider']}
        itemType="invoice"
      />
    </div>
  );
};

export default Invoices;
