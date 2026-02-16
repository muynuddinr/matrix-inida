'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Package, Star, Filter, X } from 'lucide-react';
import Navbar from '@/app/Components/Navbar';
import Footer from '@/app/Components/Footer';

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
    image_url: string;
    featured: boolean;
    status: string;
    category?: string;
    subCategory?: string;
    technical_specs?: TechnicalSpec[];
}

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image_url: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSpecs, setSelectedSpecs] = useState<{ [key: string]: string[] }>({});
    const [allSpecKeys, setAllSpecKeys] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch all categories
                const catRes = await fetch('/api/categories');
                const catData = await catRes.json();

                if (!catRes.ok) {
                    setError(catData.error || 'Failed to load categories');
                    return;
                }

                setCategories(catData.categories || []);

                // Fetch all products
                const prodRes = await fetch('/api/products');
                const prodData = await prodRes.json();

                if (!prodRes.ok) {
                    setError(prodData.error || 'Failed to load products');
                    return;
                }

                const allProducts = prodData.products || [];
                setProducts(allProducts);

                // Collect all specification keys from all products
                const specKeysSet = new Set<string>();
                allProducts.forEach((prod: Product) => {
                    if (prod.technical_specs) {
                        prod.technical_specs.forEach(spec => {
                            specKeysSet.add(spec.specification_key);
                        });
                    }
                });

                setAllSpecKeys(Array.from(specKeysSet).sort());
            } catch (err) {
                setError('An error occurred while loading data');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter products based on selected filters
    const filteredProducts = products.filter(product => {
        // Filter by category
        if (selectedCategories.length > 0) {
            if (!selectedCategories.includes(product.category || '')) {
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

    const toggleCategory = (catName: string) => {
        setSelectedCategories(prev =>
            prev.includes(catName) ? prev.filter(s => s !== catName) : [...prev, catName]
        );
    };

    const toggleSpecValue = (specKey: string, value: string) => {
        setSelectedSpecs(prev => {
            const values = prev[specKey] || [];
            return {
                ...prev,
                [specKey]: values.includes(value)
                    ? values.filter(v => v !== value)
                    : [...values, value],
            };
        });
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedSpecs({});
    };

    const hasActiveFilters = selectedCategories.length > 0 || Object.values(selectedSpecs).some(v => v.length > 0);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                            <Package className="w-8 h-8 text-purple-600 animate-spin" />
                        </div>
                        <p className="text-gray-600 text-lg">Loading categories...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-600 text-lg">{error}</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
                {/* Breadcrumb */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Link href="/" className="text-purple-600 hover:text-purple-700 transition">
                                Home
                            </Link>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Categories</span>
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">All Categories</h1>
                        <p className="text-gray-600 max-w-2xl">
                            Browse our complete range of products across all categories. Use filters to refine your search by specifications.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Filters Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6">
                                {/* Mobile Filter Toggle */}
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden w-full flex items-center justify-between bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition mb-4"
                                >
                                    <span className="flex items-center gap-2">
                                        <Filter className="w-4 h-4" />
                                        Filters
                                    </span>
                                    {hasActiveFilters && (
                                        <span className="bg-white text-purple-600 text-xs font-semibold px-2 py-1 rounded-full">
                                            {selectedCategories.length + Object.values(selectedSpecs).reduce((acc, v) => acc + v.length, 0)}
                                        </span>
                                    )}
                                </button>

                                {/* Filters Panel */}
                                <div
                                    className={`lg:block bg-white border border-gray-200 rounded-lg p-6 ${showFilters ? 'block' : 'hidden'
                                        }`}
                                >
                                    {/* Clear Filters */}
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="w-full mb-4 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition text-sm font-semibold flex items-center justify-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Clear All Filters
                                        </button>
                                    )}

                                    {/* Category Filter */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                                        <div className="space-y-2">
                                            {categories.map(cat => (
                                                <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategories.includes(cat.name)}
                                                        onChange={() => toggleCategory(cat.name)}
                                                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                                    />
                                                    <span className="text-sm text-gray-700">{cat.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Specification Filters */}
                                    {allSpecKeys.length > 0 && (
                                        <>
                                            <div className="border-t border-gray-200 pt-4">
                                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Specifications</h3>
                                                <div className="space-y-4">
                                                    {allSpecKeys.map(specKey => (
                                                        <div key={specKey} className="border border-gray-200 rounded-lg p-3">
                                                            <h4 className="text-xs font-bold text-gray-900 mb-2 uppercase">{specKey}</h4>
                                                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                                                {getSpecValues(specKey).map(value => (
                                                                    <label key={value} className="flex items-center gap-2 cursor-pointer text-xs">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={(selectedSpecs[specKey] || []).includes(value)}
                                                                            onChange={() => toggleSpecValue(specKey, value)}
                                                                            className="w-3 h-3 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                                                        />
                                                                        <span className="text-gray-700 truncate">{value}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="lg:col-span-3">
                            {/* Results Info */}
                            <div className="mb-6 flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Showing <span className="font-semibold">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
                                </p>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-sm text-purple-600 hover:text-purple-700 underline"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>

                            {/* Products List */}
                            {filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProducts.map(product => (
                                        <Link
                                            key={product.id}
                                            href={`/categories/${product.category?.toLowerCase().replace(/\s+/g, '-')}/
${product.subCategory?.toLowerCase().replace(/\s+/g, '-')}/${product.slug}`}
                                            className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-200"
                                        >
                                            <div className="relative bg-gray-100 h-48 overflow-hidden">
                                                <Image
                                                    src={product.image_url || 'https://via.placeholder.com/300'}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                                {product.featured && (
                                                    <div className="absolute top-2 right-2 bg-amber-400 rounded-full p-2">
                                                        <Star className="w-5 h-5 text-amber-900 fill-current" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <p className="text-xs text-gray-500 mb-1">{product.category} / {product.subCategory}</p>
                                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition mb-2 line-clamp-2">
                                                    {product.name}
                                                </h3>
                                                {product.technical_specs && product.technical_specs.length > 0 && (
                                                    <div className="text-xs text-gray-600 space-y-1">
                                                        {product.technical_specs.slice(0, 2).map(spec => (
                                                            <div key={spec.id}>
                                                                <span className="font-semibold">{spec.specification_key}:</span> {spec.specification_values.slice(0, 2).join(', ')}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600 text-lg mb-2">No products found</p>
                                    <p className="text-gray-500 text-sm">Try adjusting your filters</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
