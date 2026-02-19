'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Package, Star, Filter, X, FileText } from 'lucide-react';
import Navbar from '@/app/Components/Navbar';
import Footer from '@/app/Components/Footer';
import ContactModal from '@/app/Components/ContactModal';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
}

interface TechnicalSpec {
  id: string;
  specification_key: string;
  specification_values: string[];
  display_order: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  featured: boolean;
  status: string;
  sub_category_id: string;
  technical_specs?: TechnicalSpec[];
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [selectedSpecs, setSelectedSpecs] = useState<{ [key: string]: string[] }>({});
  const [allSpecKeys, setAllSpecKeys] = useState<string[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/categories/${slug}`);
        const data = await response.json();

        if (response.ok) {
          setCategory(data.category);
          setSubCategories(data.subCategories);

          // Fetch products for all subcategories
          const allProducts: Product[] = [];
          const specKeysSet = new Set<string>();

          for (const subCat of data.subCategories) {
            const prodRes = await fetch(`/api/categories/${slug}/sub/${subCat.slug}`);
            const prodData = await prodRes.json();

            if (prodData.products) {
              allProducts.push(...prodData.products);

              // Collect all specification keys
              prodData.products.forEach((prod: Product) => {
                if (prod.technical_specs) {
                  prod.technical_specs.forEach(spec => {
                    specKeysSet.add(spec.specification_key);
                  });
                }
              });
            }
          }

          setProducts(allProducts);
          setAllSpecKeys(Array.from(specKeysSet).sort());
        } else {
          setError(data.error || 'Failed to load category');
        }
      } catch (err) {
        setError('An error occurred while loading the category');
        console.error('Error fetching category:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    // Filter by sub-category
    if (selectedSubCategories.length > 0) {
      if (!selectedSubCategories.includes(product.sub_category_id)) {
        return false;
      }
    }

    // Filter by technical specifications
    for (const [specKey, specValues] of Object.entries(selectedSpecs)) {
      if (specValues.length === 0) continue;

      const productSpec = product.technical_specs?.find(s => s.specification_key === specKey);
      if (!productSpec) return false;

      const hasMatch = specValues.some(val => productSpec.specification_values.includes(val));
      if (!hasMatch) return false;
    }

    return true;
  });

  // Get unique specification values for a key
  const getSpecValues = (specKey: string): string[] => {
    const values = new Set<string>();
    products.forEach(product => {
      product.technical_specs?.forEach(spec => {
        if (spec.specification_key === specKey) {
          spec.specification_values.forEach(val => values.add(val));
        }
      });
    });
    return Array.from(values).sort();
  };

  const toggleSubCategory = (subCatId: string) => {
    setSelectedSubCategories(prev =>
      prev.includes(subCatId)
        ? prev.filter(id => id !== subCatId)
        : [...prev, subCatId]
    );
  };

  const toggleSpecValue = (specKey: string, value: string) => {
    setSelectedSpecs(prev => {
      const current = prev[specKey] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];

      return {
        ...prev,
        [specKey]: updated
      };
    });
  };

  const clearFilters = () => {
    setSelectedSubCategories([]);
    setSelectedSpecs({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The category you are looking for does not exist.'}</p>
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative h-72 bg-gradient-to-r from-purple-100 via-white to-blue-100 border-b border-gray-200">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Link href="/" className="hover:text-purple-600 transition">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">{category.name}</span>
            </div>

            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              {category.name}
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mb-6">
              {category.description}
            </p>
            <button
              onClick={() => setShowContactModal(true)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-teal-700 transition-all hover:scale-105 shadow-lg shadow-green-500/25"
            >
              <FileText className="w-6 h-6" />
              Request Catalog
            </button>
          </div>
        </div>

        {/* Sub-Categories & Products Section */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Sub-Categories Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Browse Sub-Categories</h2>
            {subCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {subCategories.map((subCategory) => (
                  <Link
                    key={subCategory.id}
                    href={`/categories/${category.slug}/${subCategory.slug}`}
                    className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-500 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Background Gradient Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-100/50 group-hover:to-blue-100/50 transition-all duration-300"></div>

                    <div className="relative">
                      {/* Image */}
                      <div className="relative mb-4 overflow-hidden rounded-lg h-48">
                        <Image
                          fill
                          src={subCategory.image_url}
                          alt={subCategory.name}
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {subCategory.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {subCategory.description}
                      </p>

                      {/* Arrow Icon */}
                      <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm">
                        View Products
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 border border-gray-200 rounded-xl">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Sub-Categories Yet</h3>
                <p className="text-gray-600">
                  Sub-categories for {category.name} will be available soon.
                </p>
              </div>
            )}
          </div>

          {/* Products Section with Filters */}
          {products.length > 0 && (
            <div>
              <div className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">All Products</h2>
                    <p className="text-gray-600">
                      Showing {filteredProducts.length} of {products.length} products
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex md:hidden items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className={`${showFilters ? 'block' : 'hidden'} md:block lg:col-span-1`}>
                  <div className="sticky top-6 space-y-6">
                    {/* Clear Filters Button */}
                    {(selectedSubCategories.length > 0 || Object.values(selectedSpecs).some(v => v.length > 0)) && (
                      <button
                        onClick={clearFilters}
                        className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Clear Filters
                      </button>
                    )}

                    {/* Sub-Categories Filter */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Sub-Categories</h3>
                      <div className="space-y-3">
                        {subCategories.map(subCat => (
                          <label key={subCat.id} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedSubCategories.includes(subCat.id)}
                              onChange={() => toggleSubCategory(subCat.id)}
                              className="w-4 h-4 rounded accent-purple-600"
                            />
                            <span className="text-gray-700 group-hover:text-purple-600 transition">
                              {subCat.name}
                            </span>
                            <span className="ml-auto text-sm text-gray-500">
                              {products.filter(p => p.sub_category_id === subCat.id).length}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Technical Specifications Filter */}
                    {allSpecKeys.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
                        <h3 className="text-lg font-bold text-gray-900">Technical Specifications</h3>

                        {allSpecKeys.map(specKey => (
                          <div key={specKey} className="border-t border-gray-200 pt-4 first:border-t-0 first:pt-0">
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm">{specKey}</h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {getSpecValues(specKey).map(value => (
                                <label key={value} className="flex items-center gap-3 cursor-pointer group">
                                  <input
                                    type="checkbox"
                                    checked={(selectedSpecs[specKey] || []).includes(value)}
                                    onChange={() => toggleSpecValue(specKey, value)}
                                    className="w-4 h-4 rounded accent-purple-600"
                                  />
                                  <span className="text-sm text-gray-700 group-hover:text-purple-600 transition break-words">
                                    {value}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Products Grid */}
                <div className="lg:col-span-3">
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/categories/${category.slug}/${subCategories.find(s => s.id === product.sub_category_id)?.slug}/${product.slug}`}
                          className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-purple-500 hover:shadow-xl transition-all"
                        >
                          {product.featured && (
                            <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                              <Star className="w-3 h-3 fill-white" />
                              Featured
                            </div>
                          )}
                          <div className="relative h-48 overflow-hidden bg-gray-900">
                            <Image
                              fill
                              src={product.image_url}
                              alt={product.name}
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-semibold px-2 py-1 rounded ${product.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-600'
                                : 'bg-gray-500/20 text-gray-600'
                                }`}>
                                {product.status === 'active' ? 'Available' : 'Unavailable'}
                              </span>
                              <ChevronRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-gray-50 border border-gray-200 rounded-xl">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
                      <p className="text-gray-600">
                        Try adjusting your filters to see more products.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        categorySlug={slug}
        productName={category?.name}
      />
    </>
  );
}