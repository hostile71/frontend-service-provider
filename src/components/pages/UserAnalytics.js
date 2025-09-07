import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import DataTable from '../ui/DataTable';

const UserAnalytics = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();

  // Mock user analytics data
  const mockUserAnalytics = [
    {
      id: 1,
      user: 'Ahmed Al-Rashid',
      userType: 'Customer',
      totalBookings: 12,
      totalSpent: 540,
      averageOrderValue: 45,
      lastActivity: '2024-08-18',
      registrationDate: '2024-01-15',
      engagement: 'High',
      favoriteCategory: 'Home Services',
      rating: 4.8
    },
    {
      id: 2,
      user: 'TechCare Services',
      userType: 'Provider',
      totalBookings: 89,
      totalEarnings: 4005,
      averageOrderValue: 45,
      lastActivity: '2024-08-17',
      registrationDate: '2024-02-20',
      engagement: 'High',
      favoriteCategory: 'HVAC Services',
      rating: 4.9
    },
    {
      id: 3,
      user: 'Sarah Mohammed',
      userType: 'Customer',
      totalBookings: 8,
      totalSpent: 240,
      averageOrderValue: 30,
      lastActivity: '2024-08-16',
      registrationDate: '2024-03-10',
      engagement: 'Medium',
      favoriteCategory: 'Cleaning',
      rating: 4.6
    },
    {
      id: 4,
      user: 'CleanPro',
      userType: 'Provider',
      totalBookings: 156,
      totalEarnings: 4680,
      averageOrderValue: 30,
      lastActivity: '2024-08-15',
      registrationDate: '2024-01-08',
      engagement: 'High',
      favoriteCategory: 'Cleaning Services',
      rating: 4.7
    }
  ];

  const handleExportAnalytics = () => {
    setModalType('export-analytics');
    setShowModal(true);
  };

  const analyticsColumns = [
    'User',
    'User Type',
    'Total Bookings',
    'Total Spent/Earnings',
    'Average Order Value',
    'Last Activity',
    'Registration Date',
    'Engagement',
    'Favorite Category',
    t('rating')
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('userAnalytics')}</h1>
        <p className="text-gray-600">
          Analyze user behavior, engagement patterns, and performance metrics.
        </p>
      </div>
      
      <DataTable
        data={mockUserAnalytics}
        columns={analyticsColumns}
        title={t('userAnalytics')}
        onAdd={handleExportAnalytics}
        searchFields={['user', 'userType', 'favoriteCategory', 'engagement']}
        itemType="analytics"
      />
    </div>
  );
};

export default UserAnalytics;
