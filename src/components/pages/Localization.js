import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import DataTable from '../ui/DataTable';

const Localization = () => {
  const { t, currentLanguage, changeLanguage } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();

  const handleAddTranslation = () => {
    setModalType('translation');
    setShowModal(true);
  };

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇴🇲' }
  ];

  const translationKeys = [
    { 
      id: 1,
      key: 'dashboard', 
      english: 'Dashboard', 
      arabic: 'لوحة القيادة',
      category: 'Navigation',
      status: 'active',
      description: 'Main dashboard page title'
    },
    { 
      id: 2,
      key: 'userManagement', 
      english: 'User Management', 
      arabic: 'إدارة المستخدمين',
      category: 'Navigation',
      status: 'active',
      description: 'User management section title'
    },
    { 
      id: 3,
      key: 'serviceManagement', 
      english: 'Service Management', 
      arabic: 'إدارة الخدمات',
      category: 'Navigation',
      status: 'active',
      description: 'Service management section title'
    },
    { 
      id: 4,
      key: 'bookingManagement', 
      english: 'Booking Management', 
      arabic: 'إدارة الحجوزات',
      category: 'Navigation',
      status: 'active',
      description: 'Booking management section title'
    },
    { 
      id: 5,
      key: 'financial', 
      english: 'Financial', 
      arabic: 'المالية',
      category: 'Navigation',
      status: 'active',
      description: 'Financial section title'
    },
    { 
      id: 6,
      key: 'reportsAnalytics', 
      english: 'Reports & Analytics', 
      arabic: 'التقارير والتحليلات',
      category: 'Navigation',
      status: 'active',
      description: 'Reports and analytics section title'
    },
    { 
      id: 7,
      key: 'contentManagement', 
      english: 'Content Management', 
      arabic: 'إدارة المحتوى',
      category: 'Navigation',
      status: 'active',
      description: 'Content management section title'
    },
    { 
      id: 8,
      key: 'systemSettings', 
      english: 'System Settings', 
      arabic: 'إعدادات النظام',
      category: 'Navigation',
      status: 'active',
      description: 'System settings section title'
    }
  ];

  const translationColumns = [
    'Key', 
    'English', 
    'Arabic', 
    'Category',
    t('status')
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('localization')}</h1>
        <p className="text-gray-600">
          Manage application languages, translations, and regional settings.
        </p>
      </div>

      {/* Current Language Settings */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Current Language Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Active Language
            </label>
            <div className="flex items-center space-x-3">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                    currentLanguage === lang.code
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Translation Management using DataTable */}
      <DataTable
        data={translationKeys}
        columns={translationColumns}
        title="Translation Management"
        onAdd={handleAddTranslation}
        searchFields={['key', 'english', 'arabic', 'category']}
        itemType="translation"
        renderCustomCell={(item, column, value, fieldKey) => {
          if (column === 'Arabic') {
            return <span dir="rtl" className="text-sm text-gray-900">{value}</span>;
          }
          if (column === 'Key') {
            return <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{value}</span>;
          }
          return undefined; // Use default rendering
        }}
      />
    </div>
  );
};

export default Localization;
