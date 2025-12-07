import React, { useState, useCallback } from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import { useQueryClient } from '@tanstack/react-query';
import ApiDataTable from '../ui/ApiDataTable';
import AddItemModal from '../ui/AddItemModal';
import DetailViewModal from '../ui/DetailViewModal';
import { useBookings, useDeleteBooking } from '../../hooks/useBookings';

const BookingManagement = () => {
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

  // Fetch bookings with useQuery directly
  const { data, isLoading, error, isFetching } = useBookings({
    page: currentPage,
    per_page: perPage,
    search_text: searchQuery,
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
    if (window.confirm(`Are you sure you want to delete booking for ${item.customer || item.service || 'this booking'}?`)) {
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
    'Amount'
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
        columns={bookingColumns}
        title={t('bookingManagement')}
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

      {/* Detail View Modal */}
      <DetailViewModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        item={detailItem}
        type="booking"
      />
    </>
  );
};

export default BookingManagement;
