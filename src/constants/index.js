import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  FileText, 
  Grid3X3,
  Calendar,
  UserCheck,
  Package,
  ChevronDown,
  ChevronRight,
  User,
  UserPlus,
  Building,
  Star,
  CreditCard,
  MapPin,
  Briefcase,
  TrendingUp,
  PieChart,
  FileBarChart,
  Globe,
  Lock,
  Bell,
  Palette,
  Clock,
  CheckCircle
} from 'lucide-react';

export const MENU_ITEMS = [
  { 
    id: 'dashboard', 
    labelKey: 'dashboard', 
    icon: BarChart3,
    path: 'dashboard'
  },
  { 
    id: 'user-management', 
    labelKey: 'userManagement', 
    icon: Users,
    children: [
      { id: 'users', labelKey: 'customers', icon: User, path: 'users' },
      { id: 'providers', labelKey: 'serviceProviders', icon: UserCheck, path: 'providers' },
      { id: 'admin-users', labelKey: 'adminUsers', icon: Shield, path: 'admin-users' }
    ]
  },
  { 
    id: 'services', 
    labelKey: 'serviceManagement', 
    icon: Grid3X3,
    children: [
      { id: 'service-list', labelKey: 'allServices', icon: Briefcase, path: 'services' },
      { id: 'categories', labelKey: 'categories', icon: Package, path: 'categories' },
      // { id: 'service-requests', labelKey: 'serviceRequests', icon: FileText, path: 'service-requests' }
    ]
  },
  { 
    id: 'bookings', 
    labelKey: 'bookingManagement', 
    icon: Calendar,
    children: [
      { id: 'all-bookings', labelKey: 'allBookings', icon: Calendar, path: 'bookings' },
      { id: 'pending-bookings', labelKey: 'pendingBookings', icon: Clock, path: 'pending-bookings' },
      { id: 'completed-bookings', labelKey: 'completedBookings', icon: CheckCircle, path: 'completed-bookings' }
    ]
  },
  { 
    id: 'reports', 
    labelKey: 'reportsAnalytics', 
    icon: BarChart3,
    children: [
      { id: 'dashboard-reports', labelKey: 'dashboardReports', icon: PieChart, path: 'reports' },
      { id: 'user-analytics', labelKey: 'userAnalytics', icon: Users, path: 'user-analytics' },
      { id: 'revenue-reports', labelKey: 'revenueReports', icon: TrendingUp, path: 'revenue-reports' },
      { id: 'service-analytics', labelKey: 'serviceAnalytics', icon: FileBarChart, path: 'service-analytics' }
    ]
  },
  // { 
  //   id: 'content', 
  //   labelKey: 'contentManagement', 
  //   icon: FileText,
  //   children: [
  //     { id: 'pages', labelKey: 'pages', icon: FileText, path: 'content' },
  //     { id: 'banners', labelKey: 'banners', icon: Palette, path: 'banners' },
  //     { id: 'notifications', labelKey: 'notifications', icon: Bell, path: 'notifications' }
  //   ]
  // },
  { 
    id: 'system', 
    labelKey: 'systemSettings', 
    icon: Settings,
    children: [
      { id: 'general-settings', labelKey: 'generalSettings', icon: Settings, path: 'settings' },
      { id: 'localization', labelKey: 'localization', icon: Globe, path: 'localization' },
      { id: 'security', labelKey: 'security', icon: Lock, path: 'security' }
    ]
  }
];

export const STATUS_TYPES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  IN_PROGRESS: 'inProgress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const USER_ROLES = {
  CUSTOMER: 'customer',
  SERVICE_PROVIDER: 'serviceProvider',
  SUPER_ADMIN: 'superAdmin',
  MANAGER: 'manager',
  SUPPORT: 'support'
};

export const CURRENCIES = {
  OMR: 'OMR',
  USD: 'USD'
};

export const LANGUAGES = {
  EN: 'en',
  AR: 'ar'
};

export const STATUS_CONFIG = {
  active: { color: 'bg-green-100 text-green-800' },
  inactive: { color: 'bg-red-100 text-red-800' },
  pending: { color: 'bg-yellow-100 text-yellow-800' },
  inProgress: { color: 'bg-blue-100 text-blue-800' },
  completed: { color: 'bg-green-100 text-green-800' },
  cancelled: { color: 'bg-red-100 text-red-800' }
};

export const STAT_CARD_COLORS = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  purple: 'bg-purple-50 text-purple-600',
  red: 'bg-red-50 text-red-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  orange: 'bg-orange-50 text-orange-600',
  teal: 'bg-teal-50 text-teal-600',
  pink: 'bg-pink-50 text-pink-600',
  gray: 'bg-gray-50 text-gray-600'
};
