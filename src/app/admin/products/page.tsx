'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface SubCategory {
  id: number;
  name: string;
  slug: string;
  categories?: Category;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  featured: boolean;
  status: string;
  sub_category_id: number;
  created_at: string;
  updated_at: string;
  subcategories?: SubCategory;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    featured: false,
    status: 'active',
    sub_category_id: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, subCategoriesRes, productsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/subcategories'),
        fetch('/api/products')
      ]);

      const categoriesData = await categoriesRes.json();
      const subCategoriesData = await subCategoriesRes.json();
      const productsData = await productsRes.json();

      if (categoriesRes.ok) {
        setCategories(categoriesData.categories || []);
      }
      if (subCategoriesRes.ok) {
        setSubCategories(subCategoriesData || []);
      }
      if (productsRes.ok) {
        setProducts(productsData || []);
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
      const url = editingProduct ? '/api/products' : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const body = editingProduct
        ? { ...formData, id: editingProduct.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchData();
        setShowForm(false);
        setEditingProduct(null);
        setFormData({ name: '', slug: '', description: '', image_url: '', featured: false, status: 'active', sub_category_id: 0 });
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      image_url: product.image_url || '',
      featured: product.featured,
      status: product.status,
      sub_category_id: product.sub_category_id,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const getSubCategoryInfo = (subCategoryId: number) => {
    const subCategory = subCategories.find(sc => sc.id === subCategoryId);
    if (subCategory) {
      const category = categories.find(c => c.id === subCategory.categories?.id);
      return `${category?.name || 'Unknown'} > ${subCategory.name}`;
    }
    return 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
            <p className="text-gray-600">Create and manage individual products</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subcategory</label>
                <select
                  value={formData.sub_category_id}
                  onChange={(e) => setFormData({ ...formData, sub_category_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value={0}>Select Subcategory</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.categories?.name || 'Unknown'} &gt; {subCategory.name}
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
                    if (!editingProduct) {
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
                        uploadFormData.append('folder', 'products');

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
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium">Featured Product</label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                    setFormData({ name: '', slug: '', description: '', image_url: '', featured: false, status: 'active', sub_category_id: 0 });
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
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {product.image_url && (
                <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  {product.featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                </div>
                <p className="text-sm text-gray-600">{product.slug}</p>
                <p className="text-sm text-gray-500">{product.description}</p>
                <p className="text-xs text-blue-600">Category: {getSubCategoryInfo(product.sub_category_id)}</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  product.status === 'active' ? 'bg-green-100 text-green-800' :
                  product.status === 'inactive' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {product.status}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(product.id)}
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