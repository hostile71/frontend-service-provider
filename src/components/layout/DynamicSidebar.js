import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X, Loader2 } from 'lucide-react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../contexts/AppContext';
import { useUser } from '../../contexts/UserContext';
import getIconComponent from '../../utils/iconMapper';

const DynamicSidebar = () => {
  const { t, isRTL } = useLocalization();
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    sidebarOpen,
    setSidebarOpen,
    expandedMenus,
    toggleMenu
  } = useAppContext();
  const { menus, menusLoading, menusError, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [hoveredItem, setHoveredItem] = React.useState(null);
  const [tooltipPosition, setTooltipPosition] = React.useState({ top: 0, left: 0 });
  const timeoutRef = React.useRef(null);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMenuClick = (item) => {
    if (item.children) {
      toggleMenu(item.id);
    } else if (item.path) {
      navigate(`/${item.path}`);
    }
  };

  const renderMenuItem = (item, isChild = false) => {
    const Icon = getIconComponent(item.icon);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus[item.id];
    const isActive = location.pathname === `/${item.path}`;
    // Check if any child is active to highlight parent
    const isChildActive = hasChildren && item.children.some(child => location.pathname === `/${child.path}`);
    const shouldHighlight = isActive || isChildActive;

    const handleMouseEnter = (event) => {
      if (sidebarCollapsed && hasChildren) {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltipPosition({
          top: rect.top,
          left: isRTL ? rect.left - 200 : rect.right + 2
        });
        setHoveredItem(item.id);
      }
    };

    const handleMouseLeave = () => {
      if (sidebarCollapsed && hasChildren) {
        // Set a timeout to hide the tooltip
        timeoutRef.current = setTimeout(() => {
          setHoveredItem(null);
        }, 200);
      }
    };

    return (
      <div key={item.id} className="relative">
        {hasChildren ? (
          <button
            onClick={() => handleMenuClick(item)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`sidebar-menu-item w-full flex items-center px-4 py-3 ${isRTL ? 'text-right' : 'text-left'} hover:bg-theme-hover transition-colors ${
              shouldHighlight 
                ? `sidebar-item-active ${isRTL ? 'rtl' : ''}` 
                : 'text-theme-text-secondary hover:text-theme-text'
            } ${sidebarCollapsed ? 'justify-center' : ''} ${isChild ? 'pl-8' : ''}`}
            title={sidebarCollapsed ? t(item.labelKey) : ''}
          >
            <Icon className={`w-5 h-5 ${sidebarCollapsed ? '' : (isRTL ? 'ml-3' : 'mr-3')}`} />
            {!sidebarCollapsed && (
              <>
                <span className="truncate flex-1">{t(item.labelKey)}</span>
                {hasChildren && (
                  <div className={`${isRTL ? 'mr-2' : 'ml-2'}`}>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                )}
              </>
            )}
          </button>
        ) : (
          <Link
            to={`/${item.path}`}
            className={`sidebar-menu-item w-full flex items-center px-4 py-3 ${isRTL ? 'text-right' : 'text-left'} hover:bg-theme-hover transition-colors ${
              shouldHighlight 
                ? `sidebar-item-active ${isRTL ? 'rtl' : ''}` 
                : 'text-theme-text-secondary hover:text-theme-text'
            } ${sidebarCollapsed ? 'justify-center' : ''} ${isChild ? 'pl-8' : ''}`}
            title={sidebarCollapsed ? t(item.labelKey) : ''}
          >
            <Icon className={`w-5 h-5 ${sidebarCollapsed ? '' : (isRTL ? 'ml-3' : 'mr-3')}`} />
            {!sidebarCollapsed && <span className="truncate flex-1">{t(item.labelKey)}</span>}
          </Link>
        )}
        
        {/* Render children if expanded and not collapsed */}
        {hasChildren && isExpanded && !sidebarCollapsed && (
          <div className="bg-theme-bg">
            {item.children.map(child => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  // Loading state
  if (menusLoading && isAuthenticated) {
    return (
      <div className={`hidden lg:flex flex-col bg-theme-sidebar border-theme-border shadow-lg transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-theme-primary" />
        </div>
      </div>
    );
  }

  // Error state
  if (menusError && isAuthenticated) {
    return (
      <div className={`hidden lg:flex flex-col bg-theme-sidebar border-theme-border shadow-lg transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="flex items-center justify-center h-full p-4">
          <p className="text-red-500 text-sm text-center">Failed to load menu</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show empty sidebar
  if (!isAuthenticated || menus.length === 0) {
    return (
      <div className={`hidden lg:flex flex-col bg-theme-sidebar border-theme-border shadow-lg transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-theme-border">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold text-theme-text">{t('appName')}</h1>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-md hover:bg-theme-hover text-theme-text transition-colors"
          >
            {sidebarCollapsed ? 
              (isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />) : 
              (isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />)
            }
          </button>
        </div>
        <nav className="mt-4 flex-1 overflow-y-auto">
          {/* Empty - no menus to show */}
        </nav>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex flex-col bg-theme-sidebar border-theme-border shadow-lg transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-theme-border">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold text-theme-text">{t('appName')}</h1>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-md hover:bg-theme-hover text-theme-text transition-colors"
          >
            {sidebarCollapsed ? 
              (isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />) : 
              (isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />)
            }
          </button>
        </div>
        
        <nav className="mt-4 flex-1 overflow-y-auto">
          {menus.map((item) => renderMenuItem(item))}
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:hidden fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-64 bg-theme-sidebar border-theme-border shadow-lg transition-colors duration-200`}>
        <div className="flex items-center justify-between p-4 border-b border-theme-border">
          <h1 className="text-xl font-bold text-theme-text">{t('appName')}</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-theme-hover text-theme-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-4 overflow-y-auto h-full pb-20">
          {menusLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-theme-primary" />
            </div>
          ) : (
            menus.map((item) => {
              const Icon = getIconComponent(item.icon);
              const hasChildren = item.children && item.children.length > 0;
              
              return (
                <div key={item.id}>
                  {hasChildren ? (
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className={`sidebar-menu-item w-full flex items-center px-4 py-3 ${isRTL ? 'text-right' : 'text-left'} hover:bg-theme-hover transition-colors ${
                        (location.pathname === `/${item.path}` || (item.children && item.children.some(child => location.pathname === `/${child.path}`)))
                          ? `sidebar-item-active ${isRTL ? 'rtl' : ''}` 
                          : 'text-theme-text-secondary hover:text-theme-text'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                      <span className="truncate flex-1">{t(item.labelKey)}</span>
                      <div className={`${isRTL ? 'mr-2' : 'ml-2'}`}>
                        {expandedMenus[item.id] ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                  ) : (
                    <Link
                      to={`/${item.path}`}
                      onClick={() => setSidebarOpen(false)}
                      className={`sidebar-menu-item w-full flex items-center px-4 py-3 ${isRTL ? 'text-right' : 'text-left'} hover:bg-theme-hover transition-colors ${
                        location.pathname === `/${item.path}`
                          ? `sidebar-item-active ${isRTL ? 'rtl' : ''}` 
                          : 'text-theme-text-secondary hover:text-theme-text'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                      <span className="truncate flex-1">{t(item.labelKey)}</span>
                    </Link>
                  )}
                  
                  {/* Mobile children */}
                  {hasChildren && expandedMenus[item.id] && (
                    <div className="bg-theme-bg">
                      {item.children.map(child => {
                        const ChildIcon = getIconComponent(child.icon);
                        return (
                          <Link
                            key={child.id}
                            to={`/${child.path}`}
                            onClick={() => setSidebarOpen(false)}
                            className={`sidebar-menu-item w-full flex items-center px-8 py-3 ${isRTL ? 'text-right' : 'text-left'} hover:bg-theme-hover transition-colors ${
                              location.pathname === `/${child.path}`
                                ? `sidebar-item-active ${isRTL ? 'rtl' : ''}` 
                                : 'text-theme-text-secondary hover:text-theme-text'
                            }`}
                          >
                            <ChildIcon className={`w-4 h-4 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                            {t(child.labelKey)}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Collapsed sidebar tooltip */}
      {sidebarCollapsed && hoveredItem && (
        <div 
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-48 z-[1000]"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            transform: 'translateY(-5px)'
          }}
          onMouseEnter={() => {
            // Clear timeout when entering tooltip
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          }}
          onMouseLeave={() => {
            // Hide tooltip immediately when leaving
            setHoveredItem(null);
          }}
        >
          {(() => {
            const item = menus.find(menuItem => menuItem.id === hoveredItem);
            if (!item || !item.children) return null;
            
            const ItemIcon = getIconComponent(item.icon);
            
            return (
              <>
                <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
                  <span className="font-medium text-gray-900 text-sm">{t(item.labelKey)}</span>
                </div>
                {item.children.map(child => {
                  const ChildIcon = getIconComponent(child.icon);
                  return (
                    <Link
                      key={child.id}
                      to={`/${child.path}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/${child.path}`);
                        setHoveredItem(null);
                      }}
                      className={`w-full flex items-center px-3 py-2 text-left hover:bg-theme-hover transition-colors text-sm cursor-pointer ${
                        location.pathname === `/${child.path}`
                          ? 'bg-theme-primary-light text-theme-primary font-medium' 
                          : 'text-gray-700 hover:text-theme-primary'
                      }`}
                    >
                      <ChildIcon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      <span>{t(child.labelKey)}</span>
                    </Link>
                  );
                })}
              </>
            );
          })()}
        </div>
      )}
    </>
  );
};

export default DynamicSidebar;
