import React, { useState } from 'react';
import { Download, TrendingUp, Users, Star, DollarSign } from 'lucide-react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useDashboardStats } from '../../hooks/useReports';
import reportService from '../../services/report.service';
import { useToast } from '../../contexts/ToastContext';

const Reports = () => {
  const { t } = useLocalization();
  const toast = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('last_7_days');
  const [exporting, setExporting] = useState({ excel: false, csv: false });

  // Fetch dashboard statistics
  const { data: statsData, isLoading } = useDashboardStats(selectedPeriod);
  const stats = statsData?.data || {
    total_revenue: 0,
    completed_bookings: 0,
    active_users: 0,
    average_rating: 0
  };

  const handleExportExcel = async () => {
    try {
      setExporting(prev => ({ ...prev, excel: true }));
      const response = await reportService.exportExcel('dashboard', selectedPeriod);

      if (response.status && response.data) {
        // Convert the sheet data to CSV format and download
        const sheets = response.data.sheets;
        let csvContent = '';

        sheets.forEach((sheet, index) => {
          if (index > 0) csvContent += '\n\n';
          csvContent += `${sheet.name}\n`;
          sheet.data.forEach(row => {
            csvContent += row.join(',') + '\n';
          });
        });

        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${response.data.filename}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success('Excel report downloaded successfully');
      }
    } catch (error) {
      console.error('Export Excel error:', error);
      toast.error('Failed to export Excel report');
    } finally {
      setExporting(prev => ({ ...prev, excel: false }));
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(prev => ({ ...prev, csv: true }));
      const blob = await reportService.exportCSV('dashboard', selectedPeriod);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard_report_${selectedPeriod}_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('CSV report downloaded successfully');
    } catch (error) {
      console.error('Export CSV error:', error);
      toast.error('Failed to export CSV report');
    } finally {
      setExporting(prev => ({ ...prev, csv: false }));
    }
  };

  const handleGenerateReport = async (reportType) => {
    try {
      toast.info(`Generating ${reportType} report...`);

      let reportData;
      switch (reportType) {
        case 'daily-booking':
          reportData = await reportService.getDailyBooking(selectedPeriod);
          break;
        case 'monthly-revenue':
          reportData = await reportService.getMonthlyRevenue(selectedPeriod);
          break;
        case 'top-services':
          reportData = await reportService.getTopServices(selectedPeriod, 10);
          break;
        case 'customer-engagement':
          reportData = await reportService.getCustomerEngagement(selectedPeriod);
          break;
        case 'provider-performance':
          reportData = await reportService.getProviderPerformance(selectedPeriod);
          break;
        default:
          toast.error('Unknown report type');
          return;
      }

      if (reportData.status && reportData.data) {
        // Convert report data to CSV and download
        const csvContent = convertReportToCSV(reportType, reportData.data);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportType}_report_${selectedPeriod}_${Date.now()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success(`${reportType} report downloaded successfully`);
      }
    } catch (error) {
      console.error('Generate report error:', error);
      toast.error(`Failed to generate ${reportType} report`);
    }
  };

  const convertReportToCSV = (reportType, data) => {
    let csv = '';

    switch (reportType) {
      case 'daily-booking':
        csv = 'Daily Booking Report\n\n';
        csv += 'Summary\n';
        csv += `Total Bookings,${data.summary?.total_bookings || 0}\n`;
        csv += `Completed,${data.summary?.completed || 0}\n`;
        csv += `Pending,${data.summary?.pending || 0}\n`;
        csv += `Cancelled,${data.summary?.cancelled || 0}\n`;
        csv += `Period,${data.summary?.period?.start || ''} to ${data.summary?.period?.end || ''}\n\n`;
        if (data.daily_data && data.daily_data.length > 0) {
          csv += 'Daily Data\n';
          csv += 'Date,Total Bookings,Completed,Pending,Cancelled\n';
          data.daily_data.forEach(day => {
            csv += `${day.date},${day.total_bookings},${day.completed},${day.pending},${day.cancelled}\n`;
          });
        }
        break;

      case 'monthly-revenue':
        csv = 'Monthly Revenue Report\n\n';
        // Check if data has summary at root level or nested
        const revenueData = data.data || data;

        if (revenueData.summary) {
          csv += 'Summary\n';
          csv += `Total Revenue,${revenueData.summary.total_revenue || 0}\n`;
          csv += `Total Bookings,${revenueData.summary.total_bookings || 0}\n`;
          csv += `Total Discount,${revenueData.summary.total_discount || 0}\n\n`;
        }

        if (revenueData.monthly_data && revenueData.monthly_data.length > 0) {
          csv += 'Monthly Data\n';
          csv += 'Month,Bookings,Revenue,Discount,Avg Order Value\n';
          revenueData.monthly_data.forEach(month => {
            csv += `${month.month || month.year_month || '-'},${month.bookings || month.total_bookings || 0},${month.revenue || month.total_revenue || 0},${month.discount || month.total_discount || 0},${month.avg_order_value || month.average_value || 0}\n`;
          });
          csv += '\n';
        }

        if (revenueData.top_services && revenueData.top_services.length > 0) {
          csv += 'Top Services\n';
          csv += 'Service,Bookings,Revenue\n';
          revenueData.top_services.forEach(service => {
            const serviceName = service.service_name || service.service?.title || service.service?.name || service.name || service.title || 'Unknown Service';
            csv += `"${serviceName}",${service.bookings || service.total_bookings || 0},${service.revenue || service.total_revenue || 0}\n`;
          });
        } else {
          csv += '\nNo monthly data available for the selected period.\n';
        }
        break;

      case 'top-services':
        csv = 'Top Services Report\n\n';
        const servicesData = data.data || data;

        if (servicesData.summary) {
          csv += 'Summary\n';
          csv += `Total Services,${servicesData.summary.total_services || 0}\n`;
          csv += `Total Bookings,${servicesData.summary.total_bookings || 0}\n`;
          csv += `Total Revenue,${servicesData.summary.total_revenue || 0}\n`;
          if (servicesData.summary.period) {
            csv += `Period,${servicesData.summary.period.start} to ${servicesData.summary.period.end}\n`;
          }
          csv += '\n';
        }

        // Check multiple possible data locations
        const servicesList = servicesData.services || servicesData.top_services || [];

        if (servicesList.length > 0) {
          csv += 'Service Details\n';
          // Check first item to determine available fields
          const firstItem = servicesList[0];

          if (firstItem.category !== undefined) {
            // Full details available
            csv += 'Rank,Service Name,Category,Total Bookings,Completed,Pending,Cancelled,Total Revenue,Avg Rating\n';
            servicesList.forEach((service, index) => {
              const serviceName = service.name || service.title || service.service_name || 'Unknown';
              csv += `${index + 1},"${serviceName}","${service.category || service.sub_category?.name || '-'}",${service.total_bookings || service.bookings || 0},${service.completed || 0},${service.pending || 0},${service.cancelled || 0},${service.total_revenue || service.revenue || 0},${Number(service.avg_rating || 0).toFixed(1)}\n`;
            });
          } else {
            // Simplified data
            csv += 'Rank,Service Name,Total Bookings,Total Revenue,Avg Rating\n';
            servicesList.forEach((service, index) => {
              const serviceName = service.service_name || service.service?.title || service.service?.name || service.name || service.title || 'Unknown';
              csv += `${index + 1},"${serviceName}",${service.bookings || service.total_bookings || 0},${service.revenue || service.total_revenue || 0},${Number(service.avg_rating || 0).toFixed(1)}\n`;
            });
          }
        } else {
          csv += 'No services data available for the selected period.\n';
        }
        break;

      case 'customer-engagement':
        csv = 'Customer Engagement Report\n\n';
        csv += 'Summary\n';
        csv += `Total Users,${data.summary?.total_users || 0}\n`;
        csv += `Active Users,${data.summary?.active_users || 0}\n`;
        csv += `New Users,${data.summary?.new_users || 0}\n`;
        csv += `Repeat Customers,${data.summary?.repeat_customers || 0}\n`;
        csv += `Retention Rate,${data.summary?.retention_rate || 0}%\n`;
        csv += `Period,${data.period?.start || ''} to ${data.period?.end || ''}\n\n`;
        if (data.top_customers && data.top_customers.length > 0) {
          csv += 'Top Customers\n';
          csv += 'Name,Email,Total Bookings,Total Spent\n';
          data.top_customers.forEach(customer => {
            csv += `"${customer.first_name} ${customer.last_name}",${customer.email},${customer.total_bookings || 0},${customer.total_spent || 0}\n`;
          });
        } else {
          csv += 'No top customers data available for the selected period.\n';
        }
        break;

      case 'provider-performance':
        csv = 'Provider Performance Report\n\n';
        csv += 'Summary\n';
        csv += `Total Providers,${data.summary?.total_providers || 0}\n`;
        csv += `Total Revenue,${data.summary?.total_revenue || 0}\n`;
        csv += `Average Rating,${Number(data.summary?.avg_rating || 0).toFixed(2)}\n`;
        csv += `Period,${data.summary?.period?.start || ''} to ${data.summary?.period?.end || ''}\n\n`;
        if (data.providers && data.providers.length > 0) {
          csv += 'Provider Details\n';
          csv += 'Name,Email,Total Bookings,Completed,Revenue,Avg Rating,Ratings Count,Completion Rate\n';
          data.providers.forEach(provider => {
            csv += `"${provider.first_name} ${provider.last_name}",${provider.email},${provider.total_bookings || 0},${provider.completed_bookings || 0},${provider.total_revenue || 0},${Number(provider.avg_rating || 0).toFixed(1)},${provider.ratings_count || 0},${provider.completion_rate || 0}%\n`;
          });
        } else {
          csv += 'No provider data available.\n';
        }
        break;

      default:
        csv = 'Report Data\n\n';
        csv += JSON.stringify(data, null, 2);
    }

    return csv;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <h2 className="text-xl font-semibold">{t('reportsAnalytics')}</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last_7_days">{t('last7Days')}</option>
              <option value="last_30_days">{t('last30Days')}</option>
              <option value="last_90_days">{t('last3Months')}</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="last_12_months">Last 12 Months</option>
              <option value="this_year">This Year</option>
            </select>
            <button
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleExportExcel}
              disabled={exporting.excel || isLoading}
            >
              <Download className="w-4 h-4 mr-2" />
              {exporting.excel ? 'Exporting...' : t('exportExcel')}
            </button>
            <button
              className="flex items-center justify-center px-4 py-2 btn-theme-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleExportCSV}
              disabled={exporting.csv || isLoading}
            >
              <Download className="w-4 h-4 mr-2" />
              {exporting.csv ? 'Exporting...' : t('exportCSV')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="text-center p-4 md:p-6 border rounded-lg bg-blue-50">
            <div className="flex justify-center mb-2">
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
            {isLoading ? (
              <div className="text-2xl md:text-3xl font-bold text-blue-600">...</div>
            ) : (
              <div className="text-2xl md:text-3xl font-bold text-blue-600">{stats.total_revenue}</div>
            )}
            <div className="text-sm text-gray-600 mt-1">{t('totalRevenue')} (OMR)</div>
          </div>
          <div className="text-center p-4 md:p-6 border rounded-lg bg-green-50">
            <div className="flex justify-center mb-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            {isLoading ? (
              <div className="text-2xl md:text-3xl font-bold text-green-600">...</div>
            ) : (
              <div className="text-2xl md:text-3xl font-bold text-green-600">{stats.completed_bookings}</div>
            )}
            <div className="text-sm text-gray-600 mt-1">{t('completedBookings')}</div>
          </div>
          <div className="text-center p-4 md:p-6 border rounded-lg bg-purple-50">
            <div className="flex justify-center mb-2">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            {isLoading ? (
              <div className="text-2xl md:text-3xl font-bold text-purple-600">...</div>
            ) : (
              <div className="text-2xl md:text-3xl font-bold text-purple-600">{stats.active_users}</div>
            )}
            <div className="text-sm text-gray-600 mt-1">{t('activeUsers')}</div>
          </div>
          <div className="text-center p-4 md:p-6 border rounded-lg bg-yellow-50">
            <div className="flex justify-center mb-2">
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
            {isLoading ? (
              <div className="text-2xl md:text-3xl font-bold text-yellow-600">...</div>
            ) : (
              <div className="text-2xl md:text-3xl font-bold text-yellow-600">
                {Number(stats.average_rating || 0).toFixed(1)}
              </div>
            )}
            <div className="text-sm text-gray-600 mt-1">{t('averageRating')}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
            <h3 className="font-semibold mb-2">{t('dailyBookingReport')}</h3>
            <p className="text-sm text-gray-600 mb-3">Track daily booking trends and patterns</p>
            <button
              className="text-blue-600 text-sm hover:underline"
              onClick={() => handleGenerateReport('daily-booking')}
            >
              {t('generateReport')}
            </button>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
            <h3 className="font-semibold mb-2">{t('monthlyRevenueReport')}</h3>
            <p className="text-sm text-gray-600 mb-3">Monthly revenue breakdown by services</p>
            <button
              className="text-blue-600 text-sm hover:underline"
              onClick={() => handleGenerateReport('monthly-revenue')}
            >
              {t('generateReport')}
            </button>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
            <h3 className="font-semibold mb-2">{t('topServicesReport')}</h3>
            <p className="text-sm text-gray-600 mb-3">Most popular services and providers</p>
            <button
              className="text-blue-600 text-sm hover:underline"
              onClick={() => handleGenerateReport('top-services')}
            >
              {t('generateReport')}
            </button>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
            <h3 className="font-semibold mb-2">{t('customerEngagement')}</h3>
            <p className="text-sm text-gray-600 mb-3">User activity and engagement metrics</p>
            <button
              className="text-blue-600 text-sm hover:underline"
              onClick={() => handleGenerateReport('customer-engagement')}
            >
              {t('generateReport')}
            </button>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
            <h3 className="font-semibold mb-2">{t('providerPerformance')}</h3>
            <p className="text-sm text-gray-600 mb-3">Service provider ratings and statistics</p>
            <button
              className="text-blue-600 text-sm hover:underline"
              onClick={() => handleGenerateReport('provider-performance')}
            >
              {t('generateReport')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
