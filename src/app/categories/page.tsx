'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, Grid3X3, Package } from 'lucide-react';
import Navbar from '@/app/Components/Navbar';
import Footer from '@/app/Components/Footer';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/categories');
        const data = await res.json();

        if (res.ok) {
          setCategories(data.categories || []);
          setSubCategories(data.subCategories || []);
        } else {
          setError('Failed to load categories');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black">
        {/* Header */}
        <div className="bg-linear-to-r from-purple-900 to-black border-b border-purple-500/20 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-4 text-gray-400">
              <Link href="/" className="hover:text-purple-400 transition">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-purple-400">Categories</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Categories</h1>
            <p className="text-gray-400">
              Explore our product categories
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading categories...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-linear-to-br from-gray-900 to-black border border-purple-500/20 rounded-xl p-6 sticky top-6">
                  <h2 className="text-lg font-bold text-white mb-6">Browse</h2>

                  {/* Search */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Search Categories
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                      />
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="mb-6 pt-6 border-t border-purple-500/20">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">
                      About Categories
                    </h3>
                    <p className="text-xs text-gray-400">
                      Browse our product categories to find exactly what you're looking for. Each category contains related subcategories and products.
                    </p>
                  </div>

                  {/* Specifications */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">
                      Product Specifications
                    </h3>
                    <p className="text-xs text-gray-400">
                      Our products come with detailed specifications. Check category pages for product listings and individual product pages for full specs.
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="pt-6 border-t border-purple-500/20">
                    <div className="text-sm text-gray-400">
                      <p className="mb-2">Total Categories: {categories.length}</p>
                      <p>Total Subcategories: {subCategories.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories Grid */}
              <div className="lg:col-span-3">
                {filteredCategories.length === 0 ? (
                  <div className="bg-linear-to-br from-gray-900 to-black border border-purple-500/20 rounded-xl p-12 text-center">
                    <Grid3X3 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No categories found matching your search</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-gray-400">
                        Showing {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCategories.map((category) => {
                        const categorySubCategories = subCategories.filter(
                          (sub) => sub.category_id === category.id
                        );

                        return (
                          <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="group"
                          >
                            <div className="bg-linear-to-br from-gray-900 to-black border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-500/50 transition">
                              {/* Category Image */}
                              <div className="relative h-48 overflow-hidden bg-gray-800">
                                <img
                                  src={category.image_url || 'https://via.placeholder.com/300?text=Category'}
                                  alt={category.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                />
                              </div>

                              {/* Category Info */}
                              <div className="p-4">
                                <h3 className="text-white font-semibold group-hover:text-purple-300 transition line-clamp-2 mb-2">
                                  {category.name}
                                </h3>
                                <p className="text-xs text-gray-500 mb-3">
                                  {categorySubCategories.length} subcategories
                                </p>

                                <div className="pt-3 border-t border-purple-500/10 flex items-center justify-between">
                                  <span className="text-xs text-gray-400">View Category</span>
                                  <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}