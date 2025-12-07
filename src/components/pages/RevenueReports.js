import React, { useState } from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useRevenueReport } from '../../hooks/useReports';
import { useServices } from '../../hooks/useServices';
import { useUsers } from '../../hooks/useUsers';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const RevenueReports = () => {
  const { t } = useLocalization();
  const [filters, setFilters] = useState({
    group_by: 'month',
    provider_id: '',
    service_id: '',
    sub_category_id: '',
    customer_id: '',
    start_date: '',
    end_date: ''
  });

  // Fetch revenue data with filters
  const { data: revenueData, isLoading } = useRevenueReport(filters);

  // Fetch dropdowns data
  const { data: servicesData, isLoading: loadingServices } = useServices({ per_page: 100 });
  const { data: providersData, isLoading: loadingProviders } = useUsers({ type: 'provider', per_page: 100 });
  const { data: customersData, isLoading: loadingCustomers } = useUsers({ type: 'customer', per_page: 100 });

  const services = servicesData?.data?.data || [];
  const providers = providersData?.data || [];
  const customers = customersData?.data || [];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = (format) => {
    if (!revenueData) return;

    const data = revenueData.data || revenueData;
    const revenue = data.revenue_trend || [];

    if (format === 'csv' || format === 'excel') {
      const headers = [
        'Period',
        'Gross Revenue',
        'Discount',
        'Net Revenue',
        'Bookings'
      ];

      const rows = revenue.map(item => [
        item.period || 'N/A',
        item.gross_revenue || 0,
        item.discount || 0,
        item.net_revenue || 0,
        item.bookings || 0
      ]);

      // Add summary if available
      if (data.summary) {
        rows.push([]);
        rows.push(['Summary']);
        rows.push(['Total Bookings', data.summary.total_bookings || 0]);
        rows.push(['Gross Revenue', data.summary.gross_revenue || 0]);
        rows.push(['Total Discount', data.summary.total_discount || 0]);
        rows.push(['Net Revenue', data.summary.net_revenue || 0]);
        rows.push(['Avg Booking Value', data.summary.avg_booking_value || 0]);
      }

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `revenue-report-${filters.group_by}-${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text('Revenue Report', 14, 22);

      // Add filters info
      doc.setFontSize(10);
      doc.text(`Group By: ${filters.group_by}`, 14, 32);
      if (filters.provider_id) doc.text(`Provider ID: ${filters.provider_id}`, 14, 38);
      if (filters.service_id) doc.text(`Service ID: ${filters.service_id}`, 14, 44);
      if (filters.customer_id) doc.text(`Customer ID: ${filters.customer_id}`, 14, 50);

      // Add summary table
      if (data.summary) {
        doc.setFontSize(14);
        doc.text('Summary', 14, 60);
        autoTable(doc, {
          startY: 65,
          head: [['Metric', 'Value']],
          body: [
            ['Total Bookings', data.summary.total_bookings || 0],
            ['Gross Revenue', `$${data.summary.gross_revenue || 0}`],
            ['Total Discount', `$${data.summary.total_discount || 0}`],
            ['Net Revenue', `$${data.summary.net_revenue || 0}`],
            ['Avg Booking Value', `$${data.summary.avg_booking_value || 0}`]
          ]
        });
      }

      // Add revenue trend if available
      if (revenue.length > 0) {
        doc.setFontSize(14);
        const startY = data.summary ? doc.lastAutoTable.finalY + 10 : 60;
        doc.text('Revenue Trend', 14, startY);
        autoTable(doc, {
          startY: startY + 5,
          head: [['Period', 'Bookings', 'Gross Revenue', 'Discount', 'Net Revenue']],
          body: revenue.map(item => [
            item.period || 'N/A',
            item.bookings || 0,
            `$${item.gross_revenue || 0}`,
            `$${item.discount || 0}`,
            `$${item.net_revenue || 0}`
          ])
        });
      }

      doc.save(`revenue-report-${filters.group_by}-${Date.now()}.pdf`);
    }
  };

  const revenue = revenueData?.data?.revenue_trend || [];
  const summary = revenueData?.data?.summary || null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('revenueReports')}</h1>
          <p className="text-gray-600">
            Track revenue trends, commission earnings, and financial performance metrics.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Export CSV
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Export Excel
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group By
            </label>
            <select
              value={filters.group_by}
              onChange={(e) => handleFilterChange('group_by', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provider (Optional) {providers.length > 0 && `(${providers.length} available)`}
            </label>
            <select
              value={filters.provider_id}
              onChange={(e) => handleFilterChange('provider_id', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loadingProviders}
            >
              <option value="">-- All Providers --</option>
              {providers.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.first_name} {provider.last_name} -- {provider.company_name || 'N/A'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service (Optional) {services.length > 0 && `(${services.length} available)`}
            </label>
            <select
              value={filters.service_id}
              onChange={(e) => handleFilterChange('service_id', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loadingServices}
            >
              <option value="">-- All Services --</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.title} - {service.sub_category?.category?.name || service.sub_category?.name || 'N/A'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date (Optional)
            </label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date (Optional)
            </label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer (Optional) {customers.length > 0 && `(${customers.length} available)`}
            </label>
            <select
              value={filters.customer_id}
              onChange={(e) => handleFilterChange('customer_id', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loadingCustomers}
            >
              <option value="">-- All Customers --</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.first_name} {customer.last_name} -- {customer.email}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ) : revenue && revenue.length > 0 ? (
        <>
          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm text-gray-600 mb-2">Total Bookings</h3>
                <p className="text-3xl font-bold text-blue-600">{summary.total_bookings || 0}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm text-gray-600 mb-2">Gross Revenue</h3>
                <p className="text-3xl font-bold text-green-600">${summary.gross_revenue || 0}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm text-gray-600 mb-2">Total Discount</h3>
                <p className="text-3xl font-bold text-red-600">${summary.total_discount || 0}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm text-gray-600 mb-2">Net Revenue</h3>
                <p className="text-3xl font-bold text-purple-600">${summary.net_revenue || 0}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm text-gray-600 mb-2">Avg Booking Value</h3>
                <p className="text-3xl font-bold text-orange-600">${summary.avg_booking_value || 0}</p>
              </div>
            </div>
          )}

          {/* Revenue Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Revenue Breakdown</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {revenue.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.period || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.bookings || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">${item.gross_revenue || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">${item.discount || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">${item.net_revenue || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
          No revenue data available for the selected filters.
        </div>
      )}
    </div>
  );
};

export default RevenueReports;

