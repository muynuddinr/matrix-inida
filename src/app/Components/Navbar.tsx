'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Search, User } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  status: string;
}

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  description?: string;
  image_url?: string;
}

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);

  useEffect(() => {
    // Fetch categories and subcategories from API
    const fetchData = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.categories) {
          setCategories(data.categories);
        }
        if (data.subCategories) {
          setSubcategories(data.subCategories);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Product Center', href: '/products', hasDropdown: true },
    { name: 'Service', href: '/service', hasDropdown: true },
    { name: 'About Us', href: '/about' },

  ];

  return (
    <nav className="bg-black border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="shrink-0 group cursor-pointer">
            <div className="flex items-center gap-1">
              <div className="flex h-9 transition-transform duration-300 group-hover:scale-110">
                <div className="w-2.5 bg-gradient-to-b from-purple-500 to-purple-600 transform -skew-x-12 shadow-lg shadow-purple-500/50"></div>
                <div className="w-2.5 bg-gradient-to-b from-red-500 to-red-600 transform -skew-x-12 shadow-lg shadow-red-500/50"></div>
                <div className="w-2.5 bg-gradient-to-b from-yellow-400 to-yellow-500 transform -skew-x-12 shadow-lg shadow-yellow-400/50"></div>
                <div className="w-2.5 bg-gradient-to-b from-blue-500 to-blue-600 transform -skew-x-12 shadow-lg shadow-blue-500/50"></div>
              </div>
              <span className="text-2xl font-bold tracking-wider ml-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                NTRIX
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  className="flex items-center gap-1 text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium relative group"
                >
                  <span className="relative">
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                  {item.hasDropdown && (
                    <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                  )}
                </a>
                
                {/* Products Dropdown with Categories and Subcategories */}
                {item.hasDropdown && activeDropdown === item.name && item.name === 'Product Center' && (
                  <div className="absolute top-full left-0 mt-2 w-96 bg-black backdrop-blur-xl rounded-lg shadow-2xl border border-zinc-700/50 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-96 overflow-y-auto">
                    {categories.length > 0 ? (
                      categories.map((category) => {
                        // Get subcategories for this category
                        const catSubcategories = subcategories.filter(
                          (sub) => sub.category_id === category.id
                        );

                        return (
                          <div key={category.id}>
                            {/* Category Header */}
                            <Link
                              href={`/categories/${category.slug}`}
                              className="block px-4 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 hover:text-white transition-all duration-200 border-l-2 border-transparent hover:border-purple-500"
                            >
                              <div className="flex items-center gap-3">
                                {category.image_url && (
                                  <img 
                                    src={category.image_url} 
                                    alt={category.name}
                                    className="w-8 h-8 rounded object-cover"
                                  />
                                )}
                                <div>
                                  <div className="font-medium">{category.name}</div>
                                  <div className="text-xs text-gray-500">{category.description}</div>
                                </div>
                              </div>
                            </Link>

                            {/* Subcategories for this Category */}
                            {catSubcategories.length > 0 && (
                              <div className="bg-black/50 border-l border-zinc-700/50 ml-4">
                                {catSubcategories.map((subcategory) => (
                                  <Link
                                    key={subcategory.id}
                                    href={`/categories/${category.slug}/${subcategory.slug}`}
                                    className="block px-4 py-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-purple-600/10 transition-all duration-200 border-l-2 border-transparent hover:border-purple-500"
                                  >
                                    <div className="font-medium">{subcategory.name}</div>
                                    {subcategory.description && (
                                      <div className="text-xs text-gray-500 mt-0.5">{subcategory.description}</div>
                                    )}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No categories available
                      </div>
                    )}
                  </div>
                )}

                {/* Service Dropdown (keep existing) */}
                {item.hasDropdown && activeDropdown === item.name && item.name === 'Service' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-black backdrop-blur-xl rounded-lg shadow-2xl border border-zinc-700/50 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <a href="#" className="block px-4 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 hover:text-white transition-all duration-200 border-l-2 border-transparent hover:border-purple-500">
                      Option 1
                    </a>
                    <a href="#" className="block px-4 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 hover:text-white transition-all duration-200 border-l-2 border-transparent hover:border-purple-500">
                      Option 2
                    </a>
                    <a href="#" className="block px-4 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 hover:text-white transition-all duration-200 border-l-2 border-transparent hover:border-purple-500">
                      Option 3
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Section - Contact Button */}
          <div className="flex items-center">
            <a
              href="/contact"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/25"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}