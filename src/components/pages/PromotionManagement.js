import React, { useState, useCallback } from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ApiDataTable from '../ui/ApiDataTable';
import DetailViewModal from '../ui/DetailViewModal';
import { promotionService } from '../../services';
import { useDeletePromotion } from '../../hooks/usePromotions';

const PromotionManagement = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal, setEditItem } = useAppContext();
  const queryClient = useQueryClient();

  // State for detail view modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  // pagination/search state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch promotions with useQuery
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['promotions', currentPage, perPage, searchQuery],
    queryFn: () => {
      const params = {
        page: currentPage,
        per_page: perPage,
      };
      
      // Add search parameter - use the parameter name that API expects
      if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery;  // Most common parameter name
      }
      
      console.log('🌐 Fetching promotions with params:', params);
      return promotionService.getAll(params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log('📊 Current state:', { currentPage, perPage, searchQuery });
  console.log('📦 API Response data:', data);

  // Client-side filtering fallback - filter the data if server-side search doesn't filter
  const applyClientSideFilter = (items) => {
    if (!searchQuery || !searchQuery.trim() || !items) return items;
    const searchLower = searchQuery.toLowerCase();
    return items.filter(item => {
      return (
        (item.title && item.title.toLowerCase().includes(searchLower)) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(searchLower)) ||
        (item.subtext && item.subtext.toLowerCase().includes(searchLower))
      );
    });
  };

  const displayData = applyClientSideFilter(data?.data?.data || []);

  const deleteMutation = useDeletePromotion();

  const handleAddPromotion = useCallback(() => {
    setEditItem(null);
    setModalType('promotion');
    setShowModal(true);
  }, [setEditItem, setModalType, setShowModal]);

  const handleView = useCallback((item) => {
    setDetailItem(item);
    setShowDetailModal(true);
  }, []);

  const handleEdit = useCallback((item) => {
    setEditItem(item);
    setModalType('promotion');
    setShowModal(true);
  }, [setEditItem, setModalType, setShowModal]);

  const handleDelete = useCallback((item) => {
    if (window.confirm(`Are you sure you want to delete "${item.title || 'this promotion'}"?`)) {
      deleteMutation.mutate(item.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['promotions'] });
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

  const promotionColumns = [
    'Title',
    'Subtitle',
    'Discount',
    'Expiry Date',
    'Status'
  ];

  // Custom cell renderer for promotion-specific fields
  const renderCustomCell = (item, column, value, fieldKey) => {
    if (column === 'Discount') {
      return (
        <div className="text-sm">
          <div className="font-semibold text-green-600">
            {item.percentage || '-'}%
          </div>
          {item.max_amount && (
            <div className="text-gray-500 text-xs">Max: {item.max_amount} OMR</div>
          )}
        </div>
      );
    }

    if (column === 'Expiry Date') {
      const expiryDate = item.expired_at ? new Date(item.expired_at).toLocaleDateString() : '-';
      const isExpired = item.expired_at && new Date(item.expired_at) < new Date();
      return (
        <span className={isExpired ? 'text-red-600' : 'text-gray-900'}>
          {expiryDate}
        </span>
      );
    }

    if (column === 'Status') {
      const isActive = item.is_active === 1 || item.is_active === true || item.is_active === 'true';
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
          {isActive ? '✓ Active' : '✗ Inactive'}
        </span>
      );
    }

    return undefined; // Use default rendering
  };

  return (
    <>
      <ApiDataTable
        data={displayData}
        pagination={data?.data ? {
          current_page: data.data.current_page,
          last_page: data.data.last_page,
          per_page: data.data.per_page,
          total: data.data.total,
          from: data.data.from,
          to: data.data.to,
        } : null}
        columns={promotionColumns}
        title="Promotions"
        onAdd={handleAddPromotion}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading || isFetching}
        itemType="promotion"
        renderCustomCell={renderCustomCell}
      />

      {/* Detail View Modal */}
      <DetailViewModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        item={detailItem}
        type="promotion"
      />
    </>
  );
};

export default PromotionManagement;
