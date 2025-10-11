import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LocalizationProvider } from './contexts/LocalizationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
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
  AdminUsers,
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

const AppRouter = () => (
  <ThemeProvider>
    <LocalizationProvider>
      <AppProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/providers" element={<ServiceProviders />} />
              <Route path="/admin-users" element={<AdminUsers />} />
              <Route path="/services" element={<ServiceManagement />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/service-requests" element={<ServiceRequests />} />
              <Route path="/bookings" element={<BookingManagement />} />
              <Route path="/pending-bookings" element={<PendingBookings />} />
              <Route path="/completed-bookings" element={<CompletedBookings />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/commissions" element={<Commissions />} />
              <Route path="/user-analytics" element={<UserAnalytics />} />
              <Route path="/revenue-reports" element={<RevenueReports />} />
              <Route path="/service-analytics" element={<ServiceAnalytics />} />
              <Route path="/banners" element={<Banners />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/localization" element={<Localization />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/security" element={<Security />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </LocalizationProvider>
  </ThemeProvider>
);

export default AppRouter;
