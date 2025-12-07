import React, { useState } from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useServices } from '../../hooks/useServices';
import { useServiceAnalytics } from '../../hooks/useReports';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ServiceAnalytics = () => {
  const { t } = useLocalization();
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [period, setPeriod] = useState('last_30_days');

  // Fetch services list for dropdown
  const { data: servicesData, isLoading: loadingServices } = useServices({ per_page: 100 });
  const services = servicesData?.data?.data || [];

  // Fetch analytics for selected service
  const { data: analyticsData, isLoading: loadingAnalytics } = useServiceAnalytics(
    selectedServiceId,
    period
  );

  const handleExport = (format) => {
    if (!analyticsData) return;

    const data = analyticsData.data || analyticsData;

    if (format === 'csv' || format === 'excel') {
      const headers = [
        'Service Name',
        'Category',
        'Total Bookings',
        'Completed Bookings',
        'Cancelled Bookings',
        'Total Revenue',
        'Average Booking Value',
        'Average Rating',
        'Total Reviews',
        'Provider'
      ];

      const rows = [[
        data.service?.title || 'N/A',
        data.service?.sub_category?.name || 'N/A',
        data.booking_stats?.total_bookings || 0,
        data.booking_stats?.completed_bookings || 0,
        data.booking_stats?.cancelled_bookings || 0,
        data.booking_stats?.total_revenue || 0,
        data.booking_stats?.avg_booking_value || 0,
        data.rating_stats?.avg_rating || 0,
        data.rating_stats?.total_ratings || 0,
        `${data.service?.provider?.first_name} ${data.service?.provider?.last_name}` || 'N/A'
      ]];

      // Add rating distribution
      if (data.rating_stats && data.rating_stats.total_ratings > 0) {
        rows.push([], ['Rating Distribution']);
        rows.push(['Rating', 'Count', 'Percentage']);
        ['five_star', 'four_star', 'three_star', 'two_star', 'one_star'].forEach((key, index) => {
          const rating = 5 - index;
          const count = data.rating_stats[key] || 0;
          const percentage = data.rating_stats.total_ratings > 0 ? ((count / data.rating_stats.total_ratings) * 100).toFixed(1) : 0;
          rows.push([`${rating} Star`, count, `${percentage}%`]);
        });
      }

      // Add booking trend
      if (data.booking_trend && data.booking_trend.length > 0) {
        rows.push([], ['Booking Trend']);
        rows.push(['Date', 'Bookings', 'Revenue']);
        data.booking_trend.forEach(trend => {
          rows.push([
            trend.date || 'N/A',
            trend.bookings || 0,
            trend.revenue || 0
          ]);
        });
      } const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `service-analytics-${selectedServiceId}-${period}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text('Service Analytics Report', 14, 22);

      // Add service info
      doc.setFontSize(12);
      doc.text(`Service: ${data.service?.title || 'N/A'}`, 14, 32);
      doc.text(`Provider: ${data.service?.provider?.first_name} ${data.service?.provider?.last_name}` || 'N/A', 14, 39);
      doc.text(`Category: ${data.service?.sub_category?.name || 'N/A'}`, 14, 46);
      doc.text(`Period: ${period}`, 14, 53);

      // Add stats table
      autoTable(doc, {
        startY: 62,
        head: [['Metric', 'Value']],
        body: [
          ['Total Bookings', data.booking_stats?.total_bookings || 0],
          ['Completed Bookings', data.booking_stats?.completed_bookings || 0],
          ['Pending Bookings', data.booking_stats?.pending_bookings || 0],
          ['Cancelled Bookings', data.booking_stats?.cancelled_bookings || 0],
          ['Total Revenue', `$${data.booking_stats?.total_revenue || 0}`],
          ['Avg Booking Value', `$${data.booking_stats?.avg_booking_value || 0}`],
          ['Average Rating', `${data.rating_stats?.avg_rating || 0} (${data.rating_stats?.total_ratings || 0} ratings)`]
        ]
      });

      // Add rating distribution if available
      if (data.rating_stats && data.rating_stats.total_ratings > 0) {
        const ratingBody = ['five_star', 'four_star', 'three_star', 'two_star', 'one_star'].map((key, index) => {
          const rating = 5 - index;
          const count = data.rating_stats[key] || 0;
          const percentage = data.rating_stats.total_ratings > 0 ? ((count / data.rating_stats.total_ratings) * 100).toFixed(1) : 0;
          return [`${rating} Star`, count, `${percentage}%`];
        });

        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 10,
          head: [['Rating', 'Count', 'Percentage']],
          body: ratingBody
        });
      }

      // Add booking trend if available
      if (data.booking_trend && data.booking_trend.length > 0) {
        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 10,
          head: [['Date', 'Bookings', 'Revenue']],
          body: data.booking_trend.map(trend => [
            trend.date || 'N/A',
            trend.bookings || 0,
            `$${trend.revenue || 0}`
          ])
        });
      }

      doc.save(`service-analytics-${selectedServiceId}-${period}.pdf`);
    }
  };

  if (!selectedServiceId) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('serviceAnalytics')}</h1>
          <p className="text-gray-600">
            Analyze service performance, ratings, and booking trends.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Service to View Analytics
          </label>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loadingServices}
          >
            <option value="">-- Select Service --</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.title} - {service.sub_category?.category?.name || service.sub_category?.name || 'N/A'}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('serviceAnalytics')}</h1>
          <p className="text-gray-600">
            Analyze service performance, ratings, and booking trends.
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

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Service
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loadingServices}
            >
              <option value="">-- Select Service --</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.title} - {service.sub_category?.category?.name || service.sub_category?.name || 'N/A'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Period
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_90_days">Last 90 Days</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {loadingAnalytics ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ) : analyticsData ? (
        <>
          {/* Service Info Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Service Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Service Name</p>
                <p className="font-medium">{analyticsData.data?.service?.title || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium">{analyticsData.data?.service?.sub_category?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Provider</p>
                <p className="font-medium">{analyticsData.data?.service?.provider?.first_name} {analyticsData.data?.service?.provider?.last_name || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-600 mb-2">Total Bookings</h3>
              <p className="text-3xl font-bold text-blue-600">{analyticsData.data?.booking_stats?.total_bookings || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-600 mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600">${analyticsData.data?.booking_stats?.total_revenue || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-600 mb-2">Average Rating</h3>
              <p className="text-3xl font-bold text-yellow-600">{analyticsData.data?.rating_stats?.avg_rating || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-600 mb-2">Completed Bookings</h3>
              <p className="text-3xl font-bold text-purple-600">{analyticsData.data?.booking_stats?.completed_bookings || 0}</p>
            </div>
          </div>

          {/* Rating Distribution */}
          {analyticsData.data?.rating_stats && analyticsData.data.rating_stats.total_ratings > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Rating Distribution</h2>
              <div className="space-y-3">
                {['five_star', 'four_star', 'three_star', 'two_star', 'one_star'].map((key, index) => {
                  const rating = 5 - index;
                  const count = analyticsData.data.rating_stats[key] || 0;
                  const percentage = analyticsData.data.rating_stats.total_ratings > 0
                    ? ((count / analyticsData.data.rating_stats.total_ratings) * 100).toFixed(1)
                    : 0;
                  return (
                    <div key={key} className="flex items-center gap-4">
                      <span className="w-16 text-sm font-medium">{rating} Star</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-yellow-500 h-4 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="w-20 text-sm text-gray-600 text-right">{count} ({percentage}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}          {/* Booking Trend Table */}
          {analyticsData.data?.booking_trend && analyticsData.data.booking_trend.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Booking Trend</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {analyticsData.data.booking_trend.map((trend, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{trend.date || trend.period || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{trend.bookings || trend.count || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">${trend.revenue || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
          No analytics data available for the selected service and period.
        </div>
      )}
    </div>
  );
};

export default ServiceAnalytics;
