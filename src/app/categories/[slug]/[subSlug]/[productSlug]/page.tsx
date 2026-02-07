'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Star, Package, Truck, Shield, Heart } from 'lucide-react';
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
  category_id: string;
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

export default function ProductDetailPage() {
  const params = useParams();
  const categorySlug = params?.slug as string;
  const subSlug = params?.subSlug as string;
  const productSlug = params?.productSlug as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!categorySlug || !subSlug || !productSlug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch the product by slug via products API (which includes joined data)
        const prodRes = await fetch(`/api/products?slug=${productSlug}`);
        const prodData = await prodRes.json();
        
        if (prodRes.ok && prodData) {
          setProduct(prodData);
          
          // Get category and subcategory from the product
          if (prodData.subcategories?.categories) {
            setCategory(prodData.subcategories.categories);
            setSubCategory(prodData.subcategories);
          } else if (prodData.categories) {
            setCategory(prodData.categories);
            setSubCategory(subSlug === 'all' ? null : null); // No subcategory
          }
          
          // Get related products (same subcategory or category)
          const relatedQuery = prodData.sub_category_id 
            ? `?sub_category_id=${prodData.sub_category_id}` 
            : `?category_id=${prodData.category_id}`;
          const relatedRes = await fetch(`/api/products${relatedQuery}`);
          const relatedData = await relatedRes.json();
          const relatedProds = (Array.isArray(relatedData) ? relatedData : []).filter((prod: Product) => prod.id !== prodData.id);
          setRelatedProducts(relatedProds);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('An error occurred while loading the product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug, subSlug, productSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !category || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
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
        {/* Breadcrumb */}
        <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-purple-600 transition">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/categories/${category.slug}`} className="hover:text-purple-600 transition">
                {category.name}
              </Link>
              {subCategory && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <Link href={`/categories/${category.slug}/${subCategory.slug}`} className="hover:text-purple-600 transition">
                    {subCategory.name}
                  </Link>
                </>
              )}
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="relative bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden mb-4">
              {product.featured && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2">
                  <Star className="w-4 h-4 fill-white" />
                  Featured Product
                </div>
              )}
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {product.name}
            </h1>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Status */}
            <div className="mb-8">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${product.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                <span className={`font-semibold ${product.status === 'active' ? 'text-emerald-600' : 'text-gray-500'}`}>
                  {product.status === 'active' ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, values]) => (
                      <div key={key} className="pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                        <p className="text-sm font-semibold text-gray-700 capitalize mb-2">
                          {key.replace(/_/g, ' ')}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(values) && values.map((value, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-600"
                            >
                              {value}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

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

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/categories/${relatedProduct.subcategories?.categories?.slug || relatedProduct.categories?.slug}/${relatedProduct.subcategories?.slug || 'all'}/${relatedProduct.slug}`}
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-purple-500 hover:shadow-xl transition-all"
                >
                  {relatedProduct.featured && (
                    <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      Featured
                    </div>
                  )}
                  <div className="relative h-48 overflow-hidden bg-gray-900">
                    <img
                      src={relatedProduct.image_url}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {relatedProduct.description}
                    </p>
                  </div>
                </Link>
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
