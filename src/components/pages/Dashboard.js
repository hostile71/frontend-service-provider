import React from 'react';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Grid3X3, 
  UserCheck, 
  CheckCircle, 
  Star, 
  MapPin,
  TrendingUp,
  Activity,
  Clock,
  ArrowUpRight,
  AlertCircle,
  Eye,
  MessageSquare
} from 'lucide-react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useStats } from '../../hooks/useStats';
import { mockBookings, mockServices } from '../../data/mockData';
import StatCard from '../ui/StatCard';
import StatusBadge from '../ui/StatusBadge';
import RatingStars from '../ui/RatingStars';

const Dashboard = () => {
  const { t, currentLanguage, isRTL } = useLocalization();
  const { themeConfig } = useTheme();
  const stats = useStats();

  // Calculate growth percentages and trends
  const growthData = {
    bookingsGrowth: 12.5,
    usersGrowth: 8.3,
    revenueGrowth: 15.2,
    servicesGrowth: 5.1,
    providersGrowth: 7.8,
    completionRate: 94.2,
    avgResponseTime: '12 min'
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className={`bg-gradient-to-r ${themeConfig.gradient} rounded-xl p-6 text-white`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              {t('welcome')} Dashboard
            </h1>
            <p className="text-blue-100 text-lg">
              {t('todayOverview')} • {new Date().toLocaleDateString(currentLanguage === 'ar' ? 'ar-OM' : 'en-OM')}
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex space-x-3">
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Eye className="w-4 h-4 inline mr-2" />
              {t('viewReports')}
            </button>
                        <button className="bg-white text-theme-primary hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <ArrowUpRight className="w-4 h-4 inline mr-2" />
              {t('quickActions')}
            </button>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t('totalBookings')} 
          value={stats.totalBookings} 
          change={growthData.bookingsGrowth} 
          icon={Calendar} 
          color="blue"
          trend="up"
          subtitle={`${stats.pendingBookings} pending`}
        />
        <StatCard 
          title={t('activeUsers')} 
          value={stats.totalUsers} 
          change={growthData.usersGrowth} 
          icon={Users} 
          color="green"
          trend="up"
          subtitle={`${stats.totalCustomers} customers`}
        />
        <StatCard 
          title={t('monthlyRevenue')} 
          value={`${stats.monthlyRevenue}`} 
          change={growthData.revenueGrowth} 
          icon={DollarSign} 
          color="purple"
          trend="up"
          subtitle="OMR this month"
          prefix="OMR"
        />
        <StatCard 
          title={t('activeServices')} 
          value={stats.activeServices} 
          change={growthData.servicesGrowth} 
          icon={Grid3X3} 
          color="yellow"
          trend="up"
          subtitle={`${stats.totalServices} total services`}
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t('serviceProviders')} 
          value={stats.totalProviders} 
          change={growthData.providersGrowth}
          icon={UserCheck} 
          color="indigo"
          trend="up"
          subtitle="Active providers"
        />
        <StatCard 
          title={t('completedBookings')} 
          value={stats.completedBookings} 
          change={growthData.completionRate}
          icon={CheckCircle} 
          color="green"
          trend="up"
          subtitle="Success rate 94.2%"
        />
        <StatCard 
          title={t('averageRating')} 
          value={stats.averageRating.toFixed(1)} 
          change={2.3}
          icon={Star} 
          color="yellow"
          trend="up"
          subtitle="Customer satisfaction"
        />
        <StatCard 
          title="Response Time" 
          value={growthData.avgResponseTime}
          change={-15.2}
          icon={Clock} 
          color="orange"
          trend="down"
          subtitle="Avg response time"
        />
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Activity */}
        <div className="bg-theme-card p-6 rounded-lg shadow-sm border-theme-border border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-theme-text">{t('todayActivity')}</h3>
            <Activity className="w-5 h-5 text-theme-text-secondary" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-theme-text-secondary">New Bookings</span>
              <span className="font-semibold text-theme-primary">+8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-theme-text-secondary">Completed Services</span>
              <span className="font-semibold text-green-600">+12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-theme-text-secondary">New Providers</span>
              <span className="font-semibold text-purple-600">+3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-theme-text-secondary">Customer Reviews</span>
              <span className="font-semibold text-yellow-600">+15</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-theme-card p-6 rounded-lg shadow-sm border-theme-border border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-theme-text">Quick Stats</h3>
            <TrendingUp className="w-5 h-5 text-theme-text-secondary" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-theme-text-secondary">Conversion Rate</span>
              <span className="font-semibold text-green-600">12.8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-theme-text-secondary">Avg. Booking Value</span>
              <span className="font-semibold text-theme-primary">42 OMR</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-theme-text-secondary">Customer Retention</span>
              <span className="font-semibold text-purple-600">87.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-theme-text-secondary">Platform Uptime</span>
              <span className="font-semibold text-green-600">99.9%</span>
            </div>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-theme-card p-6 rounded-lg shadow-sm border-theme-border border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-theme-text">Alerts</h3>
            <AlertCircle className="w-5 h-5 text-theme-text-secondary" />
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium">3 pending reviews</p>
              <p className="text-xs text-yellow-600">Requires admin attention</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">New provider applications</p>
              <p className="text-xs text-blue-600">5 pending approvals</p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">System update completed</p>
              <p className="text-xs text-green-600">All services running normally</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Bookings */}
        <div className="bg-theme-card p-4 md:p-6 rounded-lg shadow-sm border-theme-border border">
          <h3 className="text-lg font-semibold mb-4 text-theme-text">{t('recentBookings')}</h3>
          <div className="space-y-4">
            {mockBookings.slice(0, 5).map(booking => (
              <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-theme-border last:border-b-0 space-y-2 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <p className="font-medium text-sm truncate text-theme-text">{booking.service}</p>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="text-xs text-theme-text-secondary mt-1 truncate">
                    {booking.customer} • {booking.date} at {booking.time}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-theme-text-secondary">
                    <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{booking.location}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-semibold text-sm text-theme-text">{booking.amount} OMR</p>
                  {booking.rating && <RatingStars rating={booking.rating} />}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top Services */}
        <div className="bg-theme-card p-4 md:p-6 rounded-lg shadow-sm border-theme-border border">
          <h3 className="text-lg font-semibold mb-4 text-theme-text">{t('topServices')}</h3>
          <div className="space-y-4">
            {mockServices
              .sort((a, b) => b.bookings - a.bookings)
              .slice(0, 5)
              .map(service => (
                <div key={service.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-3">
                      <Grid3X3 className="w-4 h-4 md:w-5 md:h-5 text-theme-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate text-theme-text">
                        {currentLanguage === 'ar' && service.nameAr ? service.nameAr : service.name}
                      </p>
                      <div className="flex items-center mt-1 flex-wrap">
                        <RatingStars rating={service.rating} />
                        <span className="text-xs text-theme-text-secondary ml-2">
                          {service.bookings} {t('bookings')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-sm text-theme-text">{service.price} OMR</p>
                    <StatusBadge status={service.status} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
