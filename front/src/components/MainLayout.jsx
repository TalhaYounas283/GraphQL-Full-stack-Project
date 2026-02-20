import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { 
  LogOut, 
  Calendar, 
  LayoutDashboard, 
  Users, 
  Ticket, 
  Menu,
  X,
  CalendarDays,
  Bell,
  Search
} from 'lucide-react';

const MainLayout = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'events', label: 'Events', icon: Calendar, path: '/event' },
    { id: 'users', label: 'Users', icon: Users, path: '/user' },
    { id: 'bookings', label: 'Bookings', icon: Ticket, path: '/booking' },
  ];

  const currentPath = location.pathname;
  const activeTab = navItems.find(item => item.path === currentPath)?.id || 'dashboard';

  const getPageTitle = () => {
    const item = navItems.find(i => i.path === currentPath);
    return item?.label || 'Dashboard';
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-brand">
            <div className="brand-icon">
              <CalendarDays size={20} color="white" />
            </div>
            <span className="brand-text">EventHub</span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="sidebar-close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <p className="nav-section-title">Main Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="sidebar-footer">
          <div className="user-profile-summary">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <p className="user-name">
                {user?.name || 'User'}
              </p>
              <p className="user-email">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
          <button 
            className="btn btn-outline btn-full"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Header */}
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
          <div className="header-left">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="menu-trigger"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="page-title">
                {getPageTitle()}
              </h1>
              <p className="page-subtitle">
                Manage your {getPageTitle().toLowerCase()} efficiently
              </p>
            </div>
          </div>

          <div className="header-right">
            {/* Search */}
            <div className="search-container">
              <Search size={18} color="#9ca3af" />
              <input 
                type="text" 
                placeholder="Search..."
                className="search-input"
              />
            </div>

            {/* Notifications */}
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
