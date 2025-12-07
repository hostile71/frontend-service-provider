import React, { useState, useCallback } from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import { useQueryClient } from '@tanstack/react-query';
import ApiDataTable from '../ui/ApiDataTable';
import AddItemModal from '../ui/AddItemModal';
import DetailViewModal from '../ui/DetailViewModal';
import { useBookings, useDeleteBooking } from '../../hooks/useBookings';

const CompletedBookings = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal, setEditItem, showModal, modalType } = useAppContext();
  const queryClient = useQueryClient();

  // State for detail view modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  // Pagination/search state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch completed bookings with status filter
  const { data, isLoading, error, isFetching } = useBookings({
    page: currentPage,
    per_page: perPage,
    search_text: searchQuery,
    status: 'completed',
  });

  const deleteMutation = useDeleteBooking();

  const handleAddBooking = useCallback(() => {
    setEditItem(null);
    setModalType('booking');
    setShowModal(true);
  }, [setEditItem, setModalType, setShowModal]);

  const handleView = useCallback((item) => {
    setDetailItem(item);
    setShowDetailModal(true);
  }, []);

  const handleEdit = useCallback((item) => {
    setEditItem(item);
    setModalType('booking');
    setShowModal(true);
  }, [setEditItem, setModalType, setShowModal]);

  const handleDelete = useCallback((item) => {
    if (window.confirm(`Are you sure you want to delete this completed booking?`)) {
      deleteMutation.mutate(item.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['bookings'] });
        }
      });
    }
  }, [deleteMutation, queryClient]);

  const handlePageChange = useCallback((page, newPerPage) => {
    if (newPerPage !== null && newPerPage !== undefined && newPerPage !== perPage) {
      setPerPage(newPerPage);
      setCurrentPage(1);
    } else if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [currentPage, perPage]);

  const handleSearch = useCallback((query) => {
    if (query !== searchQuery) {
      setSearchQuery(query);
      setCurrentPage(1);
    }
  }, [searchQuery]);

  const bookingColumns = [
    t('customer'),
    'Service',
    t('provider'),
    'Date',
    'Time',
    'Mobile',
    t('status'),
    'Amount',
    'Completion',
    t('rating')
  ];

  // Custom cell renderer for booking-specific fields
  const renderCustomCell = (item, column, value, fieldKey) => {
    if (column === t('customer')) {
      const customer = item.customer || item.user;
      if (typeof customer === 'object' && customer !== null) {
        return (
          <span className="text-sm text-gray-900">
            {customer.first_name || customer.name || '-'}
          </span>
        );
      }
      return (
        <span className="text-sm text-gray-900">
          {customer || '-'}
        </span>
      );
    }

    if (column === 'Service') {
      return (
        <span className="text-sm text-gray-900">
          {item.service?.title || item.service?.name || '-'}
        </span>
      );
    }

    if (column === t('provider')) {
      const provider = item.provider;
      return (
        <span className="text-sm text-gray-900">
          {provider ? `${provider.first_name || ''} ${provider.last_name || ''}`.trim() : '-'}
        </span>
      );
    }

    if (column === 'Date') {
      return (
        <span className="text-sm text-gray-900">
          {item.booking_date ? new Date(item.booking_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
        </span>
      );
    }

    if (column === 'Time') {
      return (
        <span className="text-sm text-gray-900">
          {item.schedule_time || '-'}
        </span>
      );
    }

    if (column === 'Mobile') {
      return (
        <span className="text-sm text-gray-900">
          {item.mobile_no || '-'}
        </span>
      );
    }

    if (column === 'Amount') {
      return (
        <div className="text-sm">
          <div className="font-semibold text-gray-900">${item.net_amount || item.price || '0.00'}</div>
          {item.discount_amount > 0 && (
            <div className="text-xs text-gray-500">
              Discount: ${item.discount_amount}
            </div>
          )}
        </div>
      );
    }

    if (column === 'Completion') {
      return (
        <span className="text-sm text-gray-900">
          {item.completed_at ? new Date(item.completed_at).toLocaleDateString() : '-'}
        </span>
      );
    }

    if (column === t('rating')) {
      const rating = Number(item.rating) || 0;
      return (
        <div className="flex items-center">
          <span className="text-yellow-500 mr-1">★</span>
          <span className="text-sm font-medium text-gray-900">{rating.toFixed(1)}</span>
        </div>
      );
    }

    return undefined;
  };

  const totalBookings = data?.data?.total || 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('completedBookings')}</h1>
        <p className="text-gray-600">
          View and analyze all successfully completed service bookings and customer feedback.
        </p>
      </div>

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
        columns={bookingColumns}
        title={`${t('completedBookings')} (${totalBookings})`}
        onAdd={handleAddBooking}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading || isFetching}
        itemType="booking"
        renderCustomCell={renderCustomCell}
      />

      {/* Add/Edit Modal */}
      {showModal && modalType === 'booking' && (
        <AddItemModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditItem(null);
          }}
          type="booking"
        />
      )}

      {/* Detail View Modal */}
      <DetailViewModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        item={detailItem}
        type="booking"
      />
    </div>
  );
};

export default CompletedBookings;
