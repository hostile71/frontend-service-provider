import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import DataTable from '../ui/DataTable';

const ServiceAnalytics = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();

  // Mock service analytics data
  const mockServiceAnalytics = [
    {
      id: 1,
      service: 'AC Repair',
      category: 'HVAC Services',
      totalBookings: 89,
      revenue: 4005,
      averageRating: 4.9,
      averagePrice: 45,
      topProvider: 'TechCare Services',
      completionRate: 98.9,
      customerSatisfaction: 4.8,
      repeatCustomers: 67
    },
    {
      id: 2,
      service: 'House Cleaning',
      category: 'Cleaning',
      totalBookings: 156,
      revenue: 4680,
      averageRating: 4.7,
      averagePrice: 30,
      topProvider: 'CleanPro',
      completionRate: 99.4,
      customerSatisfaction: 4.6,
      repeatCustomers: 89
    },
    {
      id: 3,
      service: 'Plumbing Repair',
      category: 'Plumbing',
      totalBookings: 78,
      revenue: 4680,
      averageRating: 4.6,
      averagePrice: 60,
      topProvider: 'Fix-It-Fast',
      completionRate: 96.2,
      customerSatisfaction: 4.5,
      repeatCustomers: 45
    },
    {
      id: 4,
      service: 'Electrical Work',
      category: 'Electrical',
      totalBookings: 45,
      revenue: 1125,
      averageRating: 4.4,
      averagePrice: 25,
      topProvider: 'PowerTech',
      completionRate: 93.3,
      customerSatisfaction: 4.3,
      repeatCustomers: 23
    }
  ];

  const handleAnalyzeService = () => {
    setModalType('service-analysis');
    setShowModal(true);
  };

  const serviceColumns = [
    'Service',
    t('category'),
    'Total Bookings',
    'Revenue',
    'Avg Rating',
    'Avg Price',
    'Top Provider',
    'Completion Rate (%)',
    'Customer Satisfaction',
    'Repeat Customers'
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('serviceAnalytics')}</h1>
        <p className="text-gray-600">
          Analyze service performance, customer satisfaction, and booking trends.
        </p>
      </div>
      
      <DataTable
        data={mockServiceAnalytics}
        columns={serviceColumns}
        title={t('serviceAnalytics')}
        onAdd={handleAnalyzeService}
        searchFields={['service', 'category', 'topProvider']}
        itemType="analytics"
      />
    </div>
  );
};

export default ServiceAnalytics;
