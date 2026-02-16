'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, Eye, X } from 'lucide-react';
import { generateSlug } from '@/lib/slug';
import { uploadImage } from '@/lib/uploadImage';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  status: 'active' | 'inactive';
  created_at: string;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  status: 'active' | 'inactive';
  imageFile: File | null;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    status: 'active',
    imageFile: null,
  });

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setCategories(data.categories || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (c) => filter === 'all' || c.status === filter
  );

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

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

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug || !formData.description || !formData.imageFile) {
      alert('Please fill all required fields including image');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = '';
      if (formData.imageFile) {
        imageUrl = await uploadImage(formData.imageFile);
      }

      const response = await fetch('/api/categories/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          image_url: imageUrl,
          status: formData.status,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create category');
      }

      const data = await response.json();
      setCategories([...categories, data.category]);
      setShowAddForm(false);
      setFormData({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        status: 'active',
        imageFile: null,
      });
      alert('Category added successfully!');
    } catch (error) {
      console.error('Error adding category:', error);
      alert(error instanceof Error ? error.message : 'Failed to add category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      image_url: category.image_url || '',
      status: category.status || 'active',
      imageFile: null,
    });
    setIsEditing(true);
    setShowAddForm(true);
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert('No category selected for editing');
      return;
    }
    if (!formData.name || !formData.slug || !formData.description) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = formData.image_url;
      if (formData.imageFile) {
        imageUrl = await uploadImage(formData.imageFile);
      }

      const response = await fetch('/api/categories/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedCategory.id,
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          image_url: imageUrl,
          status: formData.status,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update category');
      }

      const data = await response.json();
      setCategories(categories.map((c) => (c.id === selectedCategory.id ? data.category : c)));
      setSelectedCategory(data.category);
      setShowAddForm(false);
      setIsEditing(false);
      setFormData({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        status: 'active',
        imageFile: null,
      });
      alert('Category updated successfully!');
    } catch (error) {
      console.error('Error updating category:', error);
      alert(error instanceof Error ? error.message : 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${category.slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete category');
      }

      setCategories(categories.filter((c) => c.id !== category.id));
      setSelectedCategory(null);
      alert('Category deleted successfully!');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete category');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-purple-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Categories</h1>
          <p className="text-gray-600 mt-1">Manage product categories</p>
        </div>
        <button
          onClick={() => {
            setIsEditing(false);
            setFormData({
              name: '',
              slug: '',
              description: '',
              image_url: '',
              status: 'active',
              imageFile: null,
            });
            setShowAddForm(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Filter Tabs */}
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
            {status.charAt(0).toUpperCase() + status.slice(1)} ({filteredCategories.length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Grid */}
        <div className="lg:col-span-2 space-y-4">
          {filteredCategories.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-lg">
              <p className="text-gray-500">No categories found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-500 cursor-pointer transition group overflow-hidden shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <img src={category.image_url || 'https://via.placeholder.com/64?text=Category'} alt={category.name} className="w-16 h-16 rounded object-cover" />
                    <div
                      className={`px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(
                        category.status
                      )}`}
                    >
                      {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                    </div>
                  </div>

                  <h3 className="text-gray-900 font-semibold text-lg group-hover:text-purple-600 transition mb-1">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-gray-600 text-sm">{new Date(category.created_at).toLocaleDateString()}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategory(category);
                      }}
                      className="text-gray-600 hover:text-purple-600 transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          {selectedCategory ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Details</h2>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <img src={selectedCategory.image_url || 'https://via.placeholder.com/300?text=Category'} alt={selectedCategory.name} className="w-full h-48 rounded-lg object-cover mb-4" />

                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Name</p>
                  <p className="text-gray-900 font-semibold">{selectedCategory.name}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Slug</p>
                  <p className="text-purple-600 font-mono text-sm">{selectedCategory.slug}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Description</p>
                  <p className="text-gray-700 text-sm bg-purple-50 p-3 rounded-lg border border-gray-200">
                    {selectedCategory.description}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Status</p>
                  <div
                    className={`px-3 py-2 rounded-lg border text-sm font-semibold ${getStatusColor(
                      selectedCategory.status
                    )}`}
                  >
                    {selectedCategory.status.charAt(0).toUpperCase() + selectedCategory.status.slice(1)}
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Created</p>
                  <p className="text-gray-700 text-sm">{new Date(selectedCategory.created_at).toLocaleDateString()}</p>
                </div>

                <div className="pt-4 space-y-2 border-t border-gray-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedCategory) handleStartEditCategory(selectedCategory);
                      }}
                      className="w-full flex items-center justify-center py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-semibold text-sm"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedCategory) handleDeleteCategory(selectedCategory);
                      }}
                      className="w-full flex items-center justify-center py-2 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition font-semibold text-sm"
                    >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-lg">
              <p className="text-gray-500">Select a category to view details</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>

    {/* Add Category Modal */}
    {showAddForm && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Category</h2>
            <button
              onClick={() => {
                setShowAddForm(false);
                setIsEditing(false);
              }}
              className="text-gray-600 hover:text-gray-900 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={isEditing ? handleEditCategory : handleAddCategory} className="space-y-4">
            <div>
              <label className="text-gray-700 text-sm font-semibold mb-2 block">Category Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Electronics"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm font-semibold mb-2 block">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="e.g., electronics"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm font-semibold mb-2 block">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Category description"
                rows={3}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm font-semibold mb-2 block">Category Image <span className="text-red-500">*</span></label>
              <input
                type="file"
                name="image_url"
                onChange={handleInputChange}
                accept="image/*"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                required
              />
              {formData.image_url && (
                <div className="mt-3">
                  <img src={formData.image_url} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                </div>
              )}
            </div>

            <div>
              <label className="text-gray-700 text-sm font-semibold mb-2 block">Status</label>
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

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setIsEditing(false);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isSubmitting ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Category')}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </>
  );
}
