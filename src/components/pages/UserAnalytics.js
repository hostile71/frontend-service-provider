import React, { useState } from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useUsers } from '../../hooks/useUsers';
import { useUserAnalytics } from '../../hooks/useReports';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const UserAnalytics = () => {
  const { t } = useLocalization();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [period, setPeriod] = useState('last_30_days');

  // Fetch users list for dropdown
  const { data: usersData, isLoading: loadingUsers } = useUsers({ per_page: 100 });
  const users = usersData?.data || [];

  // Fetch analytics for selected user
  const { data: analyticsData, isLoading: loadingAnalytics } = useUserAnalytics(
    selectedUserId,
    period
  );

  const handleExport = (format) => {
    if (!analyticsData) return;

    const data = analyticsData.data || analyticsData;

    if (format === 'csv' || format === 'excel') {
      const headers = [
        'User Name',
        'Email',
        'Total Bookings',
        'Completed Bookings',
        'Cancelled Bookings',
        'Total Spent',
        'Average Booking Value',
        'Total Discount Received'
      ];

      const rows = [[
        data.user?.name || 'N/A',
        data.user?.email || 'N/A',
        data.booking_stats?.total_bookings || 0,
        data.booking_stats?.completed_bookings || 0,
        data.booking_stats?.cancelled_bookings || 0,
        data.booking_stats?.total_spent || 0,
        data.booking_stats?.avg_booking_value || 0,
        data.booking_stats?.total_discount_received || 0
      ]];

      // Add booking history
      if (data.booking_history && data.booking_history.length > 0) {
        rows.push([], ['Booking History'], ['Date', 'Service', 'Status', 'Amount', 'Provider']);
        data.booking_history.forEach(booking => {
          rows.push([
            booking.created_at?.split('T')[0] || 'N/A',
            booking.service?.title || 'N/A',
            booking.status || 'N/A',
            booking.net_amount || booking.price || 0,
            `${booking.provider?.first_name} ${booking.provider?.last_name}` || 'N/A'
          ]);
        });
      } const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `user-analytics-${selectedUserId}-${period}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text('User Analytics Report', 14, 22);

      // Add user info
      doc.setFontSize(12);
      doc.text(`User: ${data.user?.name || 'N/A'}`, 14, 32);
      doc.text(`Email: ${data.user?.email || 'N/A'}`, 14, 39);
      doc.text(`Period: ${period}`, 14, 46);

      // Add stats table
      autoTable(doc, {
        startY: 55,
        head: [['Metric', 'Value']],
        body: [
          ['Total Bookings', data.booking_stats?.total_bookings || 0],
          ['Completed Bookings', data.booking_stats?.completed_bookings || 0],
          ['Pending Bookings', data.booking_stats?.pending_bookings || 0],
          ['Cancelled Bookings', data.booking_stats?.cancelled_bookings || 0],
          ['Total Spent', `$${data.booking_stats?.total_spent || 0}`],
          ['Avg Booking Value', `$${data.booking_stats?.avg_booking_value || 0}`],
          ['Total Discount Received', `$${data.booking_stats?.total_discount_received || 0}`]
        ]
      });

      // Add booking history if available
      if (data.booking_history && data.booking_history.length > 0) {
        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 10,
          head: [['Date', 'Service', 'Provider', 'Status', 'Amount']],
          body: data.booking_history.map(booking => [
            booking.created_at?.split('T')[0] || 'N/A',
            booking.service?.title || 'N/A',
            `${booking.provider?.first_name} ${booking.provider?.last_name}` || 'N/A',
            booking.status || 'N/A',
            `$${booking.net_amount || booking.price || 0}`
          ])
        });
      }

      doc.save(`user-analytics-${selectedUserId}-${period}.pdf`);
    }
  };

  if (!selectedUserId) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('userAnalytics')}</h1>
          <p className="text-gray-600">
            Analyze user behavior, engagement patterns, and performance metrics.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select User to View Analytics
          </label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loadingUsers}
          >
            <option value="">-- Select User --</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.first_name} {user.last_name} -- {user.email}
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('userAnalytics')}</h1>
          <p className="text-gray-600">
            Analyze user behavior, engagement patterns, and performance metrics.
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
              Select User
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loadingUsers}
            >
              <option value="">-- Select User --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} -- {user.email}
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
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">User Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{analyticsData.data?.user?.name || analyticsData.data?.user?.full_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{analyticsData.data?.user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{analyticsData.data?.user?.phone || 'N/A'}</p>
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
              <h3 className="text-sm text-gray-600 mb-2">Completed</h3>
              <p className="text-3xl font-bold text-green-600">{analyticsData.data?.booking_stats?.completed_bookings || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-600 mb-2">Total Spent</h3>
              <p className="text-3xl font-bold text-purple-600">${analyticsData.data?.booking_stats?.total_spent || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-600 mb-2">Avg Booking Value</h3>
              <p className="text-3xl font-bold text-orange-600">${analyticsData.data?.booking_stats?.avg_booking_value || 0}</p>
            </div>
          </div>

          {/* Booking History Table */}
          {analyticsData.data?.booking_history && analyticsData.data.booking_history.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Booking History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {analyticsData.data.booking_history.map((booking, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.created_at?.split('T')[0] || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.service?.title || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.provider ? `${booking.provider.first_name} ${booking.provider.last_name}` : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {booking.status || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">${booking.net_amount || booking.price || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.rating || 'N/A'}</td>
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
          No analytics data available for the selected user and period.
        </div>
      )}
    </div>
  );
};

export default UserAnalytics;

