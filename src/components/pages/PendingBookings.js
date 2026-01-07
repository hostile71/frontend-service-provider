import React, { useState, useCallback } from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import { useQueryClient } from '@tanstack/react-query';
import ApiDataTable from '../ui/ApiDataTable';
import AddItemModal from '../ui/AddItemModal';
import DetailViewModal from '../ui/DetailViewModal';
import { useBookings, useDeleteBooking } from '../../hooks/useBookings';

const PendingBookings = () => {
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

  // Fetch pending bookings with status filter
  const { data, isLoading, error, isFetching } = useBookings({
    page: currentPage,
    per_page: perPage,
    search_text: searchQuery,
    status: 'pending',
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
    if (window.confirm(`Are you sure you want to delete this pending booking?`)) {
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
    'Priority'
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

    if (column === 'Priority') {
      const daysDiff = item.booking_date ?
        Math.ceil((new Date(item.booking_date) - new Date()) / (1000 * 60 * 60 * 24)) : null;

      let priority = 'Normal';
      let priorityColor = 'text-blue-600 bg-blue-50';

      if (daysDiff !== null) {
        if (daysDiff <= 1) {
          priority = 'Urgent';
          priorityColor = 'text-red-600 bg-red-50';
        } else if (daysDiff <= 3) {
          priority = 'High';
          priorityColor = 'text-orange-600 bg-orange-50';
        }
      }

      return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColor}`}>
          {priority}
        </span>
      );
    }

    return undefined;
  };

  const totalBookings = data?.data?.total || 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('pendingBookings')}</h1>
        <p className="text-gray-600">
          Manage and track all pending service bookings that require attention.
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
        title={`${t('pendingBookings')} (${totalBookings})`}
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
    </div>
  );
};

export default PendingBookings;
