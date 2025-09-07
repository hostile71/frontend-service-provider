import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../contexts/AppContext';
import { MENU_ITEMS } from '../../constants';

const Sidebar = () => {
  const { t, isRTL } = useLocalization();
  const { 
    activeTab, 
    setActiveTab, 
    sidebarCollapsed, 
    setSidebarCollapsed, 
    sidebarOpen, 
    setSidebarOpen,
    expandedMenus,
    toggleMenu
  } = useAppContext();

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
      // If it's a parent menu with children, toggle expansion
      toggleMenu(item.id);
    } else {
      // If it's a direct menu item or child item, set as active
      setActiveTab(item.path || item.id);
    }
  };

  const renderMenuItem = (item, isChild = false) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus[item.id];
    const isActive = activeTab === (item.path || item.id);
    
    // Check if any child is active to highlight parent
    const isChildActive = hasChildren && item.children.some(child => 
      activeTab === (child.path || child.id)
    );
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
        
        {/* Render children if expanded and not collapsed */}
        {hasChildren && isExpanded && !sidebarCollapsed && (
          <div className="bg-theme-bg">
            {item.children.map(child => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    );
  };

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
          {MENU_ITEMS.map((item) => renderMenuItem(item))}
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
          {MENU_ITEMS.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.children) {
                    toggleMenu(item.id);
                  } else {
                    setActiveTab(item.path || item.id);
                    setSidebarOpen(false);
                  }
                }}
                className={`sidebar-menu-item w-full flex items-center px-4 py-3 ${isRTL ? 'text-right' : 'text-left'} hover:bg-theme-hover transition-colors ${
                  (activeTab === (item.path || item.id) || (item.children && item.children.some(child => activeTab === (child.path || child.id))))
                    ? `sidebar-item-active ${isRTL ? 'rtl' : ''}` 
                    : 'text-theme-text-secondary hover:text-theme-text'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <span className="truncate flex-1">{t(item.labelKey)}</span>
                {item.children && (
                  <div className={`${isRTL ? 'mr-2' : 'ml-2'}`}>
                    {expandedMenus[item.id] ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                )}
              </button>
              
              {/* Mobile children */}
              {item.children && expandedMenus[item.id] && (
                <div className="bg-theme-bg">
                  {item.children.map(child => (
                    <button
                      key={child.id}
                      onClick={() => {
                        setActiveTab(child.path || child.id);
                        // Keep the parent menu expanded to show it's active
                        // Don't close the sidebar immediately to show the selection
                        setTimeout(() => setSidebarOpen(false), 100);
                      }}
                      className={`sidebar-menu-item w-full flex items-center px-8 py-3 ${isRTL ? 'text-right' : 'text-left'} hover:bg-theme-hover transition-colors ${
                        activeTab === (child.path || child.id)
                          ? `sidebar-item-active ${isRTL ? 'rtl' : ''}` 
                          : 'text-theme-text-secondary hover:text-theme-text'
                      }`}
                    >
                      <child.icon className={`w-4 h-4 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                      {t(child.labelKey)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
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
            const item = MENU_ITEMS.find(menuItem => menuItem.id === hoveredItem);
            if (!item || !item.children) return null;
            
            return (
              <>
                <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
                  <span className="font-medium text-gray-900 text-sm">{t(item.labelKey)}</span>
                </div>
                {item.children.map(child => (
                  <button
                    key={child.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Clicking child:', child.path || child.id);
                      setActiveTab(child.path || child.id);
                      // Also expand the parent menu to show it's active
                      toggleMenu(item.id);
                      setHoveredItem(null);
                    }}
                    className={`w-full flex items-center px-3 py-2 text-left hover:bg-theme-hover transition-colors text-sm cursor-pointer ${
                      activeTab === (child.path || child.id)
                        ? 'bg-theme-primary-light text-theme-primary font-medium' 
                        : 'text-gray-700 hover:text-theme-primary'
                    }`}
                  >
                    <child.icon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <span>{t(child.labelKey)}</span>
                  </button>
                ))}
              </>
            );
          })()}
        </div>
      )}
    </>
  );
};

export default Sidebar;
