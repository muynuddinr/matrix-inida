'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, Eye, X } from 'lucide-react';
import { generateSlug } from '@/lib/slug';
import { uploadImage } from '@/lib/uploadImage';

interface SubCategory {
  id: string;
  name: string;
  category_id: string;
  slug: string;
  description: string;
  image_url: string;
  status: 'active' | 'inactive';
  created_at: string;
}

interface Category {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  category: string;
  slug: string;
  description: string;
  image_url: string;
  status: 'active' | 'inactive';
  imageFile: File | null;
}

export default function SubCategoriesPage() {
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubCat, setSelectedSubCat] = useState<SubCategory | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    slug: '',
    description: '',
    image_url: '',
    status: 'active',
    imageFile: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, subCatRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/sub-categories'),
        ]);
        if (!catRes.ok || !subCatRes.ok) throw new Error('Failed to fetch');
        const catData = await catRes.json();
        const subCatData = await subCatRes.json();
        setCategories(catData.categories || []);
        setSubcategories(subCatData.subCategories || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData((prev) => ({ ...prev, category: categories[0].name }));
    }
  }, [categories]);

  const filteredSubcategories = subcategories.filter((sc) => {
    const statusMatch = filter === 'all' || sc.status === filter;
    const categoryMatch = categoryFilter === 'all' || categories.find((c) => c.id === sc.category_id)?.name === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const categoryNames = categories.map((c) => c.name);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0] || null;
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        image_url: file ? URL.createObjectURL(file) : '',
      }));
    } else {
      setFormData((prev) => {
        const updated = { ...prev, [name]: value };
        
        // Auto-generate slug when name changes
        if (name === 'name') {
          updated.slug = generateSlug(value);
        }
        
        return updated;
      });
    }
  };

  const handleAddSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.slug || !formData.description || !formData.imageFile) {
      alert('Please fill all required fields including image');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = '';
      if (formData.imageFile) {
        imageUrl = await uploadImage(formData.imageFile);
      }

      const response = await fetch('/api/sub-categories/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          image_url: imageUrl,
          status: formData.status,
          category_name: formData.category,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create sub-category');
      }

      const data = await response.json();
      setSubcategories([...subcategories, data.subCategory]);
      setShowAddForm(false);
      setFormData({
        name: '',
        category: formData.category,
        slug: '',
        description: '',
        image_url: '',
        status: 'active',
        imageFile: null,
      });
      alert('Sub-category added successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to add sub-category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Sub Categories</h1>
          <p className="text-gray-600 mt-1">Manage product sub-categories</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add Sub Category
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          {(['all', 'active', 'inactive'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                filter === status
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-purple-100 border border-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {['all', ...categoryNames].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-sm transition ${
                categoryFilter === cat
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-purple-100 border border-gray-200'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sub-Categories List */}
        <div className="xl:col-span-3">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
            {filteredSubcategories.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No sub-categories found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-purple-50">
                      <th className="px-4 md:px-6 py-4 text-left text-purple-900 font-semibold">Sub-Category</th>
                      <th className="px-4 md:px-6 py-4 text-left text-purple-900 font-semibold hidden md:table-cell">Category</th>
                      <th className="px-4 md:px-6 py-4 text-left text-purple-900 font-semibold">Status</th>
                      <th className="px-4 md:px-6 py-4 text-left text-purple-900 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubcategories.map((subcat) => (
                      <tr
                        key={subcat.id}
                        className="border-b border-gray-100 hover:bg-purple-50 transition cursor-pointer"
                        onClick={() => setSelectedSubCat(subcat)}
                      >
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={subcat.image_url || 'https://via.placeholder.com/48?text=Sub'} alt={subcat.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                            <div>
                              <p className="text-gray-900 font-semibold">{subcat.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                          <p className="text-gray-600 text-sm">{categories.find((c) => c.id === subcat.category_id)?.name}</p>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div
                            className={`px-2 py-1 rounded-lg border text-xs font-semibold w-fit ${getStatusColor(
                              subcat.status
                            )}`}
                          >
                            {subcat.status.charAt(0).toUpperCase() + subcat.status.slice(1)}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSubCat(subcat);
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
          {selectedSubCat ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-purple-900">Details</h2>
                <button onClick={() => setSelectedSubCat(null)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="mb-4">
                  <img src={selectedSubCat.image_url || 'https://via.placeholder.com/300?text=Sub'} alt={selectedSubCat.name} className="w-full h-48 rounded-lg object-cover bg-gray-100" />
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Name</p>
                  <p className="text-gray-900 font-semibold">{selectedSubCat.name}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Category</p>
                  <p className="text-gray-700 text-sm">{categories.find((c) => c.id === selectedSubCat.category_id)?.name}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Description</p>
                  <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {selectedSubCat.description}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Slug</p>
                  <p className="text-gray-600 text-sm font-mono">{selectedSubCat.slug}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Status</p>
                  <div
                    className={`px-2 py-1 rounded-lg border text-xs font-semibold w-fit ${getStatusColor(
                      selectedSubCat.status
                    )}`}
                  >
                    {selectedSubCat.status.charAt(0).toUpperCase() + selectedSubCat.status.slice(1)}
                  </div>
                </div>

                <div className="pt-4 space-y-2 border-t border-gray-200">
                  <button className="w-full flex items-center justify-center py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-semibold text-sm">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button className="w-full flex items-center justify-center py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition font-semibold text-sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-lg">
              <p className="text-gray-500">Select a sub-category to view details</p>
            </div>
          )}
        </div>
      </div>
      </div>

    {/* Add Sub Category Modal */}
    {showAddForm && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-purple-900">Add New Sub Category</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleAddSubCategory} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sub Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Smartphones"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="Auto-generated from name"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Sub category description"
                rows={3}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sub-Category Image <span className="text-red-500">*</span></label>
              <input
                type="file"
                name="image_url"
                onChange={handleInputChange}
                accept="image/*"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                required
              />
              {formData.image_url && (
                <div className="mt-3">
                  <img src={formData.image_url} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-gray-200" />
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

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isSubmitting ? 'Adding...' : 'Add Sub Category'}
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
  );
}
