import React from 'react';
import { Download } from 'lucide-react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useStats } from '../../hooks/useStats';

const Reports = () => {
  const { t } = useLocalization();
  const stats = useStats();

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <h2 className="text-xl font-semibold">{t('reportsAnalytics')}</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>{t('last7Days')}</option>
              <option>{t('last30Days')}</option>
              <option>{t('last3Months')}</option>
              <option>{t('customRange')}</option>
            </select>
            <button className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              {t('exportExcel')}
            </button>
            <button className="flex items-center justify-center px-4 py-2 btn-theme-primary rounded-lg">
              <Download className="w-4 h-4 mr-2" />
              {t('exportCSV')}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="text-center p-4 md:p-6 border rounded-lg bg-blue-50">
            <div className="text-2xl md:text-3xl font-bold text-blue-600">{stats.totalRevenue}</div>
            <div className="text-sm text-gray-600 mt-1">{t('totalRevenue')} (OMR)</div>
          </div>
          <div className="text-center p-4 md:p-6 border rounded-lg bg-green-50">
            <div className="text-2xl md:text-3xl font-bold text-green-600">{stats.completedBookings}</div>
            <div className="text-sm text-gray-600 mt-1">{t('completedBookings')}</div>
          </div>
          <div className="text-center p-4 md:p-6 border rounded-lg bg-purple-50">
            <div className="text-2xl md:text-3xl font-bold text-purple-600">{stats.totalCustomers}</div>
            <div className="text-sm text-gray-600 mt-1">{t('activeUsers')}</div>
          </div>
          <div className="text-center p-4 md:p-6 border rounded-lg bg-yellow-50">
            <div className="text-2xl md:text-3xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600 mt-1">{t('averageRating')}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <h3 className="font-semibold mb-2">{t('dailyBookingReport')}</h3>
            <p className="text-sm text-gray-600 mb-3">Track daily booking trends and patterns</p>
            <button className="text-blue-600 text-sm hover:underline">{t('generateReport')}</button>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <h3 className="font-semibold mb-2">{t('monthlyRevenueReport')}</h3>
            <p className="text-sm text-gray-600 mb-3">Monthly revenue breakdown by services</p>
            <button className="text-blue-600 text-sm hover:underline">{t('generateReport')}</button>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <h3 className="font-semibold mb-2">{t('topServicesReport')}</h3>
            <p className="text-sm text-gray-600 mb-3">Most popular services and providers</p>
            <button className="text-blue-600 text-sm hover:underline">{t('generateReport')}</button>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <h3 className="font-semibold mb-2">{t('customerEngagement')}</h3>
            <p className="text-sm text-gray-600 mb-3">User activity and engagement metrics</p>
            <button className="text-blue-600 text-sm hover:underline">{t('generateReport')}</button>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <h3 className="font-semibold mb-2">{t('providerPerformance')}</h3>
            <p className="text-sm text-gray-600 mb-3">Service provider ratings and statistics</p>
            <button className="text-blue-600 text-sm hover:underline">{t('generateReport')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
