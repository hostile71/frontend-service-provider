import { STATUS_TYPES, USER_ROLES } from '../constants';

export const mockUsers = [
  { 
    id: 1, 
    name: 'Ahmed Al-Rashid', 
    email: 'ahmed@example.com', 
    phone: '+968 9123 4567', 
    role: USER_ROLES.CUSTOMER, 
    status: STATUS_TYPES.ACTIVE, 
    joinDate: '2024-01-15', 
    totalBookings: 12, 
    totalSpent: 450 
  },
  { 
    id: 2, 
    name: 'Sarah Mohammed', 
    email: 'sarah@example.com', 
    phone: '+968 9234 5678', 
    role: USER_ROLES.SERVICE_PROVIDER, 
    status: STATUS_TYPES.ACTIVE, 
    joinDate: '2024-02-20', 
    completedServices: 89, 
    rating: 4.8 
  },
  { 
    id: 3, 
    name: 'Omar Hassan', 
    email: 'omar@example.com', 
    phone: '+968 9345 6789', 
    role: USER_ROLES.CUSTOMER, 
    status: STATUS_TYPES.INACTIVE, 
    joinDate: '2024-03-10', 
    totalBookings: 3, 
    totalSpent: 120 
  },
];

export const mockServices = [
  { 
    id: 1, 
    name: 'House Cleaning', 
    nameAr: 'تنظيف المنازل', 
    category: 'Home Services', 
    provider: 'CleanCorp', 
    price: 25, 
    duration: '2-3 hours', 
    rating: 4.5, 
    bookings: 45, 
    status: STATUS_TYPES.ACTIVE 
  },
  { 
    id: 2, 
    name: 'Plumbing Repair', 
    nameAr: 'إصلاح السباكة', 
    category: 'Home Services', 
    provider: 'FixIt Pro', 
    price: 35, 
    duration: '1-2 hours', 
    rating: 4.7, 
    bookings: 32, 
    status: STATUS_TYPES.ACTIVE 
  },
  { 
    id: 3, 
    name: 'AC Maintenance', 
    nameAr: 'صيانة التكييف', 
    category: 'Home Services', 
    provider: 'CoolTech', 
    price: 40, 
    duration: '1 hour', 
    rating: 4.6, 
    bookings: 28, 
    status: STATUS_TYPES.PENDING 
  },
];

export const mockCategories = [
  { 
    id: 1, 
    name: 'Home Services', 
    nameAr: 'الخدمات المنزلية', 
    serviceCount: 45, 
    status: STATUS_TYPES.ACTIVE, 
    description: 'All home-related services' 
  },
  { 
    id: 2, 
    name: 'Beauty & Wellness', 
    nameAr: 'الجمال والعافية', 
    serviceCount: 23, 
    status: STATUS_TYPES.ACTIVE, 
    description: 'Beauty and wellness services' 
  },
  { 
    id: 3, 
    name: 'Automotive', 
    nameAr: 'خدمات السيارات', 
    serviceCount: 12, 
    status: STATUS_TYPES.ACTIVE, 
    description: 'Car maintenance and repair' 
  },
];

export const mockBookings = [
  { 
    id: 1, 
    customer: 'Ahmed Al-Rashid', 
    provider: 'CleanCorp', 
    service: 'House Cleaning', 
    date: '2024-08-15', 
    time: '10:00 AM',
    location: 'Muscat, Al Khuwair',
    status: STATUS_TYPES.COMPLETED, 
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
    status: STATUS_TYPES.IN_PROGRESS, 
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
    status: STATUS_TYPES.PENDING, 
    amount: 40,
    duration: '1 hour',
    rating: null
  },
];
