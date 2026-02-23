import React, { useState, useCallback, useEffect } from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { localizationService } from '../../services';
import { useDeleteTranslation } from '../../hooks/useLocalization';
import ApiDataTable from '../ui/ApiDataTable';

const Localization = () => {
  const { t, currentLanguage, changeLanguage } = useLocalization();
  const { setModalType, setShowModal, showModal, setEditItem } = useAppContext();
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteTranslation();

  // State management
  const [languages, setLanguages] = useState([]);

  // Fetch languages on component mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await localizationService.getLanguages();
        setLanguages(response.data.data || []);
      } catch (err) {
        console.error('Error fetching languages:', err);
      }
    };

    fetchLanguages();
  }, []);

  // Fetch translations using React Query for automatic refetch
  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['translations'],
    queryFn: () => localizationService.getTranslations({
      page: 1,
      limit: 50,
      status: 'active'
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const translationKeys = data?.data?.data || [];

  // Refetch translations when modal closes (after adding/editing)
  useEffect(() => {
    if (!showModal) {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
    }
  }, [showModal, queryClient]);

  const handleAddTranslation = useCallback(() => {
    setEditItem(null);
    setModalType('translation');
    setShowModal(true);
  }, [setEditItem, setModalType, setShowModal]);

  const handleEdit = useCallback((item) => {
    setEditItem(item);
    setModalType('translation');
    setShowModal(true);
  }, [setEditItem, setModalType, setShowModal]);

  const handleDeleteTranslation = useCallback((item) => {
    if (window.confirm('Are you sure you want to delete this translation?')) {
      deleteMutation.mutate(item.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['translations'] });
        }
      });
    }
  }, [deleteMutation, queryClient]);

  const translationColumns = [
    'Key',
    'English',
    'Arabic',
    'Category',
    t('status')
  ];

  // Show error state
  if (error && translationKeys.length === 0) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 font-semibold mb-2">Error loading data</p>
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

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
            <div className="flex items-center space-x-3 flex-wrap gap-2">
              {languages.length > 0 ? (
                languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${currentLanguage === lang.code
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.native_name}</span>
                  </button>
                ))
              ) : (
                <p className="text-gray-500">Loading languages...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Translation Management using ApiDataTable */}
      <ApiDataTable
        data={translationKeys}
        columns={translationColumns}
        title="Translation Management"
        onAdd={handleAddTranslation}
        onEdit={handleEdit}
        onDelete={handleDeleteTranslation}
        itemType="translation"
        isLoading={loading}
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
