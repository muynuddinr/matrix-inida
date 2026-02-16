'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Star, Package } from 'lucide-react';
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
  const [, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory] = useState<string>('all');
  const [selectedSubCategory] = useState<string>('all');
  const [searchQuery] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, subCatRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/sub-categories'),
          fetch('/api/products'),
        ]);

        const catData = await catRes.json();
        const subCatData = await subCatRes.json();
        const prodData = await prodRes.json();

        setCategories(catData.categories || []);
        setSubCategories(subCatData.subCategories || []);
        setProducts(prodData.products || []);
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
                              <Image
                                fill
                                src={product.image_url || 'https://via.placeholder.com/300?text=Product'}
                                alt={product.name}
                                className="object-cover group-hover:scale-110 transition duration-300"
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
