/**
 * User Detail Modal Component
 * 
 * Displays detailed information about a user (customer/provider)
 * Fetches data from API when opened
 */

import React from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, Shield, Building, Award, TrendingUp } from 'lucide-react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useUser as useUserContext } from '../../contexts/UserContext';
import { useUser as useUserQuery } from '../../hooks/useUsers';
import StatusBadge from './StatusBadge';

const UserDetailModal = ({ isOpen, onClose, userId, userType }) => {
  const { t } = useLocalization();
  const { assetUrl } = useUserContext();
  
  // Fetch user data from API
  const { data: userData, isLoading, error } = useUserQuery(userId, {
    enabled: isOpen && !!userId,
  });

  if (!isOpen) return null;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading user details: {error.message}</p>
        </div>
      );
    }

    if (!userData) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">No user data found</p>
        </div>
      );
    }

    const user = userData.data || userData;
    const profileImageUrl = user.profile_picture ? `${assetUrl}/${user.profile_picture}` : null;

    return (
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r ">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center border-4 border-white shadow-lg"
                style={{ display: profileImageUrl ? 'none' : 'flex' }}
              >
                <User className="h-12 w-12 text-gray-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-gray-600 mt-1">
                {user.identification_number || 'No ID number'}
              </p>
              <div className="mt-2">
                <StatusBadge status={user.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Basic Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                {t('email')}
              </label>
              <p className="text-gray-900 mt-1">{user.email || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                {t('phone')}
              </label>
              <p className="text-gray-900 mt-1">{user.mobile_no || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                User Type
              </label>
              <p className="text-gray-900 mt-1 capitalize">
                {user.type || userType || '-'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Join Date
              </label>
              <p className="text-gray-900 mt-1">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Address Information */}
        {user.address && (
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Address Information
            </h4>
            <p className="text-gray-900">{user.address}</p>
          </div>
        )}

        {/* Provider-specific Information */}
        {userType === 'provider' && (
          <>
            {(user.company_name || user.business_license) && (
              <div className="bg-purple-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-purple-600" />
                  Business Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.company_name && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company Name</label>
                      <p className="text-gray-900 mt-1">{user.company_name}</p>
                    </div>
                  )}
                  {user.business_license && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Business License</label>
                      <p className="text-gray-900 mt-1">{user.business_license}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(user.specialization || user.experience || user.certifications) && (
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-green-600" />
                  Professional Information
                </h4>
                <div className="space-y-3">
                  {user.specialization && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Specialization</label>
                      <p className="text-gray-900 mt-1">{user.specialization}</p>
                    </div>
                  )}
                  {user.experience && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Experience</label>
                      <p className="text-gray-900 mt-1">{user.experience}</p>
                    </div>
                  )}
                  {user.certifications && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Certifications</label>
                      <p className="text-gray-900 mt-1">{user.certifications}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Role Information */}
        {user.role && (
          <div className="bg-indigo-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-indigo-600" />
              Role Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Role Name</label>
                <p className="text-gray-900 mt-1">{user.role.role_name || '-'}</p>
              </div>
              {user.role.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-900 mt-1">{user.role.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistics (if available) */}
        {(user.total_bookings || user.total_spent || user.completed_services || user.rating) && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
              Statistics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {user.total_bookings && (
                <div className="text-center bg-white p-4 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{user.total_bookings}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Bookings</p>
                </div>
              )}
              {user.total_spent && (
                <div className="text-center bg-white p-4 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{user.total_spent} OMR</p>
                  <p className="text-sm text-gray-600 mt-1">Total Spent</p>
                </div>
              )}
              {user.completed_services && (
                <div className="text-center bg-white p-4 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{user.completed_services}</p>
                  <p className="text-sm text-gray-600 mt-1">Completed Services</p>
                </div>
              )}
              {user.rating && (
                <div className="text-center bg-white p-4 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{user.rating}/5</p>
                  <p className="text-sm text-gray-600 mt-1">Rating</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Notes */}
        {user.notes && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Additional Notes</h4>
            <p className="text-gray-900 whitespace-pre-wrap">{user.notes}</p>
          </div>
        )}

        {/* Timestamps */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium text-gray-500">Created At</label>
              <p className="text-gray-900 mt-1">
                {user.created_at ? new Date(user.created_at).toLocaleString() : '-'}
              </p>
            </div>
            <div>
              <label className="font-medium text-gray-500">Last Updated</label>
              <p className="text-gray-900 mt-1">
                {user.updated_at ? new Date(user.updated_at).toLocaleString() : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r">
          <h3 className="text-xl font-semibold text-black">
            {userType === 'provider' ? 'Service Provider' : 'Customer'} Details
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
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

export default UserDetailModal;
