/**
 * Icon Mapper Utility
 * 
 * Maps icon names from API to actual Lucide React icon components
 */

import * as LucideIcons from 'lucide-react';

/**
 * Get icon component by name
 * @param {string} iconName - Name of the icon (e.g., "BarChart3", "Users")
 * @returns {Component} Lucide React icon component or default icon
 */
export const getIconComponent = (iconName) => {
  if (!iconName) return LucideIcons.Circle;
  
  // Try to get the icon from Lucide
  const Icon = LucideIcons[iconName];
  
  if (Icon) {
    return Icon;
  }
  
  // Fallback icon if not found
  console.warn(`Icon "${iconName}" not found in Lucide icons, using default`);
  return LucideIcons.Circle;
};

/**
 * Check if icon exists in Lucide
 * @param {string} iconName - Name of the icon
 * @returns {boolean} Whether icon exists
 */
export const iconExists = (iconName) => {
  return !!LucideIcons[iconName];
};

export default getIconComponent;
