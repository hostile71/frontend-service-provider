import React, { useState, useCallback } from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import { useUser } from '../../contexts/UserContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ApiDataTable from '../ui/ApiDataTable';
import AddItemModal from '../ui/AddItemModal';
import DetailViewModal from '../ui/DetailViewModal';
import { subcategoryService } from '../../services';
import { useDeleteSubcategory } from '../../hooks/useSubcategories';
import { buildAssetUrl } from '../../utils/assetHelpers';

const SubcategoryManagement = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal, setEditItem, showModal, modalType } = useAppContext();
  const { assetUrl } = useUser();
  const queryClient = useQueryClient();

  // State for detail view modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  // Pagination/search state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch subcategories with useQuery directly
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['subcategories', currentPage, perPage, searchQuery],
    queryFn: () => {
      const params = {
        page: currentPage,
        per_page: perPage,
        search_text: searchQuery,
      };
      console.log('🌐 Fetching subcategories with params:', params);
      return subcategoryService.getAll(params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log('📊 Subcategory state:', { currentPage, perPage, searchQuery });
  console.log('📦 Subcategory data:', data);

  const deleteMutation = useDeleteSubcategory();

  const handleAddSubcategory = useCallback(() => {
    setEditItem(null);
    setModalType('subcategory');
    setShowModal(true);
  }, [setEditItem, setModalType, setShowModal]);

  const handleView = useCallback((item) => {
    setDetailItem(item);
    setShowDetailModal(true);
  }, []);

  const handleEdit = useCallback((item) => {
    setEditItem(item);
    setModalType('subcategory');
    setShowModal(true);
  }, [setEditItem, setModalType, setShowModal]);

  const handleDelete = useCallback((item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name || 'this subcategory'}?`)) {
      deleteMutation.mutate(item.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['subcategories'] });
        }
      });
    }
  }, [deleteMutation, queryClient]);

  const handlePageChange = useCallback((page, newPerPage) => {
    console.log('📄 Page change requested:', page, newPerPage);
    if (newPerPage !== null && newPerPage !== undefined && newPerPage !== perPage) {
      setPerPage(newPerPage);
      setCurrentPage(1);
    } else if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [currentPage, perPage]);

  const handleSearch = useCallback((query) => {
    console.log('🔍 Search requested:', query);
    if (query !== searchQuery) {
      setSearchQuery(query);
      setCurrentPage(1);
    }
  }, [searchQuery]);

  const subcategoryColumns = [
    t('name'),
    'Category',
    'Icon',
    'Color',
    t('status')
  ];

  // Custom cell renderer for subcategory-specific fields
  const renderCustomCell = (item, column, value, fieldKey) => {
    if (column === 'Category') {
      return (
        <span className="text-sm text-gray-900">
          {item.category?.name || '-'}
        </span>
      );
    }

    if (column === 'Icon') {
      const iconUrl = item.icon ? `${assetUrl}/${item.icon}` : null;
      return (
        <div className="flex items-center justify-center">
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={item.name}
              className="w-10 h-10 object-cover rounded"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect width="40" height="40" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="sans-serif" font-size="12"%3E?%3C/text%3E%3C/svg%3E';
              }}
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400">?</div>
          )}
        </div>
      );
    }

    if (column === 'Color') {
      return (
        <div className="flex items-center space-x-2">
          {item.color && (
            <div
              className="w-8 h-8 rounded border border-gray-300"
              style={{ backgroundColor: item.color }}
            />
          )}
          <span className="text-xs text-gray-600">{item.color || '-'}</span>
        </div>
      );
    }

    return undefined;
  };

  return (
    <>
      <ApiDataTable
        data={data?.data?.data || data?.data || []}
        pagination={data?.data ? {
          current_page: data.data.current_page,
          last_page: data.data.last_page,
          per_page: data.data.per_page,
          total: data.data.total,
          from: data.data.from,
          to: data.data.to,
        } : null}
        columns={subcategoryColumns}
        title={t('subcategories')}
        onAdd={handleAddSubcategory}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading || isFetching}
        itemType="subcategory"
        renderCustomCell={renderCustomCell}
      />

      {/* Detail View Modal */}
      <DetailViewModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        item={detailItem}
        type="subcategory"
      />
    </>
  );
};

export default SubcategoryManagement;
