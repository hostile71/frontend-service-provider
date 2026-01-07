import React, { useState, useEffect } from 'react';
import { Upload, X, Loader2, User, Lock } from 'lucide-react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useUser } from '../../contexts/UserContext';
import { useUpdateProfile } from '../../hooks/useUser';
import { useToast } from '../../contexts/ToastContext';
import { buildAssetUrl } from '../../utils/assetHelpers';
import Modal from './Modal';

const ProfileSettingsModal = ({ isOpen, onClose }) => {
  const { t } = useLocalization();
  const { profile, profileLoading, assetUrl } = useUser();
  const updateProfileMutation = useUpdateProfile();
  const toast = useToast();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_no: '',
    identification_number: '',
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Load profile data when modal opens
  useEffect(() => {
    if (isOpen && profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        mobile_no: profile.mobile_no || '',
        identification_number: profile.identification_number || '',
        current_password: '',
        password: '',
        password_confirmation: '',
      });
      
      // Set existing profile picture preview using global assetUrl
      const profilePicUrl = buildAssetUrl(assetUrl, profile.profile_picture);
      setProfilePicturePreview(profilePicUrl);
    }
  }, [isOpen, profile, assetUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(jpeg|png|jpg|gif|webp)/)) {
        setErrors(prev => ({
          ...prev,
          profile_picture: 'Please select a valid image file (JPEG, PNG, JPG, GIF, WEBP)'
        }));
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2048 * 1024) {
        setErrors(prev => ({
          ...prev,
          profile_picture: 'File size must be less than 2MB'
        }));
        return;
      }

      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
      setErrors(prev => ({
        ...prev,
        profile_picture: undefined
      }));
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    // Reset to original profile picture using global assetUrl
    const profilePicUrl = buildAssetUrl(assetUrl, profile?.profile_picture);
    setProfilePicturePreview(profilePicUrl);
  };

  const validateForm = () => {
    const newErrors = {};

    // Password validation
    if (formData.password || formData.current_password) {
      if (!formData.current_password) {
        newErrors.current_password = 'Current password is required to change password';
      }
      if (formData.password && formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      // Create FormData for file upload
      const data = new FormData();
      
      // Only append changed fields
      if (formData.first_name !== profile?.first_name) {
        data.append('first_name', formData.first_name);
      }
      if (formData.last_name !== profile?.last_name) {
        data.append('last_name', formData.last_name);
      }
      if (formData.mobile_no !== profile?.mobile_no) {
        data.append('mobile_no', formData.mobile_no);
      }
      if (formData.identification_number !== profile?.identification_number) {
        data.append('identification_number', formData.identification_number);
      }

      // Password fields - always send if user wants to change password
      if (formData.password || formData.current_password) {
        if (formData.current_password) {
          data.append('current_password', formData.current_password);
        }
        if (formData.password) {
          data.append('password', formData.password);
        }
        if (formData.password_confirmation) {
          data.append('password_confirmation', formData.password_confirmation);
        }
      }

      // Profile picture
      if (profilePicture) {
        data.append('profile_picture', profilePicture);
      }

      await updateProfileMutation.mutateAsync(data);
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        current_password: '',
        password: '',
        password_confirmation: '',
      }));
      setProfilePicture(null);
      
      // Show success toast
      toast.success('Profile updated successfully!');
      
      onClose();
    } catch (error) {
      console.error('Profile update error:', error);
      
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        const formattedErrors = {};
        
        // Handle both array format and string format
        Object.keys(backendErrors).forEach(key => {
          const errorValue = backendErrors[key];
          // If error is array (e.g., ["The password is incorrect."]), take first item
          // If error is string, use it directly
          formattedErrors[key] = Array.isArray(errorValue) ? errorValue[0] : errorValue;
        });
        
        console.log('📝 Formatted errors:', formattedErrors);
        setErrors(formattedErrors);
        toast.error('Please fix the validation errors');
      } else if (error.response?.data?.message) {
        // Show general error message
        toast.error(error.response.data.message);
      } else {
        // Generic error
        toast.error('Failed to update profile. Please try again.');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Profile" size="lg">
      <form onSubmit={handleSubmit}>
        {/* Profile Picture Section - Centered at Top */}
        <div className="flex flex-col items-center pb-6 mb-6 border-b border-gray-200">
          <div className="relative group">
            {profilePicturePreview ? (
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg group-hover:border-blue-200 transition-all">
                <img 
                  src={profilePicturePreview} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
                {profilePicture && (
                  <button
                    type="button"
                    onClick={removeProfilePicture}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors z-10"
                    title="Remove photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center border-4 border-blue-100 shadow-lg">
                <User className="w-12 h-12 text-blue-400" />
              </div>
            )}
          </div>
          <label className="mt-4 cursor-pointer inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            <Upload className="w-4 h-4 mr-2" />
            Change Photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 mt-2">JPG, PNG, GIF or WEBP • Max 2MB</p>
          {errors.profile_picture && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
              {errors.profile_picture}
            </p>
          )}
        </div>

        {/* Personal Information Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <User className="w-4 h-4 text-gray-600 mr-2" />
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Personal Information</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Enter first name"
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.first_name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={profileLoading || updateProfileMutation.isPending}
              />
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-1.5"></span>
                  {errors.first_name}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Enter last name"
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.last_name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={profileLoading || updateProfileMutation.isPending}
              />
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-1.5"></span>
                  {errors.last_name}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobile_no"
                value={formData.mobile_no}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.mobile_no ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={profileLoading || updateProfileMutation.isPending}
              />
              {errors.mobile_no && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-1.5"></span>
                  {errors.mobile_no}
                </p>
              )}
            </div>

            {/* Identification Number */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                ID Number
              </label>
              <input
                type="text"
                name="identification_number"
                value={formData.identification_number}
                onChange={handleInputChange}
                placeholder="Enter ID number"
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.identification_number ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={profileLoading || updateProfileMutation.isPending}
              />
              {errors.identification_number && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-1.5"></span>
                  {errors.identification_number}
                </p>
              )}
            </div>

            {/* Email - Full Width */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={profile?.email || ''}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                  disabled
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  Read-only
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <Lock className="w-4 h-4 text-gray-600 mr-2" />
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Security</h3>
            <span className="ml-auto text-xs text-gray-500 italic">Optional</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Current Password - Full Width */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                name="current_password"
                value={formData.current_password}
                onChange={handleInputChange}
                placeholder="Enter your current password"
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.current_password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={profileLoading || updateProfileMutation.isPending}
              />
              {errors.current_password && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-1.5"></span>
                  {errors.current_password}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Minimum 8 characters"
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={profileLoading || updateProfileMutation.isPending}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-1.5"></span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleInputChange}
                placeholder="Re-enter new password"
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.password_confirmation ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={profileLoading || updateProfileMutation.isPending}
              />
              {errors.password_confirmation && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-1.5"></span>
                  {errors.password_confirmation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
            disabled={updateProfileMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
            disabled={profileLoading || updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            {updateProfileMutation.isPending ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProfileSettingsModal;
