import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import DataTable from '../ui/DataTable';

const Banners = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();

  // Mock banner data
  const mockBanners = [
    {
      id: 1,
      title: 'Summer Service Special',
      titleAr: 'عرض خاص للخدمات الصيفية',
      type: 'Promotional',
      position: 'Homepage Hero',
      startDate: '2024-08-01',
      endDate: '2024-08-31',
      status: 'active',
      clickRate: 3.2,
      impressions: 12450,
      imageUrl: '/banners/summer-special.jpg'
    },
    {
      id: 2,
      title: 'New Provider Registration',
      titleAr: 'تسجيل مقدم خدمة جديد',
      type: 'Information',
      position: 'Sidebar',
      startDate: '2024-08-15',
      endDate: '2024-09-15',
      status: 'active',
      clickRate: 2.8,
      impressions: 8900,
      imageUrl: '/banners/provider-registration.jpg'
    },
    {
      id: 3,
      title: 'Mobile App Launch',
      titleAr: 'إطلاق تطبيق الهاتف المحمول',
      type: 'Announcement',
      position: 'Top Bar',
      startDate: '2024-08-10',
      endDate: '2024-08-25',
      status: 'completed',
      clickRate: 4.1,
      impressions: 15600,
      imageUrl: '/banners/mobile-app.jpg'
    },
    {
      id: 4,
      title: 'Customer Reviews Campaign',
      titleAr: 'حملة تقييمات العملاء',
      type: 'Promotional',
      position: 'Footer',
      startDate: '2024-08-20',
      endDate: '2024-09-20',
      status: 'scheduled',
      clickRate: 0,
      impressions: 0,
      imageUrl: '/banners/reviews-campaign.jpg'
    }
  ];

  const handleAddBanner = () => {
    setModalType('banner');
    setShowModal(true);
  };

  const bannerColumns = [
    'Title',
    'Type',
    'Position',
    'Start Date',
    'End Date',
    t('status'),
    'Click Rate (%)',
    'Impressions',
    'Image'
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('banners')}</h1>
        <p className="text-gray-600">
          Manage website banners, promotional content, and marketing campaigns.
        </p>
      </div>
      
      <DataTable
        data={mockBanners}
        columns={bannerColumns}
        title={t('banners')}
        onAdd={handleAddBanner}
        searchFields={['title', 'titleAr', 'type', 'position']}
        itemType="banner"
      />
    </div>
  );
};

export default Banners;
