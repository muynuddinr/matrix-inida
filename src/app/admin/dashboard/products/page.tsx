'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, Eye, Star } from 'lucide-react';
import { generateSlug } from '@/lib/slug';
import { uploadImage } from '@/lib/uploadImage';

interface Product {
  id: string;
  name: string;
  slug: string;
  sub_category_id: string;
  image_url: string;
  status: 'active' | 'inactive';
  featured: boolean;
  created_at: string;
  description?: string;
  category?: string;
  subCategory?: string;
}

interface SubCategory {
  id: string;
  name: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  slug: string;
  category: string;
  subCategory: string;
  image_url: string;
  status: 'active' | 'inactive';
  featured: boolean;
  imageFile: File | null;
  technical_specs: Array<{ key: string; values: string[] }>;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'featured'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specMergeNotice, setSpecMergeNotice] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    category: '',
    subCategory: '',
    image_url: 'https://via.placeholder.com/300?text=Product',
    status: 'active',
    featured: false,
    imageFile: null,
    technical_specs: [],
  });

  // Fetch data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, subCatRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/sub-categories'),
          fetch('/api/products?all=true'),
        ]);
        if (!catRes.ok || !subCatRes.ok || !prodRes.ok) throw new Error('Failed to fetch');
        const catData = await catRes.json();
        const subCatData = await subCatRes.json();
        const prodData = await prodRes.json();
        setCategories(catData.categories || []);
        setSubCategories(subCatData.subCategories || []);
        setProducts(prodData.products || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkboxTarget = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkboxTarget.checked }));
    } else if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0] || null;
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        image_url: file ? URL.createObjectURL(file) : 'https://via.placeholder.com/300?text=Product',
      }));
    } else {
      setFormData(prev => {
        const updated = { ...prev, [name]: value };
        
        // Auto-generate slug when name changes
        if (name === 'name') {
          updated.slug = generateSlug(value);
        }
        
        return updated;
      });
    }
  };

  // Helpers: normalize keys and sanitize/merge specs (remove duplicates)
  const normalizeKey = (k: string) => (k || '').trim().toLowerCase();

  const sanitizeSpecs = (specs: Array<{ key: string; values: string[] }>) => {
    const map = new Map<string, { key: string; values: Set<string> }>();
    (specs || []).forEach((s) => {
      const rawKey = (s?.key || '').trim();
      if (!rawKey) return;
      const keyNorm = normalizeKey(rawKey);
      const vals = (s.values || []).map(v => (v || '').toString().trim()).filter(Boolean);
      if (!map.has(keyNorm)) map.set(keyNorm, { key: rawKey, values: new Set<string>(vals) });
      else {
        vals.forEach(v => map.get(keyNorm)!.values.add(v));
      }
    });

    return Array.from(map.values()).map((entry) => ({
      key: entry.key,
      values: Array.from(entry.values),
    }));
  };

  const handleAddSpecification = () => {
    setFormData(prev => ({
      ...prev,
      technical_specs: [
        ...prev.technical_specs,
        { key: '', values: [''] }
      ]
    }));
  };

  const handleUpdateSpecification = (index: number, field: 'key' | 'values', value: any) => {
    setFormData(prev => {
      const updated = [...prev.technical_specs];

      if (field === 'key') {
        const newKey = (value || '').trim();
        const norm = normalizeKey(newKey);
        // If another spec already has this key, merge values and remove duplicate entry
        const dupIndex = updated.findIndex((s, i) => i !== index && normalizeKey(s.key) === norm);
        if (dupIndex !== -1) {
          const mergedValues = Array.from(new Set([...(updated[dupIndex].values || []), ...(updated[index].values || [])].map((v: any) => (v || '').toString().trim()).filter(Boolean)));
          updated[dupIndex].values = mergedValues;
          // remove the current (duplicate) entry
          updated.splice(index, 1);

          // notify user about the merge
          setSpecMergeNotice(`Merged duplicate spec key "${newKey}" — values combined`);
          setTimeout(() => setSpecMergeNotice(null), 3500);

          return { ...prev, technical_specs: updated };
        }

        updated[index].key = newKey;
      } else if (field === 'values') {
        const vals = Array.isArray(value) ? value.map((v: any) => (v || '').toString().trim()).filter(Boolean) : [];
        updated[index].values = Array.from(new Set(vals));
      }

      return { ...prev, technical_specs: updated };
    });
  };

  const handleRemoveSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technical_specs: prev.technical_specs.filter((_, i) => i !== index)
    }));
  };

  const handleAddSpecValue = (specIndex: number) => {
    setFormData(prev => {
      const updated = [...prev.technical_specs];
      updated[specIndex].values.push('');
      return { ...prev, technical_specs: updated };
    });
  };

  const handleUpdateSpecValue = (specIndex: number, valueIndex: number, value: string) => {
    setFormData(prev => {
      const updated = [...prev.technical_specs];
      updated[specIndex].values[valueIndex] = (value || '').toString().trim();
      // remove empty and dedupe
      updated[specIndex].values = Array.from(new Set(updated[specIndex].values.filter((v: any) => v && v.toString().trim())));
      return { ...prev, technical_specs: updated };
    });
  };

  const handleRemoveSpecValue = (specIndex: number, valueIndex: number) => {
    setFormData(prev => {
      const updated = [...prev.technical_specs];
      updated[specIndex].values = updated[specIndex].values.filter((_, i) => i !== valueIndex);
      return { ...prev, technical_specs: updated };
    });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.category || !formData.imageFile) {
      alert('Please fill in all required fields: Product Name, Category, and Image');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = '';
      if (formData.imageFile) {
        imageUrl = await uploadImage(formData.imageFile);
      }

      // sanitize/merge technical specs before sending
      const sanitizedSpecsToCreate = sanitizeSpecs(formData.technical_specs);
      if (sanitizedSpecsToCreate.length < (formData.technical_specs || []).length) {
        setSpecMergeNotice('Merged duplicate specification keys — values combined');
        setTimeout(() => setSpecMergeNotice(null), 3500);
      }

      const response = await fetch('/api/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: '',
          image_url: imageUrl,
          status: formData.status,
          featured: formData.featured,
          category_name: formData.category,
          sub_category_name: formData.subCategory,
          technical_specs: sanitizedSpecsToCreate,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create product');
      }

      const data = await response.json();
      setProducts([...products, data.product]);
      setShowAddForm(false);
      setFormData({
        name: '',
        slug: '',
        category: '',
        subCategory: '',
        image_url: 'https://via.placeholder.com/300?text=Product',
        status: 'active',
        featured: false,
        imageFile: null,
        technical_specs: [],
      });
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.category || !selectedProduct) {
      alert('Please fill in all required fields: Product Name, Category');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = formData.image_url;
      if (formData.imageFile) {
        imageUrl = await uploadImage(formData.imageFile);
      }

      // sanitize/merge technical specs before sending
      const sanitizedSpecsToUpdate = sanitizeSpecs(formData.technical_specs);
      if (sanitizedSpecsToUpdate.length < (formData.technical_specs || []).length) {
        setSpecMergeNotice('Merged duplicate specification keys — values combined');
        setTimeout(() => setSpecMergeNotice(null), 3500);
      }

      const response = await fetch('/api/products/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedProduct.id,
          name: formData.name,
          slug: formData.slug,
          description: '',
          image_url: imageUrl,
          status: formData.status,
          featured: formData.featured,
          category_name: formData.category,
          sub_category_name: formData.subCategory,
          technical_specs: sanitizedSpecsToUpdate,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update product');
      }

      const data = await response.json();
      setProducts(products.map(p => p.id === selectedProduct.id ? data.product : p));
      setShowAddForm(false);
      setIsEditing(false);
      setSelectedProduct(null);
      setFormData({
        name: '',
        slug: '',
        category: '',
        subCategory: '',
        image_url: 'https://via.placeholder.com/300?text=Product',
        status: 'active',
        featured: false,
        imageFile: null,
        technical_specs: [],
      });
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${product.slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete product');
      }

      setProducts(products.filter(p => p.id !== product.id));
      setSelectedProduct(null);
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete product');
    }
  };

  const handleStartEdit = (product: Product) => {
    // Allow editing when sub-category is missing or when product is inactive.
    // If the listed product has a valid subCategory AND is active, keep using the category/sub route (same behavior as before).
    // Otherwise fetch directly by slug with ?all=true so admin can edit products without sub-category or inactive products.
    let url = '';
    if (product.category && product.subCategory && product.status === 'active') {
      const categorySlug = product.category.toLowerCase().replace(/\s+/g, '-');
      const subCategorySlug = product.subCategory.toLowerCase().replace(/\s+/g, '-');
      url = `/api/categories/${categorySlug}/sub/${subCategorySlug}/products/${product.slug}`;
    } else {
      url = `/api/products/${product.slug}?all=true`;
    }

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch product details');
        return res.json();
      })
      .then(data => {
        console.log('Edit API response:', data);

        if (!data.product) {
          throw new Error('Invalid product data received');
        }

        setFormData({
          name: data.product.name || '',
          slug: data.product.slug || '',
          category: data.category?.name || product.category || '',
          subCategory: data.subCategory?.name || product.subCategory || '',
          image_url: data.product.image_url || '',
          status: data.product.status || 'active',
          featured: data.product.featured || false,
          imageFile: null,
          technical_specs: data.product.technical_specs ? data.product.technical_specs.map((spec: any) => ({
            key: spec.specification_key || '',
            values: spec.specification_values || []
          })) : [],
        });

        setSelectedProduct(product);
        setIsEditing(true);
        setShowAddForm(true);
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
        alert('Failed to load product details for editing: ' + (error instanceof Error ? error.message : 'Unknown error'));
      });
  };

  const filteredProducts = products.filter((p) => {
    if (filter === 'featured') return p.featured;
    if (filter === 'active') return p.status === 'active';
    if (filter === 'inactive') return p.status === 'inactive';
    return true;
  });

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage all products in inventory</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition shadow-lg hover:shadow-xl">
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        {(['all', 'active', 'inactive', 'featured'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
              filter === status
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-purple-100 border border-gray-200'
            }`}
          >
            {status === 'featured' ? '⭐ Featured' : status.charAt(0).toUpperCase() + status.slice(1)} (
            {filteredProducts.length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Products Table */}
        <div className="xl:col-span-3">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No products found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-purple-50">
                      <th className="px-4 md:px-6 py-4 text-left text-purple-900 font-semibold">Product</th>
                      <th className="px-4 md:px-6 py-4 text-left text-purple-900 font-semibold hidden md:table-cell">Category</th>
                      <th className="px-4 md:px-6 py-4 text-left text-purple-900 font-semibold">Status</th>
                      <th className="px-4 md:px-6 py-4 text-left text-purple-900 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-100 hover:bg-purple-50 transition cursor-pointer"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={product.image_url || 'https://via.placeholder.com/48?text=Product'} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                            <div>
                              <p className="text-gray-900 font-semibold">{product.name}</p>
                              {product.featured && (
                                <span className="inline-flex items-center gap-1 text-amber-500 text-xs font-semibold">
                                  <Star className="w-3 h-3 fill-current" />
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                          <p className="text-gray-600 text-sm">{product.category}</p>
                          <p className="text-gray-400 text-xs">{product.subCategory}</p>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div
                            className={`px-2 py-1 rounded-lg border text-xs font-semibold w-fit ${getStatusColor(
                              product.status
                            )}`}
                          >
                            {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(product);
                            }}
                            className="text-purple-600 hover:text-purple-700 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Details Panel */}
        <div className="xl:col-span-1">
          {selectedProduct ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-purple-900">Details</h2>
                <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="mb-4">
                <img src={selectedProduct.image_url || 'https://via.placeholder.com/300?text=Product'} alt={selectedProduct.name} className="w-full h-48 rounded-lg object-cover bg-gray-100" />
              </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Product Name</p>
                  <p className="text-gray-900 font-semibold">{selectedProduct.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Category</p>
                    <p className="text-gray-700 text-sm">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Sub Category</p>
                    <p className="text-gray-700 text-sm">{selectedProduct.subCategory}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Status</p>
                  <div
                    className={`px-2 py-1 rounded-lg border text-xs font-semibold w-fit ${getStatusColor(
                      selectedProduct.status
                    )}`}
                  >
                    {selectedProduct.status.charAt(0).toUpperCase() + selectedProduct.status.slice(1)}
                  </div>
                </div>

                {selectedProduct.featured && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                    <p className="text-amber-600 text-xs font-semibold flex items-center justify-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Featured Product
                    </p>
                  </div>
                )}

                <div className="pt-4 space-y-2 border-t border-gray-200">
                  <button
                    onClick={() => handleStartEdit(selectedProduct)}
                    className="w-full flex items-center justify-center py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-semibold text-sm"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(selectedProduct)}
                    className="w-full flex items-center justify-center py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition font-semibold text-sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-lg">
              <p className="text-gray-500">Select a product to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-purple-900">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => { setShowAddForm(false); setIsEditing(false); }} className="text-gray-400 hover:text-gray-600 text-2xl">
                ✕
              </button>
            </div>

            <form onSubmit={isEditing ? handleEditProduct : handleAddProduct} className="p-6 space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., iPhone 15 Pro"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                />
              </div>

              {/* Product Slug */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="Auto-generated from product name"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                />
              </div>

              {/* Category & Sub-Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sub-Category <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    disabled={!formData.category}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition disabled:opacity-50 disabled:bg-gray-100"
                  >
                    <option value="">No Sub-Category (Direct to Category)</option>
                    {formData.category && subCategories
                      .filter(sub => {
                        const catId = categories.find(c => c.name === formData.category)?.id;
                        return sub.category_id === catId;
                      })
                      .map(sub => (
                        <option key={sub.id} value={sub.name}>{sub.name}</option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Image & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image <span className="text-red-500">*</span></label>
                  <input
                    type="file"
                    name="image_url"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                    required
                  />
                  {formData.image_url && !formData.image_url.includes('placeholder') && (
                    <div className="mt-3">
                      <img src={formData.image_url} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-lg p-4">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded accent-purple-600"
                />
                <label className="text-sm font-semibold text-gray-700">Mark as Featured Product</label>
              </div>

              {/* Technical Specifications */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">Technical Specifications <span className="text-gray-500 text-xs">(Optional)</span></h3>
                  {specMergeNotice && (
                    <p className="text-xs text-amber-600 mt-1">{specMergeNotice}</p>
                  )}
                  <button
                    type="button"
                    onClick={handleAddSpecification}
                    className="text-xs px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded transition"
                  >
                    + Add Spec
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.technical_specs.map((spec, specIndex) => (
                    <div key={specIndex} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold text-gray-700">Specification {specIndex + 1}</label>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecification(specIndex)}
                          className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mb-3">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Key (e.g., Color, Processor, RAM)</label>
                        <input
                          type="text"
                          value={spec.key}
                          onChange={(e) => handleUpdateSpecification(specIndex, 'key', e.target.value)}
                          placeholder="e.g., Display, Processor, RAM"
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-semibold text-gray-600">Values</label>
                          <button
                            type="button"
                            onClick={() => handleAddSpecValue(specIndex)}
                            className="text-xs px-2 py-1 bg-blue-400 hover:bg-blue-500 text-white rounded transition"
                          >
                            + Add Value
                          </button>
                        </div>

                        <div className="space-y-2">
                          {spec.values.map((value, valueIndex) => (
                            <div key={valueIndex} className="flex gap-2">
                              <input
                                type="text"
                                value={value}
                                onChange={(e) => handleUpdateSpecValue(specIndex, valueIndex, e.target.value)}
                                placeholder="e.g., 6.1 inch OLED"
                                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-purple-500"
                              />
                              {spec.values.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSpecValue(specIndex, valueIndex)}
                                  className="px-2 py-1 bg-red-300 hover:bg-red-400 text-white rounded text-sm transition"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.technical_specs.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No specifications added yet. Click "Add Spec" to get started.</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? 'Adding...' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
