import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Package, Globe, Image, Bell, CreditCard, FileText, BarChart3, CalendarDays, MapPin } from 'lucide-react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';

const AddItemModal = ({ isOpen, onClose, type }) => {
  const { t, isRTL } = useLocalization();
  const { editItem, setEditItem } = useAppContext();
  const [formData, setFormData] = useState({});

  const isEditMode = editItem !== null;

  // Initialize form data when editItem changes or modal opens
  useEffect(() => {
    if (isEditMode && editItem) {
      setFormData(editItem);
    } else {
      setFormData({});
    }
  }, [editItem, isEditMode, isOpen]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically call an API to save/update the item
    console.log('Submitting form data:', formData);
    console.log('Is edit mode:', isEditMode);
    
    // Close modal and reset
    onClose();
    setEditItem(null);
    setFormData({});
  };

  // Handle modal close
  const handleClose = () => {
    onClose();
    setEditItem(null);
    setFormData({});
  };

  if (!isOpen) return null;

  const getModalIcon = () => {
    switch (type) {
      case 'user':
      case 'customer':
      case 'provider':
        return User;
      case 'service':
        return Briefcase;
      case 'category':
        return Package;
      case 'translation':
        return Globe;
      case 'banner':
        return Image;
      case 'notification':
        return Bell;
      case 'service-request':
        return FileText;
      case 'payment':
      case 'invoice':
      case 'commission':
        return CreditCard;
      case 'analytics':
      case 'report':
        return BarChart3;
      default:
        return FileText;
    }
  };

  const getModalTitle = () => {
    const prefix = isEditMode ? t('edit') : t('addNew');
    switch (type) {
      case 'user': return `${prefix} ${t('customer')}`;
      case 'customer': return `${prefix} ${t('customer')}`;
      case 'provider': return `${prefix} ${t('serviceProvider')}`;
      case 'service': return `${prefix} ${t('serviceName')}`;
      case 'category': return `${prefix} ${t('category')}`;
      case 'admin-user': return `${prefix} Admin User`;
      case 'content': return `${prefix} Content`;
      case 'translation': return `${prefix} Translation Key`;
      case 'banner': return `${prefix} Banner`;
      case 'notification': return `${prefix} Notification`;
      case 'service-request': return `${prefix} Service Request`;
      case 'booking': return `${prefix} Booking`;
      case 'payment': return `${prefix} Payment`;
      case 'invoice': return `${prefix} Invoice`;
      case 'commission': return `${prefix} Commission`;
      case 'analytics': return `${prefix} Analytics`;
      case 'report': return `${prefix} Report`;
      default: return `${prefix} Item`;
    }
  };

  const renderForm = () => {
    switch (type) {
      case 'user':
      case 'customer':
      case 'provider':
        return (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Basic Information
              </h4>
              <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('name')} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('email')} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('phone')} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="tel" 
                    placeholder="+968 9XXX XXXX"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('address')}</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    rows="2"
                    placeholder="Enter full address"
                    value={formData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {type === 'provider' && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Professional Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('companyName')}</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter company name"
                      value={formData.companyName || ''}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('specialization')} <span className="text-red-500">*</span>
                      </label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        required
                        value={formData.specialization || ''}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                      >
                        <option value="">Select specialization</option>
                        <option>Home Services</option>
                        <option>Beauty & Wellness</option>
                        <option>Automotive</option>
                        <option>Health Care</option>
                        <option>Education</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('experience')} <span className="text-red-500">*</span>
                      </label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        required
                        value={formData.experience || ''}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                      >
                        <option value="">Select experience</option>
                        <option>0-1 years</option>
                        <option>2-5 years</option>
                        <option>5-10 years</option>
                        <option>10+ years</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'service':
        return (
          <div className="space-y-6">
            {/* Service Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Service Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('serviceName')} (English) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter service name in English"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('serviceName')} (Arabic) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    dir="rtl" 
                    placeholder="أدخل اسم الخدمة بالعربية"
                    value={formData.nameAr || ''}
                    onChange={(e) => handleInputChange('nameAr', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('description')} <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    rows="3"
                    placeholder="Describe the service in detail"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Pricing & Details */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Pricing & Details
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('category')} <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      required
                      value={formData.category || ''}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                    >
                      <option value="">Select category</option>
                      <option>Home Services</option>
                      <option>Beauty & Wellness</option>
                      <option>Automotive</option>
                      <option>Health Care</option>
                      <option>Education</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('price')} (OMR) <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="0.00"
                      value={formData.price || ''}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('duration')} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g., 1-2 hours, 30 minutes, 1 day" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    value={formData.duration || ''}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'category':
        return (
          <div className="space-y-6">
            {/* Category Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Category Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('name')} (English) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter category name in English"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('name')} (Arabic) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    dir="rtl" 
                    placeholder="أدخل اسم الفئة بالعربية"
                    value={formData.nameAr || ''}
                    onChange={(e) => handleInputChange('nameAr', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('description')}</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    rows="3"
                    placeholder="Describe this category and what services it includes"
                    value={formData.categoryDescription || ''}
                    onChange={(e) => handleInputChange('categoryDescription', e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Category Media */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Category Icon
              </h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: Square image, minimum 64x64px, PNG or SVG format
                </p>
              </div>
            </div>
          </div>
        );
      case 'translation':
        return (
          <div className="space-y-6">
            {/* Translation Key Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Translation Key Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Translation Key <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g., dashboard, userManagement, settings"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    value={formData.translationKey || ''}
                    onChange={(e) => handleInputChange('translationKey', e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use camelCase format without spaces (e.g., userManagement)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.translationCategory || ''}
                    onChange={(e) => handleInputChange('translationCategory', e.target.value)}
                  >
                    <option value="">Select category (optional)</option>
                    <option value="navigation">Navigation</option>
                    <option value="forms">Forms & Inputs</option>
                    <option value="actions">Actions & Buttons</option>
                    <option value="status">Status & Messages</option>
                    <option value="content">Content & Pages</option>
                    <option value="system">System & Settings</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Translations */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Translations</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Text <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter the English translation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.englishText || ''}
                    onChange={(e) => handleInputChange('englishText', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arabic Text <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="أدخل النص العربي"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    dir="rtl"
                    value={formData.arabicText || ''}
                    onChange={(e) => handleInputChange('arabicText', e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Text will be displayed right-to-left for Arabic users
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea 
                  placeholder="Optional: Describe when and where this translation is used"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
        );
      case 'banner':
        return (
          <div className="space-y-6">
            {/* Banner Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Banner Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter banner title"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      required
                      value={formData.type || ''}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                    >
                      <option value="">Select banner type</option>
                      <option>Promotional</option>
                      <option>Announcement</option>
                      <option>Featured Service</option>
                      <option>Seasonal Offer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      required
                      value={formData.position || ''}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                    >
                      <option value="">Select position</option>
                      <option>Header</option>
                      <option>Homepage Hero</option>
                      <option>Sidebar</option>
                      <option>Footer</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    rows="3"
                    placeholder="Enter banner description"
                    value={formData.bannerDescription || ''}
                    onChange={(e) => handleInputChange('bannerDescription', e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Banner Content */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Banner Content</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Image <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 1920x400px for hero banners, JPG or PNG format
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link URL</label>
                  <input 
                    type="url" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="https://example.com"
                    value={formData.linkUrl || ''}
                    onChange={(e) => handleInputChange('linkUrl', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'notification':
        return (
          <div className="space-y-6">
            {/* Notification Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter notification title"
                    value={formData.notificationTitle || ''}
                    onChange={(e) => handleInputChange('notificationTitle', e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                      <option value="">Select notification type</option>
                      <option>System Update</option>
                      <option>Promotion</option>
                      <option>Service Alert</option>
                      <option>General Announcement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                      <option value="">Select priority</option>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Content */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Content</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (English) <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    rows="3"
                    placeholder="Enter notification message in English"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Arabic)
                  </label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    rows="3"
                    placeholder="أدخل رسالة الإشعار بالعربية"
                    dir="rtl"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        );

      case 'booking':
        return (
          <div className="space-y-8">
            {/* Booking Information Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CalendarDays className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Booking Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                  <input
                    type="text"
                    name="customer"
                    value={formData.customer || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                  <input
                    type="text"
                    name="service"
                    value={formData.service || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Enter service name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                  <input
                    type="text"
                    name="provider"
                    value={formData.provider || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Enter provider name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Enter amount"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details Section */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Additional Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Status</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'invoice':
        return (
          <div className="space-y-6">
            {/* Invoice Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Invoice Information
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Invoice Number <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="INV-2024-001"
                      value={formData.invoiceNumber || ''}
                      onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('customer')} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter customer name"
                      value={formData.customer || ''}
                      onChange={(e) => handleInputChange('customer', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter service name"
                      value={formData.service || ''}
                      onChange={(e) => handleInputChange('service', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('provider')}</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter provider name"
                      value={formData.provider || ''}
                      onChange={(e) => handleInputChange('provider', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Financial Details
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="0.00"
                      value={formData.amount || ''}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Amount</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="0.00"
                      value={formData.taxAmount || ''}
                      onChange={(e) => handleInputChange('taxAmount', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="0.00"
                      value={formData.totalAmount || ''}
                      onChange={(e) => handleInputChange('totalAmount', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                    <input 
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      value={formData.issueDate || ''}
                      onChange={(e) => handleInputChange('issueDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input 
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      value={formData.dueDate || ''}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'commission':
        return (
          <div className="space-y-6">
            {/* Commission Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Commission Information
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('provider')} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter provider name"
                      value={formData.provider || ''}
                      onChange={(e) => handleInputChange('provider', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter service name"
                      value={formData.service || ''}
                      onChange={(e) => handleInputChange('service', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Amount <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="0.00"
                      value={formData.orderAmount || ''}
                      onChange={(e) => handleInputChange('orderAmount', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="10"
                      value={formData.commissionRate || ''}
                      onChange={(e) => handleInputChange('commissionRate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Commission Amount</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="0.00"
                      value={formData.commissionAmount || ''}
                      onChange={(e) => handleInputChange('commissionAmount', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
      case 'report':
        return (
          <div className="space-y-6">
            {/* Report Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Report Configuration
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter report name"
                    value={formData.reportName || ''}
                    onChange={(e) => handleInputChange('reportName', e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.reportType || ''}
                      onChange={(e) => handleInputChange('reportType', e.target.value)}
                    >
                      <option value="">Select report type</option>
                      <option value="revenue">Revenue Report</option>
                      <option value="user">User Analytics</option>
                      <option value="service">Service Analytics</option>
                      <option value="performance">Performance Report</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.period || ''}
                      onChange={(e) => handleInputChange('period', e.target.value)}
                    >
                      <option value="">Select period</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('description')}</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    rows="3"
                    placeholder="Enter report description"
                    value={formData.reportDescription || ''}
                    onChange={(e) => handleInputChange('reportDescription', e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        );

      case 'service-request':
        return (
          <div className="space-y-6">
            {/* Service Request Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Service Request Information
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('customer')} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter customer name"
                      value={formData.customer || ''}
                      onChange={(e) => handleInputChange('customer', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter service name"
                      value={formData.service || ''}
                      onChange={(e) => handleInputChange('service', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.urgency || ''}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                    >
                      <option value="">Select urgency</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter location"
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="0.00"
                      value={formData.estimatedCost || ''}
                      onChange={(e) => handleInputChange('estimatedCost', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('description')}</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    rows="3"
                    placeholder="Describe the service request in detail"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            {/* Payment Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Information
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment ID <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter payment ID"
                      value={formData.paymentId || ''}
                      onChange={(e) => handleInputChange('paymentId', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter customer name"
                      value={formData.customer || ''}
                      onChange={(e) => handleInputChange('customer', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="0.00"
                      value={formData.amount || ''}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.paymentMethod || ''}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    >
                      <option value="">Select method</option>
                      <option value="Cash">Cash</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Online Payment">Online Payment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.status || ''}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      <option value="">Select status</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Date</label>
                    <input 
                      type="datetime-local" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      value={formData.transactionDate || ''}
                      onChange={(e) => handleInputChange('transactionDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter reference number"
                      value={formData.referenceNumber || ''}
                      onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    rows="3"
                    placeholder="Additional payment notes"
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        );

      case 'booking':
        return (
          <div className="space-y-6">
            {/* Booking Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CalendarDays className="w-5 h-5 mr-2" />
                Booking Information
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking ID <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter booking ID"
                      value={formData.bookingId || ''}
                      onChange={(e) => handleInputChange('bookingId', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter customer name"
                      value={formData.customer || ''}
                      onChange={(e) => handleInputChange('customer', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter service name"
                      value={formData.service || ''}
                      onChange={(e) => handleInputChange('service', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Provider</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter provider name"
                      value={formData.provider || ''}
                      onChange={(e) => handleInputChange('provider', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Booking Date</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      value={formData.bookingDate || ''}
                      onChange={(e) => handleInputChange('bookingDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input 
                      type="time" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      value={formData.time || ''}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.status || ''}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      <option value="">Select status</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter service location"
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="0.00"
                      value={formData.totalAmount || ''}
                      onChange={(e) => handleInputChange('totalAmount', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    rows="3"
                    placeholder="Any special instructions for the booking"
                    value={formData.specialInstructions || ''}
                    onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Form for {type} will be implemented here</p>
          </div>
        );
    }
  };

  const Icon = getModalIcon();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <Icon className="w-6 h-6 mr-3 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900">{getModalTitle()}</h3>
          </div>
          <button 
            onClick={handleClose} 
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
            {renderForm()}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button 
              type="button" 
              onClick={handleClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {t('cancel')}
            </button>
            <button 
              type="submit"
              className="px-6 py-2 btn-theme-primary rounded-lg transition-colors"
            >
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
