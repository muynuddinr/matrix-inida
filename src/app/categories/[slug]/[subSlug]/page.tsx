'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Package, Star, Truck, Shield, Heart } from 'lucide-react';
import Navbar from '@/app/Components/Navbar';
import Footer from '@/app/Components/Footer';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface SubCategory {
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
  technical_specs?: Array<{
    id: string;
    specification_key: string;
    specification_values: string[];
    display_order: number;
  }>;
}

export default function SubCategoryPage() {
  const params = useParams();
  const categorySlug = params?.slug as string;
  const subSlug = params?.subSlug as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<'sub-category' | 'product' | null>(null);

  useEffect(() => {
    if (!categorySlug || !subSlug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/categories/${categorySlug}/sub/${subSlug}`);
        const data = await response.json();

        if (response.ok) {
          setCategory(data.category);
          setSubCategory(data.subCategory);
          setProducts(data.products);
          setType(data.type || 'sub-category');
        } else {
          setError(data.error || 'Failed to load data');
        }
      } catch (err) {
        setError('An error occurred while loading the page');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug, subSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The page you are looking for does not exist.'}</p>
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

  // Handle standalone product view (product without sub-category)
  if (type === 'product' && products.length === 1) {
    const product = products[0];
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white">
          {/* Hero Section */}
          <div className="relative h-72 bg-gradient-to-r from-purple-100 via-white to-blue-100 border-b border-gray-200">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            
            {/* Background Image */}
            <div className="absolute inset-0 opacity-20">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Link href="/" className="hover:text-purple-600 transition">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href={`/categories/${category.slug}`} className="hover:text-purple-600 transition">
                  {category.name}
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900">{product.name}</span>
              </div>

              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl">
                {product.description}
              </p>
            </div>
          </div>

          {/* Product Details */}
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Product Image */}
              <div>
                <div className="relative bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden mb-4 w-full aspect-square">
                  {product.featured && (
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2">
                      <Star className="w-4 h-4 fill-white" />
                      Featured Product
                    </div>
                  )}
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    priority
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  {product.name}
                </h1>

                {/* Description */}
                {product.description && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div className="mb-8">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${product.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                    <span className={`font-semibold ${product.status === 'active' ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {product.status === 'active' ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  <button
                    className="flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:scale-105 shadow-lg shadow-purple-500/25"
                  >
                    <Package className="w-6 h-6" />
                    Learn More
                  </button>
                  <button className="p-4 bg-gradient-to-br from-gray-900 to-black border border-zinc-800 rounded-lg hover:border-purple-500/50 transition-all">
                    <Heart className="w-6 h-6 text-white" />
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <Truck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-700">Free Delivery</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-700">Warranty</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900 to-black border border-zinc-800 rounded-lg p-4 text-center">
                    <Package className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Easy Returns</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            {product.technical_specs && product.technical_specs.length > 0 && (
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Technical Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {product.technical_specs.map((spec) => (
                    <div key={spec.id} className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-purple-900 mb-4">{spec.specification_key}</h3>
                      <ul className="space-y-2">
                        {spec.specification_values.map((value, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-purple-600 font-bold mt-1">•</span>
                            <span className="text-gray-700">{value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Handle sub-category view
  if (type === 'sub-category' && subCategory) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white">
          {/* Hero Section */}
          <div className="relative h-72 bg-gradient-to-r from-purple-100 via-white to-blue-100 border-b border-gray-200">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          
          {/* Background Image */}
          <div className="absolute inset-0 opacity-20">
            <Image
              src={subCategory.image_url}
              alt={subCategory.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Link href="/" className="hover:text-purple-600 transition">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/categories/${category.slug}`} className="hover:text-purple-600 transition">
                {category.name}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">{subCategory.name}</span>
            </div>

            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              {subCategory.name}
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl">
              {subCategory.description}
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Products</h2>
            <p className="text-gray-600">
              {products.length} {products.length === 1 ? 'product' : 'products'} available
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/categories/${categorySlug}/${subSlug}/${product.slug}`}
                  className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-purple-500 hover:shadow-xl transition-all duration-300"
                >
                  {/* Featured Badge */}
                  {product.featured && (
                    <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      Featured
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="relative h-56 overflow-hidden bg-gray-900">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {product.description}
                    </p>

                    {/* View Details Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/categories/${categorySlug}/${subSlug}/${product.slug}`;
                      }}
                      className="w-full py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:scale-105"
                    >
                      <Package className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 border border-gray-200 rounded-xl">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Yet</h3>
              <p className="text-gray-600">
                Products for {subCategory.name} will be available soon.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
      </>
    );
  }

  // Default fallback (shouldn't reach here)
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
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
