import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LANGUAGES, CURRENCIES } from '../../constants';
import { Palette, Monitor, Sun, Moon, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const { t, currentLanguage, changeLanguage } = useLocalization();
  const { currentTheme, changeTheme, availableThemes, themeConfigs } = useTheme();

  const themeOptions = [
    { value: availableThemes.DEFAULT, label: 'Default Blue', icon: Sun },
    { value: availableThemes.PURPLE, label: 'Royal Purple', icon: Palette },
    { value: availableThemes.GREEN, label: 'Nature Green', icon: Sun },
    { value: availableThemes.ORANGE, label: 'Sunset Orange', icon: Sun },
    { value: availableThemes.BLUE, label: 'Ocean Blue', icon: Sun },
    { value: availableThemes.PINK, label: 'Rose Pink', icon: Palette },
    // { value: availableThemes.DARK, label: 'Dark Mode', icon: Moon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center mb-2">
          <SettingsIcon className="w-6 h-6 mr-2 text-gray-600" />
          <h2 className="text-2xl font-semibold">{t('settings')}</h2>
        </div>
        <p className="text-gray-600">Customize your application preferences and appearance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <Palette className="w-5 h-5 mr-2 text-gray-600" />
            <h3 className="text-lg font-semibold">Theme Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Choose Theme</label>
              <div className="grid grid-cols-1 gap-3">
                {themeOptions.map((theme) => {
                  const IconComponent = theme.icon;
                  const isSelected = currentTheme === theme.value;
                  const config = themeConfigs[theme.value];
                  
                  return (
                    <div
                      key={theme.value}
                      onClick={() => changeTheme(theme.value)}
                      className={`
                        p-4 rounded-lg border cursor-pointer transition-all duration-200
                        ${isSelected 
                          ? 'border-theme-primary bg-theme-primary-light ring-2 ring-theme-primary ring-opacity-20' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 min-w-0">
                          <IconComponent className="w-5 h-5 mr-3 text-gray-600 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-gray-900 text-sm">{theme.label}</span>
                            {isSelected && (
                              <div className="mt-1">
                                <span className="text-xs bg-theme-primary-light text-theme-primary px-2 py-1 rounded">
                                  Current
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Theme Color Preview */}
                        <div className="flex flex-col items-end space-y-1 ml-3 flex-shrink-0">
                          <div className="flex space-x-1">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: config.primaryColor }}
                              title="Primary Color"
                            ></div>
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: config.accentColor }}
                              title="Accent Color"
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">Preview</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Language and Localization */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <Monitor className="w-5 h-5 mr-2 text-gray-600" />
            <h3 className="text-lg font-semibold">Localization Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">App Name</label>
              <input 
                type="text" 
                defaultValue="Better Dashboard" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg form-input-theme" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('language')}</label>
              <select 
                value={currentLanguage}
                onChange={(e) => changeLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={LANGUAGES.EN}>English</option>
                <option value={LANGUAGES.AR}>العربية</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('currency')}</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value={CURRENCIES.OMR}>OMR (Omani Rial)</option>
                <option value={CURRENCIES.USD}>USD</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Additional Settings</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SMS Gateway</label>
              <input 
                type="text" 
                placeholder="SMS API Key" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Firebase FCM Key</label>
              <input 
                type="text" 
                placeholder="FCM Server Key" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <input type="checkbox" id="maintenance" className="mr-2" />
              <label htmlFor="maintenance" className="text-sm text-gray-700">{t('maintenanceMode')}</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="notifications" className="mr-2" />
              <label htmlFor="notifications" className="text-sm text-gray-700">Enable Push Notifications</label>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Regional Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Format
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="12">12 Hour</option>
              <option value="24">24 Hour</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number Format
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="1,234.56">1,234.56</option>
              <option value="1.234,56">1.234,56</option>
              <option value="1 234.56">1 234.56</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Week Start
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="monday">Monday</option>
              <option value="sunday">Sunday</option>
              <option value="saturday">Saturday</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2 btn-theme-primary rounded-lg transition-colors">
          {t('saveSettings')}
        </button>
      </div>
    </div>
  );
};

export default Settings;
