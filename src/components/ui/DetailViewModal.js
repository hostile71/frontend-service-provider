import React from 'react';
import { X, User, Calendar, MapPin, DollarSign, Star, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useLocalization } from '../../contexts/LocalizationContext';
import StatusBadge from './StatusBadge';
import RatingStars from './RatingStars';

const DetailViewModal = ({ isOpen, onClose, item, type }) => {
  const { t, currentLanguage, isRTL } = useLocalization();

  if (!isOpen || !item) return null;

  const getModalTitle = () => {
    switch (type) {
      case 'user':
      case 'customer':
        return `${t('customer')} Details`;
      case 'provider':
        return `${t('serviceProvider')} Details`;
      case 'service':
        return `${t('serviceName')} Details`;
      case 'booking':
        return `Booking Details`;
      case 'category':
        return `${t('category')} Details`;
      case 'payment':
        return `Payment Details`;
      case 'notification':
        return `Notification Details`;
      case 'banner':
        return `Banner Details`;
      case 'translation':
        return `Translation Details`;
      case 'admin-user':
        return `Admin User Details`;
      case 'content':
        return `Content Details`;
      default:
        return `Item Details`;
    }
  };

  const renderUserDetails = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Basic Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">{t('name')}</label>
            <p className="text-gray-900 font-medium">{item.name || item.customer || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('email')}</label>
            <p className="text-gray-900">{item.email || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('phone')}</label>
            <p className="text-gray-900">{item.phone || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('status')}</label>
            <div className="mt-1">
              <StatusBadge status={item.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {(item.totalBookings || item.totalSpent || item.completedServices || item.rating) && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Statistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {item.totalBookings && (
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{item.totalBookings}</p>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>
            )}
            {item.totalSpent && (
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{item.totalSpent} OMR</p>
                <p className="text-sm text-gray-600">Total Spent</p>
              </div>
            )}
            {item.completedServices && (
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{item.completedServices}</p>
                <p className="text-sm text-gray-600">Completed Services</p>
              </div>
            )}
            {item.rating && (
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  <RatingStars rating={item.rating} />
                </div>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="space-y-4">
        {item.address && (
          <div>
            <label className="text-sm font-medium text-gray-500 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Address
            </label>
            <p className="text-gray-900 mt-1">{item.address}</p>
          </div>
        )}
        {item.joinDate && (
          <div>
            <label className="text-sm font-medium text-gray-500 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Join Date
            </label>
            <p className="text-gray-900 mt-1">{item.joinDate}</p>
          </div>
        )}
        {(item.specialization || item.companyName || item.experience) && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Professional Information</h4>
            <div className="space-y-3">
              {item.companyName && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Company Name</label>
                  <p className="text-gray-900">{item.companyName}</p>
                </div>
              )}
              {item.specialization && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Specialization</label>
                  <p className="text-gray-900">{item.specialization}</p>
                </div>
              )}
              {item.experience && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Experience</label>
                  <p className="text-gray-900">{item.experience}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderServiceDetails = () => (
    <div className="space-y-6">
      {/* Service Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Service Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Service Name</label>
            <p className="text-gray-900 font-medium">{item.name || item.service || item.serviceName || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('category')}</label>
            <p className="text-gray-900">{item.category || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('provider')}</label>
            <p className="text-gray-900">{item.provider || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('status')}</label>
            <div className="mt-1">
              <StatusBadge status={item.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing & Duration */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Pricing & Duration
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {item.price && (
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{item.price} OMR</p>
              <p className="text-sm text-gray-600">Price</p>
            </div>
          )}
          {item.duration && (
            <div className="text-center">
              <p className="text-lg font-semibold text-blue-600">{item.duration}</p>
              <p className="text-sm text-gray-600">Duration</p>
            </div>
          )}
          {item.bookings && (
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{item.bookings}</p>
              <p className="text-sm text-gray-600">Total Bookings</p>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <div>
          <label className="text-sm font-medium text-gray-500">Description</label>
          <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">{item.description}</p>
        </div>
      )}

      {/* Rating */}
      {item.rating && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Customer Rating
          </h4>
          <div className="flex items-center space-x-4">
            <RatingStars rating={item.rating} />
            <span className="text-lg font-semibold">{item.rating}/5</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderBookingDetails = () => (
    <div className="space-y-6">
      {/* Booking Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Booking Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">{t('customer')}</label>
            <p className="text-gray-900 font-medium">{item.customer || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Service</label>
            <p className="text-gray-900">{item.service || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('provider')}</label>
            <p className="text-gray-900">{item.provider || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('status')}</label>
            <div className="mt-1">
              <StatusBadge status={item.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Schedule & Location */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Schedule & Location
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Date</label>
            <p className="text-gray-900">{item.date || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Time</label>
            <p className="text-gray-900">{item.time || '-'}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-500 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Location
            </label>
            <p className="text-gray-900">{item.location || '-'}</p>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Payment Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Amount</label>
            <p className="text-gray-900 font-semibold text-lg">{item.amount} OMR</p>
          </div>
          {item.duration && (
            <div>
              <label className="text-sm font-medium text-gray-500">Duration</label>
              <p className="text-gray-900">{item.duration}</p>
            </div>
          )}
        </div>
      </div>

      {/* Rating & Review */}
      {(item.rating || item.review) && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Customer Feedback
          </h4>
          {item.rating && (
            <div className="flex items-center space-x-4 mb-3">
              <RatingStars rating={item.rating} />
              <span className="text-lg font-semibold">{item.rating}/5</span>
            </div>
          )}
          {item.review && (
            <div>
              <label className="text-sm font-medium text-gray-500">Review</label>
              <p className="text-gray-900 mt-1 p-3 bg-white rounded border">{item.review}</p>
            </div>
          )}
        </div>
      )}

      {/* Additional Information */}
      {(item.description || item.notes || item.requestDate) && (
        <div className="space-y-4">
          {item.description && (
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">{item.description}</p>
            </div>
          )}
          {item.notes && (
            <div>
              <label className="text-sm font-medium text-gray-500">Notes</label>
              <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">{item.notes}</p>
            </div>
          )}
          {item.requestDate && (
            <div>
              <label className="text-sm font-medium text-gray-500">Request Date</label>
              <p className="text-gray-900">{item.requestDate}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderPaymentDetails = () => (
    <div className="space-y-6">
      {/* Payment Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Payment Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Transaction ID</label>
            <p className="text-gray-900 font-mono">{item.transactionId || item.id || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Amount</label>
            <p className="text-gray-900 font-semibold text-xl text-green-600">{item.amount} OMR</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Payment Method</label>
            <p className="text-gray-900">{item.paymentMethod || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('status')}</label>
            <div className="mt-1">
              <StatusBadge status={item.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Service Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">{t('customer')}</label>
            <p className="text-gray-900">{item.customer || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Service</label>
            <p className="text-gray-900">{item.service || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('provider')}</label>
            <p className="text-gray-900">{item.provider || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Payment Date</label>
            <p className="text-gray-900">{item.paymentDate || item.date || '-'}</p>
          </div>
        </div>
      </div>

      {/* Commission Details */}
      {(item.commission || item.providerPayout) && (
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Commission Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {item.commission && (
              <div>
                <label className="text-sm font-medium text-gray-500">Commission</label>
                <p className="text-gray-900 font-semibold">{item.commission} OMR</p>
              </div>
            )}
            {item.providerPayout && (
              <div>
                <label className="text-sm font-medium text-gray-500">Provider Payout</label>
                <p className="text-gray-900 font-semibold">{item.providerPayout} OMR</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderNotificationDetails = () => (
    <div className="space-y-6">
      {/* Notification Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Notification Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Title</label>
            <p className="text-gray-900 font-medium">{item.title || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Type</label>
            <p className="text-gray-900">{item.type || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Priority</label>
            <p className="text-gray-900">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.priority === 'High' ? 'bg-red-100 text-red-800' :
                item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {item.priority}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('status')}</label>
            <div className="mt-1">
              <StatusBadge status={item.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Content</h4>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Message (English)</label>
            <p className="text-gray-900 mt-1 p-3 bg-white rounded border">{item.message || '-'}</p>
          </div>
          {item.messageAr && (
            <div>
              <label className="text-sm font-medium text-gray-500">Message (Arabic)</label>
              <p className="text-gray-900 mt-1 p-3 bg-white rounded border" dir="rtl">{item.messageAr}</p>
            </div>
          )}
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Delivery Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Recipient</label>
            <p className="text-gray-900">{item.recipient || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Sent Date</label>
            <p className="text-gray-900">{item.sentDate || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Read Rate</label>
            <p className="text-gray-900 font-semibold">{item.readRate || 0}%</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTranslationDetails = () => (
    <div className="space-y-6">
      {/* Translation Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Translation Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Translation Key</label>
            <p className="text-gray-900 font-mono bg-white px-2 py-1 rounded border">{item.key || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Category</label>
            <p className="text-gray-900">{item.category || '-'}</p>
          </div>
          {item.status && (
            <div>
              <label className="text-sm font-medium text-gray-500">{t('status')}</label>
              <div className="mt-1">
                <StatusBadge status={item.status} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Translations */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Translations</h4>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">English</label>
            <p className="text-gray-900 mt-1 p-3 bg-white rounded border">{item.english || '-'}</p>
          </div>
          {item.arabic && (
            <div>
              <label className="text-sm font-medium text-gray-500">Arabic</label>
              <p className="text-gray-900 mt-1 p-3 bg-white rounded border" dir="rtl">{item.arabic}</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Information */}
      {(item.description || item.context || item.notes) && (
        <div className="space-y-4">
          {item.description && (
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">{item.description}</p>
            </div>
          )}
          {item.context && (
            <div>
              <label className="text-sm font-medium text-gray-500">Context</label>
              <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">{item.context}</p>
            </div>
          )}
          {item.notes && (
            <div>
              <label className="text-sm font-medium text-gray-500">Notes</label>
              <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">{item.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderBannerDetails = () => (
    <div className="space-y-6">
      {/* Banner Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Banner Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Title</label>
            <p className="text-gray-900 font-medium">{item.title || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Type</label>
            <p className="text-gray-900">{item.type || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Position</label>
            <p className="text-gray-900">{item.position || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('status')}</label>
            <div className="mt-1">
              <StatusBadge status={item.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Banner Content */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Content</h4>
        <div className="space-y-4">
          {item.image && (
            <div>
              <label className="text-sm font-medium text-gray-500">Image</label>
              <div className="mt-1">
                <img src={item.image} alt="Banner" className="max-w-full h-32 object-cover rounded border" />
              </div>
            </div>
          )}
          {item.description && (
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-900 mt-1 p-3 bg-white rounded border">{item.description}</p>
            </div>
          )}
          {item.link && (
            <div>
              <label className="text-sm font-medium text-gray-500">Link</label>
              <p className="text-gray-900 mt-1 p-3 bg-white rounded border">{item.link}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCategoryDetails = () => (
    <div className="space-y-6">
      {/* Category Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Category Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">{t('name')}</label>
            <p className="text-gray-900 font-medium">{item.name || '-'}</p>
          </div>
          {item.nameAr && (
            <div>
              <label className="text-sm font-medium text-gray-500">Name (Arabic)</label>
              <p className="text-gray-900 font-medium" dir="rtl">{item.nameAr}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-500">Service Count</label>
            <p className="text-gray-900 font-semibold text-xl text-blue-600">{item.serviceCount || 0}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('status')}</label>
            <div className="mt-1">
              <StatusBadge status={item.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
          <p className="text-gray-900">{item.description}</p>
        </div>
      )}

      {/* Category Icon/Image */}
      {item.icon && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Category Icon</h4>
          <div className="flex items-center">
            <img src={item.icon} alt="Category Icon" className="w-16 h-16 object-cover rounded border" />
          </div>
        </div>
      )}
    </div>
  );

  const renderGenericDetails = () => (
    <div className="space-y-6">
      {Object.entries(item).map(([key, value]) => {
        if (key === 'id' || value === null || value === undefined) return null;
        
        return (
          <div key={key} className="border-b border-gray-200 pb-3 last:border-b-0">
            <label className="text-sm font-medium text-gray-500 capitalize">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
            <div className="mt-1">
              {key.includes('status') ? (
                <StatusBadge status={value} />
              ) : key.includes('rating') && typeof value === 'number' ? (
                <RatingStars rating={value} />
              ) : key.includes('price') || key.includes('amount') ? (
                <p className="text-gray-900 font-semibold">{value} OMR</p>
              ) : (
                <p className="text-gray-900">{value}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'user':
      case 'customer':
      case 'provider':
        return renderUserDetails();
      case 'service':
        return renderServiceDetails();
      case 'booking':
        return renderBookingDetails();
      case 'payment':
        return renderPaymentDetails();
      case 'notification':
        return renderNotificationDetails();
      case 'translation':
        return renderTranslationDetails();
      case 'banner':
        return renderBannerDetails();
      case 'category':
        return renderCategoryDetails();
      default:
        return renderGenericDetails();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-900">{getModalTitle()}</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailViewModal;
