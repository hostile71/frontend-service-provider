import { useQuery } from '@tanstack/react-query';
import reportService from '../services/report.service';

export const reportKeys = {
    all: ['reports'],
    dashboard: (period) => [...reportKeys.all, 'dashboard', period],
    dailyBooking: (period) => [...reportKeys.all, 'daily-booking', period],
    monthlyRevenue: (period) => [...reportKeys.all, 'monthly-revenue', period],
    topServices: (period, limit) => [...reportKeys.all, 'top-services', period, limit],
    customerEngagement: (period) => [...reportKeys.all, 'customer-engagement', period],
    providerPerformance: (period) => [...reportKeys.all, 'provider-performance', period],
    userAnalytics: (userId, period, startDate, endDate) => [...reportKeys.all, 'user-analytics', userId, period, startDate, endDate],
    providerAnalytics: (providerId, period, startDate, endDate) => [...reportKeys.all, 'provider-analytics', providerId, period, startDate, endDate],
    serviceAnalytics: (serviceId, period, startDate, endDate) => [...reportKeys.all, 'service-analytics', serviceId, period, startDate, endDate],
    revenue: (filters) => [...reportKeys.all, 'revenue', filters],
};

export const useDashboardStats = (period = 'last_7_days') => {
    return useQuery({
        queryKey: reportKeys.dashboard(period),
        queryFn: () => reportService.getDashboard(period),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useDailyBooking = (period = 'last_30_days') => {
    return useQuery({
        queryKey: reportKeys.dailyBooking(period),
        queryFn: () => reportService.getDailyBooking(period),
        staleTime: 5 * 60 * 1000,
    });
};

export const useMonthlyRevenue = (period = 'last_12_months') => {
    return useQuery({
        queryKey: reportKeys.monthlyRevenue(period),
        queryFn: () => reportService.getMonthlyRevenue(period),
        staleTime: 5 * 60 * 1000,
    });
};

export const useTopServices = (period = 'last_30_days', limit = 10) => {
    return useQuery({
        queryKey: reportKeys.topServices(period, limit),
        queryFn: () => reportService.getTopServices(period, limit),
        staleTime: 5 * 60 * 1000,
    });
};

export const useCustomerEngagement = (period = 'last_30_days') => {
    return useQuery({
        queryKey: reportKeys.customerEngagement(period),
        queryFn: () => reportService.getCustomerEngagement(period),
        staleTime: 5 * 60 * 1000,
    });
};

export const useProviderPerformance = (period = 'last_30_days') => {
    return useQuery({
        queryKey: reportKeys.providerPerformance(period),
        queryFn: () => reportService.getProviderPerformance(period),
        staleTime: 5 * 60 * 1000,
    });
};

export const useUserAnalytics = (userId, period = null, startDate = null, endDate = null) => {
    return useQuery({
        queryKey: reportKeys.userAnalytics(userId, period, startDate, endDate),
        queryFn: () => reportService.getUserAnalytics(userId, period, startDate, endDate),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useProviderAnalytics = (providerId, period = null, startDate = null, endDate = null) => {
    return useQuery({
        queryKey: reportKeys.providerAnalytics(providerId, period, startDate, endDate),
        queryFn: () => reportService.getProviderAnalytics(providerId, period, startDate, endDate),
        enabled: !!providerId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useServiceAnalytics = (serviceId, period = null, startDate = null, endDate = null) => {
    return useQuery({
        queryKey: reportKeys.serviceAnalytics(serviceId, period, startDate, endDate),
        queryFn: () => reportService.getServiceAnalytics(serviceId, period, startDate, endDate),
        enabled: !!serviceId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useRevenueReport = (filters = {}) => {
    return useQuery({
        queryKey: reportKeys.revenue(filters),
        queryFn: () => reportService.getRevenueReport(filters),
        staleTime: 5 * 60 * 1000,
    });
};
