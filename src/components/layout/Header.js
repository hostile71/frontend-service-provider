import React from 'react';
import { 
  Menu, 
  Globe, 
  Bell, 
  ChevronDown, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../contexts/AppContext';
import { MENU_ITEMS, LANGUAGES } from '../../constants';

const Header = () => {
  const { t, currentLanguage, changeLanguage, isRTL } = useLocalization();
  const { themeConfig } = useTheme();
  const { 
    activeTab, 
    setSidebarOpen, 
    showProfileMenu, 
    setShowProfileMenu, 
    setShowProfileSettings 
  } = useAppContext();

  const getPageTitle = () => {
    if (activeTab === 'dashboard') return t('dashboardOverview');
    
    // Find the menu item or child item that matches the active tab
    for (const menuItem of MENU_ITEMS) {
      if (menuItem.path === activeTab || menuItem.id === activeTab) {
        return t(menuItem.labelKey);
      }
      
      if (menuItem.children) {
        for (const child of menuItem.children) {
          if (child.path === activeTab || child.id === activeTab) {
            return t(child.labelKey);
          }
        }
      }
    }
    
    // Fallback to the activeTab value
    return activeTab;
  };

  return (
    <header className="bg-theme-header shadow-sm border-b border-theme-border px-4 md:px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center min-w-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className={`lg:hidden p-2 rounded-md hover:bg-gray-100 ${isRTL ? 'ml-3' : 'mr-3'}`}
          >
            <Menu className="w-5 h-5 text-theme-text" />
          </button>
          <h2 className="text-lg font-semibold capitalize truncate text-theme-text">
            {getPageTitle()}
          </h2>
        </div>
        
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2 md:space-x-4' : 'space-x-2 md:space-x-4'}`}>
          {/* Language Switcher */}
          <button 
            onClick={() => changeLanguage(currentLanguage === LANGUAGES.EN ? LANGUAGES.AR : LANGUAGES.EN)}
            className="p-2 text-theme-text-secondary hover:text-theme-primary flex items-center"
          >
            <Globe className="w-5 h-5" />
            <span className={`text-sm font-medium hidden sm:block ${isRTL ? 'mr-1' : 'ml-1'}`}>
              {currentLanguage === LANGUAGES.EN ? 'عربي' : 'EN'}
            </span>
          </button>
          
          <button className="p-2 text-theme-text-secondary hover:text-theme-primary relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <button 
              className={`flex items-center cursor-pointer ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="w-8 h-8 bg-theme-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">RS</span>
              </div>
              <div className="text-sm hidden sm:block">
                <p className="font-medium text-theme-text">Rabius Sani</p>
                <p className="text-theme-text-secondary text-xs">{t('superAdmin')}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-theme-text-secondary hidden sm:block" />
            </button>
            
            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="profile-menu w-48 bg-white rounded-lg shadow-lg border">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowProfileSettings(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('profileSettings')}
                  </button>
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close profile menu */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;
