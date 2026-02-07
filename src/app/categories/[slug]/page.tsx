'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Package, Star } from 'lucide-react';
import Navbar from '@/app/Components/Navbar';
import Footer from '@/app/Components/Footer';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
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

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState<boolean>(false);
  const [selectedSpecifications, setSelectedSpecifications] = useState<Record<string, string[]>>({});

  const filteredProducts = products.filter((product) => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (showFeaturedOnly && !product.featured) {
      return false;
    }
    
    // Filter by specifications
    if (Object.keys(selectedSpecifications).length > 0) {
      for (const [key, values] of Object.entries(selectedSpecifications)) {
        if (values.length === 0) continue;
        
        const productSpec = product.specifications?.[key];
        if (!productSpec) {
          return false;
        }

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

  const getAvailableSpecifications = () => {
    const specsMap: Record<string, Set<string>> = {};
    
    products.forEach((product) => {
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

    const result: Record<string, string[]> = {};
    Object.entries(specsMap).forEach(([key, set]) => {
      result[key] = Array.from(set).sort();
    });

    return result;
  };

  const availableSpecifications = getAvailableSpecifications();

  useEffect(() => {
    if (!slug) return;

    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        const data = await response.json();

        if (response.ok) {
          // Find category by slug
          const foundCategory = data.categories?.find((cat: Category) => cat.slug === slug);
          
          if (foundCategory) {
            setCategory(foundCategory);
            // Filter subcategories for this category
            const filteredSubCategories = data.subCategories?.filter(
              (sub: SubCategory) => sub.category_id === foundCategory.id
            ) || [];
            setSubCategories(filteredSubCategories);

            // Fetch products for this category that have no subcategory
            const productsRes = await fetch(`/api/products?category_id=${foundCategory.id}`);
            const productsData = await productsRes.json();
            setProducts(Array.isArray(productsData) ? productsData : []);
          } else {
            setError('Category not found');
          }
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
          <p className="text-xl text-gray-700 max-w-2xl">
            {category.description}
          </p>
        </div>
      </div>

      {/* Sub-Categories Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse Sub-Categories</h2>
          <p className="text-gray-600">Explore our range of {category.name.toLowerCase()} products</p>
        </div>

        {subCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <img
                      src={subCategory.image_url}
                      alt={subCategory.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
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

      {/* Products without Subcategory */}
      {products.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6">
                {/* Category Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Category</h3>
                  <div className="flex items-center gap-3">
                    <img
                      src={category.image_url || 'https://via.placeholder.com/48?text=Cat'}
                      alt={category.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-600">{filteredProducts.length} products</p>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Filters</h3>
                  {/* Search */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Search Products
                    </label>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                  </div>
                  {/* Featured */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showFeaturedOnly}
                        onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-semibold text-gray-700">Featured only</span>
                    </label>
                  </div>
                </div>

                {/* Specifications */}
                {Object.keys(availableSpecifications).length > 0 && (
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Specifications</h3>
                    <div className="space-y-4">
                      {Object.entries(availableSpecifications).map(([specKey, specValues]) => (
                        <div key={specKey}>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
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
                                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition capitalize">
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
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Products</h2>
                <p className="text-gray-600">Direct products in {category.name.toLowerCase()}</p>
              </div>

              {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/categories/${category.slug}/all/${product.slug}`}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-purple-500 hover:shadow-xl transition-all"
              >
                {product.featured && (
                  <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    Featured
                  </div>
                )}
                <div className="relative h-48 overflow-hidden bg-gray-900">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 border border-gray-200 rounded-xl">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-600">
                No products match your current filters.
              </p>
            </div>
          )}
            </div>
          </div>
        </div>
      )}
      </div>
      <Footer />
    </>
  );
}
