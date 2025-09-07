import { useMemo } from 'react';
import { USER_ROLES, STATUS_TYPES } from '../constants';
import { mockUsers, mockServices, mockBookings } from '../data/mockData';
import { useLocalization } from '../contexts/LocalizationContext';

export const useStats = () => {
  const { t } = useLocalization();

  const stats = useMemo(() => ({
    totalUsers: mockUsers.length,
    totalCustomers: mockUsers.filter(u => u.role === USER_ROLES.CUSTOMER).length,
    totalProviders: mockUsers.filter(u => u.role === USER_ROLES.SERVICE_PROVIDER).length,
    totalServices: mockServices.length,
    totalBookings: mockBookings.length,
    completedBookings: mockBookings.filter(b => b.status === STATUS_TYPES.COMPLETED).length,
    pendingBookings: mockBookings.filter(b => b.status === STATUS_TYPES.PENDING).length,
    inProgressBookings: mockBookings.filter(b => b.status === STATUS_TYPES.IN_PROGRESS).length,
    totalRevenue: mockBookings.reduce((sum, booking) => sum + booking.amount, 0),
    monthlyRevenue: mockBookings
      .filter(b => b.date.startsWith('2024-08'))
      .reduce((sum, booking) => sum + booking.amount, 0),
    averageRating: mockServices.reduce((sum, service) => sum + service.rating, 0) / mockServices.length,
    activeServices: mockServices.filter(s => s.status === STATUS_TYPES.ACTIVE).length,
  }), []);

  return stats;
};
