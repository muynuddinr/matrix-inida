'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface SubCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  category_id: number;
  created_at: string;
  updated_at: string;
  categories?: Category;
}

export default function AdminSubCategoriesPage() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    category_id: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, subCategoriesRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/subcategories')
      ]);

      const categoriesData = await categoriesRes.json();
      const subCategoriesData = await subCategoriesRes.json();

      if (categoriesRes.ok) {
        setCategories(categoriesData.categories || []);
      }
      if (subCategoriesRes.ok) {
        setSubCategories(subCategoriesData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingSubCategory ? '/api/subcategories' : '/api/subcategories';
      const method = editingSubCategory ? 'PUT' : 'POST';
      const body = editingSubCategory
        ? { ...formData, id: editingSubCategory.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchData();
        setShowForm(false);
        setEditingSubCategory(null);
        setFormData({ name: '', slug: '', description: '', image_url: '', category_id: 0 });
      }
    } catch (error) {
      console.error('Error saving subcategory:', error);
    }
  };

  const handleEdit = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory);
    setFormData({
      name: subCategory.name,
      slug: subCategory.slug,
      description: subCategory.description || '',
      image_url: subCategory.image_url || '',
      category_id: subCategory.category_id,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;

    try {
      const response = await fetch(`/api/subcategories?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading subcategories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Subcategories Management</h1>
            <p className="text-gray-600">Create and manage product subcategories</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Subcategory
          </button>
        </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingSubCategory ? 'Edit Subcategory' : 'Add Subcategory'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value={0}>Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (!editingSubCategory) {
                      setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const uploadFormData = new FormData();
                        uploadFormData.append('file', file);
                        uploadFormData.append('folder', 'subcategories');

                        try {
                          const uploadResponse = await fetch('/api/upload', {
                            method: 'POST',
                            body: uploadFormData,
                          });

                          if (uploadResponse.ok) {
                            const uploadData = await uploadResponse.json();
                            setFormData({ ...formData, image_url: uploadData.url });
                          }
                        } catch (error) {
                          console.error('Upload error:', error);
                        }
                      }
                    }}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                  {formData.image_url && (
                    <img src={formData.image_url} alt="Preview" className="w-16 h-16 object-cover rounded" />
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingSubCategory ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingSubCategory(null);
                    setFormData({ name: '', slug: '', description: '', image_url: '', category_id: 0 });
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {subCategories.map((subCategory) => (
          <div key={subCategory.id} className="border rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {subCategory.image_url && (
                <img src={subCategory.image_url} alt={subCategory.name} className="w-16 h-16 object-cover rounded" />
              )}
              <div>
                <h3 className="font-semibold">{subCategory.name}</h3>
                <p className="text-sm text-gray-600">{subCategory.slug}</p>
                <p className="text-sm text-gray-500">{subCategory.description}</p>
                <p className="text-xs text-blue-600">Category: {getCategoryName(subCategory.category_id)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(subCategory)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(subCategory.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}