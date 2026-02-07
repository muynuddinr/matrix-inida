'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Folder,
  Package,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Contacts', href: '/admin/contact', icon: Users },
  { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { name: 'Subcategories', href: '/admin/subcategories', icon: Folder },
  { name: 'Products', href: '/admin/products', icon: Package },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check authentication using localStorage
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    const adminEmail = localStorage.getItem('admin_email');

    if (isLoggedIn === 'true') {
      setUser({ email: adminEmail || 'admin@matrixindia.com' });
    } else {
      // Only redirect to login if we're not already on the login page
      if (pathname !== '/admin') {
        router.push('/admin');
      }
    }
  }, [router, pathname]);

  const handleLogout = async () => {
    // Clear localStorage and redirect to login
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_email');
    // Immediately clear local user state and close sidebar
    setUser(null);
    setSidebarOpen(false);
    router.push('/admin');
  };

  // Show the loading spinner only for protected admin pages. Allow the login page (/admin) to render even when `user` is null.
  if (!user && pathname !== '/admin') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && user && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (only show when logged in) */}
      {user && (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
          <div className="flex flex-col h-full">
            {/* Logo/Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
              <div className="flex items-center">
                <Home className="w-8 h-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Matrix Admin</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-700' : 'text-gray-400'
                      }`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User info and logout */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={`flex-1 ${user ? 'pl-64' : 'pl-0'}`}>
        {/* Top bar (mobile) */}
        {user && (
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 lg:hidden">
            <div className="flex items-center justify-between h-16 px-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center">
                <Home className="w-6 h-6 text-blue-600" />
                <span className="ml-2 text-lg font-semibold text-gray-900">Matrix Admin</span>
              </div>
              <div className="w-10" /> {/* Spacer for centering */}
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}