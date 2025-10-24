import React, { useState, useCallback } from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { useCategories, useDeleteCategory } from '../../hooks/useCategories';
import ApiDataTable from '../ui/ApiDataTable';

const Categories = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();
  const toast = useToast();
  
  // State for pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch categories with React Query
  const { data, isLoading, error, isFetching } = useCategories({
    page: currentPage,
    per_page: perPage,
    search: searchQuery,
  });

  // Delete mutation
  const deleteMutation = useDeleteCategory();

  const handleAddCategory = () => {
    setModalType('category');
    setShowModal(true);
  };

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

  const handleDelete = async (item) => {
    if (window.confirm(`${t('confirmDelete')} "${item.name}"?`)) {
      try {
        await deleteMutation.mutateAsync(item.id);
        toast.success(t('deleteSuccess'));
      } catch (error) {
        toast.error(error.message || t('deleteError'));
      }
    }
  };

  const categoryColumns = [
    t('name'), 
    'Service Count', 
    t('status'), 
    t('description')
  ];

  // Permission IDs for category CRUD operations (matching API response)
  const categoryPermissions = {
    view: 'category.view',
    create: 'category.create',
    edit: 'category.edit',
    delete: 'category.delete',
  };

  return (
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
      onDelete={handleDelete}
      isLoading={isLoading || isFetching}
      permissions={categoryPermissions}
      itemType="category"
    />
  );
};

export default Categories;
