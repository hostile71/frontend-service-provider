import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useUser } from '../../contexts/UserContext';
import { useAppContext } from '../../contexts/AppContext';
import { getFieldValue } from '../../utils/helpers';
import StatusBadge from '../ui/StatusBadge';
import RatingStars from '../ui/RatingStars';

/**
 * API-Integrated DataTable Component with Pagination, Search, and Permission-based Actions
 * 
 * @param {Array} data - Array of items to display (from API response data.data)
 * @param {Object} pagination - Pagination metadata from API
 * @param {Array} columns - Column headers
 * @param {string} title - Table title
 * @param {Function} onAdd - Add button handler
 * @param {Function} onPageChange - Page change handler
 * @param {Function} onSearch - Search handler
 * @param {Function} onView - View button handler
 * @param {Function} onEdit - Edit button handler
 * @param {Function} onDelete - Delete button handler
 * @param {boolean} isLoading - Loading state
 * @param {Object} permissions - Permission IDs for CRUD operations
 * @param {string} itemType - Type of items (for modal)
 * @param {Function} renderCustomCell - Custom cell renderer
 */
const ApiDataTable = ({
  data = [],
  pagination = null,
  columns = [],
  title = '',
  onAdd = null,
  onPageChange = null,
  onSearch = null,
  onView = null,
  onEdit = null,
  onDelete = null,
  isLoading = false,
  permissions = {},
  itemType = 'item',
  renderCustomCell = null
}) => {
  const { t, isRTL } = useLocalization();
  const { hasPermission } = useUser();
  const { openDetailView, setModalType, setShowModal, setEditItem } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Trigger search when debounced term changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);

  // Check permissions for actions
  const canView = permissions.view ? hasPermission(permissions.view) : true;
  const canCreate = permissions.create ? hasPermission(permissions.create) : true;
  const canEdit = permissions.edit ? hasPermission(permissions.edit) : true;
  const canDelete = permissions.delete ? hasPermission(permissions.delete) : true;

  const handleViewClick = (item) => {
    if (onView) {
      onView(item);
    } else {
      openDetailView(item, itemType);
    }
  };

  const handleEditClick = (item) => {
    if (onEdit) {
      onEdit(item);
    } else {
      setEditItem(item);
      setModalType(itemType);
      setShowModal(true);
    }
  };

  const handleDeleteClick = (item) => {
    if (onDelete) {
      onDelete(item);
    }
  };

  const handlePageClick = (page) => {
    if (onPageChange && page !== pagination?.current_page) {
      onPageChange(page, null);
    }
  };

  const handlePerPageChange = (perPage) => {
    if (onPageChange) {
      onPageChange(1, perPage);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    if (!pagination) return [];

    const { current_page, last_page } = pagination;
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, current_page - halfVisible);
    let endPage = Math.min(last_page, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const renderCellContent = (item, column, value, fieldKey) => {
    // Custom cell renderer
    if (renderCustomCell) {
      const customContent = renderCustomCell(item, column, value, fieldKey);
      if (customContent !== undefined) return customContent;
    }

    // Default cell rendering logic
    if (fieldKey.includes('status') || column === t('status')) {
      return <StatusBadge status={value} />;
    }

    if (fieldKey.includes('price') || fieldKey.includes('amount') || column === t('price')) {
      return value !== null && value !== undefined ? <span className="font-medium">{value} OMR</span> : '-';
    }

    if (fieldKey.includes('rating') || column === t('rating')) {
      return value && <RatingStars rating={value} />;
    }

    if (column === 'Growth' || column === 'Success Rate') {
      return value !== null && value !== undefined ? <span className="text-sm">{value}%</span> : '-';
    }

    return <span className="text-sm text-gray-900">{value !== null && value !== undefined ? value : '-'}</span>;
  };

  // Show action column only if user has at least one permission
  const showActions = canView || canEdit || canDelete;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                placeholder={`${t('search')}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full sm:w-48 py-2 border border-gray-300 rounded-lg form-input-theme ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
              />
            </div>
            <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap">
              <Filter className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('filter')}
            </button>
            {onAdd && canCreate && (
              <button
                onClick={onAdd}
                className="flex items-center justify-center px-4 py-2 btn-theme-primary rounded-lg whitespace-nowrap"
              >
                <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('add')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto thin-scrollbar">
        <table className={`w-full ${isRTL ? 'table-rtl' : ''}`}>
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={`px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {column}
                </th>
              ))}
              {showActions && (
                <th className={`px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('actions')}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (showActions ? 1 : 0)} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3">{t('loading')}...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (showActions ? 1 : 0)} className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? `${t('noResults')} "${searchTerm}"` : 'No data available'}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  {columns.map((column, cellIndex) => {
                    const value = getFieldValue(item, column, t);
                    const fieldKey = column.toLowerCase().replace(/\s+/g, '');

                    return (
                      <td key={cellIndex} className={`px-4 md:px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {renderCellContent(item, column, value, fieldKey)}
                      </td>
                    );
                  })}
                  {showActions && (
                    <td className={`px-4 md:px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className={`flex items-center space-x-1 md:space-x-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                        {canView && (
                          <button
                            onClick={() => handleViewClick(item)}
                            className="p-1.5 md:p-2 text-gray-400 hover:text-blue-600 rounded transition-colors"
                            title={t('view')}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {canEdit && (
                          <button
                            onClick={() => handleEditClick(item)}
                            className="p-1.5 md:p-2 text-gray-400 hover:text-green-600 rounded transition-colors"
                            title={t('edit')}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="p-1.5 md:p-2 text-gray-400 hover:text-red-600 rounded transition-colors"
                            title={t('delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* API Pagination */}
      {pagination && pagination.total > 0 && (
        <div className="px-4 py-4 border-t border-gray-200 bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Results info and per-page selector */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Showing {pagination.from} to {pagination.to} of {pagination.total} results
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show:</span>
                <select
                  value={String(pagination.per_page)}
                  onChange={(e) => handlePerPageChange(parseInt(e.target.value, 10))}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span className="text-sm text-gray-700">per page</span>
              </div>
            </div>

            {/* Pagination controls */}
            {pagination.last_page > 1 && (
              <div className="flex items-center space-x-1">
                {/* First page */}
                <button
                  onClick={() => handlePageClick(1)}
                  disabled={pagination.current_page === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="First page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Previous page */}
                <button
                  onClick={() => handlePageClick(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageClick(pageNum)}
                      className={`px-3 py-2 text-sm rounded-md font-medium transition-colors ${pagination.current_page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                {/* Next page */}
                <button
                  onClick={() => handlePageClick(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Last page */}
                <button
                  onClick={() => handlePageClick(pagination.last_page)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Last page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiDataTable;
