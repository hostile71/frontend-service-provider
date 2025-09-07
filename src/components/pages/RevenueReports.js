import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import DataTable from '../ui/DataTable';

const RevenueReports = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();

  // Mock revenue report data
  const mockRevenueReports = [
    {
      id: 1,
      period: 'August 2024',
      totalRevenue: 12450,
      commissions: 1245,
      providerPayouts: 11205,
      transactions: 278,
      averageOrderValue: 44.78,
      growthRate: 15.3,
      topCategory: 'Home Services',
      topProvider: 'TechCare Services'
    },
    {
      id: 2,
      period: 'July 2024',
      totalRevenue: 10800,
      commissions: 1080,
      providerPayouts: 9720,
      transactions: 240,
      averageOrderValue: 45.0,
      growthRate: 8.2,
      topCategory: 'Cleaning',
      topProvider: 'CleanPro'
    },
    {
      id: 3,
      period: 'June 2024',
      totalRevenue: 9980,
      commissions: 998,
      providerPayouts: 8982,
      transactions: 222,
      averageOrderValue: 44.95,
      growthRate: 12.7,
      topCategory: 'Plumbing',
      topProvider: 'Fix-It-Fast'
    },
    {
      id: 4,
      period: 'May 2024',
      totalRevenue: 8850,
      commissions: 885,
      providerPayouts: 7965,
      transactions: 197,
      averageOrderValue: 44.92,
      growthRate: 6.8,
      topCategory: 'Electrical',
      topProvider: 'PowerTech'
    }
  ];

  const handleGenerateReport = () => {
    setModalType('revenue-report');
    setShowModal(true);
  };

  const revenueColumns = [
    'Period',
    'Total Revenue',
    'Commissions',
    'Provider Payouts',
    'Transactions',
    'Avg Order Value',
    'Growth Rate (%)',
    'Top Category',
    'Top Provider'
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('revenueReports')}</h1>
        <p className="text-gray-600">
          Track revenue trends, commission earnings, and financial performance metrics.
        </p>
      </div>
      
      <DataTable
        data={mockRevenueReports}
        columns={revenueColumns}
        title={t('revenueReports')}
        onAdd={handleGenerateReport}
        searchFields={['period', 'topCategory', 'topProvider']}
        itemType="report"
      />
    </div>
  );
};

export default RevenueReports;
