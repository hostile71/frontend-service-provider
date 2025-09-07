import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import DataTable from '../ui/DataTable';

const NotificationsPage = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();

  // Mock notification data
  const mockNotifications = [
    {
      id: 1,
      title: 'New Service Booking',
      titleAr: 'حجز خدمة جديد',
      message: 'Ahmed Al-Rashid has booked AC Repair service',
      messageAr: 'أحمد الراشد قام بحجز خدمة إصلاح المكيف',
      type: 'Booking',
      recipient: 'All Providers',
      priority: 'High',
      status: 'sent',
      sentDate: '2024-08-18 10:30',
      readRate: 85.3
    },
    {
      id: 2,
      title: 'Payment Received',
      titleAr: 'تم استلام الدفع',
      message: 'Payment of 45 OMR received for service #12345',
      messageAr: 'تم استلام دفعة بقيمة 45 ريال عماني للخدمة رقم 12345',
      type: 'Payment',
      recipient: 'TechCare Services',
      priority: 'Medium',
      status: 'sent',
      sentDate: '2024-08-18 09:15',
      readRate: 100
    },
    {
      id: 3,
      title: 'System Maintenance',
      titleAr: 'صيانة النظام',
      message: 'Scheduled maintenance tonight from 11 PM to 2 AM',
      messageAr: 'صيانة مجدولة الليلة من 11 مساءً إلى 2 صباحاً',
      type: 'System',
      recipient: 'All Users',
      priority: 'High',
      status: 'scheduled',
      sentDate: '2024-08-19 23:00',
      readRate: 0
    },
    {
      id: 4,
      title: 'New Review Posted',
      titleAr: 'تم نشر تقييم جديد',
      message: 'Sarah Mohammed left a 5-star review for CleanPro',
      messageAr: 'سارة محمد تركت تقييماً 5 نجوم لشركة كلين برو',
      type: 'Review',
      recipient: 'CleanPro',
      priority: 'Low',
      status: 'draft',
      sentDate: '2024-08-18 14:45',
      readRate: 0
    }
  ];

  const handleAddNotification = () => {
    setModalType('notification');
    setShowModal(true);
  };

  const notificationColumns = [
    'Title',
    'Type',
    'Recipient',
    'Priority',
    t('status'),
    'Sent Date',
    'Read Rate (%)',
    'Message'
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('notifications')}</h1>
        <p className="text-gray-600">
          Send and manage system notifications, alerts, and announcements.
        </p>
      </div>
      
      <DataTable
        data={mockNotifications}
        columns={notificationColumns}
        title={t('notifications')}
        onAdd={handleAddNotification}
        searchFields={['title', 'titleAr', 'type', 'recipient', 'priority']}
        itemType="notification"
      />
    </div>
  );
};

export default NotificationsPage;
