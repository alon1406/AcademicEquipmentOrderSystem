import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROLE_ADMIN, ROLE_CUSTOMER, ROLE_PROCUREMENT_MANAGER } from '../constants/roles';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  Users, 
  Package, 
  FileText, 
  Activity,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';

function NavItem({ icon: Icon, label, path, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`nav-item ${active ? 'active' : ''}`}
    >
      <Icon />
      {label}
    </button>
  );
}

function LayoutContent({ children }) {
  const { currentUser, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return <div className="loading-screen">Loading system...</div>;
  }

  // Define available routes based on role
  const getNavItems = () => {
    if (!currentUser) return [];
    
    const items = [{ label: 'Catalog', icon: ShoppingBag, path: '/catalog' }];

    if (currentUser.role === ROLE_CUSTOMER) {
      items.push({ label: 'My Orders', icon: ShoppingCart, path: '/orders' });
    }

    if (currentUser.role === ROLE_PROCUREMENT_MANAGER || currentUser.role === ROLE_ADMIN) {
      items.unshift({ label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' });
      items.push({ label: 'All Orders', icon: ShoppingCart, path: '/orders' });
      items.push({ label: 'Reports', icon: FileText, path: '/reports' });
    }

    if (currentUser.role === ROLE_ADMIN) {
      items.push({ label: 'Manage Users', icon: Users, path: '/users' });
      items.push({ label: 'Manage Products', icon: Package, path: '/manageproducts' });
      items.push({ label: 'System Logs', icon: Activity, path: '/logs' });
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Package size={20} />
            </div>
            EduEquip
          </div>
          <div className="sidebar-subtitle">Procurement System</div>
        </div>

        <div className="session-panel">
          <div className="session-card">
            <p className="session-label">Current Session</p>
            <div className="session-info">
              <div className="session-user-info">
                <div className="session-avatar">
                  <User size={16} />
                </div>
                <div>
                  <p className="session-username">
                    {currentUser?.username || 'Guest'}
                  </p>
                  <p className="session-role">
                    {currentUser?.role?.replace(/_/g, ' ') || 'No Role'}
                  </p>
                </div>
              </div>
              
              <button 
                className="btn btn-ghost btn-icon"
                onClick={handleLogout}
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavItem 
              key={item.label} 
              {...item}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Package size={16} />
          </div>
          EduEquip
        </div>
        <button 
          className="btn btn-ghost btn-icon"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="sheet">
            <div className="sheet-header flex items-center justify-between">
              <span>Menu</span>
              <button 
                className="btn btn-ghost btn-icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavItem 
                  key={item.label}
                  {...item}
                  active={location.pathname === item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                />
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function Layout({ children }) {
  return (
    <LayoutContent>
      {children}
    </LayoutContent>
  );
}
