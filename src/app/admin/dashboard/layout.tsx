'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, LogOut, Database, Server } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [dbStatus, setDbStatus] = useState('checking');
  const [serverStatus, setServerStatus] = useState('online');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    const name = localStorage.getItem('adminName');

    console.log('Dashboard layout - Checking auth:', { token: !!token, name });

    if (!token) {
      console.log('No token found, redirecting to login');
      router.push('/admin');
      return;
    }

    setAdminName(name || 'Admin');

    // Update time
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    // Check database connection
    checkDatabaseConnection();

    return () => clearInterval(timer);
  }, [router]);

  const checkDatabaseConnection = async () => {
    try {
      const response = await fetch('/api/health/database');
      const data = await response.json();
      setDbStatus(data.database || 'disconnected');
    } catch (error) {
      setDbStatus('disconnected');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    router.push('/admin');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col shadow-lg`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Matrix
          </h1>
          <p className="text-gray-500 text-xs mt-1">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link
            href="/admin/dashboard"
            className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
          >
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
            Dashboard
          </Link>

          <div className="mt-6 mb-2 px-4">
            <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider">Inventory</p>
          </div>

          <Link
            href="/admin/dashboard/categories"
            className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
          >
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
            Categories
          </Link>

          <Link
            href="/admin/dashboard/sub-categories"
            className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
          >
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
            Sub Categories
          </Link>

          <Link
            href="/admin/dashboard/products"
            className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
          >
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
            Products
          </Link>

          <div className="mt-6 mb-2 px-4">
            <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider">Enquiries</p>
          </div>

          <Link
            href="/admin/dashboard/contact-enquiry"
            className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
          >
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
            Contact Enquiry
          </Link>

          <Link
            href="/admin/dashboard/catalog-enquiry"
            className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
          >
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
            Catalog Enquiry
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition border border-red-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 md:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left - Toggle & Time */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-purple-50 rounded-lg transition text-purple-600"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="text-gray-600 text-sm">
                <p className="font-mono">{currentTime}</p>
              </div>
            </div>

            {/* Right - Admin Details & Status */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {/* Connection Status */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-500" />
                  <div>
                    <p className="text-xs text-gray-500">Server</p>
                    <p className="text-sm font-semibold text-emerald-500 capitalize">{serverStatus}</p>
                  </div>
                </div>

                <div className="h-6 w-px bg-gray-200"></div>

                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="text-xs text-gray-500">Database</p>
                    <p className="text-sm font-semibold text-purple-500 capitalize">{dbStatus}</p>
                  </div>
                </div>
              </div>

              <div className="hidden md:block h-8 w-px bg-gray-200"></div>

              {/* Admin Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-semibold text-sm">
                  {adminName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{adminName}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-linear-to-br from-purple-50 to-white">
          {children}
        </div>
      </div>
    </div>
  );
}
