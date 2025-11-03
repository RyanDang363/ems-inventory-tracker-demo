import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  AlertTriangle, 
  ClipboardList,
  Menu,
  X,
  Activity,
  LogOut,
  User
} from 'lucide-react';

const Layout = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Low Stock', href: '/low-stock', icon: AlertTriangle },
    { name: 'Transactions', href: '/transactions', icon: ClipboardList },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white shadow-lg`}>
        <div className="flex flex-col h-full">
          <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} p-4 border-b`}>
            {sidebarOpen ? (
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-red-600" />
                <span className="text-xl font-bold text-gray-800">EMS Tracker</span>
              </div>
            ) : (
              <Activity className="h-10 w-10 text-red-600" />
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-1 rounded-lg hover:bg-gray-100 ${!sidebarOpen ? 'absolute top-4 right-2' : ''}`}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center ${sidebarOpen ? 'space-x-3 px-3' : 'justify-center px-2'} ${sidebarOpen ? 'py-2' : 'py-3'} rounded-lg transition-all ${
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={!sidebarOpen ? item.name : ''}
                >
                  <Icon className={`${sidebarOpen ? 'h-5 w-5' : 'h-7 w-7'} transition-all duration-300`} />
                  {sidebarOpen && <span className="font-medium">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            {sidebarOpen ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{user?.fullName}</p>
                    <p className="text-xs text-gray-500">@{user?.username}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLogout}
                className="flex justify-center w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {navigation.find(n => isActive(n.href))?.name || 'Dashboard'}
            </h1>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
