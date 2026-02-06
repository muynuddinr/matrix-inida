'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, Star, Package } from 'lucide-react';
import Navbar from '@/app/Components/Navbar';
import Footer from '@/app/Components/Footer';

interface Product {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  status: 'active' | 'inactive';
  featured: boolean;
  sub_category_id: string;
  category?: string;
  subCategory?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, subCatRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/subcategories'),
          fetch('/api/products'),
        ]);

        const catData = await catRes.json();
        const subCatData = await subCatRes.json();
        const prodData = await prodRes.json();

        setCategories(catData.categories || []);
        // subcategories API returns an array directly
        setSubCategories(Array.isArray(subCatData) ? subCatData : subCatData.subCategories || []);
        // products API returns an array directly
        setProducts(Array.isArray(prodData) ? prodData : prodData.products || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    // Filter by search query
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by sub-category (if selected)
    if (selectedSubCategory !== 'all' && product.sub_category_id !== selectedSubCategory) {
      return false;
    }

    // Filter by category (via sub-category) - only if category is selected
    if (selectedCategory !== 'all') {
      const productSubCategory = subCategories.find(sub => sub.id === product.sub_category_id);
      if (!productSubCategory || productSubCategory.category_id !== selectedCategory) {
        return false;
      }
    }

    return true;
  });

  const filteredSubCategories = selectedCategory === 'all'
    ? subCategories
    : subCategories.filter(sub => sub.category_id === selectedCategory);

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
              <span className="text-purple-400">Products</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Products</h1>
            <p className="text-gray-400">
              Explore our complete collection of products
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Filters */}
              <div className="lg:col-span-1">
                <div className="bg-linear-to-br from-gray-900 to-black border border-purple-500/20 rounded-xl p-6 sticky top-6">
                  <h2 className="text-lg font-bold text-white mb-6">Filters</h2>

                  {/* Search */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Category
                    </label>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setSelectedSubCategory('all');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                          selectedCategory === 'all'
                            ? 'bg-purple-600 text-white'
                            : 'text-gray-300 hover:bg-purple-500/20'
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setSelectedSubCategory('all');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                            selectedCategory === cat.id
                              ? 'bg-purple-600 text-white'
                              : 'text-gray-300 hover:bg-purple-500/20'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sub-Category Filter */}
                  {selectedCategory !== 'all' && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-300 mb-3">
                        Sub-Category
                      </label>
                      <div className="space-y-2">
                        <button
                          onClick={() => setSelectedSubCategory('all')}
                          className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                            selectedSubCategory === 'all'
                              ? 'bg-purple-600 text-white'
                              : 'text-gray-300 hover:bg-purple-500/20'
                          }`}
                        >
                          All Sub-Categories
                        </button>
                        {filteredSubCategories.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => setSelectedSubCategory(sub.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                              selectedSubCategory === sub.id
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-300 hover:bg-purple-500/20'
                            }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Featured Products */}
                  <div className="pt-6 border-t border-purple-500/20">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">
                      Featured Products
                    </h3>
                    <div className="space-y-2">
                      {products
                        .filter((p) => p.featured && p.status === 'active')
                        .slice(0, 5)
                        .map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            className="flex items-start gap-2 p-2 rounded-lg hover:bg-purple-500/10 transition group"
                          >
                            <Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span className="text-xs text-gray-300 group-hover:text-white transition line-clamp-2">
                              {product.name}
                            </span>
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="lg:col-span-3">
                {filteredProducts.length === 0 ? (
                  <div className="bg-linear-to-br from-gray-900 to-black border border-purple-500/20 rounded-xl p-12 text-center">
                    <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No products found matching your criteria</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-gray-400">
                        Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          className="group"
                        >
                          <div className="bg-linear-to-br from-gray-900 to-black border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-500/50 transition">
                            {/* Product Image */}
                            <div className="relative h-48 overflow-hidden bg-gray-800">
                              <img
                                src={product.image_url || 'https://via.placeholder.com/300?text=Product'}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                              />
                              {product.featured && (
                                <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold">
                                  <Star className="w-3 h-3 fill-current" />
                                  Featured
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                              <h3 className="text-white font-semibold group-hover:text-purple-300 transition line-clamp-2 mb-2">
                                {product.name}
                              </h3>
                              
                              {product.subCategory && (
                                <p className="text-xs text-gray-500 mb-3">
                                  {product.subCategory}
                                </p>
                              )}

                              <div className="pt-3 border-t border-purple-500/10 flex items-center justify-between">
                                <span className="text-xs text-gray-400">View Details</span>
                                <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
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
