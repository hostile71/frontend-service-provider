import React from 'react';
import { LocalizationProvider } from './contexts/LocalizationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Layout from './components/layout/Layout';
import { 
  Dashboard, 
  UserManagement, 
  ServiceProviders, 
  ServiceManagement, 
  Categories, 
  BookingManagement, 
  Reports, 
  Settings,
  ServiceRequests,
  PendingBookings,
  CompletedBookings,
  Payments,
  Invoices,
  Commissions,
  UserAnalytics,
  RevenueReports,
  ServiceAnalytics,
  Banners,
  NotificationsPage,
  Localization,
  Security
} from './components/pages';
import AddItemModal from './components/ui/AddItemModal';
import ProfileSettingsModal from './components/ui/ProfileSettingsModal';
import DetailViewModal from './components/ui/DetailViewModal';
import DataTable from './components/ui/DataTable';
import { useLocalization } from './contexts/LocalizationContext';

// Content Management placeholder
const ContentManagement = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();

  const handleAddContent = () => {
    setModalType('content');
    setShowModal(true);
  };

  const contentColumns = ['Type', 'Title', t('status'), 'Position'];

  return (
    <DataTable
      data={[]}
      columns={contentColumns}
      title={t('contentManagement')}
      onAdd={handleAddContent}
      searchFields={['type', 'title', 'titleAr']}
    />
  );
};

// Admin Users placeholder
const AdminUsers = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();

  const handleAddAdminUser = () => {
    setModalType('admin-user');
    setShowModal(true);
  };

  const adminColumns = [
    t('name'), 
    t('email'), 
    t('role'), 
    'Last Login', 
    t('status'), 
    'Permissions'
  ];

  return (
    <DataTable
      data={[]}
      columns={adminColumns}
      title={t('adminUsers')}
      onAdd={handleAddAdminUser}
      searchFields={['name', 'email', 'role']}
    />
  );
};

const ServicePlatformAdmin = () => {
  const { isRTL } = useLocalization();
  const { 
    activeTab, 
    showModal, 
    setShowModal, 
    modalType, 
    showProfileSettings, 
    setShowProfileSettings,
    showDetailView,
    detailViewItem,
    detailViewType,
    closeDetailView
  } = useAppContext();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'providers':
        return <ServiceProviders />;
      case 'services':
      case 'service-list':
        return <ServiceManagement />;
      case 'categories':
        return <Categories />;
      case 'service-requests':
        return <ServiceRequests />;
      case 'bookings':
      case 'all-bookings':
        return <BookingManagement />;
      case 'pending-bookings':
        return <PendingBookings />;
      case 'completed-bookings':
        return <CompletedBookings />;
      case 'content':
      case 'pages':
        return <ContentManagement />;
      case 'reports':
      case 'dashboard-reports':
        return <Reports />;
      case 'user-analytics':
        return <UserAnalytics />;
      case 'revenue-reports':
        return <RevenueReports />;
      case 'service-analytics':
        return <ServiceAnalytics />;
      case 'admin-users':
        return <AdminUsers />;
      case 'settings':
      case 'general-settings':
        return <Settings />;
      case 'localization':
        return <Localization />;
      case 'security':
        return <Security />;
      case 'payments':
        return <Payments />;
      case 'invoices':
        return <Invoices />;
      case 'commissions':
        return <Commissions />;
      case 'banners':
        return <Banners />;
      case 'notifications':
        return <NotificationsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}>
      <Layout>
        {renderContent()}
        
        {/* Modals */}
        <AddItemModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          type={modalType}
        />
        <ProfileSettingsModal 
          isOpen={showProfileSettings} 
          onClose={() => setShowProfileSettings(false)} 
        />
        <DetailViewModal 
          isOpen={showDetailView} 
          onClose={closeDetailView}
          item={detailViewItem}
          type={detailViewType}
        />
      </Layout>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <LocalizationProvider>
        <AppProvider>
          <ServicePlatformAdmin />
        </AppProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
