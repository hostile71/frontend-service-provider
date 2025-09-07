import React, { useState, useMemo, createContext, useContext } from 'react';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  FileText, 
  Grid3X3,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Bell,
  Menu,
  X,
  ChevronDown,
  Calendar,
  MapPin,
  Star,
  Clock,
  DollarSign,
  TrendingUp,
  UserCheck,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Camera,
  Globe,
  Lock,
  Mail,
  Phone,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Localization Context
const LocalizationContext = createContext();

// Language translations
const translations = {
  en: {
    // Header & Navigation
    appName: "Better Dashboard",
    dashboard: "Dashboard",
    userManagement: "User Management",
    serviceProviders: "Service Providers",
    serviceManagement: "Service Management",
    categories: "Categories",
    bookingManagement: "Booking Management",
    contentManagement: "Content Management",
    reportsAnalytics: "Reports & Analytics",
    adminUsers: "Admin Users",
    settings: "Settings",
    
    // Dashboard
    dashboardOverview: "Dashboard Overview",
    totalBookings: "Total Bookings",
    activeUsers: "Active Users",
    monthlyRevenue: "Monthly Revenue",
    activeServices: "Active Services",
    completedBookings: "Completed Bookings",
    averageRating: "Average Rating",
    recentBookings: "Recent Bookings",
    topServices: "Top Services",
    
    // Common Actions
    search: "Search",
    filter: "Filter",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    save: "Save",
    cancel: "Cancel",
    update: "Update",
    actions: "Actions",
    
    // Status
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    inProgress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
    
    // User Management
    customerManagement: "Customer Management",
    serviceProviderManagement: "Service Provider Management",
    name: "Name",
    email: "Email",
    phone: "Phone",
    role: "Role",
    status: "Status",
    joinDate: "Join Date",
    totalSpent: "Total Spent",
    rating: "Rating",
    customer: "Customer",
    serviceProvider: "Service Provider",
    superAdmin: "Super Admin",
    manager: "Manager",
    support: "Support",
    
    // Services
    serviceName: "Service Name",
    category: "Category",
    provider: "Provider",
    price: "Price",
    duration: "Duration",
    bookings: "Bookings",
    description: "Description",
    
    // Profile
    profileSettings: "Profile Settings",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm New Password",
    updateProfile: "Update Profile",
    logout: "Logout",
    
    // Reports
    totalRevenue: "Total Revenue",
    dailyBookingReport: "Daily Booking Report",
    monthlyRevenueReport: "Monthly Revenue Report",
    topServicesReport: "Top Services Report",
    customerEngagement: "Customer Engagement",
    providerPerformance: "Provider Performance",
    generateReport: "Generate Report",
    exportExcel: "Export to Excel",
    exportCSV: "Export to CSV",
    
    // Time periods
    last7Days: "Last 7 days",
    last30Days: "Last 30 days",
    last3Months: "Last 3 months",
    customRange: "Custom Range",
    
    // Form fields
    firstName: "First Name",
    lastName: "Last Name",
    address: "Address",
    city: "City",
    zipCode: "ZIP Code",
    country: "Country",
    website: "Website",
    companyName: "Company Name",
    specialization: "Specialization",
    experience: "Years of Experience",
    
    // Misc
    noResults: "No results found",
    language: "Language",
    currency: "Currency",
    maintenanceMode: "Maintenance Mode",
    saveSettings: "Save Settings",
    fromLastMonth: "from last month",
    addNew: "Add New",
    createNew: "Create New"
  },
  ar: {
    // Header & Navigation
    appName: "لوحة تحكم أفضل",
    dashboard: "لوحة القيادة",
    userManagement: "إدارة المستخدمين",
    serviceProviders: "مقدمو الخدمات",
    serviceManagement: "إدارة الخدمات",
    categories: "الفئات",
    bookingManagement: "إدارة الحجوزات",
    contentManagement: "إدارة المحتوى",
    reportsAnalytics: "التقارير والتحليلات",
    adminUsers: "المستخدمون الإداريون",
    settings: "الإعدادات",
    
    // Dashboard
    dashboardOverview: "نظرة عامة على لوحة القيادة",
    totalBookings: "إجمالي الحجوزات",
    activeUsers: "المستخدمون النشطون",
    monthlyRevenue: "الإيرادات الشهرية",
    activeServices: "الخدمات النشطة",
    completedBookings: "الحجوزات المكتملة",
    averageRating: "متوسط التقييم",
    recentBookings: "الحجوزات الأخيرة",
    topServices: "أفضل الخدمات",
    
    // Common Actions
    search: "بحث",
    filter: "تصفية",
    add: "إضافة",
    edit: "تعديل",
    delete: "حذف",
    view: "عرض",
    save: "حفظ",
    cancel: "إلغاء",
    update: "تحديث",
    actions: "الإجراءات",
    
    // Status
    active: "نشط",
    inactive: "غير نشط",
    pending: "قيد الانتظار",
    inProgress: "قيد التنفيذ",
    completed: "مكتمل",
    cancelled: "ملغي",
    
    // User Management
    customerManagement: "إدارة العملاء",
    serviceProviderManagement: "إدارة مقدمي الخدمات",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    role: "الدور",
    status: "الحالة",
    joinDate: "تاريخ التسجيل",
    totalSpent: "إجمالي المصروفات",
    rating: "التقييم",
    customer: "عميل",
    serviceProvider: "مقدم خدمة",
    superAdmin: "مدير عام",
    manager: "مدير",
    support: "الدعم الفني",
    
    // Services
    serviceName: "اسم الخدمة",
    category: "الفئة",
    provider: "المقدم",
    price: "السعر",
    duration: "المدة",
    bookings: "الحجوزات",
    description: "الوصف",
    
    // Profile
    profileSettings: "إعدادات الملف الشخصي",
    currentPassword: "كلمة المرور الحالية",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور الجديدة",
    updateProfile: "تحديث الملف الشخصي",
    logout: "تسجيل الخروج",
    
    // Reports
    totalRevenue: "إجمالي الإيرادات",
    dailyBookingReport: "تقرير الحجوزات اليومية",
    monthlyRevenueReport: "تقرير الإيرادات الشهرية",
    topServicesReport: "تقرير أفضل الخدمات",
    customerEngagement: "تفاعل العملاء",
    providerPerformance: "أداء مقدمي الخدمات",
    generateReport: "إنشاء التقرير",
    exportExcel: "تصدير إلى Excel",
    exportCSV: "تصدير إلى CSV",
    
    // Time periods
    last7Days: "آخر 7 أيام",
    last30Days: "آخر 30 يوماً",
    last3Months: "آخر 3 أشهر",
    customRange: "نطاق مخصص",
    
    // Form fields
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    address: "العنوان",
    city: "المدينة",
    zipCode: "الرمز البريدي",
    country: "البلد",
    website: "الموقع الإلكتروني",
    companyName: "اسم الشركة",
    specialization: "التخصص",
    experience: "سنوات الخبرة",
    
    // Misc
    noResults: "لا توجد نتائج",
    language: "اللغة",
    currency: "العملة",
    maintenanceMode: "وضع الصيانة",
    saveSettings: "حفظ الإعدادات",
    fromLastMonth: "من الشهر الماضي",
    addNew: "إضافة جديد",
    createNew: "إنشاء جديد"
  }
};

// Localization Hook
const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within LocalizationProvider');
  }
  return context;
};

// Localization Provider
const LocalizationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const t = (key) => {
    return translations[currentLanguage][key] || key;
  };

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    document.documentElement.lang = lang;
  };

  const value = {
    currentLanguage,
    t,
    changeLanguage
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

const ServicePlatformAdmin = () => {
  const { t, currentLanguage, changeLanguage } = useLocalization();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerms, setSearchTerms] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  // Sample data
  const [users] = useState([
    { id: 1, name: 'Ahmed Al-Rashid', email: 'ahmed@example.com', phone: '+968 9123 4567', role: t('customer'), status: t('active'), joinDate: '2024-01-15', totalBookings: 12, totalSpent: 450 },
    { id: 2, name: 'Sarah Mohammed', email: 'sarah@example.com', phone: '+968 9234 5678', role: t('serviceProvider'), status: t('active'), joinDate: '2024-02-20', completedServices: 89, rating: 4.8 },
    { id: 3, name: 'Omar Hassan', email: 'omar@example.com', phone: '+968 9345 6789', role: t('customer'), status: t('inactive'), joinDate: '2024-03-10', totalBookings: 3, totalSpent: 120 },
  ]);

  const [services] = useState([
    { id: 1, name: 'House Cleaning', nameAr: 'تنظيف المنازل', category: 'Home Services', provider: 'CleanCorp', price: 25, duration: '2-3 hours', rating: 4.5, bookings: 45, status: t('active') },
    { id: 2, name: 'Plumbing Repair', nameAr: 'إصلاح السباكة', category: 'Home Services', provider: 'FixIt Pro', price: 35, duration: '1-2 hours', rating: 4.7, bookings: 32, status: t('active') },
    { id: 3, name: 'AC Maintenance', nameAr: 'صيانة التكييف', category: 'Home Services', provider: 'CoolTech', price: 40, duration: '1 hour', rating: 4.6, bookings: 28, status: t('pending') },
  ]);

  const [categories] = useState([
    { id: 1, name: 'Home Services', nameAr: 'الخدمات المنزلية', serviceCount: 45, status: t('active'), description: 'All home-related services' },
    { id: 2, name: 'Beauty & Wellness', nameAr: 'الجمال والعافية', serviceCount: 23, status: t('active'), description: 'Beauty and wellness services' },
    { id: 3, name: 'Automotive', nameAr: 'خدمات السيارات', serviceCount: 12, status: t('active'), description: 'Car maintenance and repair' },
  ]);

  const [bookings] = useState([
    { 
      id: 1, 
      customer: 'Ahmed Al-Rashid', 
      provider: 'CleanCorp', 
      service: 'House Cleaning', 
      date: '2024-08-15', 
      time: '10:00 AM',
      location: 'Muscat, Al Khuwair',
      status: t('completed'), 
      amount: 25,
      duration: '2 hours',
      rating: 5
    },
    { 
      id: 2, 
      customer: 'Sarah Mohammed', 
      provider: 'FixIt Pro', 
      service: 'Plumbing Repair', 
      date: '2024-08-16', 
      time: '2:00 PM',
      location: 'Muscat, Qurum',
      status: t('inProgress'), 
      amount: 35,
      duration: '1.5 hours',
      rating: null
    },
    { 
      id: 3, 
      customer: 'Omar Hassan', 
      provider: 'CoolTech', 
      service: 'AC Maintenance', 
      date: '2024-08-17', 
      time: '9:00 AM',
      location: 'Muscat, Ruwi',
      status: t('pending'), 
      amount: 40,
      duration: '1 hour',
      rating: null
    },
  ]);

  const handleAddClick = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const stats = useMemo(() => ({
    totalUsers: users.length,
    totalCustomers: users.filter(u => u.role === t('customer')).length,
    totalProviders: users.filter(u => u.role === t('serviceProvider')).length,
    totalServices: services.length,
    totalBookings: bookings.length,
    completedBookings: bookings.filter(b => b.status === t('completed')).length,
    pendingBookings: bookings.filter(b => b.status === t('pending')).length,
    inProgressBookings: bookings.filter(b => b.status === t('inProgress')).length,
    totalRevenue: bookings.reduce((sum, booking) => sum + booking.amount, 0),
    monthlyRevenue: bookings.filter(b => b.date.startsWith('2024-08')).reduce((sum, booking) => sum + booking.amount, 0),
    averageRating: services.reduce((sum, service) => sum + service.rating, 0) / services.length,
    activeServices: services.filter(s => s.status === t('active')).length,
  }), [users, services, bookings, t]);

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: BarChart3 },
    { id: 'users', label: t('userManagement'), icon: Users },
    { id: 'providers', label: t('serviceProviders'), icon: UserCheck },
    { id: 'services', label: t('serviceManagement'), icon: Grid3X3 },
    { id: 'categories', label: t('categories'), icon: Package },
    { id: 'bookings', label: t('bookingManagement'), icon: Calendar },
    { id: 'content', label: t('contentManagement'), icon: FileText },
    { id: 'reports', label: t('reportsAnalytics'), icon: BarChart3 },
    { id: 'admin-users', label: t('adminUsers'), icon: Shield },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  // Filter function for search
  const filterData = (data, searchTerm, searchFields) => {
    if (!searchTerm) return data;
    return data.filter(item => 
      searchFields.some(field => 
        item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  // Modal Component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md max-h-screen overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    );
  };

  // Add Item Modal
  const AddItemModal = ({ isOpen, onClose, type }) => {
    const getModalTitle = () => {
      switch (type) {
        case 'user': return `${t('addNew')} ${t('customer')}`;
        case 'provider': return `${t('addNew')} ${t('serviceProvider')}`;
        case 'service': return `${t('addNew')} ${t('serviceName')}`;
        case 'category': return `${t('addNew')} ${t('category')}`;
        case 'admin-user': return `${t('addNew')} Admin User`;
        case 'content': return `${t('addNew')} Content`;
        default: return `${t('addNew')} Item`;
      }
    };

    const renderForm = () => {
      switch (type) {
        case 'user':
        case 'provider':
          return (
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('firstName')}</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('lastName')}</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('email')}</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('phone')}</label>
                <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('address')}</label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows="2"></textarea>
              </div>
              {type === 'provider' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('companyName')}</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('specialization')}</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option>Home Services</option>
                        <option>Beauty & Wellness</option>
                        <option>Automotive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('experience')}</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option>0-1 years</option>
                        <option>2-5 years</option>
                        <option>5+ years</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </form>
          );
        case 'service':
          return (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('serviceName')} (English)</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('serviceName')} (Arabic)</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" dir="rtl" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('category')}</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Home Services</option>
                    <option>Beauty & Wellness</option>
                    <option>Automotive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('price')} (OMR)</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('duration')}</label>
                <input type="text" placeholder="e.g., 1-2 hours" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('description')}</label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
              </div>
            </form>
          );
        case 'category':
          return (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('name')} (English)</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('name')} (Arabic)</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" dir="rtl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('description')}</label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <input type="file" accept="image/*" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </form>
          );
        default:
          return (
            <div className="text-center py-8 text-gray-500">
              Form for {type} will be implemented here
            </div>
          );
      }
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()}>
        {renderForm()}
        <div className={`flex justify-end space-x-3 pt-4 mt-6 border-t`}>
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {t('cancel')}
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('save')}
          </button>
        </div>
      </Modal>
    );
  };

  // Profile Settings Modal
  const ProfileSettingsModal = ({ isOpen, onClose }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={t('profileSettings')}>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('name')}</label>
          <input 
            type="text" 
            defaultValue="Rabius Sani" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('email')}</label>
          <input 
            type="email" 
            defaultValue="admin@serviceapp.com" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('phone')}</label>
          <input 
            type="tel" 
            defaultValue="+968 77057472" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('currentPassword')}</label>
          <input 
            type="password" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('newPassword')}</label>
          <input 
            type="password" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('confirmPassword')}</label>
          <input 
            type="password" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className={`flex justify-end space-x-3 pt-4`}>
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {t('cancel')}
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('updateProfile')}
          </button>
        </div>
      </form>
    </Modal>
  );

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      [t('active')]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [t('inactive')]: { color: 'bg-red-100 text-red-800', icon: XCircle },
      [t('pending')]: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      [t('inProgress')]: { color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
      [t('completed')]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [t('cancelled')]: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      purple: 'bg-purple-50 text-purple-600',
      red: 'bg-red-50 text-red-600',
    };

    return (
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <p className="text-xs text-green-600 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {change}% {t('fromLastMonth')}
              </p>
            )}
          </div>
          <div className={`p-2 md:p-3 rounded-lg flex-shrink-0 ${colorClasses[color]}`}>
            <Icon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
        </div>
      </div>
    );
  };

  const RatingStars = ({ rating, size = 'sm' }) => {
    const sizeClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-4 md:space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title={t('totalBookings')} value={stats.totalBookings} change={12} icon={Calendar} color="blue" />
        <StatCard title={t('activeUsers')} value={stats.totalUsers} change={8} icon={Users} color="green" />
        <StatCard title={t('monthlyRevenue')} value={`${stats.monthlyRevenue} OMR`} change={15} icon={DollarSign} color="purple" />
        <StatCard title={t('activeServices')} value={stats.activeServices} change={5} icon={Grid3X3} color="yellow" />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatCard title={t('serviceProviders')} value={stats.totalProviders} icon={UserCheck} color="blue" />
        <StatCard title={t('completedBookings')} value={stats.completedBookings} icon={CheckCircle} color="green" />
        <StatCard title={t('averageRating')} value={stats.averageRating.toFixed(1)} icon={Star} color="yellow" />
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Bookings */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">{t('recentBookings')}</h3>
          <div className="space-y-4">
            {bookings.slice(0, 5).map(booking => (
              <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 last:border-b-0 space-y-2 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <p className="font-medium text-sm truncate">{booking.service}</p>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    {booking.customer} • {booking.date} at {booking.time}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{booking.location}</span>
                  </div>
                </div>
                <div className={`text-right flex-shrink-0 ml-4`}>
                  <p className="font-semibold text-sm">{booking.amount} OMR</p>
                  {booking.rating && <RatingStars rating={booking.rating} />}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top Services */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">{t('topServices')}</h3>
          <div className="space-y-4">
            {services
              .sort((a, b) => b.bookings - a.bookings)
              .slice(0, 5)
              .map(service => (
                <div key={service.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className={`w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-3`}>
                      <Grid3X3 className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">
                        {currentLanguage === 'ar' && service.nameAr ? service.nameAr : service.name}
                      </p>
                      <div className="flex items-center mt-1 flex-wrap">
                        <RatingStars rating={service.rating} />
                        <span className={`text-xs text-gray-500 ml-2`}>
                          {service.bookings} {t('bookings')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-sm">{service.price} OMR</p>
                    <StatusBadge status={service.status} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTable = (data, columns, title, onAdd, searchFields = ['name', 'email', 'title']) => {
    const searchTerm = searchTerms[activeTab] || '';
    const filteredData = filterData(data, searchTerm, searchFields);

    // Create a mapping function to get the correct field value for each column
    const getFieldValue = (item, columnName) => {
      // Direct field mappings
      const fieldMappings = {
        // User fields
        [t('name')]: 'name',
        [t('email')]: 'email',
        [t('phone')]: 'phone',
        [t('role')]: 'role',
        [t('status')]: 'status',
        [t('joinDate')]: 'joinDate',
        [t('totalSpent')]: 'totalSpent',
        [t('totalBookings')]: 'totalBookings',
        'Completed Services': 'completedServices',
        [t('rating')]: 'rating',
        
        // Service fields
        [t('serviceName')]: 'name',
        [t('category')]: 'category',
        [t('provider')]: 'provider',
        [t('price')]: 'price',
        [t('duration')]: 'duration',
        [t('bookings')]: 'bookings',
        
        // Category fields
        'Service Count': 'serviceCount',
        [t('description')]: 'description',
        
        // Booking fields
        [t('customer')]: 'customer',
        'Service': 'service',
        'Date': 'date',
        'Time': 'time',
        'Location': 'location',
        'Amount': 'amount'
      };

      const fieldKey = fieldMappings[columnName];
      return fieldKey ? item[fieldKey] : null;
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className={`flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto`}>
              <div className="relative flex-1 sm:flex-none">
                <Search className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 left-3`} />
                <input
                  type="text"
                  placeholder={`${t('search')}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerms({...searchTerms, [activeTab]: e.target.value})}
                  className={`w-full sm:w-48 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10 pr-4`}
                />
              </div>
              <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap">
                <Filter className={`w-4 h-4 mr-2`} />
                {t('filter')}
              </button>
              {onAdd && (
                <button 
                  onClick={onAdd}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
                >
                  <Plus className={`w-4 h-4 mr-2`} />
                  {t('add')} {title.split(' ')[0]}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className="px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                    {column}
                  </th>
                ))}
                <th className="px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column, cellIndex) => {
                    const value = getFieldValue(item, column);
                    const fieldKey = column.toLowerCase().replace(/\s+/g, '');
                    
                    return (
                      <td key={cellIndex} className="px-4 md:px-6 py-4 text-left">
                        {fieldKey.includes('status') || column === t('status') ? (
                          <StatusBadge status={value} />
                        ) : fieldKey.includes('price') || fieldKey.includes('amount') || column === t('price') || column === 'Amount' ? (
                          <span className="font-medium">{value} OMR</span>
                        ) : fieldKey.includes('rating') || column === t('rating') ? (
                          value && <RatingStars rating={value} />
                        ) : column === t('name') || column === t('serviceName') ? (
                          <span className="text-sm text-gray-900">
                            {currentLanguage === 'ar' && item.nameAr ? item.nameAr : (value || '-')}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-900">{value || '-'}</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 md:px-6 py-4 text-left">
                    <div className="flex items-center space-x-1 md:space-x-2 justify-start">
                      <button className="p-1.5 md:p-2 text-gray-400 hover:text-blue-600 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 md:p-2 text-gray-400 hover:text-green-600 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 md:p-2 text-gray-400 hover:text-red-600 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? `${t('noResults')} "${searchTerm}"` : 'No data available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderReports = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <h2 className="text-xl font-semibold">{t('reportsAnalytics')}</h2>
          <div className={`flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto`}>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>{t('last7Days')}</option>
              <option>{t('last30Days')}</option>
              <option>{t('last3Months')}</option>
              <option>{t('customRange')}</option>
            </select>
            <button className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Download className={`w-4 h-4 mr-2`} />
              {t('exportExcel')}
            </button>
            <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className={`w-4 h-4 mr-2`} />
              {t('exportCSV')}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="text-center p-4 md:p-6 border rounded-lg bg-blue-50">
            <div className="text-2xl md:text-3xl font-bold text-blue-600">{stats.totalRevenue}</div>
            <div className="text-sm text-gray-600 mt-1">{t('totalRevenue')} (OMR)</div>
          </div>
          <div className="text-center p-4 md:p-6 border rounded-lg bg-green-50">
            <div className="text-2xl md:text-3xl font-bold text-green-600">{stats.completedBookings}</div>
            <div className="text-sm text-gray-600 mt-1">{t('completedBookings')}</div>
          </div>
          <div className="text-center p-4 md:p-6 border rounded-lg bg-purple-50">
            <div className="text-2xl md:text-3xl font-bold text-purple-600">{stats.totalCustomers}</div>
            <div className="text-sm text-gray-600 mt-1">{t('activeUsers')}</div>
          </div>
          <div className="text-center p-4 md:p-6 border rounded-lg bg-yellow-50">
            <div className="text-2xl md:text-3xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600 mt-1">{t('averageRating')}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <h3 className="font-semibold mb-2">{t('dailyBookingReport')}</h3>
            <p className="text-sm text-gray-600 mb-3">Track daily booking trends and patterns</p>
            <button className="text-blue-600 text-sm hover:underline">{t('generateReport')}</button>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <h3 className="font-semibold mb-2">{t('monthlyRevenueReport')}</h3>
            <p className="text-sm text-gray-600 mb-3">Monthly revenue breakdown by services</p>
            <button className="text-blue-600 text-sm hover:underline">{t('generateReport')}</button>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <h3 className="font-semibold mb-2">{t('topServicesReport')}</h3>
            <p className="text-sm text-gray-600 mb-3">Most popular services and providers</p>
            <button className="text-blue-600 text-sm hover:underline">{t('generateReport')}</button>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <h3 className="font-semibold mb-2">{t('customerEngagement')}</h3>
            <p className="text-sm text-gray-600 mb-3">User activity and engagement metrics</p>
            <button className="text-blue-600 text-sm hover:underline">{t('generateReport')}</button>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <h3 className="font-semibold mb-2">{t('providerPerformance')}</h3>
            <p className="text-sm text-gray-600 mb-3">Service provider ratings and statistics</p>
            <button className="text-blue-600 text-sm hover:underline">{t('generateReport')}</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-4">{t('settings')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">App Name</label>
            <input type="text" defaultValue="Service Platform" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('language')}</label>
            <select 
              value={currentLanguage}
              onChange={(e) => changeLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('currency')}</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="OMR">OMR (Omani Rial)</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMS Gateway</label>
            <input type="text" placeholder="SMS API Key" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Firebase FCM Key</label>
            <input type="text" placeholder="FCM Server Key" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="maintenance" className="mr-2" />
            <label htmlFor="maintenance" className="text-sm text-gray-700">{t('maintenanceMode')}</label>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {t('saveSettings')}
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderTable(
          users.filter(u => u.role === t('customer')), 
          [t('name'), t('email'), t('phone'), t('totalBookings'), t('totalSpent'), t('status'), t('joinDate')], 
          t('customerManagement'), 
          () => handleAddClick('user'),
          ['name', 'email', 'phone']
        );
      case 'providers':
        return renderTable(
          users.filter(u => u.role === t('serviceProvider')), 
          [t('name'), t('email'), t('phone'), 'Completed Services', t('rating'), t('status')], 
          t('serviceProviderManagement'), 
          () => handleAddClick('provider'),
          ['name', 'email', 'phone']
        );
      case 'services':
        return renderTable(
          services, 
          [t('serviceName'), t('category'), t('provider'), t('price'), t('duration'), t('rating'), t('bookings'), t('status')], 
          t('serviceManagement'), 
          () => handleAddClick('service'),
          ['name', 'nameAr', 'category', 'provider']
        );
      case 'categories':
        return renderTable(
          categories, 
          [t('name'), 'Service Count', t('status'), t('description')], 
          t('categories'), 
          () => handleAddClick('category'),
          ['name', 'nameAr', 'description']
        );
      case 'bookings':
        return renderTable(
          bookings, 
          [t('customer'), 'Service', t('provider'), 'Date', 'Time', 'Location', t('status'), 'Amount'], 
          t('bookingManagement'),
          null,
          ['customer', 'service', 'provider', 'location']
        );
      case 'content':
        return renderTable(
          [], 
          ['Type', 'Title', t('status'), 'Position'], 
          t('contentManagement'), 
          () => handleAddClick('content'),
          ['type', 'title', 'titleAr']
        );
      case 'reports':
        return renderReports();
      case 'admin-users':
        return renderTable(
          [], 
          [t('name'), t('email'), t('role'), 'Last Login', t('status'), 'Permissions'], 
          t('adminUsers'), 
          () => handleAddClick('admin-user'),
          ['name', 'email', 'role']
        );
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex flex-col bg-white shadow-lg transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="flex items-center justify-between p-4 border-b">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold text-gray-800">{t('appName')}</h1>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
        
        <nav className="mt-4 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <Icon className={`w-5 h-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                {!sidebarCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">{t('appName')}</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-4 md:px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-3"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold capitalize truncate">
                {activeTab === 'dashboard' ? t('dashboardOverview') : 
                 activeTab === 'admin-users' ? t('adminUsers') :
                 menuItems.find(item => item.id === activeTab)?.label || activeTab}
              </h2>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Language Switcher */}
              <button 
                onClick={() => changeLanguage(currentLanguage === 'en' ? 'ar' : 'en')}
                className="p-2 text-gray-400 hover:text-gray-600 flex items-center"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:block ml-1">
                  {currentLanguage === 'en' ? 'عربي' : 'EN'}
                </span>
              </button>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">RS</span>
                  </div>
                  <div className="text-sm hidden sm:block">
                    <p className="font-medium">Rabius Sani</p>
                    <p className="text-gray-500 text-xs">{t('superAdmin')}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                </button>
                
                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="profile-menu w-48 bg-white rounded-lg shadow-lg border">
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowProfileSettings(true);
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        {t('profileSettings')}
                      </button>
                      <button
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {t('logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderContent()}
        </main>
      </div>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Click outside to close profile menu */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setShowProfileMenu(false)}
        />
      )}

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
    </div>
  );
};

// Main App Component with Localization Provider
const App = () => {
  return (
    <LocalizationProvider>
      <ServicePlatformAdmin />
    </LocalizationProvider>
  );
};

export default App;