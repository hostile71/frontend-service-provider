import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerms, setSearchTerms] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [showDetailView, setShowDetailView] = useState(false);
  const [detailViewItem, setDetailViewItem] = useState(null);
  const [detailViewType, setDetailViewType] = useState('');
  const [editItem, setEditItem] = useState(null);

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const openDetailView = (item, type) => {
    setDetailViewItem(item);
    setDetailViewType(type);
    setShowDetailView(true);
  };

  const closeDetailView = () => {
    setShowDetailView(false);
    setDetailViewItem(null);
    setDetailViewType('');
  };

  const value = {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    sidebarOpen,
    setSidebarOpen,
    searchTerms,
    setSearchTerms,
    showModal,
    setShowModal,
    modalType,
    setModalType,
    showProfileMenu,
    setShowProfileMenu,
    showProfileSettings,
    setShowProfileSettings,
    expandedMenus,
    setExpandedMenus,
    toggleMenu,
    showDetailView,
    setShowDetailView,
    detailViewItem,
    setDetailViewItem,
    detailViewType,
    setDetailViewType,
    openDetailView,
    closeDetailView,
    editItem,
    setEditItem
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
