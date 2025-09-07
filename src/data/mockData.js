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
  { 
    id: 4, 
    name: 'Laila Saeed', 
    email: 'laila@example.com',
    phone: '+968 9456 7890',
    role: USER_ROLES.SUPER_ADMIN,
    status: STATUS_TYPES.ACTIVE,
    joinDate: '2024-04-05',
    totalBookings: 20,
    totalSpent: 800
  },
  {
    id: 5,
    name: 'Khalid Yousuf',
    email: 'khalid@example.com',
    phone: '+968 9567 8901',
    role: USER_ROLES.MANAGER,
    status: STATUS_TYPES.ACTIVE,
    joinDate: '2024-05-10',
    totalBookings: 15,
    totalSpent: 600
  }
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
  {
    id: 4,
    name: 'Haircut & Styling',
    nameAr: 'قص وتصفيف الشعر',
    category: 'Beauty & Wellness',
    provider: 'Glamour Salon',
    price: 30,
    duration: '1 hour',
    rating: 4.8,
    bookings: 50,
    status: STATUS_TYPES.ACTIVE
  },
  {
    id: 5,
    name: 'Car Oil Change',
    nameAr: 'تغيير زيت السيارة',
    category: 'Automotive',
    provider: 'AutoCare',
    price: 60,
    duration: '30 minutes',
    rating: 4.4,
    bookings: 20,
    status: STATUS_TYPES.ACTIVE
  },
  {
    id: 6,
    name: 'Massage Therapy',
    nameAr: 'علاج التدليك',
    category: 'Beauty & Wellness',
    provider: 'Relax Spa',
    price: 70,
    duration: '1 hour',
    rating: 4.9,
    bookings: 40,
    status: STATUS_TYPES.INACTIVE
  },
  // add more 15 services
  {
    id: 7,
    name: 'Window Cleaning',
    nameAr: 'تنظيف النوافذ',
    category: 'Home Services',
    provider: 'CleanCorp',
    price: 20,
    duration: '1-2 hours',
    rating: 4.3,
    bookings: 30,
    status: STATUS_TYPES.ACTIVE
  },
  {
    id: 8,
    name: 'Electrical Repair',
    nameAr: 'إصلاح كهربائي',
    category: 'Home Services',
    provider: 'FixIt Pro',
    price: 50,
    duration: '2 hours',
    rating: 4.5,
    bookings: 25,
    status: STATUS_TYPES.ACTIVE
  },
  {
    id: 9,
    name: 'Garden Landscaping',
    nameAr: 'تنسيق الحدائق',
    category: 'Home Services',  
    provider: 'GreenThumb',
    price: 100,
    duration: '4 hours',
    rating: 4.7,
    bookings: 15,
    status: STATUS_TYPES.PENDING
  },
  {
    id: 10,
    name: 'Facial Treatment',
    nameAr: 'علاج الوجه',
    category: 'Beauty & Wellness',
    provider: 'Glamour Salon',
    price: 45,
    duration: '1 hour',
    rating: 4.6,
    bookings: 35,
    status: STATUS_TYPES.ACTIVE
  },
  {
    id: 11,
    name: 'Manicure & Pedicure',
    nameAr: 'مانيكير وباديكير',
    category: 'Beauty & Wellness',
    provider: 'Relax Spa',
    price: 40,
    duration: '1.5 hours',
    rating: 4.8,
    bookings: 28,
    status: STATUS_TYPES.ACTIVE
  },
  {
    id: 12,
    name: 'Spa Treatment',
    nameAr: 'علاج السبا',
    category: 'Beauty & Wellness',
    provider: 'Relax Spa',
    price: 80,
    duration: '2 hours',
    rating: 4.9,
    bookings: 22,
    status: STATUS_TYPES.ACTIVE
  },
  {
    id: 13,
    name: 'Body Treatment',
    nameAr: 'علاج الجسم',
    category: 'Beauty & Wellness',
    provider: 'Relax Spa',
    price: 90,
    duration: '1.5 hours',
    rating: 4.8,
    bookings: 18,
    status: STATUS_TYPES.ACTIVE
  },
  {
    id: 14,
    name: 'Tire Rotation',
    nameAr: 'تدوير الإطارات',
    category: 'Automotive',
    provider: 'AutoCare',
    price: 25,
    duration: '30 minutes',
    rating: 4.5,
    bookings: 20,
    status: STATUS_TYPES.ACTIVE
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
  // add more 10 bookings
  {
    id: 4,
    customer: 'Laila Saeed',
    provider: 'Glamour Salon',
    service: 'Haircut & Styling',
    date: '2024-08-18',
    time: '11:00 AM',
    location: 'Muscat, Al Azaiba',
    status: STATUS_TYPES.COMPLETED,
    amount: 30, 
    duration: '1 hour',
    rating: 4.5
  },
  {
    id: 5,
    customer: 'Khalid Yousuf',
    provider: 'AutoCare',
    service: 'Car Oil Change',  
    date: '2024-08-19',
    time: '3:00 PM',
    location: 'Muscat, Al Khuwair',
    status: STATUS_TYPES.CANCELLED,
    amount: 60,
    duration: '30 minutes',
    rating: null
  },
  {
    id: 6,
    customer: 'Aisha Nasser',
    provider: 'Relax Spa',
    service: 'Massage Therapy',
    date: '2024-08-20',
    time: '1:00 PM',
    location: 'Muscat, Al Khuwair',
    status: STATUS_TYPES.PENDING,
    amount: 80,
    duration: '1 hour',
    rating: null
  },
  {
    id: 7,
    customer: 'Faisal Ahmed',
    provider: 'CleanCorp',
    service: 'Window Cleaning',
    date: '2024-08-21',
    time: '10:00 AM',
    location: 'Muscat, Al Azaiba',
    status: STATUS_TYPES.COMPLETED,
    amount: 30,
    duration: '1 hour',
    rating: 4.5
  },
];
