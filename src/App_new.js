import React from 'react';
import { LocalizationProvider } from './contexts/LocalizationContext';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './components/pages/Dashboard';
import UserManagement from './components/pages/UserManagement';
import ServiceProviders from './components/pages/ServiceProviders';
import ServiceManagement from './components/pages/ServiceManagement';
import Categories from './components/pages/Categories';
import BookingManagement from './components/pages/BookingManagement';
import Reports from './components/pages/Reports';
import Settings from './components/pages/Settings';
import Localization from './components/pages/Localization';
import Payments from './components/pages/Payments';
import NotificationsPage from './components/pages/NotificationsPage';
import Banners from './components/pages/Banners';
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
  const { 
    activeTab, 
    showModal, 
    setShowModal, 
    modalType, 
    showProfileSettings, 
    setShowProfileSettings,
    showDetailView,
    setShowDetailView,
    detailViewItem,
    detailViewType
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
        return <ServiceManagement />;
      case 'categories':
        return <Categories />;
      case 'bookings':
        return <BookingManagement />;
      case 'content':
        return <ContentManagement />;
      case 'reports':
        return <Reports />;
      case 'admin-users':
        return <AdminUsers />;
      case 'settings':
        return <Settings />;
      case 'localization':
        return <Localization />;
      case 'payments':
        return <Payments />;
      case 'notifications':
        return <NotificationsPage />;
      case 'banners':
        return <Banners />;
      default:
        return <Dashboard />;
    }
  };

  return (
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
        onClose={() => setShowDetailView(false)} 
        item={detailViewItem}
        type={detailViewType}
      />
    </Layout>
  );
};

const App = () => {
  return (
    <LocalizationProvider>
      <AppProvider>
        <ServicePlatformAdmin />
      </AppProvider>
    </LocalizationProvider>
  );
};

export default App;
