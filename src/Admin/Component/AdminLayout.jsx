import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleAdminDropdown = () => {
    setShowAdminDropdown(!showAdminDropdown);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logout clicked');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Navigation items
  const navItems = [
    { 
      path: '/admin/dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      path: '/admin/products', 
      label: 'Products', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    { 
      path: '/admin/users', 
      label: 'Users', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.663 0-1.313.103-1.933.297" />
        </svg>
      )
    },
    { 
      path: '/admin/orders', 
      label: 'Orders', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#5c4024' }}>
      {/* Top Navbar - Matching Main Navbar Theme */}
      <nav className="fixed w-full z-10" style={{ backgroundColor: '#5c4024', borderBottom: '1px solid #AF8F6F' }}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-[#74512D] mr-2 transition-colors"
                style={{ color: '#F8F4E1' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-[#F8F4E1] tracking-wide">Admin Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Admin Button with Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleAdminDropdown}
                  className="p-2 rounded-lg hover:bg-[#74512D] transition-colors flex items-center"
                  style={{ color: '#F8F4E1' }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#AF8F6F' }}>
                    <span className="text-[#F8F4E1] font-medium">A</span>
                  </div>
                </button>
                
                {/* Admin Dropdown */}
                {showAdminDropdown && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg py-1 z-20 border border-[#AF8F6F]"
                    style={{ backgroundColor: '#5c4024', color: '#F8F4E1' }}>
                    <div className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#AF8F6F' }}>
                          <span className="text-[#F8F4E1] font-medium">A</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium" style={{ color: '#F8F4E1' }}>Admin User</p>
                          <p className="text-xs" style={{ color: '#AF8F6F' }}>admin@bagcollection.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="border-t py-1" style={{ borderColor: '#AF8F6F' }}>
                      <a href="#" className="block px-4 py-2 text-sm hover:bg-[#74512D] transition-colors font-medium" style={{ color: '#F8F4E1' }}>
                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile Settings
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm hover:bg-[#74512D] transition-colors font-medium" style={{ color: '#F8F4E1' }}>
                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Account Settings
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg hover:opacity-90 flex items-center transition-colors font-medium"
                style={{ backgroundColor: '#AF8F6F', color: '#F8F4E1' }}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} fixed transition-all duration-300`} style={{ 
          backgroundColor: '#5c4024', 
          height: 'calc(100vh - 64px)',
          overflow: 'hidden',
          borderRight: '1px solid #AF8F6F'
        }}>
          <div className="p-4 h-full flex flex-col">
            <div className="mb-8">
              {sidebarOpen && (
                <h2 className="text-sm font-medium tracking-wider uppercase" style={{ color: '#AF8F6F' }}>Admin Panel</h2>
              )}
            </div>
            
            {/* Navigation */}
            <nav className="space-y-2 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors relative group font-medium tracking-wide ${
                    location.pathname === item.path
                      ? 'border-l-4'
                      : 'hover:bg-[#74512D]'
                  }`}
                  style={{
                    backgroundColor: location.pathname === item.path ? '#74512D' : 'transparent',
                    color: location.pathname === item.path ? '#AF8F6F' : '#F8F4E1',
                    borderColor: location.pathname === item.path ? '#AF8F6F' : 'transparent'
                  }}
                >
                  <span style={{ 
                    color: location.pathname === item.path ? '#AF8F6F' : '#F8F4E1',
                    stroke: location.pathname === item.path ? '#AF8F6F' : '#F8F4E1'
                  }}>
                    {item.icon}
                  </span>
                  {sidebarOpen && (
                    <span className="ml-3" style={{ color: location.pathname === item.path ? '#AF8F6F' : '#F8F4E1' }}>
                      {item.label}
                    </span>
                  )}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap font-medium"
                      style={{ 
                        backgroundColor: '#AF8F6F', 
                        color: '#F8F4E1',
                        border: '1px solid #AF8F6F'
                      }}>
                      {item.label}
                    </div>
                  )}
                </Link>
              ))}
            </nav>
            
            {/* Simple spacer to maintain layout */}
            <div className="grow"></div>
            
            {/* Footer */}
            <div className="pt-6" style={{ borderTopColor: '#AF8F6F', borderTopWidth: '1px' }}>
              {sidebarOpen && (
                <div className="text-xs text-center font-medium" style={{ color: '#AF8F6F' }}>
                  © 2024 Bag Collection
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-6 transition-all duration-300`} style={{ backgroundColor: '#F8F4E1' }}>
          <div className="mb-6">
            <div className="text-sm font-medium tracking-wide mb-1 uppercase" style={{ color: '#AF8F6F' }}>
              Admin Dashboard
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#74512D' }}>
              {location.pathname.includes('/products') && 'Product Management'}
              {location.pathname.includes('/users') && 'User Management'}
              {location.pathname.includes('/orders') && 'Order Management'}
              {location.pathname.includes('/dashboard') && 'Dashboard Overview'}
            </h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;