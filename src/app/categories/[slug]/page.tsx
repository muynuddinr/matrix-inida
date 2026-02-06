'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Package } from 'lucide-react';
import Navbar from '@/app/Components/Navbar';
import Footer from '@/app/Components/Footer';

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
  category_id: string;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    </div>
    <Footer />
    </>
  );
}
