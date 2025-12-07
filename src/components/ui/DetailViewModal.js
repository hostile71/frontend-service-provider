import React from 'react';
import { X, User, Calendar, MapPin, DollarSign, Star, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useLocalization } from '../../contexts/LocalizationContext';
import StatusBadge from './StatusBadge';
import RatingStars from './RatingStars';
import { useUser } from '../../contexts/UserContext';
import { buildAssetUrl } from '../../utils/assetHelpers';
import { useService } from '../../hooks/useServices';
import { useCategory, useCategories } from '../../hooks/useCategories';
import { useSubcategory } from '../../hooks/useSubcategories';

const DetailViewModal = ({ isOpen, onClose, item, type }) => {
  const { t, currentLanguage, isRTL } = useLocalization();
  const { assetUrl } = useUser();

  // Fetch fresh details when an id is available for services/categories/subcategories
  // Hooks must be called unconditionally
  const serviceQuery = useService(type === 'service' ? item?.id : undefined);
  const categoryQuery = useCategory(type === 'category' ? item?.id : undefined);
  const subcategoryQuery = useSubcategory(type === 'subcategory' ? item?.id : undefined);

  // If modal is not open, don't render (but hooks are already called above)
  if (!isOpen) return null;

  const fetchedItem = (type === 'service' && serviceQuery?.data?.data)
    || (type === 'category' && categoryQuery?.data?.data)
    || (type === 'subcategory' && subcategoryQuery?.data?.data)
    || item;

  if (!fetchedItem) return null;

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
      case 'subcategory':
        return `Subcategory Details`;
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
            <p className="text-gray-900 font-medium">{fetchedItem.name || fetchedItem.customer || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('email')}</label>
            <p className="text-gray-900">{fetchedItem.email || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('phone')}</label>
            <p className="text-gray-900">{fetchedItem.phone || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('status')}</label>
            <div className="mt-1">
              <StatusBadge status={fetchedItem.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {(fetchedItem.totalBookings || fetchedItem.totalSpent || fetchedItem.completedServices || fetchedItem.rating) && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Statistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {fetchedItem.totalBookings && (
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{fetchedItem.totalBookings}</p>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>
            )}
            {fetchedItem.totalSpent && (
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{fetchedItem.totalSpent} OMR</p>
                <p className="text-sm text-gray-600">Total Spent</p>
              </div>
            )}
            {fetchedItem.completedServices && (
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{fetchedItem.completedServices}</p>
                <p className="text-sm text-gray-600">Completed Services</p>
              </div>
            )}
            {fetchedItem.rating && (
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  <RatingStars rating={fetchedItem.rating} />
                </div>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="space-y-4">
        {fetchedItem.address && (
          <div>
            <label className="text-sm font-medium text-gray-500 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Address
            </label>
            <p className="text-gray-900 mt-1">{fetchedItem.address}</p>
          </div>
        )}
        {fetchedItem.joinDate && (
          <div>
            <label className="text-sm font-medium text-gray-500 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Join Date
            </label>
            <p className="text-gray-900 mt-1">{fetchedItem.joinDate}</p>
          </div>
        )}
        {(fetchedItem.specialization || fetchedItem.companyName || fetchedItem.experience) && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Professional Information</h4>
            <div className="space-y-3">
              {fetchedItem.companyName && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Company Name</label>
                  <p className="text-gray-900">{fetchedItem.companyName}</p>
                </div>
              )}
              {fetchedItem.specialization && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Specialization</label>
                  <p className="text-gray-900">{fetchedItem.specialization}</p>
                </div>
              )}
              {fetchedItem.experience && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Experience</label>
                  <p className="text-gray-900">{fetchedItem.experience}</p>
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
      {/* Banner Image */}
      {fetchedItem.banner_image && (
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Main Image</h4>
          <div className="flex items-center justify-center">
            <img
              src={buildAssetUrl(assetUrl, fetchedItem.banner_image) || fetchedItem.banner_image}
              alt={fetchedItem.title || 'Banner'}
              className="w-full max-h-64 object-contain rounded"
            />
          </div>
        </div>
      )}
      {/* Service Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Service Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Service Name</label>
            <p className="text-gray-900 font-medium">{fetchedItem.title || fetchedItem.name || fetchedItem.service || fetchedItem.serviceName || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('category')}</label>
            <p className="text-gray-900">{fetchedItem.sub_category?.category?.name || fetchedItem.category?.name || fetchedItem.category || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Subcategory</label>
            <p className="text-gray-900">{fetchedItem.sub_category?.name || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('provider')}</label>
            <p className="text-gray-900">
              {fetchedItem.provider
                ? (typeof fetchedItem.provider === 'object'
                  ? `${fetchedItem.provider.first_name || ''} ${fetchedItem.provider.last_name || ''}`.trim() || fetchedItem.provider.email || fetchedItem.provider.company_name || '-'
                  : fetchedItem.provider)
                : '-'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Location</label>
            <p className="text-gray-900">{fetchedItem.location || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('status')}</label>
            <div className="mt-1">
              <StatusBadge status={fetchedItem.status} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Verified</label>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${fetchedItem.is_verified === 1 || fetchedItem.is_verified === true || fetchedItem.is_verified === 'true'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
                }`}>
                {fetchedItem.is_verified === 1 || fetchedItem.is_verified === true || fetchedItem.is_verified === 'true' ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Not Verified
                  </>
                )}
              </span>
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
          {fetchedItem.price && (
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{fetchedItem.price} OMR</p>
              <p className="text-sm text-gray-600">Price</p>
            </div>
          )}
          {fetchedItem.duration && (
            <div className="text-center">
              <p className="text-lg font-semibold text-blue-600">{fetchedItem.duration}</p>
              <p className="text-sm text-gray-600">Duration</p>
            </div>
          )}
          {fetchedItem.bookings && (
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{fetchedItem.bookings}</p>
              <p className="text-sm text-gray-600">Total Bookings</p>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {fetchedItem.description && (
        <div>
          <label className="text-sm font-medium text-gray-500">Description</label>
          <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">{fetchedItem.description}</p>
        </div>
      )}

      {/* Rating - Calculate average from ratings array */}
      {(() => {
        let avgRating = 0;
        let ratingsCount = 0;

        if (fetchedItem.ratings && Array.isArray(fetchedItem.ratings) && fetchedItem.ratings.length > 0) {
          const sum = fetchedItem.ratings.reduce((acc, r) => acc + parseFloat(r.rating || 0), 0);
          avgRating = sum / fetchedItem.ratings.length;
          ratingsCount = fetchedItem.ratings.length;
        } else if (fetchedItem.rating) {
          avgRating = parseFloat(fetchedItem.rating);
        }

        if (avgRating > 0) {
          return (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Customer Rating
              </h4>
              <div className="flex items-center space-x-4">
                <RatingStars rating={avgRating} />
                <span className="text-lg font-semibold">{avgRating.toFixed(1)}/5</span>
                {ratingsCount > 0 && (
                  <span className="text-sm text-gray-600">({ratingsCount} review{ratingsCount !== 1 ? 's' : ''})</span>
                )}
              </div>
              {fetchedItem.ratings && fetchedItem.ratings.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Recent Reviews:</p>
                  {fetchedItem.ratings.slice(0, 3).map((review, idx) => (
                    <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                      <div className="flex items-center space-x-2 mb-1">
                        <RatingStars rating={parseFloat(review.rating)} />
                        <span className="text-sm font-medium">{review.rating}/5</span>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }
        return null;
      })()}
      {/* Gallery Images */}
      {fetchedItem.images && fetchedItem.images.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Gallery</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {fetchedItem.images.map((img, idx) => {
              // Handle different image formats: string path, object with path/url/image_path
              const imagePath = typeof img === 'string'
                ? img
                : (img?.url || img?.path || img?.image_path || img?.image || '');
              const imageUrl = buildAssetUrl(assetUrl, imagePath) || imagePath;

              return (
                <div key={idx} className="border rounded overflow-hidden p-1 bg-white">
                  <img src={imageUrl} alt={`gallery-${idx}`} className="w-full h-32 object-cover" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderBookingDetails = () => {
    const customer = fetchedItem.customer || fetchedItem.user;
    const customerName = typeof customer === 'object' && customer !== null
      ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.name || customer.email
      : customer;

    const service = fetchedItem.service;
    const serviceName = typeof service === 'object' && service !== null
      ? service.title || service.name
      : service;

    const provider = fetchedItem.provider;
    const providerName = typeof provider === 'object' && provider !== null
      ? `${provider.first_name || ''} ${provider.last_name || ''}`.trim() || provider.name || provider.email
      : provider;

    return (
      <div className="space-y-6">
        {/* Booking Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Booking Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">{t('customer')}</label>
              <p className="text-gray-900 font-medium">{customerName || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Service</label>
              <p className="text-gray-900">{serviceName || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">{t('provider')}</label>
              <p className="text-gray-900">{providerName || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">{t('status')}</label>
              <div className="mt-1">
                <StatusBadge status={fetchedItem.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Schedule & Location */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Booking Date</label>
              <p className="text-gray-900">
                {fetchedItem.booking_date || fetchedItem.date ? (() => {
                  const dateStr = fetchedItem.booking_date || fetchedItem.date;
                  const date = new Date(dateStr);
                  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                })() : '-'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Schedule Time</label>
              <p className="text-gray-900">{fetchedItem.schedule_time || fetchedItem.time || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Mobile Number</label>
              <p className="text-gray-900">{fetchedItem.mobile_no || fetchedItem.phone || '-'}</p>
            </div>
            {fetchedItem.notes && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="text-gray-900">{fetchedItem.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Payment Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Price</label>
              <p className="text-gray-900 font-semibold">${fetchedItem.price || '0.00'}</p>
            </div>
            {fetchedItem.discount_amount > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Discount</label>
                <p className="text-gray-900 font-semibold text-orange-600">-${fetchedItem.discount_amount}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">Net Amount</label>
              <p className="text-gray-900 font-semibold text-lg text-green-600">${fetchedItem.net_amount || fetchedItem.amount || '0.00'}</p>
            </div>
          </div>
        </div>

        {/* Rating & Review */}
        {(fetchedItem.rating || fetchedItem.review) && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Customer Feedback
            </h4>
            {fetchedItem.rating && (
              <div className="flex items-center space-x-4 mb-3">
                <RatingStars rating={fetchedItem.rating} />
                <span className="text-lg font-semibold">{fetchedItem.rating}/5</span>
              </div>
            )}
            {fetchedItem.review && (
              <div>
                <label className="text-sm font-medium text-gray-500">Review</label>
                <p className="text-gray-900 mt-1 p-3 bg-white rounded border">{fetchedItem.review}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

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
            <p className="text-gray-900 font-mono">{fetchedItem.transactionId || fetchedItem.id || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Amount</label>
            <p className="text-gray-900 font-semibold text-xl text-green-600">{fetchedItem.amount} OMR</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Payment Method</label>
            <p className="text-gray-900">{fetchedItem.paymentMethod || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('status')}</label>
            <div className="mt-1">
              <StatusBadge status={fetchedItem.status} />
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
            <p className="text-gray-900">{fetchedItem.customer || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Service</label>
            <p className="text-gray-900">{fetchedItem.service || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('provider')}</label>
            <p className="text-gray-900">{fetchedItem.provider || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Payment Date</label>
            <p className="text-gray-900">{fetchedItem.paymentDate || fetchedItem.date || '-'}</p>
          </div>
        </div>
      </div>

      {/* Commission Details */}
      {(fetchedItem.commission || fetchedItem.providerPayout) && (
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Commission Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fetchedItem.commission && (
              <div>
                <label className="text-sm font-medium text-gray-500">Commission</label>
                <p className="text-gray-900 font-semibold">{fetchedItem.commission} OMR</p>
              </div>
            )}
            {fetchedItem.providerPayout && (
              <div>
                <label className="text-sm font-medium text-gray-500">Provider Payout</label>
                <p className="text-gray-900 font-semibold">{fetchedItem.providerPayout} OMR</p>
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
            <p className="text-gray-900 font-medium">{fetchedItem.title || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Type</label>
            <p className="text-gray-900">{fetchedItem.type || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Priority</label>
            <p className="text-gray-900">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${fetchedItem.priority === 'High' ? 'bg-red-100 text-red-800' :
                fetchedItem.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                {fetchedItem.priority}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('status')}</label>
            <div className="mt-1">
              <StatusBadge status={fetchedItem.status} />
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
            <p className="text-gray-900 mt-1 p-3 bg-white rounded border">{fetchedItem.message || '-'}</p>
          </div>
          {fetchedItem.messageAr && (
            <div>
              <label className="text-sm font-medium text-gray-500">Message (Arabic)</label>
              <p className="text-gray-900 mt-1 p-3 bg-white rounded border" dir="rtl">{fetchedItem.messageAr}</p>
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
            <p className="text-gray-900">{fetchedItem.recipient || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Sent Date</label>
            <p className="text-gray-900">{fetchedItem.sentDate || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Read Rate</label>
            <p className="text-gray-900 font-semibold">{fetchedItem.readRate || 0}%</p>
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
            <p className="text-gray-900 font-mono bg-white px-2 py-1 rounded border">{fetchedItem.key || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Category</label>
            <p className="text-gray-900">{fetchedItem.category || '-'}</p>
          </div>
          {fetchedItem.status && (
            <div>
              <label className="text-sm font-medium text-gray-500">{t('status')}</label>
              <div className="mt-1">
                <StatusBadge status={fetchedItem.status} />
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
            <p className="text-gray-900 mt-1 p-3 bg-white rounded border">{fetchedItem.english || '-'}</p>
          </div>
          {fetchedItem.arabic && (
            <div>
              <label className="text-sm font-medium text-gray-500">Arabic</label>
              <p className="text-gray-900 mt-1 p-3 bg-white rounded border" dir="rtl">{fetchedItem.arabic}</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Information */}
      {(fetchedItem.description || fetchedItem.context || fetchedItem.notes) && (
        <div className="space-y-4">
          {fetchedItem.description && (
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">{fetchedItem.description}</p>
            </div>
          )}
          {fetchedItem.context && (
            <div>
              <label className="text-sm font-medium text-gray-500">Context</label>
              <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">{fetchedItem.context}</p>
            </div>
          )}
          {fetchedItem.notes && (
            <div>
              <label className="text-sm font-medium text-gray-500">Notes</label>
              <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">{fetchedItem.notes}</p>
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
            <p className="text-gray-900 font-medium">{fetchedItem.title || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Type</label>
            <p className="text-gray-900">{fetchedItem.type || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Position</label>
            <p className="text-gray-900">{fetchedItem.position || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('status')}</label>
            <div className="mt-1">
              <StatusBadge status={fetchedItem.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Banner Content */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Content</h4>
        <div className="space-y-4">
          {fetchedItem.image && (
            <div>
              <label className="text-sm font-medium text-gray-500">Image</label>
              <div className="mt-1">
                <img src={fetchedItem.image} alt="Banner" className="max-w-full h-32 object-cover rounded border" />
              </div>
            </div>
          )}
          {fetchedItem.description && (
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-900 mt-1 p-3 bg-white rounded border">{fetchedItem.description}</p>
            </div>
          )}
          {fetchedItem.link && (
            <div>
              <label className="text-sm font-medium text-gray-500">Link</label>
              <p className="text-gray-900 mt-1 p-3 bg-white rounded border">{fetchedItem.link}</p>
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
            <p className="text-gray-900 font-medium">{fetchedItem.name || '-'}</p>
          </div>
          {fetchedItem.nameAr && (
            <div>
              <label className="text-sm font-medium text-gray-500">Name (Arabic)</label>
              <p className="text-gray-900 font-medium" dir="rtl">{fetchedItem.nameAr}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-500">Service Count</label>
            <p className="text-gray-900 font-semibold text-xl text-blue-600">{fetchedItem.serviceCount || 0}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('status')}</label>
            <div className="mt-1">
              <StatusBadge status={fetchedItem.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {fetchedItem.description && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
          <p className="text-gray-900">{fetchedItem.description}</p>
        </div>
      )}

      {/* Category Icon/Image */}
      {fetchedItem.icon && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Category Icon</h4>
          <div className="flex items-center">
            <img src={`${assetUrl}/${fetchedItem.icon}`} alt="Category Icon" className="w-16 h-16 object-cover rounded border" />
          </div>
        </div>
      )}
    </div>
  );

  const renderSubcategoryDetails = () => (
    <div className="space-y-6">
      {/* Subcategory Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Subcategory Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">{t('name')}</label>
            <p className="text-gray-900 font-medium">{fetchedItem.name || '-'}</p>
          </div>
          {fetchedItem.name_ar && (
            <div>
              <label className="text-sm font-medium text-gray-500">Name (Arabic)</label>
              <p className="text-gray-900 font-medium" dir="rtl">{fetchedItem.name_ar}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-500">Parent {t('category')}</label>
            <p className="text-gray-900 font-medium">{fetchedItem.category?.name || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('status')}</label>
            <div className="mt-1">
              <StatusBadge status={fetchedItem.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {fetchedItem.description && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
          <p className="text-gray-900">{fetchedItem.description}</p>
        </div>
      )}

      {/* Subcategory Icon/Image */}
      {fetchedItem.icon && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Subcategory Icon</h4>
          <div className="flex items-center">
            <img src={`${assetUrl}/${fetchedItem.icon}`} alt="Subcategory Icon" className="w-16 h-16 object-cover rounded border" />
          </div>
        </div>
      )}
    </div>
  );

  const renderGenericDetails = () => (
    <div className="space-y-6">
      {Object.entries(fetchedItem).map(([key, value]) => {
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
      case 'subcategory':
        return renderSubcategoryDetails();
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
