import React, { useState, useEffect, useRef } from 'react';
import { X, User, Briefcase, Package, Globe, Image, Bell, CreditCard, FileText, BarChart3, CalendarDays, MapPin, Percent } from 'lucide-react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { useQueryClient } from '@tanstack/react-query';
import { useServices, useCreateService, useUpdateService } from '../../hooks/useServices';
import { useSubcategories, useCreateSubcategory, useUpdateSubcategory } from '../../hooks/useSubcategories';
import { useCategories, useCreateCategory, useUpdateCategory } from '../../hooks/useCategories';
import { usePromotions, useCreatePromotion, useUpdatePromotion } from '../../hooks/usePromotions';
import { useCreateBooking, useUpdateBooking } from '../../hooks/useBookings';
import { useUsers } from '../../hooks/useUsers';
import { useUser } from '../../contexts/UserContext';
import { buildAssetUrl } from '../../utils/helpers';
import { localizationService, settingsService, securityService } from '../../services';

const AddItemModal = ({ isOpen, onClose, type }) => {
  const { t, isRTL } = useLocalization();
  const { editItem, setEditItem } = useAppContext();
  const [formData, setFormData] = useState({});
  const toast = useToast();
  const queryClient = useQueryClient();

  const createService = useCreateService();
  const updateService = useUpdateService();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const createSubcategory = useCreateSubcategory();
  const updateSubcategory = useUpdateSubcategory();
  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();
  const createBooking = useCreateBooking();
  const updateBooking = useUpdateBooking();

  const { data: categoriesData } = useCategories({ per_page: 100 });
  const { data: subcategoriesData } = useSubcategories({ per_page: 100 });
  const { data: servicesData } = useServices({ per_page: 100 });
  const { data: providersData } = useUsers({ type: 'provider', per_page: 100 });

  // Normalize providers list from potential response shapes
  const providersList = (providersData && (
    providersData.data?.data || providersData.data || providersData.users || providersData
  )) || [];

  // Normalize services list from potential response shapes
  const servicesList = Array.isArray(servicesData)
    ? servicesData
    : (servicesData?.data?.data || servicesData?.data || servicesData?.services || []);

  // Debug: Log services data
  useEffect(() => {
    if (servicesData) {
      console.log('Services Data:', servicesData);
      console.log('Services List:', servicesList);
      console.log('Services List Length:', servicesList.length);
    }
  }, [servicesData]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Previews for banner and gallery images
  const { assetUrl } = useUser();
  const [bannerPreview, setBannerPreview] = useState(null);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [iconPreview, setIconPreview] = useState(null);
  const initialImageIdsRef = useRef([]);

  const isEditMode = editItem !== null;

  // Initialize form data when editItem changes or modal opens
  useEffect(() => {
    if (isEditMode && editItem) {
      // Normalize editItem into expected form keys so selects auto-select correctly
      const normalized = {
        ...editItem,
        // provider_id may come as provider_id or provider object
        provider_id: editItem.provider_id || editItem.provider?.id || editItem.provider?.user_id || '',
        // category_id may be on editItem.category_id or nested under sub_category
        category_id: editItem.category_id || editItem.sub_category?.category_id || editItem.sub_category?.category?.id || editItem.category?.id || '',
        // subcategory id
        subcategory_id: editItem.sub_category_id || editItem.sub_category?.id || '',
        // service_id for bookings (may come as service_id or service object)
        service_id: editItem.service_id || editItem.service?.id || '',
        // banner image path or file
        banner_image: editItem.banner_image || editItem.image || editItem.banner || null,
        // images may come as array of paths/objects
        images: Array.isArray(editItem.images) ? editItem.images : (editItem.images ? [editItem.images] : []),
        // Translation fields mapping
        translationKey: editItem.translationKey || editItem.key || '',
        englishText: editItem.englishText || editItem.en || editItem.english || '',
        arabicText: editItem.arabicText || editItem.ar || editItem.arabic || '',
        translationCategory: editItem.translationCategory || editItem.category || '',
      };

      // Convert booking_date from ISO format to YYYY-MM-DD for date input
      if (normalized.booking_date) {
        const dateStr = normalized.booking_date.split('T')[0]; // Extract YYYY-MM-DD from ISO string
        normalized.booking_date = dateStr;
      }

      // Convert numeric ids to strings for select value matching
      if (normalized.provider_id !== undefined && normalized.provider_id !== null) normalized.provider_id = String(normalized.provider_id);
      if (normalized.category_id !== undefined && normalized.category_id !== null) normalized.category_id = String(normalized.category_id);
      if (normalized.subcategory_id !== undefined && normalized.subcategory_id !== null) normalized.subcategory_id = String(normalized.subcategory_id);
      if (normalized.service_id !== undefined && normalized.service_id !== null) normalized.service_id = String(normalized.service_id);

      setFormData(normalized);
      // record original existing image IDs (if any) to compute removals on update
      const existingIds = (Array.isArray(normalized.images) ? normalized.images : [])
        .filter(img => img && typeof img === 'object' && (img.id || img.image_id || img.imageId))
        .map(img => img.id || img.image_id || img.imageId)
        .filter(Boolean);
      initialImageIdsRef.current = existingIds;
      // Clear errors when loading edit data
      setErrors({});
    } else {
      setFormData({});
      setErrors({});
    }
  }, [editItem, isEditMode, isOpen]);

  // Generate previews when banner_image changes
  useEffect(() => {
    let currentUrl = null;
    const setPreview = async () => {
      if (!formData?.banner_image) {
        setBannerPreview(null);
        return;
      }

      // If a File was selected
      if (formData.banner_image instanceof File) {
        currentUrl = URL.createObjectURL(formData.banner_image);
        setBannerPreview(currentUrl);
        return;
      }

      // If it's an existing path/string, build asset URL
      if (typeof formData.banner_image === 'string') {
        setBannerPreview(buildAssetUrl(assetUrl, formData.banner_image));
        return;
      }

      setBannerPreview(null);
    };

    setPreview();

    return () => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [formData?.banner_image, assetUrl]);

  // Generate previews when images (gallery) change
  useEffect(() => {
    let objectUrls = [];
    const build = () => {
      if (!formData?.images) {
        setImagesPreview([]);
        return;
      }

      // If it's an array (either File objects from input or existing paths/objects)
      if (Array.isArray(formData.images)) {
        // New Files selected
        if (formData.images.length > 0 && formData.images[0] instanceof File) {
          objectUrls = formData.images.map(f => URL.createObjectURL(f));
          setImagesPreview(objectUrls);
          return;
        }

        // Existing images (paths or objects)
        const urls = formData.images.map(img => {
          if (!img) return null;
          if (typeof img === 'string') return buildAssetUrl(assetUrl, img);
          // Try various property names that might contain the image path
          if (img.url) return buildAssetUrl(assetUrl, img.url);
          if (img.path) return buildAssetUrl(assetUrl, img.path);
          if (img.image_path) return buildAssetUrl(assetUrl, img.image_path);
          if (img.image) return buildAssetUrl(assetUrl, img.image);
          return null;
        }).filter(Boolean);
        setImagesPreview(urls);
        return;
      }

      // If FileList (fallback)
      if (typeof FileList !== 'undefined' && formData.images instanceof FileList) {
        const files = Array.from(formData.images);
        objectUrls = files.map(f => URL.createObjectURL(f));
        setImagesPreview(objectUrls);
        return;
      }

      setImagesPreview([]);
    };

    build();

    return () => {
      objectUrls.forEach(u => URL.revokeObjectURL(u));
    };
  }, [formData?.images, assetUrl]);

  // Generate preview when icon changes (for category/subcategory)
  useEffect(() => {
    let currentUrl = null;
    const setPreview = async () => {
      if (!formData?.icon) {
        setIconPreview(null);
        return;
      }

      // If a File was selected
      if (formData.icon instanceof File) {
        currentUrl = URL.createObjectURL(formData.icon);
        setIconPreview(currentUrl);
        return;
      }

      // If it's an existing path/string, build asset URL
      if (typeof formData.icon === 'string') {
        setIconPreview(buildAssetUrl(assetUrl, formData.icon));
        return;
      }

      setIconPreview(null);
    };

    setPreview();

    return () => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [formData?.icon, assetUrl]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    // Don't set undefined or empty values for file fields
    if (value === undefined || value === null) {
      // Remove the field from formData if it exists
      setFormData(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error for this field when user changes it
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const buildFormData = (obj) => {
      const fd = new FormData();
      Object.keys(obj).forEach((k) => {
        const v = obj[k];
        if (v === undefined || v === null) return;
        // Handle FileList (multiple files)
        if (typeof FileList !== 'undefined' && v instanceof FileList) {
          Array.from(v).forEach((file) => fd.append(`${k}[]`, file));
        } else if (v instanceof File) {
          fd.append(k, v);
        } else if (Array.isArray(v)) {
          // If array contains File objects, append each as file
          if (v.length > 0 && v[0] instanceof File) {
            v.forEach((file) => fd.append(`${k}[]`, file));
          } else {
            // For arrays of existing image paths or simple values, append each as repeated field
            v.forEach((item) => {
              if (item === undefined || item === null) return;
              if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
                fd.append(`${k}[]`, String(item));
              } else if (item.path) {
                fd.append(`${k}[]`, item.path);
              } else if (item.url) {
                fd.append(`${k}[]`, item.url);
              } else {
                // fallback to JSON string
                fd.append(`${k}[]`, JSON.stringify(item));
              }
            });
          }
        } else {
          fd.append(k, v);
        }
      });
      return fd;
    };

    const handleError = (err) => {
      console.error('Form submission error:', err);
      const backend = err.errors || err.response?.data?.errors || null;
      if (backend) {
        const formatted = {};
        const errorMessages = [];
        Object.keys(backend).forEach((key) => {
          const val = backend[key];
          // Normalize key: if it's like 'images.0' -> 'images', 'sub_category_id' -> 'subcategory_id'
          let normalized = key.split('.')[0];
          // convert snake_case to camel-like with underscores removed for form fields
          normalized = normalized.replace(/_([a-z])/g, (m, p1) => p1.toUpperCase());
          // Lowercase first char to match our form keys
          normalized = normalized.charAt(0).toLowerCase() + normalized.slice(1);
          // map specific known fields
          if (normalized === 'subCategoryId') normalized = 'subcategory_id';
          if (normalized === 'providerId') normalized = 'provider_id';
          if (normalized === 'bannerImage') normalized = 'banner_image';
          if (normalized === 'images') normalized = 'images';

          const errorMsg = Array.isArray(val) ? val[0] : val;
          formatted[normalized] = errorMsg;
          errorMessages.push(errorMsg);
        });
        setErrors(formatted);
        // Show first error or general message
        const firstError = errorMessages[0] || t('validationError') || 'Please check the form for errors';
        toast.error(firstError);
      } else {
        const message = err.response?.data?.message || err.message || 'Failed to save. Please try again.';
        toast.error(message);
      }
    };

    (async () => {
      try {
        if (type === 'service') {
          // Map frontend keys to backend expected keys
          const mapKeysForBackend = (src) => {
            const payloadObj = { ...src };
            if (payloadObj.subcategory_id !== undefined) {
              payloadObj.sub_category_id = payloadObj.subcategory_id;
              delete payloadObj.subcategory_id;
            }
            // Normalize is_verified to string 'true'/'false' (matching working API)
            if (payloadObj.is_verified !== undefined) {
              payloadObj.is_verified = payloadObj.is_verified ? 'true' : 'false';
            }
            // Ensure currency has a default value if not set
            if (!payloadObj.currency) {
              payloadObj.currency = 'OMR';
            }
            return payloadObj;
          };

          const mapped = mapKeysForBackend(formData);

          // DEV: log payload mapping for debugging dropdown/required issues
          try {
            if (process && process.env && process.env.NODE_ENV !== 'production') {
              console.debug('Service payload mapped (before files):', mapped);
            }
          } catch (e) {
            // ignore in environments without process
          }

          // Extract newly-selected image File objects (if any)
          const newImageFiles = Array.isArray(formData.images) ? formData.images.filter(i => i instanceof File) : [];
          const bannerIsFile = formData.banner_image instanceof File;

          // When editing, compute which existing image IDs were removed by the user
          let removeImageIds = [];
          if (isEditMode) {
            const remainingExistingIds = (Array.isArray(formData.images) ? formData.images : [])
              .filter(img => img && typeof img === 'object' && (img.id || img.image_id || img.imageId))
              .map(img => img.id || img.image_id || img.imageId)
              .filter(Boolean);
            removeImageIds = initialImageIdsRef.current.filter(id => !remainingExistingIds.includes(id));
          }

          // Decide whether we need multipart FormData: banner or new images or icon are files
          const needFormData = bannerIsFile || newImageFiles.length > 0 || formData.icon instanceof File;

          if (isEditMode && editItem?.id) {
            // Update flow
            if (needFormData) {
              const fd = new FormData();

              // Append scalar fields first (matching working API structure)
              Object.keys(mapped).forEach((k) => {
                const v = mapped[k];
                if (v === undefined || v === null) return;
                // Skip file-related fields (handled separately below)
                if (k === 'images' || k === 'banner_image' || k === 'icon') return;

                // Append scalar values directly (NOT as arrays)
                if (!Array.isArray(v)) {
                  fd.append(k, String(v));
                }
              });

              // Append banner_image file ONLY if user selected a new file
              // If not changed, don't send it (backend keeps existing)
              if (bannerIsFile) {
                fd.append('banner_image', formData.banner_image);
              }

              // Append new image files as images[] (multiple entries, like working API)
              newImageFiles.forEach(file => {
                fd.append('images[]', file);
              });

              // Append remove_image_ids[] for images user deleted
              removeImageIds.forEach(id => {
                fd.append('remove_image_ids[]', String(id));
              });

              // DEV: log FormData entries for debugging
              try {
                if (process && process.env && process.env.NODE_ENV !== 'production') {
                  console.debug('=== Update FormData entries ===');
                  for (const pair of fd.entries()) {
                    console.debug('  ', pair[0], ':', pair[1] instanceof File ? `[File: ${pair[1].name}]` : pair[1]);
                  }
                }
              } catch (e) { }

              const result = await updateService.mutateAsync({ id: editItem.id, data: fd });
              const successMsg = result?.message || t('updateSuccess') || 'Service updated successfully!';
              toast.success(successMsg);
            } else {
              // No files to upload: send JSON payload with scalars + remove_image_ids
              const payloadObj = { ...mapped };
              delete payloadObj.images; // images are file-managed
              delete payloadObj.banner_image; // don't send existing path, backend keeps it
              delete payloadObj.icon; // don't send existing icon path
              if (removeImageIds.length > 0) payloadObj.remove_image_ids = removeImageIds;
              const result = await updateService.mutateAsync({ id: editItem.id, data: payloadObj });
              const successMsg = result?.message || t('updateSuccess') || 'Service updated successfully!';
              toast.success(successMsg);
            }

            queryClient.invalidateQueries({ queryKey: ['services'] });
          } else {
            // Create flow
            if (needFormData) {
              const fd = new FormData();

              // Build FormData matching API structure
              Object.keys(mapped).forEach((k) => {
                const v = mapped[k];
                if (v === undefined || v === null) return;

                // Handle File objects
                if (v instanceof File) {
                  fd.append(k, v);
                }
                // Handle FileList
                else if (typeof FileList !== 'undefined' && v instanceof FileList) {
                  Array.from(v).forEach(file => fd.append(`${k}[]`, file));
                }
                // Handle array of Files (images)
                else if (Array.isArray(v) && v.length > 0 && v[0] instanceof File) {
                  v.forEach(file => fd.append(`${k}[]`, file));
                }
                // Skip non-file arrays and objects (don't send existing image paths on create)
                else if (!Array.isArray(v) && typeof v !== 'object') {
                  fd.append(k, String(v));
                }
              });

              // DEV: log FormData entries
              try {
                if (process && process.env && process.env.NODE_ENV !== 'production') {
                  console.debug('=== Create FormData entries ===');
                  for (const pair of fd.entries()) {
                    console.debug('  ', pair[0], ':', pair[1] instanceof File ? `[File: ${pair[1].name}]` : pair[1]);
                  }
                }
              } catch (e) { }

              const result = await createService.mutateAsync(fd);
              const successMsg = result?.message || t('createSuccess') || 'Service created successfully!';
              toast.success(successMsg);
            } else {
              const result = await createService.mutateAsync(mapped);
              const successMsg = result?.message || t('createSuccess') || 'Service created successfully!';
              toast.success(successMsg);
            }

            queryClient.invalidateQueries({ queryKey: ['services'] });
          }
        } else if (type === 'category') {
          // Category: icon is file, color is text - use FormData
          const iconIsFile = formData.icon instanceof File;

          console.log('🔍 Category formData before submit:', formData);
          console.log('🔍 Icon value:', formData.icon, 'Type:', typeof formData.icon, 'Is File:', iconIsFile);

          // For create mode, icon is required
          if (!isEditMode && !iconIsFile) {
            toast.error('Please select an icon image');
            return;
          }

          const needFormData = iconIsFile;

          if (isEditMode && editItem?.id) {
            // Update flow
            if (needFormData) {
              const fd = new FormData();

              // Build FormData matching service structure
              Object.keys(formData).forEach((k) => {
                const v = formData[k];
                if (v === undefined || v === null) return;

                // Handle File objects (icon)
                if (v instanceof File) {
                  fd.append(k, v);
                }
                // Skip arrays, objects (including empty objects), append only scalars
                else if (!Array.isArray(v) && typeof v !== 'object') {
                  fd.append(k, String(v));
                }
                // If it's an object but not a File, skip it (this handles empty objects {})
              });

              console.log('📦 Category Update FormData:');
              for (const pair of fd.entries()) {
                console.log('  ', pair[0], ':', pair[1] instanceof File ? `[File: ${pair[1].name}]` : pair[1]);
              }

              const result = await updateCategory.mutateAsync({ id: editItem.id, data: fd });
              const successMsg = result?.message || t('updateSuccess') || 'Category updated successfully!';
              toast.success(successMsg);
            } else {
              // No file, send JSON
              const categoryData = { name: formData.name, color: formData.color };
              const result = await updateCategory.mutateAsync({ id: editItem.id, data: categoryData });
              const successMsg = result?.message || t('updateSuccess') || 'Category updated successfully!';
              toast.success(successMsg);
            }
            queryClient.invalidateQueries({ queryKey: ['categories'] });
          } else {
            //Create flow
            const fd = new FormData();

            // Build FormData matching service structure
            Object.keys(formData).forEach((k) => {
              const v = formData[k];
              console.log(`  Processing field "${k}":`, v, typeof v, v instanceof File);

              if (v === undefined || v === null) return;

              // Handle File objects (icon)
              if (v instanceof File) {
                console.log(`    ✅ Appending File: ${k}`);
                fd.append(k, v);
              }
              // Skip arrays, objects (including empty objects), append only scalars
              else if (!Array.isArray(v) && typeof v !== 'object') {
                console.log(`    ✅ Appending scalar: ${k} = ${v}`);
                fd.append(k, String(v));
              } else {
                console.log(`    ⏭️ Skipping ${k} (is array or object)`);
              }
              // If it's an object but not a File, skip it (this handles empty objects {})
            });

            console.log('📦 Category Create FormData:');
            for (const pair of fd.entries()) {
              console.log('  ', pair[0], ':', pair[1] instanceof File ? `[File: ${pair[1].name}]` : pair[1]);
            }

            const result = await createCategory.mutateAsync(fd);
            const successMsg = result?.message || t('createSuccess') || 'Category created successfully!';
            toast.success(successMsg);
            queryClient.invalidateQueries({ queryKey: ['categories'] });
          }
        } else if (type === 'subcategory') {
          // Subcategory: icon is file, color is text - use FormData
          const iconIsFile = formData.icon instanceof File;

          // For create mode, icon is required
          if (!isEditMode && !iconIsFile) {
            toast.error('Please select an icon image');
            return;
          }

          const needFormData = iconIsFile;

          if (isEditMode && editItem?.id) {
            // Update flow
            if (needFormData) {
              const fd = new FormData();

              // Build FormData matching service structure
              Object.keys(formData).forEach((k) => {
                const v = formData[k];
                if (v === undefined || v === null) return;

                // Handle File objects (icon)
                if (v instanceof File) {
                  fd.append(k, v);
                }
                // Skip arrays, objects (including empty objects), append only scalars
                else if (!Array.isArray(v) && typeof v !== 'object') {
                  fd.append(k, String(v));
                }
                // If it's an object but not a File, skip it (this handles empty objects {})
              });

              console.log('📦 Subcategory Update FormData:');
              for (const pair of fd.entries()) {
                console.log('  ', pair[0], ':', pair[1] instanceof File ? `[File: ${pair[1].name}]` : pair[1]);
              }

              const result = await updateSubcategory.mutateAsync({ id: editItem.id, data: fd });
              const successMsg = result?.message || t('updateSuccess') || 'Subcategory updated successfully!';
              toast.success(successMsg);
            } else {
              // No file, send JSON
              const subcategoryData = {
                name: formData.name,
                category_id: formData.category_id,
                color: formData.color
              };
              const result = await updateSubcategory.mutateAsync({ id: editItem.id, data: subcategoryData });
              const successMsg = result?.message || t('updateSuccess') || 'Subcategory updated successfully!';
              toast.success(successMsg);
            }
            queryClient.invalidateQueries({ queryKey: ['subcategories'] });
          } else {
            // Create flow
            const fd = new FormData();

            // Build FormData matching service structure
            Object.keys(formData).forEach((k) => {
              const v = formData[k];
              if (v === undefined || v === null) return;

              // Handle File objects (icon)
              if (v instanceof File) {
                fd.append(k, v);
              }
              // Skip arrays, objects (including empty objects), append only scalars
              else if (!Array.isArray(v) && typeof v !== 'object') {
                fd.append(k, String(v));
              }
              // If it's an object but not a File, skip it (this handles empty objects {})
            });

            console.log('📦 Subcategory Create FormData:');
            for (const pair of fd.entries()) {
              console.log('  ', pair[0], ':', pair[1] instanceof File ? `[File: ${pair[1].name}]` : pair[1]);
            }

            const result = await createSubcategory.mutateAsync(fd);
            const successMsg = result?.message || t('createSuccess') || 'Subcategory created successfully!';
            toast.success(successMsg);
            queryClient.invalidateQueries({ queryKey: ['subcategories'] });
          }
        } else if (type === 'promotion') {
          // Promotion: all fields are text/numbers - use JSON
          const promotionData = {
            title: formData.title,
            subtitle: formData.subtitle || '',
            subtext: formData.subtext || '',
            percentage: parseInt(formData.percentage, 10),
            max_amount: formData.max_amount ? parseFloat(formData.max_amount) : 0,
            expired_at: formData.expired_at,
            is_active: formData.is_active === 1 || formData.is_active === true || formData.is_active === 'true' ? 1 : 0,
          };

          if (isEditMode && editItem?.id) {
            // Update flow
            const result = await updatePromotion.mutateAsync({ id: editItem.id, data: promotionData });
            const successMsg = result?.message || t('updateSuccess') || 'Promotion updated successfully!';
            toast.success(successMsg);
            queryClient.invalidateQueries({ queryKey: ['promotions'] });
          } else {
            // Create flow
            const result = await createPromotion.mutateAsync(promotionData);
            const successMsg = result?.message || t('createSuccess') || 'Promotion created successfully!';
            toast.success(successMsg);
            queryClient.invalidateQueries({ queryKey: ['promotions'] });
          }
        } else if (type === 'booking') {
          // Booking: all fields are text/numbers - use JSON
          if (isEditMode && editItem) {
            // Update flow
            const bookingData = {
              service_id: formData.service_id,
              mobile_no: formData.mobile_no,
              booking_date: formData.booking_date,
              schedule_time: formData.schedule_time,
              price: formData.price,
              discount_amount: formData.discount_amount || 0,
              net_amount: formData.net_amount,
              status: formData.status,
              notes: formData.notes || '',
            };

            const result = await updateBooking.mutateAsync({ id: editItem.id, ...bookingData });
            const successMsg = result?.message || t('updateSuccess') || 'Booking updated successfully!';
            toast.success(successMsg);
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
          } else {
            // Create flow
            const bookingData = {
              service_id: formData.service_id,
              mobile_no: formData.mobile_no,
              booking_date: formData.booking_date,
              schedule_time: formData.schedule_time,
              price: formData.price,
              discount_amount: formData.discount_amount || 0,
              net_amount: formData.net_amount,
              status: formData.status || 'pending',
              notes: formData.notes || '',
              created_by: 1, // TODO: Get from auth context
              updated_by: 1, // TODO: Get from auth context
            };

            const result = await createBooking.mutateAsync(bookingData);
            const successMsg = result?.message || t('createSuccess') || 'Booking created successfully!';
            toast.success(successMsg);
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
          }
        } else if (type === 'translation') {
          // Translation: create/update translation keys
          if (isEditMode && editItem) {
            // Update flow
            const translationData = {
              key: formData.translationKey,
              category: formData.translationCategory,
              en: formData.englishText,
              ar: formData.arabicText
            };

            try {
              const result = await localizationService.updateTranslation(editItem.id, translationData);
              const successMsg = result?.message || t('updateSuccess') || 'Translation updated successfully!';
              toast.success(successMsg);
              queryClient.invalidateQueries({ queryKey: ['translations'] });
            } catch (err) {
              throw err;
            }
          } else {
            // Create flow
            const translationData = {
              key: formData.translationKey,
              category: formData.translationCategory,
              en: formData.englishText,
              ar: formData.arabicText
            };

            try {
              const result = await localizationService.createTranslation(translationData);
              const successMsg = result?.message || t('createSuccess') || 'Translation created successfully!';
              toast.success(successMsg);
              queryClient.invalidateQueries({ queryKey: ['translations'] });
            } catch (err) {
              throw err;
            }
          }
        } else if (type === 'setting') {
          // Setting: create/update settings
          if (isEditMode && editItem) {
            // Update flow
            const settingData = {
              key: formData.settingKey,
              value: formData.settingValue,
              description: formData.settingDescription
            };

            try {
              const result = await settingsService.updateSetting(editItem.id, settingData);
              const successMsg = result?.message || t('updateSuccess') || 'Setting updated successfully!';
              toast.success(successMsg);
              queryClient.invalidateQueries({ queryKey: ['settings'] });
            } catch (err) {
              throw err;
            }
          } else {
            // Create flow
            const settingData = {
              key: formData.settingKey,
              value: formData.settingValue,
              description: formData.settingDescription
            };

            try {
              const result = await settingsService.createSetting?.(settingData);
              const successMsg = result?.message || t('createSuccess') || 'Setting created successfully!';
              toast.success(successMsg);
              queryClient.invalidateQueries({ queryKey: ['settings'] });
            } catch (err) {
              // If createSetting doesn't exist, just show warning
              console.warn('Create setting not available:', err);
              toast.warning('Setting creation not yet available');
            }
          }
        } else if (type === 'security') {
          // Security: create/update security settings
          if (isEditMode && editItem) {
            // Update flow
            const securityData = {
              key: formData.securityKey,
              value: formData.securityValue,
              description: formData.securityDescription
            };

            try {
              const result = await securityService.updateSetting(editItem.id, securityData);
              const successMsg = result?.message || t('updateSuccess') || 'Security setting updated successfully!';
              toast.success(successMsg);
              queryClient.invalidateQueries({ queryKey: ['security'] });
            } catch (err) {
              throw err;
            }
          } else {
            // Create flow
            const securityData = {
              key: formData.securityKey,
              value: formData.securityValue,
              description: formData.securityDescription
            };

            try {
              const result = await securityService.updateSetting?.(null, securityData);
              const successMsg = result?.message || t('createSuccess') || 'Security setting created successfully!';
              toast.success(successMsg);
              queryClient.invalidateQueries({ queryKey: ['security'] });
            } catch (err) {
              console.warn('Create security setting not available:', err);
              toast.warning('Security setting creation not yet available');
            }
          }
        }

        // close modal and reset
        onClose();
        setEditItem(null);
        setFormData({});
      } catch (err) {
        handleError(err);
      } finally {
        setSubmitting(false);
      }
    })();
  };

  // Handle modal close
  const handleClose = () => {
    onClose();
    setEditItem(null);
    setFormData({});
    setErrors({});
    setBannerPreview(null);
    setImagesPreview([]);
    initialImageIdsRef.current = [];
    setSubmitting(false);
  };

  const clearBanner = () => {
    setFormData(prev => ({ ...prev, banner_image: null }));
    setBannerPreview(null);
  };

  const removeImageAt = (index) => {
    setFormData(prev => {
      const imgs = Array.isArray(prev.images) ? [...prev.images] : [];
      if (index < 0 || index >= imgs.length) return prev;
      imgs.splice(index, 1);
      return { ...prev, images: imgs };
    });
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
      case 'promotion':
        return Percent;
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
      case 'promotion': return `${prefix} Promotion`;
      case 'subcategory': return `${prefix} Subcategory`;
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
                    Service Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter service title"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('category')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.category_id ? 'border-red-500' : 'border-gray-300'
                        }`}
                      value={formData.category_id || ''}
                      onChange={(e) => {
                        handleInputChange('category_id', e.target.value);
                        handleInputChange('subcategory_id', ''); // Reset subcategory when category changes
                      }}
                      required
                    >
                      <option value="">Select category</option>
                      {categoriesData?.data?.data?.map((cat) => (
                        <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                      ))}
                    </select>
                    {errors.category_id && (
                      <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.subcategory_id ? 'border-red-500' : 'border-gray-300'
                        }`}
                      value={formData.subcategory_id || ''}
                      onChange={(e) => handleInputChange('subcategory_id', e.target.value)}
                      disabled={!formData.category_id}
                      required
                    >
                      <option value="">Select subcategory</option>
                      {subcategoriesData?.data?.data
                        ?.filter(sub => String(sub.category_id) === String(formData.category_id))
                        ?.map((sub) => (
                          <option key={sub.id} value={String(sub.id)}>{sub.name}</option>
                        ))}
                    </select>
                    {errors.subcategory_id && (
                      <p className="text-red-500 text-sm mt-1">{errors.subcategory_id}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('description')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                    rows="3"
                    placeholder="Describe the service in detail"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Provider, Banner, Contact, Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Provider & Media
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provider <span className="text-red-500">*</span></label>
                  <select
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.provider_id ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.provider_id || ''}
                    onChange={(e) => handleInputChange('provider_id', e.target.value)}
                    required
                  >
                    <option value="">Select provider</option>
                    {providersList?.map((p) => (
                      <option key={p.id} value={String(p.id)}>{(p.company_name ? `${p.company_name} — ` : '') + `${p.first_name || ''} ${p.last_name || ''}` + (p.business_license ? ` (${p.business_license})` : '')}</option>
                    ))}
                  </select>
                  {errors.provider_id && <p className="text-red-500 text-sm mt-1">{errors.provider_id}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleInputChange('banner_image', e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.banner_image && (
                    <p className="text-red-500 text-sm mt-1">{errors.banner_image}</p>
                  )}
                  {bannerPreview && (
                    <div className="mt-3 relative inline-block">
                      <p className="text-xs text-gray-600 mb-2">Preview:</p>
                      <img src={bannerPreview} alt="Banner preview" className="w-40 h-24 object-cover rounded-md border" />
                      <button type="button" onClick={clearBanner} className="absolute -top-2 -right-2 bg-white rounded-full p-1 border hover:bg-red-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact No.</label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.contact_no ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.contact_no || ''}
                    onChange={(e) => handleInputChange('contact_no', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.status || 'active'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div className="flex items-center space-x-3 md:space-x-0 md:flex-col">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={!!formData.is_verified} onChange={(e) => handleInputChange('is_verified', e.target.checked ? 1 : 0)} />
                    <span className="text-sm">Verified</span>
                  </label>
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
                      {t('price')} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="0.00"
                        value={formData.price || ''}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        required
                      />

                      <select
                        className={`w-28 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.currency ? 'border-red-500' : 'border-gray-300'}`}
                        value={formData.currency || 'OMR'}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                      >
                        <option value="OMR">OMR</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                    )}
                    {errors.currency && (
                      <p className="text-red-500 text-sm mt-1">{errors.currency}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('duration')}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 1-2 hours, 30 minutes"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.duration ? 'border-red-500' : 'border-gray-300'
                        }`}
                      value={formData.duration || ''}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                    />
                    {errors.duration && (
                      <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Service location or coverage area"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.location ? 'border-red-500' : 'border-gray-300'
                      }`}
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Service Images */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Service Images
              </h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleInputChange('images', Array.from(e.target.files))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload multiple images showcasing your service (JPG, PNG, max 5MB each)
                </p>
                {imagesPreview?.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {imagesPreview.map((src, idx) => (
                      <div key={idx} className="relative">
                        <img src={src} alt={`preview-${idx}`} className="w-full h-20 object-cover rounded-md border" />
                        <button type="button" onClick={() => removeImageAt(idx)} className="absolute -top-2 -right-2 bg-white rounded-full p-1 border hover:bg-red-50">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'promotion':
        return (
          <div className="space-y-6">
            {/* Promotion Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Percent className="w-5 h-5 mr-2" />
                Promotion Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g., Winter Sale"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Save big this season"
                    value={formData.subtitle || ''}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description/Subtext
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Get amazing discounts on all services"
                    rows="3"
                    value={formData.subtext || ''}
                    onChange={(e) => handleInputChange('subtext', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Discount Details */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Discount Details</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Percentage <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.percentage ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="30"
                        value={formData.percentage || ''}
                        onChange={(e) => handleInputChange('percentage', e.target.value)}
                        required
                      />
                      <span className="absolute right-3 top-2.5 text-gray-500">%</span>
                    </div>
                    {errors.percentage && (
                      <p className="text-red-500 text-sm mt-1">{errors.percentage}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Discount Amount (OMR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="500"
                      value={formData.max_amount || ''}
                      onChange={(e) => handleInputChange('max_amount', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Validity Period */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Validity Period</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.expired_at ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.expired_at ? formData.expired_at.split('T')[0] : ''}
                    onChange={(e) => handleInputChange('expired_at', e.target.value)}
                    required
                  />
                  {errors.expired_at && (
                    <p className="text-red-500 text-sm mt-1">{errors.expired_at}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Status</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={formData.is_active === 1 || formData.is_active === true || formData.is_active === 'true'}
                    onChange={(e) => handleInputChange('is_active', e.target.checked ? 1 : 0)}
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                    Active
                  </label>
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
                    {t('name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter category name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Category Media */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Category Icon & Color
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleInputChange('icon', e.target.files[0])}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.icon ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload icon image: Square, minimum 64x64px, PNG or SVG format
                  </p>
                  {errors.icon && (
                    <p className="text-red-500 text-sm mt-1">{errors.icon}</p>
                  )}
                  {(iconPreview || (isEditMode && editItem?.icon)) && (
                    <div className="mt-3">
                      <img
                        src={iconPreview || `${assetUrl}/${editItem?.icon}`}
                        alt="Icon preview"
                        className="w-16 h-16 object-cover rounded border border-gray-300"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="color"
                    className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.color || '#3B82F6'}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Select a color for this category
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'subcategory':
        return (
          <div className="space-y-6">
            {/* Subcategory Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Subcategory Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter subcategory name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent {t('category')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.category_id || ''}
                    onChange={(e) => handleInputChange('category_id', e.target.value)}
                    required
                  >
                    <option value="">Select parent category</option>
                    {categoriesData?.data?.data?.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Subcategory Media */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Subcategory Icon & Color
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleInputChange('icon', e.target.files[0])}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.icon ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload icon image: Square, minimum 64x64px, PNG or SVG format
                  </p>
                  {errors.icon && (
                    <p className="text-red-500 text-sm mt-1">{errors.icon}</p>
                  )}
                  {(iconPreview || (isEditMode && editItem?.icon)) && (
                    <div className="mt-3">
                      <img
                        src={iconPreview || `${assetUrl}/${editItem?.icon}`}
                        alt="Icon preview"
                        className="w-16 h-16 object-cover rounded border border-gray-300"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="color"
                    className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.color || '#3B82F6'}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Select a color for this subcategory
                  </p>
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
                Booking Details
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.service_id ? 'border-red-500' : 'border-gray-300'}`}
                      value={formData.service_id || ''}
                      onChange={(e) => handleInputChange('service_id', e.target.value)}
                      required
                    >
                      <option value="">Select service</option>
                      {servicesList.length > 0 ? (
                        servicesList.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.title || service.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>Loading services...</option>
                      )}
                    </select>
                    {errors.service_id && (
                      <p className="text-red-500 text-sm mt-1">{errors.service_id}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.mobile_no ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="01712345678"
                      value={formData.mobile_no || ''}
                      onChange={(e) => handleInputChange('mobile_no', e.target.value)}
                      required
                    />
                    {errors.mobile_no && (
                      <p className="text-red-500 text-sm mt-1">{errors.mobile_no}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.booking_date ? 'border-red-500' : 'border-gray-300'}`}
                      value={formData.booking_date || ''}
                      onChange={(e) => handleInputChange('booking_date', e.target.value)}
                      required
                    />
                    {errors.booking_date && (
                      <p className="text-red-500 text-sm mt-1">{errors.booking_date}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.schedule_time ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="10-11 PM"
                      value={formData.schedule_time || ''}
                      onChange={(e) => handleInputChange('schedule_time', e.target.value)}
                      required
                    />
                    {errors.schedule_time && (
                      <p className="text-red-500 text-sm mt-1">{errors.schedule_time}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.status || 'pending'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Regular cleaning requested"
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                  ></textarea>
                </div>
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

      /* duplicate booking case removed (kept earlier booking case) */

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
              disabled={submitting}
              className={`px-6 py-2 btn-theme-primary rounded-lg transition-colors flex items-center justify-center ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  {t('saving') || 'Saving...'}
                </>
              ) : (
                t('save')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
