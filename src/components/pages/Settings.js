import React, { useState, useEffect } from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { LANGUAGES, CURRENCIES } from '../../constants';
import { Palette, Monitor, Sun, Moon, Settings as SettingsIcon } from 'lucide-react';
import { settingsService } from '../../services';

const Settings = () => {
  const { t, currentLanguage, changeLanguage } = useLocalization();
  const { currentTheme, changeTheme, availableThemes, themeConfigs } = useTheme();
  const toast = useToast();

  // State management
  const [themes, setThemes] = useState([]);
  const [userPreferences, setUserPreferences] = useState(null);
  const [appConfig, setAppConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form state - General Settings
  const [appName, setAppName] = useState('Better Dashboard');
  const [currency, setCurrency] = useState('USD');

  // Form state - Additional Settings
  const [smsGateway, setSmsGateway] = useState('');
  const [fcmKey, setFcmKey] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);

  // Form state - Regional Settings
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState('12');
  const [numberFormat, setNumberFormat] = useState('1,234.56');
  const [weekStartDay, setWeekStartDay] = useState('monday');

  // Fetch themes on component mount
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true);
        const response = await settingsService.getThemes({ isActive: true });
        const fetchedThemes = response.data.data || [];
        setThemes(fetchedThemes);
      } catch (err) {
        console.error('Error fetching themes:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  // Fetch user preferences on component mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await settingsService.getUserPreferences();
        const prefs = response.data;
        setUserPreferences(prefs);

        // Populate form state with fetched preferences
        setCurrency(prefs.currency_preference || 'USD');
        setSmsGateway(prefs.sms_gateway || '');
        setFcmKey(prefs.fcm_key || '');
        setMaintenanceMode(prefs.enable_notifications === false);
        setPushNotificationsEnabled(prefs.enable_push_notifications || false);
        setDateFormat(prefs.date_format || 'DD/MM/YYYY');
        setTimeFormat(prefs.time_format || '12');
        setNumberFormat(prefs.number_format || '1,234.56');
        setWeekStartDay(prefs.week_start_day || 'monday');
      } catch (err) {
        console.error('Error fetching preferences:', err);
        // Preferences might not be available yet, that's okay
      }
    };

    fetchPreferences();
  }, []);

  // Fetch app config on component mount
  useEffect(() => {
    const fetchAppConfig = async () => {
      try {
        const response = await settingsService.getAppConfig();
        setAppConfig(response.data);
        setAppName(response.data.app_name || 'Better Dashboard');
      } catch (err) {
        console.error('Error fetching app config:', err);
      }
    };

    fetchAppConfig();
  }, []);

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);

      // Save all user preferences - this matches the backend validation
      const preferencesPayload = {
        theme_preference: currentTheme,
        language_preference: currentLanguage,
        currency_preference: currency,
        date_format: dateFormat,
        time_format: timeFormat,
        number_format: numberFormat,
        week_start_day: weekStartDay,
        enable_notifications: !maintenanceMode, // inverse of maintenance mode
        enable_push_notifications: pushNotificationsEnabled,
      };

      const response = await settingsService.updateUserPreferences(preferencesPayload);

      // Save app config if changed
      if (appName !== appConfig?.app_name) {
        await settingsService.updateAppConfig({
          app_name: appName
        });
      }

      // Show success message
      const successMsg = response?.message || t('saveSuccess') || 'Settings saved successfully!';
      toast.success(successMsg);
      setUserPreferences(preferencesPayload);
    } catch (err) {
      console.error('Error saving settings:', err);
      const errorMsg = err.message || t('saveError') || 'Failed to save settings';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const themeOptions = themes.length > 0 ? themes : [
    { value: availableThemes.DEFAULT, label: 'Default Blue', icon: Sun },
    { value: availableThemes.PURPLE, label: 'Royal Purple', icon: Palette },
    { value: availableThemes.GREEN, label: 'Nature Green', icon: Sun },
    { value: availableThemes.ORANGE, label: 'Sunset Orange', icon: Sun },
    { value: availableThemes.BLUE, label: 'Ocean Blue', icon: Sun },
    { value: availableThemes.PINK, label: 'Rose Pink', icon: Palette },
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

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-8 bg-white rounded-lg">
          <p className="text-gray-500">Loading settings...</p>
        </div>
      )}

      {!loading && (
        <>
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
                      const IconComponent = theme.icon || Sun;
                      const themeValue = (theme.value || theme.name).toLowerCase();
                      const isSelected = currentTheme === themeValue;
                      const config = themeConfigs[themeValue];

                      return (
                        <div
                          key={themeValue}
                          onClick={() => changeTheme(themeValue)}
                          className={`
                            p-4 rounded-lg border cursor-pointer transition-all duration-200
                            ${isSelected
                              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-20'
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
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                      Current
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Theme Color Preview */}
                            {config && (
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
                            )}
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
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('language')}</label>
                  <select
                    value={currentLanguage}
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(LANGUAGES).map(([key, value]) => (
                      <option key={key} value={value}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('currency')}</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(CURRENCIES).map(([key, value]) => (
                      <option key={key} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Additional Settings</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMS Gateway</label>
                  <input
                    type="text"
                    placeholder="SMS API Key"
                    value={smsGateway}
                    onChange={(e) => setSmsGateway(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Firebase FCM Key</label>
                  <input
                    type="text"
                    placeholder="FCM Server Key"
                    value={fcmKey}
                    onChange={(e) => setFcmKey(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div> */}
              <div className="space-y-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{t('maintenanceMode') || 'Maintenance Mode'}</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pushNotificationsEnabled}
                    onChange={(e) => setPushNotificationsEnabled(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Enable Push Notifications</span>
                </label>
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Regional Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Format
                </label>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Format
                </label>
                <select
                  value={timeFormat}
                  onChange={(e) => setTimeFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="12">12 Hour</option>
                  <option value="24">24 Hour</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number Format
                </label>
                <select
                  value={numberFormat}
                  onChange={(e) => setNumberFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1,234.56">1,234.56</option>
                  <option value="1.234,56">1.234,56</option>
                  <option value="1 234.56">1 234.56</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Week Start
                </label>
                <select
                  value={weekStartDay}
                  onChange={(e) => setWeekStartDay(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monday">Monday</option>
                  <option value="sunday">Sunday</option>
                  <option value="saturday">Saturday</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <button
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {t('cancel') || 'Cancel'}
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : t('saveSettings') || 'Save Settings'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;
