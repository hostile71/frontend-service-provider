import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LocalizationProvider } from './contexts/LocalizationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Layout from './components/layout/Layout';
import { 
  Login,
  TwoFactorAuth,
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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const ServicePlatformAdmin = () => {
  const { isRTL } = useLocalization();
  const {
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

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/verify-2fa" element={<TwoFactorAuth />} />
        
        {/* Protected Routes - Redirect to login if not authenticated */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}>
                <Layout>
                  <Dashboard />
                </Layout>
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="/users" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><UserManagement /></Layout></div></ProtectedRoute>} />
        <Route path="/providers" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><ServiceProviders /></Layout></div></ProtectedRoute>} />
        <Route path="/services" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><ServiceManagement /></Layout></div></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><Categories /></Layout></div></ProtectedRoute>} />
        <Route path="/service-requests" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><ServiceRequests /></Layout></div></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><BookingManagement /></Layout></div></ProtectedRoute>} />
        <Route path="/pending-bookings" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><PendingBookings /></Layout></div></ProtectedRoute>} />
        <Route path="/completed-bookings" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><CompletedBookings /></Layout></div></ProtectedRoute>} />
        <Route path="/content" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><ContentManagement /></Layout></div></ProtectedRoute>} />
        <Route path="/pages" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><ContentManagement /></Layout></div></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><Reports /></Layout></div></ProtectedRoute>} />
        <Route path="/dashboard-reports" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><Reports /></Layout></div></ProtectedRoute>} />
        <Route path="/user-analytics" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><UserAnalytics /></Layout></div></ProtectedRoute>} />
        <Route path="/revenue-reports" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><RevenueReports /></Layout></div></ProtectedRoute>} />
        <Route path="/service-analytics" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><ServiceAnalytics /></Layout></div></ProtectedRoute>} />
        <Route path="/admin-users" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><AdminUsers /></Layout></div></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><Settings /></Layout></div></ProtectedRoute>} />
        <Route path="/general-settings" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><Settings /></Layout></div></ProtectedRoute>} />
        <Route path="/localization" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><Localization /></Layout></div></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><Security /></Layout></div></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><Payments /></Layout></div></ProtectedRoute>} />
        <Route path="/invoices" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><Invoices /></Layout></div></ProtectedRoute>} />
        <Route path="/commissions" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><Commissions /></Layout></div></ProtectedRoute>} />
        <Route path="/banners" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><Banners /></Layout></div></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--theme-bg)' }}><Layout><NotificationsPage /></Layout></div></ProtectedRoute>} />
      </Routes>

      {/* Global Modals - only show when authenticated */}
      {localStorage.getItem('authToken') && (
        <>
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
        </>
      )}
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <LocalizationProvider>
        <AppProvider>
          <Router>
            <ServicePlatformAdmin />
          </Router>
        </AppProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
