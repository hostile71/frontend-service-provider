import React, { useState, useCallback } from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ApiDataTable from '../ui/ApiDataTable';
import AddItemModal from '../ui/AddItemModal';
import DetailViewModal from '../ui/DetailViewModal';
import { serviceService } from '../../services';
import { useDeleteService } from '../../hooks/useServices';

const ServiceManagement = () => {
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

  // Fetch services with useQuery directly (like UserManagement)
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['services', currentPage, perPage, searchQuery],
    queryFn: () => {
      const params = {
        page: currentPage,
        per_page: perPage,
        search_text: searchQuery, // Backend expects search_text, not search
      };
      console.log('🌐 Fetching services with params:', params);
      console.log('🔍 Search query value:', searchQuery);
      return serviceService.getAll(params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log('📊 Current state:', { currentPage, perPage, searchQuery });
  console.log('📦 API Response data:', data);

  const deleteMutation = useDeleteService();

  const handleAddService = useCallback(() => {
    setEditItem(null);
    setModalType('service');
    setShowModal(true);
  }, [setEditItem, setModalType, setShowModal]);

  const handleView = useCallback((item) => {
    setDetailItem(item);
    setShowDetailModal(true);
  }, []);

  const handleEdit = useCallback((item) => {
    setEditItem(item);
    setModalType('service');
    setShowModal(true);
  }, [setEditItem, setModalType, setShowModal]);

  const handleDelete = useCallback((item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name || item.title || 'this service'}?`)) {
      deleteMutation.mutate(item.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['services'] });
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

  // Log when query key changes
  console.log('📊 Current query params:', { currentPage, perPage, searchQuery });

  const serviceColumns = [
    t('serviceName'),
    'Category/Subcategory',
    t('provider'),
    'Price/Duration',
    'Rating/Verified',
    t('status')
  ];

  // Custom cell renderer for service-specific fields
  const renderCustomCell = (item, column, value, fieldKey) => {
    if (column === 'Category/Subcategory') {
      return (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {item.sub_category?.category?.name || item.category?.name || '-'}
          </div>
          <div className="text-gray-500 text-xs">
            {item.sub_category?.name || '-'}
          </div>
        </div>
      );
    }

    if (column === 'Price/Duration') {
      return (
        <div className="text-sm">
          <div className="font-semibold text-green-600">
            {item.price ? `${item.price} OMR` : '-'}
          </div>
          {item.duration && (
            <div className="text-gray-500 text-xs">{item.duration}</div>
          )}
        </div>
      );
    }

    if (column === 'Rating/Verified') {
      // Calculate average rating
      let avgRating = 0;
      if (item.ratings && Array.isArray(item.ratings) && item.ratings.length > 0) {
        const sum = item.ratings.reduce((acc, r) => acc + parseFloat(r.rating || 0), 0);
        avgRating = (sum / item.ratings.length).toFixed(1);
      } else if (item.rating) {
        avgRating = parseFloat(item.rating).toFixed(1);
      }

      const isVerified = item.is_verified === 1 || item.is_verified === true || item.is_verified === 'true';

      return (
        <div className="space-y-1">
          {avgRating > 0 ? (
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500">★</span>
              <span className="text-sm font-medium text-gray-900">{avgRating}</span>
              {item.ratings && item.ratings.length > 0 && (
                <span className="text-xs text-gray-500">({item.ratings.length})</span>
              )}
            </div>
          ) : (
            <span className="text-xs text-gray-400">No ratings</span>
          )}
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
            {isVerified ? '✓ Verified' : '✗ Not Verified'}
          </span>
        </div>
      );
    }

    if (column === 'Subcategory') {
      return <span className="text-sm text-gray-900">{item.sub_category?.name || '-'}</span>;
    }

    if (column === 'Verified') {
      const isVerified = item.is_verified === 1 || item.is_verified === true || item.is_verified === 'true';
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
          {isVerified ? '✓ Verified' : '✗ Not Verified'}
        </span>
      );
    }

    if (column === t('rating') || fieldKey === 'rating') {
      // Calculate average rating from ratings array
      let avgRating = 0;
      if (item.ratings && Array.isArray(item.ratings) && item.ratings.length > 0) {
        const sum = item.ratings.reduce((acc, r) => acc + parseFloat(r.rating || 0), 0);
        avgRating = (sum / item.ratings.length).toFixed(1);
      } else if (item.rating) {
        avgRating = parseFloat(item.rating).toFixed(1);
      }

      if (avgRating > 0) {
        return (
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm font-medium text-gray-900">{avgRating}</span>
            {item.ratings && item.ratings.length > 0 && (
              <span className="text-xs text-gray-500">({item.ratings.length})</span>
            )}
          </div>
        );
      }
      return <span className="text-sm text-gray-400">No ratings</span>;
    }

    return undefined; // Use default rendering
  };

  return (
    <>
      <ApiDataTable
        data={data?.data?.data || []}
        pagination={data?.data ? {
          current_page: data.data.current_page,
          last_page: data.data.last_page,
          per_page: data.data.per_page,
          total: data.data.total,
          from: data.data.from,
          to: data.data.to,
        } : null}
        columns={serviceColumns}
        title={t('serviceManagement')}
        onAdd={handleAddService}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading || isFetching}
        itemType="service"
        renderCustomCell={renderCustomCell}
      />

      {/* Detail View Modal */}
      <DetailViewModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        item={detailItem}
        type="service"
      />
    </>
  );
};

export default ServiceManagement;
