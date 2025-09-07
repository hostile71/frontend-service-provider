import React from 'react';
import { Search, Filter, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import { filterData, getFieldValue } from '../../utils/helpers';
import StatusBadge from '../ui/StatusBadge';
import RatingStars from '../ui/RatingStars';

const DataTable = ({ 
  data, 
  columns, 
  title, 
  onAdd, 
  searchFields = ['name', 'email', 'title'],
  renderCustomCell,
  itemType = 'item' // New prop to specify the type of items in the table
}) => {
  const { t, currentLanguage, isRTL } = useLocalization();
  const { activeTab, searchTerms, setSearchTerms, openDetailView, setModalType, setShowModal, setEditItem } = useAppContext();
  
  const handleViewClick = (item) => {
    // Determine the type based on activeTab or itemType prop
    let type = itemType;
    if (type === 'item') {
      // Auto-detect type based on activeTab
      if (activeTab.includes('users') || activeTab === 'customers') {
        type = 'customer';
      } else if (activeTab.includes('provider')) {
        type = 'provider';
      } else if (activeTab.includes('service')) {
        type = 'service';
      } else if (activeTab.includes('booking')) {
        type = 'booking';
      } else if (activeTab.includes('payment')) {
        type = 'payment';
      } else if (activeTab.includes('notification')) {
        type = 'notification';
      } else if (activeTab.includes('banner')) {
        type = 'banner';
      } else if (activeTab.includes('translation')) {
        type = 'translation';
      } else if (activeTab.includes('category')) {
        type = 'category';
      } else {
        type = 'generic';
      }
    }
        console.log(activeTab, type);

    openDetailView(item, type);
  };

  const handleEditClick = (item) => {
    // Determine the type based on activeTab or itemType prop
    let type = itemType;
    if (type === 'item') {
      // Auto-detect type based on activeTab
      if (activeTab.includes('users') || activeTab === 'customers') {
        type = 'customer';
      } else if (activeTab.includes('provider')) {
        type = 'provider';
      } else if (activeTab.includes('service')) {
        type = 'service';
      } else if (activeTab.includes('booking')) {
        type = 'booking';
      } else if (activeTab.includes('payment')) {
        type = 'payment';
      } else if (activeTab.includes('notification')) {
        type = 'notification';
      } else if (activeTab.includes('banner')) {
        type = 'banner';
      } else if (activeTab.includes('translation')) {
        type = 'translation';
      } else if (activeTab.includes('category')) {
        type = 'category';
      } else {
        type = 'generic';
      }
    }
    console.log(activeTab, type);
    // Set the item to edit and open the modal in edit mode
    setEditItem(item);
    setModalType(type);
    setShowModal(true);
  };

  const searchTerm = searchTerms[activeTab] || '';
  const filteredData = filterData(data, searchTerm, searchFields);

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  
  // Calculate pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  
  // Reset to first page when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  // Generate page numbers for pagination display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
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
    
    if (fieldKey.includes('price') || fieldKey.includes('amount') || column === t('price') || column === 'Amount' || column === 'Revenue' || column === 'Commissions' || column === 'Total' || column === 'Commission') {
      return value !== null && value !== undefined ? <span className="font-medium">{value} OMR</span> : '-';
    }
    
    if (fieldKey.includes('rating') || column === t('rating')) {
      return value && <RatingStars rating={value} />;
    }
    
    if (column === 'Growth' || column === 'Success Rate' || column === 'Rate' || column === 'Change') {
      return value !== null && value !== undefined ? <span className="text-sm">{value}%</span> : '-';
    }
    
    if (column === 'Orders' || column === 'Requests' || column === 'Completed' || column === 'Recipients' || column === 'Value') {
      return value !== null && value !== undefined ? <span className="text-sm font-medium">{value.toLocaleString()}</span> : '-';
    }
    
    if (column === t('name') || column === t('serviceName')) {
      return (
        <span className="text-sm text-gray-900">
          {currentLanguage === 'ar' && item.nameAr ? item.nameAr : (value !== null && value !== undefined ? value : '-')}
        </span>
      );
    }
    
    return <span className="text-sm text-gray-900">{value !== null && value !== undefined ? value : '-'}</span>;
  };

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
                onChange={(e) => setSearchTerms({...searchTerms, [activeTab]: e.target.value})}
                className={`w-full sm:w-48 py-2 border border-gray-300 rounded-lg form-input-theme ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
              />
            </div>
            <button className={`flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap`}>
              <Filter className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('filter')}
            </button>
            {onAdd && (
              <button 
                onClick={onAdd}
                className="flex items-center justify-center px-4 py-2 btn-theme-primary rounded-lg whitespace-nowrap"
              >
                <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('add')} {title.split(' ')[0]}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className={`w-full ${isRTL ? 'table-rtl' : ''}`}>
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={`px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {column}
                </th>
              ))}
              <th className={`px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column, cellIndex) => {
                  const value = getFieldValue(item, column, t);
                  const fieldKey = column.toLowerCase().replace(/\s+/g, '');
                  
                  return (
                    <td key={cellIndex} className={`px-4 md:px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {renderCellContent(item, column, value, fieldKey)}
                    </td>
                  );
                })}
                <td className={`px-4 md:px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center space-x-1 md:space-x-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                    <button 
                      onClick={() => handleViewClick(item)}
                      className="p-1.5 md:p-2 text-gray-400 hover:text-blue-600 rounded transition-colors"
                      title={t('view')}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEditClick(item)}
                      className="p-1.5 md:p-2 text-gray-400 hover:text-green-600 rounded transition-colors"
                      title={t('edit')}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 md:p-2 text-gray-400 hover:text-red-600 rounded transition-colors"
                      title={t('delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? `${t('noResults')} "${searchTerm}"` : 'No data available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modern Pagination */}
      {totalItems > 0 && (
        <div className="px-4 py-4 border-t border-gray-200 bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Results info and per-page selector */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">per page</span>
              </div>
            </div>
            
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center space-x-1">
                {/* First page */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="First page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                
                {/* Previous page */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
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
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm rounded-md font-medium transition-colors ${
                        currentPage === pageNum
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
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                {/* Last page */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
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

export default DataTable;
