/**
 * Notification Bell Component
 * 
 * Displays notification bell icon with unread count badge
 * Shows dropdown with recent notifications and quick actions
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLocalization } from '../../contexts/LocalizationContext';

const NotificationBell = () => {
  const { unreadCount, notifications, markAsRead, deleteNotification, markAllAsRead, fetchNotifications, loading } = useNotifications();
  const { themeConfig } = useTheme();
  const { t, isRTL } = useLocalization();
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications(1);
    }
  }, [isOpen, fetchNotifications]);

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
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('justNow') || 'Just now';
    if (diffMins < 60) return `${diffMins} ${t('minutesAgo') || 'min ago'}`;
    if (diffHours < 24) return `${diffHours} ${t('hoursAgo') || 'h ago'}`;
    if (diffDays < 7) return `${diffDays} ${t('daysAgo') || 'd ago'}`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const recentNotifications = (Array.isArray(notifications) ? notifications : []).slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-all duration-200 ${
          isOpen
            ? `bg-gradient-to-r ${themeConfig.gradient} text-white`
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
        title={t('notifications') || 'Notifications'}
      >
        <Bell className="w-5 h-5" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span
            className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 
                       inline-flex items-center justify-center w-5 h-5 text-xs font-bold 
                       text-white bg-red-500 rounded-full"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute ${isRTL ? 'right-0' : 'left-0'} mt-2 w-80 bg-white rounded-lg shadow-xl 
                       border border-gray-200 z-50 max-h-96 overflow-y-auto`}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                {t('notifications') || 'Notifications'}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
                >
                  <Check className="w-3 h-3" />
                  {t('markAllAsRead') || 'Mark all read'}
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-gray-100">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-gray-50 transition-colors ${
                    !notification.read_at ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="text-lg flex-shrink-0 pt-1">
                      {getNotificationIcon(notification.data?.type || notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {notification.data?.message || 'New notification'}
                      </p>
                      {notification.data?.service_name && (
                        <p className="text-xs text-gray-600 mt-1">
                          {notification.data.service_name}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 flex-shrink-0">
                      {!notification.read_at && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title={t('markAsRead') || 'Mark as read'}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title={t('delete') || 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : loading ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 mb-2">
                  <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-sm text-gray-500">
                  {t('loading') || 'Loading...'}
                </p>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  {t('noNotifications') || 'No notifications'}
                </p>
              </div>
            )}
          </div>

          {/* Footer with View All link */}
          {recentNotifications.length > 0 && (
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 py-3 text-center">
              <a
                href="/notifications"
                className={`text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors`}
              >
                {t('viewAll') || 'View All'} →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
