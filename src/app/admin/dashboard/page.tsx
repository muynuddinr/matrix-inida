'use client';

import { BarChart3, Mail, MessageSquare, Users, Package, FolderOpen, TrendingUp, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Products',
      value: '156',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/dashboard/products',
    },
    {
      title: 'Categories',
      value: '4',
      icon: FolderOpen,
      color: 'from-purple-500 to-purple-600',
      link: '/admin/dashboard/categories',
    },
    {
      title: 'Sub Categories',
      value: '12',
      icon: BarChart3,
      color: 'from-pink-500 to-pink-600',
      link: '/admin/dashboard/sub-categories',
    },
    {
      title: 'Total Sales',
      value: '₹2,45,890',
      icon: ShoppingCart,
      color: 'from-emerald-500 to-emerald-600',
      link: '/admin/dashboard/orders',
    },
    {
      title: 'Total Contacts',
      value: '24',
      icon: Users,
      color: 'from-cyan-500 to-cyan-600',
      link: '/admin/dashboard/contact-enquiry',
    },
    {
      title: 'Contact Enquiries',
      value: '12',
      icon: MessageSquare,
      color: 'from-orange-500 to-orange-600',
      link: '/admin/dashboard/contact-enquiry',
    },
    {
      title: 'Newsletter Subscribers',
      value: '156',
      icon: Mail,
      color: 'from-indigo-500 to-indigo-600',
      link: '/admin/dashboard/newsletter-enquiry',
    },
    {
      title: 'Pending Review',
      value: '5',
      icon: TrendingUp,
      color: 'from-amber-500 to-amber-600',
      link: '/admin/dashboard',
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-200 rounded-xl p-6 md:p-8 shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-gray-700">Manage all your products, categories, and enquiries from one central hub.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} href={stat.link}>
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-lg transition cursor-pointer group h-full">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition">{stat.value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products Overview */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-md">
          <h2 className="text-xl font-bold text-purple-900 mb-4">📦 Products Overview</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-gray-700">In Stock Products</span>
              <span className="text-blue-600 font-bold text-lg">142</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
              <span className="text-gray-700">Low Stock Items</span>
              <span className="text-orange-600 font-bold text-lg">8</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <span className="text-gray-700">Out of Stock</span>
              <span className="text-red-600 font-bold text-lg">6</span>
            </div>
            <Link
              href="/admin/dashboard/products"
              className="block w-full mt-4 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition text-sm font-semibold text-center shadow-md hover:shadow-lg"
            >
              Manage Products
            </Link>
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-md">
          <h2 className="text-xl font-bold text-purple-900 mb-4">💬 Recent Enquiries</h2>
          <div className="space-y-3">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-gray-900 font-semibold text-sm">John Doe</p>
              <p className="text-gray-600 text-xs mt-1">Interested in bulk orders</p>
              <p className="text-gray-500 text-xs mt-2">2 hours ago</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-gray-900 font-semibold text-sm">Jane Smith</p>
              <p className="text-gray-600 text-xs mt-1">Product inquiry and pricing</p>
              <p className="text-gray-500 text-xs mt-2">5 hours ago</p>
            </div>
            <Link
              href="/admin/dashboard/contact-enquiry"
              className="block w-full mt-4 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition text-sm font-semibold text-center shadow-md hover:shadow-lg"
            >
              View All Enquiries
            </Link>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-md">
        <h2 className="text-xl font-bold text-purple-900 mb-4">⚙️ System Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-gray-500 text-xs uppercase font-semibold mb-2">Admin</p>
            <p className="text-gray-900 font-bold">Moin</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-gray-500 text-xs uppercase font-semibold mb-2">Role</p>
            <p className="text-gray-900 font-bold">Administrator</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-gray-500 text-xs uppercase font-semibold mb-2">Environment</p>
            <p className="text-gray-900 font-bold">Production</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-gray-500 text-xs uppercase font-semibold mb-2">Version</p>
            <p className="text-gray-900 font-bold">2.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
