import React, { useState, useCallback } from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import { useQueryClient } from '@tanstack/react-query';
import ApiDataTable from '../ui/ApiDataTable';
import AddItemModal from '../ui/AddItemModal';
import DetailViewModal from '../ui/DetailViewModal';
import { useCategories, useDeleteCategory } from '../../hooks/useCategories';

const CategoryManagement = () => {
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

  const { data, isLoading, error, isFetching } = useCategories({
    page: currentPage,
    per_page: perPage,
    search: searchQuery,
  });

  const deleteMutation = useDeleteCategory();

  const handleAddCategory = useCallback(() => {
    setEditItem(null);
    setModalType('category');
    setShowModal(true);
  }, [setEditItem, setModalType, setShowModal]);

  const handleView = useCallback((item) => {
    setDetailItem(item);
    setShowDetailModal(true);
  }, []);

  const handleEdit = useCallback((item) => {
    setEditItem(item);
    setModalType('category');
    setShowModal(true);
  }, [setEditItem, setModalType, setShowModal]);

  const handleDelete = useCallback((item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name || 'this category'}?`)) {
      deleteMutation.mutate(item.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['categories'] });
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

  const handleSearch = useCallback((term) => {
    if (term !== searchQuery) {
      setSearchQuery(term);
      setCurrentPage(1);
    }
  }, [searchQuery]);

  const categoryColumns = [
    t('name'),
    t('description'),
    'Service Count',
    t('status')
  ];

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
        columns={categoryColumns}
        title={t('categories')}
        onAdd={handleAddCategory}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading || isFetching}
        itemType="category"
      />

      {/* Detail View Modal */}
      <DetailViewModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        item={detailItem}
        type="category"
      />
    </>
  );
};

export default CategoryManagement;
