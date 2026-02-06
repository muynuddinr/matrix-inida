'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    contacts: 0,
    categories: 0,
    subcategories: 0,
    products: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Simplified data fetching
      const [contactsRes, categoriesRes, subCategoriesRes, productsRes] = await Promise.all([
        fetch('/api/contact'),
        fetch('/api/categories'),
        fetch('/api/subcategories'),
        fetch('/api/products')
      ]);

      const contactsData = contactsRes.ok ? await contactsRes.json() : [];
      const categoriesData = categoriesRes.ok ? await categoriesRes.json() : { categories: [] };
      const subCategoriesData = subCategoriesRes.ok ? await subCategoriesRes.json() : [];
      const productsData = productsRes.ok ? await productsRes.json() : [];

      setStats({
        contacts: Array.isArray(contactsData) ? contactsData.length : 0,
        categories: categoriesData.categories?.length || 0,
        subcategories: Array.isArray(subCategoriesData) ? subCategoriesData.length : 0,
        products: Array.isArray(productsData) ? productsData.length : 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to your Matrix India admin panel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/contact">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">Contacts</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.contacts}</p>
            </div>
          </Link>
          <Link href="/admin/categories">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
              <p className="text-3xl font-bold text-green-600">{stats.categories}</p>
            </div>
          </Link>
          <Link href="/admin/subcategories">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">Subcategories</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.subcategories}</p>
            </div>
          </Link>
          <Link href="/admin/products">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">Products</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.products}</p>
            </div>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/contact" className="p-4 border rounded-lg hover:bg-gray-50">
            <h3 className="font-medium text-gray-900">Contact Management</h3>
            <p className="text-sm text-gray-600">Manage contact form submissions</p>
          </Link>
          <Link href="/admin/categories" className="p-4 border rounded-lg hover:bg-gray-50">
            <h3 className="font-medium text-gray-900">Categories</h3>
            <p className="text-sm text-gray-600">Manage product categories</p>
          </Link>
          <Link href="/admin/subcategories" className="p-4 border rounded-lg hover:bg-gray-50">
            <h3 className="font-medium text-gray-900">Subcategories</h3>
            <p className="text-sm text-gray-600">Manage product subcategories</p>
          </Link>
          <Link href="/admin/products" className="p-4 border rounded-lg hover:bg-gray-50">
            <h3 className="font-medium text-gray-900">Products</h3>
            <p className="text-sm text-gray-600">Manage individual products</p>
          </Link>
        </div>
      </div>
    </div>
  );
}