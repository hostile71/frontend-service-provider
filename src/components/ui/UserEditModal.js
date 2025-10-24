/**
 * User Edit Modal Component
 * 
 * Form for editing user (customer/provider) information
 */

import React, { useState, useEffect } from 'react';
import { X, Save, Upload, User as UserIcon } from 'lucide-react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useUser as useUserContext } from '../../contexts/UserContext';
import { useUpdateUser } from '../../hooks/useUsers';

const UserEditModal = ({ isOpen, onClose, user, userType, onSuccess }) => {
  const { t } = useLocalization();
  const { assetUrl } = useUserContext();
  const updateUserMutation = useUpdateUser();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_no: '',
    identification_number: '',
    address: '',
    password: '',
    password_confirmation: '',
    type: '',
    status: 'active',
    role_id: '',
    // Provider-specific fields
    company_name: '',
    business_license: '',
    specialization: '',
    experience: '',
    certifications: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        mobile_no: user.mobile_no || '',
        identification_number: user.identification_number || '',
        address: user.address || '',
        password: '',
        password_confirmation: '',
        type: user.type || '',
        status: user.status || 'active',
        role_id: user.role_id || '',
        company_name: user.company_name || '',
        business_license: user.business_license || '',
        specialization: user.specialization || '',
        experience: user.experience || '',
        certifications: user.certifications || '',
      });
      setProfilePicture(null);
      
      // Set existing profile picture preview
      if (user.profile_picture) {
        const profilePicUrl = user.profile_picture.startsWith('http') 
          ? user.profile_picture 
          : `${assetUrl}/${user.profile_picture}`;
        setProfilePicturePreview(profilePicUrl);
      } else {
        setProfilePicturePreview(null);
      }
      
      setErrors({});
    }
  }, [user, assetUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
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
      
      // Clear error
      if (errors.profile_picture) {
        setErrors(prev => ({
          ...prev,
          profile_picture: ''
        }));
      }
    }
  };

  const handleRemoveImage = () => {
    setProfilePicture(null);
    
    // Reset to original profile picture
    if (user?.profile_picture) {
      const profilePicUrl = user.profile_picture.startsWith('http') 
        ? user.profile_picture 
        : `${assetUrl}/${user.profile_picture}`;
      setProfilePicturePreview(profilePicUrl);
    } else {
      setProfilePicturePreview(null);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.mobile_no.trim()) {
      newErrors.mobile_no = 'Phone number is required';
    }

    // Password validation - only if password is being changed
    if (formData.password) {
      if (formData.password.length < 8) {
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

    if (!validate()) {
      return;
    }

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append all form fields (only non-empty values)
      if (formData.first_name) submitData.append('first_name', formData.first_name);
      if (formData.last_name) submitData.append('last_name', formData.last_name);
      if (formData.email) submitData.append('email', formData.email);
      if (formData.mobile_no) submitData.append('mobile_no', formData.mobile_no);
      if (formData.identification_number) submitData.append('identification_number', formData.identification_number);
      if (formData.address) submitData.append('address', formData.address);
      if (formData.type) submitData.append('type', formData.type);
      if (formData.status) submitData.append('status', formData.status);
      if (formData.role_id) submitData.append('role_id', formData.role_id);
      
      // Password fields - only if password is being changed
      if (formData.password) {
        submitData.append('password', formData.password);
        if (formData.password_confirmation) {
          submitData.append('password_confirmation', formData.password_confirmation);
        }
      }

      // Provider-specific fields
      if (userType === 'provider') {
        if (formData.company_name) submitData.append('company_name', formData.company_name);
        if (formData.business_license) submitData.append('business_license', formData.business_license);
        if (formData.specialization) submitData.append('specialization', formData.specialization);
        if (formData.experience) submitData.append('experience', formData.experience);
        if (formData.certifications) submitData.append('certifications', formData.certifications);
      }

      // Append profile picture ONLY if a new file was selected
      if (profilePicture && profilePicture instanceof File) {
        submitData.append('profile_picture', profilePicture);
      }

      await updateUserMutation.mutateAsync({
        id: user.id,
        userData: submitData
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        const formattedErrors = {};
        
        Object.keys(backendErrors).forEach(key => {
          const errorValue = backendErrors[key];
          formattedErrors[key] = Array.isArray(errorValue) ? errorValue[0] : errorValue;
        });
        
        setErrors(formattedErrors);
      }
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r">
          <h3 className="text-xl font-semibold text-black">
            Edit {userType === 'provider' ? 'Service Provider' : 'Customer'}
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-black"
            disabled={updateUserMutation.isPending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Profile Picture</h4>
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  {profilePicturePreview ? (
                    <img
                      src={profilePicturePreview}
                      alt="Profile preview"
                      className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center border-4 border-white shadow-lg">
                      <UserIcon className="h-12 w-12 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="profile-picture-upload"
                    />
                    <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Picture
                    </span>
                  </label>
                  {profilePicturePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="ml-3 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG, GIF or WEBP. Max size 2MB.
                  </p>
                  {errors.profile_picture && (
                    <p className="text-red-500 text-sm mt-1">{errors.profile_picture}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.last_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile_no"
                    value={formData.mobile_no}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.mobile_no ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.mobile_no && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile_no}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Identification Number
                  </label>
                  <input
                    type="text"
                    name="identification_number"
                    value={formData.identification_number}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="block">Block</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="admin">Admin</option>
                    <option value="provider">Provider</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role ID
                  </label>
                  <input
                    type="text"
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Password Update Section */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Password Update (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Leave blank to keep current password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                  />
                  {errors.password_confirmation && (
                    <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Provider-specific fields */}
            {userType === 'provider' && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Business Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business License
                    </label>
                    <input
                      type="text"
                      name="business_license"
                      value={formData.business_license}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certifications
                    </label>
                    <textarea
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter certifications separated by commas"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={updateUserMutation.isPending}
          >
            Cancel
          </button>
          <button 
            type="submit"
            onClick={handleSubmit}
            disabled={updateUserMutation.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {updateUserMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
