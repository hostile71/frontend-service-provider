/**
 * User Add Modal Component
 * 
 * Form for adding new user (customer)
 */

import React, { useState, useEffect } from 'react';
import { X, Save, Upload, User as UserIcon } from 'lucide-react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useCreateUser } from '../../hooks/useUsers';
import { useQuery } from '@tanstack/react-query';
import { roleService } from '../../services';

const UserAddModal = ({ isOpen, onClose, onSuccess, defaultType = 'customer', titleLabel, submitLabel }) => {
  const { t } = useLocalization();
  const createUserMutation = useCreateUser();

  // Fetch roles from API
  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getAll(),
    enabled: isOpen, // Only fetch when modal is open
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });

  const roles = rolesData?.data || [];

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_no: '',
    identification_number: '',
    address: '',
    password: '',
    password_confirmation: '',
    type: defaultType, // Auto-selected type (customer/admin/etc)
    status: 'active',
    role_id: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        mobile_no: '',
        identification_number: '',
        address: '',
        password: '',
        password_confirmation: '',
        type: defaultType,
        status: 'active',
        role_id: '',
      });
      setProfilePicture(null);
      setProfilePicturePreview(null);
      setErrors({});
    }
  }, [isOpen, defaultType]);

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
    setProfilePicturePreview(null);
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

    // Password validation - required for new user
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
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

      // Append all form fields
      submitData.append('first_name', formData.first_name);
      submitData.append('last_name', formData.last_name);
      submitData.append('email', formData.email);
      submitData.append('mobile_no', formData.mobile_no);
      submitData.append('type', formData.type);
      submitData.append('status', formData.status);
      submitData.append('password', formData.password);
      submitData.append('password_confirmation', formData.password_confirmation);

      // Optional fields
      if (formData.identification_number) submitData.append('identification_number', formData.identification_number);
      if (formData.address) submitData.append('address', formData.address);
      if (formData.role_id) submitData.append('role_id', formData.role_id);

      // Append profile picture if selected
      if (profilePicture && profilePicture instanceof File) {
        submitData.append('profile_picture', profilePicture);
      }

      await createUserMutation.mutateAsync(submitData);

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Error creating user:', error);
      console.log('Error response:', error.response);
      console.log('Error response data:', error.response?.data);
      console.log('Error response errors:', error.response?.data?.errors);

      // Handle validation errors from backend
      // Note: apiClient transforms errors to { status, message, errors, code, data }
      if (error.errors) {
        const backendErrors = error.errors;
        const formattedErrors = {};

        Object.keys(backendErrors).forEach(key => {
          const errorValue = backendErrors[key];
          formattedErrors[key] = Array.isArray(errorValue) ? errorValue[0] : errorValue;
        });

        console.log('Formatted errors:', formattedErrors);
        setErrors(formattedErrors);
      } else if (error.message) {
        // Set a general error message
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'An error occurred while creating the user' });
      }
    }
  };

  if (!isOpen) return null;

  const modalTitle = titleLabel || (defaultType === 'admin' ? 'Add New Admin User' : 'Add New Customer');
  const submitButtonLabel = submitLabel || (defaultType === 'admin' ? 'Create Admin User' : 'Create Customer');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r">
          <h3 className="text-xl font-semibold text-black">{modalTitle}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-black"
            disabled={createUserMutation.isPending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* General Error Message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

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
                      Upload Picture
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
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.first_name ? 'border-red-500' : 'border-gray-300'
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
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.last_name ? 'border-red-500' : 'border-gray-300'
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
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
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
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.mobile_no ? 'border-red-500' : 'border-gray-300'
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
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.identification_number ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.identification_number && (
                    <p className="text-red-500 text-sm mt-1">{errors.identification_number}</p>
                  )}
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
                  <input
                    type="text"
                    value={defaultType === 'admin' ? 'Admin' : 'Customer'}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                  <input type="hidden" name="type" value={defaultType} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={rolesLoading}
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                  {rolesLoading && (
                    <p className="text-xs text-gray-500 mt-1">Loading roles...</p>
                  )}
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

            {/* Password Section */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Password <span className="text-red-500">*</span></h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.password_confirmation && (
                    <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={createUserMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={createUserMutation.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {createUserMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{submitButtonLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAddModal;
