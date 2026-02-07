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
  category_id: string;
  specifications?: Record<string, string[]>;
  categories?: {
    id: string;
    name: string;
    slug: string;
  };
  subcategories?: {
    id: string;
    name: string;
    slug: string;
    categories?: {
      id: string;
      name: string;
      slug: string;
    };
  };
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
  const [selectedSpecifications, setSelectedSpecifications] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const prodRes = await fetch('/api/products');
        const prodData = await prodRes.json();

        if (prodRes.ok) {
          const products = Array.isArray(prodData) ? prodData : [];
          setProducts(products);

          // Extract unique categories and subcategories from products
          const categoryMap = new Map();
          const subCategoryMap = new Map();

          products.forEach((product: Product) => {
            if (product.subcategories?.categories) {
              categoryMap.set(product.subcategories.categories.id, product.subcategories.categories);
            } else if (product.categories) {
              categoryMap.set(product.categories.id, product.categories);
            }
            if (product.subcategories) {
              subCategoryMap.set(product.subcategories.id, product.subcategories);
            }
          });

          setCategories(Array.from(categoryMap.values()));
          setSubCategories(Array.from(subCategoryMap.values()));
        } else {
          setError('Failed to load products');
        }
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

    // Filter by category (via sub-category or direct category) - only if category is selected
    if (selectedCategory !== 'all') {
      const hasCategory = product.subcategories?.categories?.id === selectedCategory || product.categories?.id === selectedCategory;
      if (!hasCategory) {
        return false;
      }
    }

    // Filter by specifications
    if (Object.keys(selectedSpecifications).length > 0) {
      for (const [key, values] of Object.entries(selectedSpecifications)) {
        if (values.length === 0) continue;
        
        const productSpec = product.specifications?.[key];
        if (!productSpec) {
          return false;
        }

        // Check if any selected specification value matches the product's specification
        const hasMatch = values.some((value) =>
          Array.isArray(productSpec) ? productSpec.includes(value) : productSpec === value
        );

        if (!hasMatch) {
          return false;
        }
      }
    }

    return true;
  });

  const filteredSubCategories = selectedCategory === 'all'
    ? subCategories
    : subCategories.filter(sub => sub.category_id === selectedCategory);

  // Extract unique specifications from products
  const getAvailableSpecifications = () => {
    const specsMap: Record<string, Set<string>> = {};
    
    products.forEach((product) => {
      // Only consider products in selected category/subcategory
      if (selectedCategory !== 'all') {
        const hasCategory = product.subcategories?.categories?.id === selectedCategory || product.categories?.id === selectedCategory;
        if (!hasCategory) return;
      }
      
      if (selectedSubCategory !== 'all' && product.sub_category_id !== selectedSubCategory) {
        return;
      }

      if (product.specifications && typeof product.specifications === 'object') {
        Object.entries(product.specifications).forEach(([key, value]) => {
          if (!specsMap[key]) {
            specsMap[key] = new Set();
          }

          if (Array.isArray(value)) {
            value.forEach((v) => specsMap[key].add(String(v)));
          } else {
            specsMap[key].add(String(value));
          }
        });
      }
    });

    // Convert Sets to sorted arrays
    const result: Record<string, string[]> = {};
    Object.entries(specsMap).forEach(([key, set]) => {
      result[key] = Array.from(set).sort();
    });

    return result;
  };

  const availableSpecifications = getAvailableSpecifications();

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

                  {/* Category & Subcategory Info */}
                  <div className="mb-6 pt-6 border-t border-purple-500/20">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">
                      Browse by Category
                    </h3>
                    <div className="space-y-2">
                      {categories.slice(0, 5).map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setSelectedSubCategory('all');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg transition text-sm text-gray-300 hover:bg-purple-500/20"
                        >
                          {cat.name}
                        </button>
                      ))}
                      {categories.length > 5 && (
                        <Link
                          href="/categories"
                          className="w-full text-left px-3 py-2 rounded-lg transition text-sm text-purple-400 hover:bg-purple-500/20"
                        >
                          View all categories
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Specifications */}
                  {Object.keys(availableSpecifications).length > 0 && (
                    <div className="pt-6 border-t border-purple-500/20">
                      <h3 className="text-sm font-semibold text-gray-300 mb-3">
                        Specifications
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(availableSpecifications).map(([specKey, specValues]) => (
                          <div key={specKey}>
                            <label className="block text-xs font-semibold text-gray-400 mb-2 capitalize">
                              {specKey.replace(/_/g, ' ')}
                            </label>
                            <div className="space-y-2">
                              {specValues.map((value) => (
                                <label
                                  key={`${specKey}-${value}`}
                                  className="flex items-center gap-2 cursor-pointer group"
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      selectedSpecifications[specKey]?.includes(value) || false
                                    }
                                    onChange={(e) => {
                                      const currentValues = selectedSpecifications[specKey] || [];
                                      if (e.target.checked) {
                                        setSelectedSpecifications({
                                          ...selectedSpecifications,
                                          [specKey]: [...currentValues, value],
                                        });
                                      } else {
                                        setSelectedSpecifications({
                                          ...selectedSpecifications,
                                          [specKey]: currentValues.filter((v) => v !== value),
                                        });
                                      }
                                    }}
                                    className="w-4 h-4 rounded bg-purple-500/20 border border-purple-500/50 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                                  />
                                  <span className="text-xs text-gray-400 group-hover:text-gray-300 transition capitalize">
                                    {value}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
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
                          href={`/categories/${product.subcategories?.categories?.slug || product.categories?.slug}/${product.subcategories?.slug || 'all'}/${product.slug}`}
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
                          href={`/categories/${product.subcategories?.categories?.slug || product.categories?.slug}/${product.subcategories?.slug || 'all'}/${product.slug}`}
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
                              
                              {product.subcategories && (
                                <p className="text-xs text-gray-500 mb-3">
                                  {product.subcategories.name}
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
