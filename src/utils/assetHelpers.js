/**
 * Asset Helper Utilities
 * 
 * Helper functions to handle asset URLs consistently across the application
 * 
 * The base asset_url is stored globally in UserContext from the profile API.
 * Use these helpers to construct full asset URLs from relative paths.
 * 
 * USAGE EXAMPLES:
 * 
 * 1. Profile Picture:
 *    const { assetUrl } = useUser();
 *    const profilePicUrl = buildAssetUrl(assetUrl, profile.profile_picture);
 *    <img src={profilePicUrl} alt="Profile" />
 * 
 * 2. Service Image:
 *    const { assetUrl } = useUser();
 *    const serviceImgUrl = buildAssetUrl(assetUrl, service.image_path);
 *    <img src={serviceImgUrl} alt="Service" />
 * 
 * 3. Category Image:
 *    const { assetUrl } = useUser();
 *    const categoryImgUrl = buildAssetUrl(assetUrl, category.icon);
 *    <img src={categoryImgUrl} alt="Category" />
 * 
 * 4. Banner Image:
 *    const { assetUrl } = useUser();
 *    const bannerUrl = buildAssetUrl(assetUrl, banner.image_url);
 *    <img src={bannerUrl} alt="Banner" />
 * 
 * All functions handle:
 * - Missing/null values (returns null)
 * - Trailing/leading slashes (automatically normalized)
 * - Consistent URL formatting
 */

/**
 * Build full asset URL by combining base asset URL with relative path
 * @param {string} assetUrl - Base asset URL from UserContext
 * @param {string} relativePath - Relative path to the asset
 * @returns {string|null} Full asset URL or null if inputs are invalid
 */
export const buildAssetUrl = (assetUrl, relativePath) => {
  if (!assetUrl || !relativePath) return null;
  
  // Remove trailing slash from assetUrl if present
  const baseUrl = assetUrl.endsWith('/') ? assetUrl.slice(0, -1) : assetUrl;
  
  // Remove leading slash from relativePath if present
  const path = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  
  return `${baseUrl}/${path}`;
};

// Legacy alias for backward compatibility
export const getAssetUrl = buildAssetUrl;

/**
 * Get profile picture URL from profile object
 * LEGACY: Prefer using buildAssetUrl(assetUrl, profile.profile_picture) with global assetUrl
 */
export const getProfilePictureUrl = (profile) => {
  if (!profile?.asset_url || !profile?.profile_picture) return null;
  return buildAssetUrl(profile.asset_url, profile.profile_picture);
};

/**
 * Get service image URL
 * LEGACY: Prefer using buildAssetUrl(assetUrl, imagePath) with global assetUrl
 */
export const getServiceImageUrl = (service, imagePath) => {
  if (!service?.asset_url || !imagePath) return null;
  return buildAssetUrl(service.asset_url, imagePath);
};

/**
 * Get category image URL
 * LEGACY: Prefer using buildAssetUrl(assetUrl, imagePath) with global assetUrl
 */
export const getCategoryImageUrl = (category, imagePath) => {
  if (!category?.asset_url || !imagePath) return null;
  return buildAssetUrl(category.asset_url, imagePath);
};

/**
 * Get banner image URL
 * LEGACY: Prefer using buildAssetUrl(assetUrl, imagePath) with global assetUrl
 */
export const getBannerImageUrl = (banner, imagePath) => {
  if (!banner?.asset_url || !imagePath) return null;
  return buildAssetUrl(banner.asset_url, imagePath);
};

/**
 * Get document/file URL
 * LEGACY: Prefer using buildAssetUrl(assetUrl, filePath) with global assetUrl
 */
export const getDocumentUrl = (assetUrl, filePath) => {
  return buildAssetUrl(assetUrl, filePath);
};

/**
 * Get user initials from profile
 * @param {Object} profile - User profile object
 * @returns {string} User initials (2 characters)
 */
export const getUserInitials = (profile) => {
  if (!profile) return 'U';
  
  const firstName = profile.first_name || '';
  const lastName = profile.last_name || '';
  
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) return firstName.substring(0, 2).toUpperCase();
  if (profile.name) {
    const parts = profile.name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
  return 'U';
};

/**
 * Get full user name from profile
 * @param {Object} profile - User profile object
 * @returns {string} Full user name
 */
export const getUserFullName = (profile) => {
  if (!profile) return 'User';
  
  const firstName = profile.first_name || '';
  const lastName = profile.last_name || '';
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) return firstName;
  if (lastName) return lastName;
  return profile.name || 'User';
};

export default {
  getAssetUrl,
  getProfilePictureUrl,
  getServiceImageUrl,
  getCategoryImageUrl,
  getBannerImageUrl,
  getDocumentUrl,
  getUserInitials,
  getUserFullName,
};
