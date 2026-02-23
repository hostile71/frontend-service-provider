/**
 * Notifications Page Component
 * 
 * Full-page view for managing all notifications
 * Supports pagination, filtering, and bulk actions
 */

import React, { useState } from 'react';
import { Trash2, Check, Eye, EyeOff, Loader } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useToast } from '../../contexts/ToastContext';

const NotificationsPage = () => {
  const { 
    notifications, 
    loading, 
    hasMore,
    markAsRead, 
    deleteNotification, 
    deleteAll, 
    loadMore,
    markAllAsRead 
  } = useNotifications();
  const { themeConfig } = useTheme();
  const { t, isRTL } = useLocalization();
  const toast = useToast();

  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());

  // Ensure notifications is always an array
  const notificationsArray = Array.isArray(notifications) ? notifications : [];

  // Filter notifications
  const filteredNotifications = notificationsArray.filter(n => {
    if (filter === 'unread') return !n.read_at;
    if (filter === 'read') return n.read_at;
    return true;
  });

  const getNotificationIcon = (type) => {
    if (typeof type === 'string') {
      if (type.includes('created') || type.includes('Booking')) return '✨';
      if (type.includes('status') || type.includes('Status')) return '📝';
      if (type.includes('cancelled') || type.includes('Cancelled')) return '❌';
      if (type.includes('payment') || type.includes('Payment')) return '💳';
    }
    return '📬';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)));
    } else {
      setSelectedNotifications(new Set());
    }
  };

  const handleSelectNotification = (notificationId) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(notificationId)) {
      newSelected.delete(notificationId);
    } else {
      newSelected.add(notificationId);
    }
    setSelectedNotifications(newSelected);
  };

  const handleMarkSelectedAsRead = async () => {
    try {
      for (const id of selectedNotifications) {
        await markAsRead(id);
      }
      setSelectedNotifications(new Set());
      toast.success(t('markedAsRead') || 'Marked as read');
    } catch (error) {
      toast.error(error.message || 'Failed to mark as read');
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(t('confirmDelete') || 'Are you sure?')) return;
    
    try {
      for (const id of selectedNotifications) {
        await deleteNotification(id);
      }
      setSelectedNotifications(new Set());
      toast.success(t('deleted') || 'Deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm(t('confirmDeleteAll') || 'Delete all notifications?')) return;
    
    try {
      await deleteAll();
      toast.success(t('allDeleted') || 'All notifications deleted');
    } catch (error) {
      toast.error(error.message || 'Failed to delete all');
    }
  };

  return (
    <div className={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('notifications') || 'Notifications'}
        </h1>
        <p className="text-gray-600">
          {t('manageNotifications') || 'Manage and view all your notifications'}
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            {['all', 'unread', 'read'].map(filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === filterType
                    ? `bg-gradient-to-r ${themeConfig.gradient} text-white`
                    : 'text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {t(filterType) || filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {selectedNotifications.size > 0 && (
              <>
                <button
                  onClick={handleMarkSelectedAsRead}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {t('markAsRead') || 'Mark Read'}
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {t('delete') || 'Delete'}
                </button>
              </>
            )}
            
            {notificationsArray.length > 0 && selectedNotifications.size === 0 && (
              <>
                <button
                  onClick={() => markAllAsRead()}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {t('markAllRead') || 'Mark All Read'}
                </button>
                <button
                  onClick={handleDeleteAll}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {t('deleteAll') || 'Delete All'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Table Header with Checkbox */}
        {filteredNotifications.length > 0 && (
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center gap-3">
            <input
              type="checkbox"
              checked={
                filteredNotifications.length > 0 &&
                selectedNotifications.size === filteredNotifications.length
              }
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-600">
              {selectedNotifications.size > 0
                ? `${selectedNotifications.size} ${t('selected') || 'selected'}`
                : `${filteredNotifications.length} ${t('notifications') || 'notifications'}`}
            </span>
          </div>
        )}

        {/* Loading State */}
        {loading && notificationsArray.length === 0 && (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
              <Loader className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
            <p className="text-gray-500">{t('loading') || 'Loading notifications...'}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredNotifications.length === 0 && (
          <div className="p-12 text-center">
            <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-1">
              {filter === 'unread' && (t('noUnreadNotifications') || 'No unread notifications')}
              {filter === 'read' && (t('noReadNotifications') || 'No read notifications')}
              {filter === 'all' && (t('noNotifications') || 'No notifications')}
            </p>
            <p className="text-gray-600 text-sm">
              {t('notification_description') || 'You are all caught up!'}
            </p>
          </div>
        )}

        {/* Notifications Grid */}
        <div className="divide-y divide-gray-200">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 transition-colors flex gap-4 items-start ${
                !notification.read_at ? 'bg-blue-50' : ''
              }`}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedNotifications.has(notification.id)}
                onChange={() => handleSelectNotification(notification.id)}
                className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
              />

              {/* Icon */}
              <div className="text-2xl flex-shrink-0">
                {getNotificationIcon(notification.data?.type || notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {notification.data?.message || 'New notification'}
                    </p>
                    {notification.data?.service_name && (
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.data.service_name}
                      </p>
                    )}
                    {notification.data?.provider_name && (
                      <p className="text-sm text-gray-600">
                        {t('provider') || 'Provider'}: {notification.data.provider_name}
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  {!notification.read_at && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex-shrink-0">
                      {t('unread') || 'Unread'}
                    </span>
                  )}
                </div>

                {/* Date */}
                <p className="text-xs text-gray-500 mt-2">
                  {formatDate(notification.created_at)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                {!notification.read_at && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title={t('markAsRead') || 'Mark as read'}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title={t('delete') || 'Delete'}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && !loading && filteredNotifications.length > 0 && (
          <div className="p-4 text-center border-t border-gray-200">
            <button
              onClick={loadMore}
              className={`px-6 py-2 font-medium text-white rounded-lg transition-all duration-200 
                         bg-gradient-to-r ${themeConfig.gradient} hover:opacity-90`}
            >
              {t('loadMore') || 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
