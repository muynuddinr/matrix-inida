'use client';

import { useEffect, useState } from 'react';
import { Package, FolderOpen, BarChart3, MessageSquare } from 'lucide-react';
import Link from 'next/link';

type CatalogEnquiry = {
  id: string;
  name: string;
  product_name?: string;
  created_at?: string;
  status?: string;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [productsCount, setProductsCount] = useState<number>(0);
  const [categoriesCount, setCategoriesCount] = useState<number>(0);
  const [subCategoriesCount, setSubCategoriesCount] = useState<number>(0);
  const [catalogEnquiriesTotal, setCatalogEnquiriesTotal] = useState<number>(0);
  const [recentCatalogEnquiries, setRecentCatalogEnquiries] = useState<CatalogEnquiry[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [prodRes, catRes, subRes, catEnqRes] = await Promise.all([
        fetch('/api/products?all=true'),
        fetch('/api/categories'),
        fetch('/api/sub-categories'),
        fetch('/api/catalog-enquiries?limit=5'),
      ]);

      if (!prodRes.ok || !catRes.ok || !subRes.ok || !catEnqRes.ok) {
        throw new Error('One or more API requests failed');
      }

      const prodJson = await prodRes.json();
      const catJson = await catRes.json();
      const subJson = await subRes.json();
      const catEnqJson = await catEnqRes.json();

      setProductsCount(Array.isArray(prodJson.products) ? prodJson.products.length : 0);
      setCategoriesCount(Array.isArray(catJson.categories) ? catJson.categories.length : 0);
      setSubCategoriesCount(Array.isArray(subJson.subCategories) ? subJson.subCategories.length : 0);

      setCatalogEnquiriesTotal(typeof catEnqJson.total === 'number' ? catEnqJson.total : (Array.isArray(catEnqJson.enquiries) ? catEnqJson.enquiries.length : 0));
      setRecentCatalogEnquiries(Array.isArray(catEnqJson.enquiries) ? catEnqJson.enquiries.slice(0, 5) : []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard — Live backend data</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-3">Error: {error}</div>
      )}

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-md">Loading live data…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Link href="/admin/dashboard/products" className="no-underline">
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-lg transition cursor-pointer h-full">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-600 text-sm mb-1">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{productsCount}</p>
              </div>
            </Link>

            <Link href="/admin/dashboard/categories" className="no-underline">
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-lg transition cursor-pointer h-full">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-600 text-sm mb-1">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categoriesCount}</p>
              </div>
            </Link>

            <Link href="/admin/dashboard/sub-categories" className="no-underline">
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-lg transition cursor-pointer h-full">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-600 text-sm mb-1">Sub Categories</p>
                <p className="text-2xl font-bold text-gray-900">{subCategoriesCount}</p>
              </div>
            </Link>

            <Link href="/admin/dashboard/catalog-enquiry" className="no-underline">
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-lg transition cursor-pointer h-full">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-600 text-sm mb-1">Catalog Enquiries</p>
                <p className="text-2xl font-bold text-gray-900">{catalogEnquiriesTotal}</p>
              </div>
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Recent catalog enquiries</h2>

            {recentCatalogEnquiries.length === 0 ? (
              <p className="text-gray-600">No recent enquiries</p>
            ) : (
              <div className="space-y-3">
                {recentCatalogEnquiries.map((e) => (
                  <div key={e.id} className="p-3 border rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{e.name}</p>
                        <p className="text-xs text-gray-600">{e.product_name || '—'}</p>
                      </div>
                      <p className="text-xs text-gray-500">{e.created_at ? new Date(e.created_at).toLocaleString() : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
