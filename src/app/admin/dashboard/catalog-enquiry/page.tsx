'use client';

import { useState, useEffect } from 'react';
import { Trash2, Eye, CheckCircle, FileText, Phone, Mail, User, Package } from 'lucide-react';

interface CatalogEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  product_name: string;
  product_slug?: string;
  category_slug?: string;
  sub_category_slug?: string;
  status: 'new' | 'reviewed' | 'replied';
  created_at: string;
  updated_at: string;
}

export default function CatalogEnquiryPage() {
  const [enquiries, setEnquiries] = useState<CatalogEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<CatalogEnquiry | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'reviewed' | 'replied'>('all');

  useEffect(() => {
    fetchEnquiries();
  }, [filter]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const statusParam = filter === 'all' ? '' : `&status=${filter}`;
      const response = await fetch(`/api/catalog-enquiries?limit=100${statusParam}`);
      const data = await response.json();

      if (response.ok) {
        setEnquiries(data.enquiries);
      } else {
        setError(data.error || 'Failed to fetch enquiries');
      }
    } catch (err) {
      setError('An error occurred while fetching enquiries');
      console.error('Error fetching enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateEnquiryStatus = async (id: string, status: 'new' | 'reviewed' | 'replied') => {
    try {
      const response = await fetch('/api/catalog-enquiries', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        setEnquiries(enquiries.map(enquiry =>
          enquiry.id === id ? { ...enquiry, status } : enquiry
        ));
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update enquiry');
      }
    } catch (err) {
      setError('An error occurred while updating enquiry');
      console.error('Error updating enquiry:', err);
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;

    try {
      const response = await fetch(`/api/catalog-enquiries?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEnquiries(enquiries.filter(enquiry => enquiry.id !== id));
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry(null);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete enquiry');
      }
    } catch (err) {
      setError('An error occurred while deleting enquiry');
      console.error('Error deleting enquiry:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading catalog enquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catalog Enquiries</h1>
          <p className="text-gray-600 mt-1">Manage catalog requests from customers</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Enquiries</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{enquiries.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">N</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New</p>
              <p className="text-2xl font-bold text-gray-900">
                {enquiries.filter(e => e.status === 'new').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 font-bold">R</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reviewed</p>
              <p className="text-2xl font-bold text-gray-900">
                {enquiries.filter(e => e.status === 'reviewed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">D</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Replied</p>
              <p className="text-2xl font-bold text-gray-900">
                {enquiries.filter(e => e.status === 'replied').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiries List */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Enquiries</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {enquiries.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No catalog enquiries found</p>
                </div>
              ) : (
                enquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
                      selectedEnquiry?.id === enquiry.id ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                    }`}
                    onClick={() => setSelectedEnquiry(enquiry)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{enquiry.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(enquiry.status)}`}>
                            {enquiry.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {enquiry.product_name}
                          </span>
                          <span>{formatDate(enquiry.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateEnquiryStatus(enquiry.id, enquiry.status === 'new' ? 'reviewed' : 'new');
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                          title={enquiry.status === 'new' ? 'Mark as reviewed' : 'Mark as new'}
                        >
                          {enquiry.status === 'new' ? (
                            <Eye className="w-4 h-4 text-blue-600" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEnquiry(enquiry.id);
                          }}
                          className="p-1 hover:bg-red-100 rounded"
                          title="Delete enquiry"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Enquiry Details */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Enquiry Details</h2>
            </div>
            <div className="p-6">
              {selectedEnquiry ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{selectedEnquiry.name}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{selectedEnquiry.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{selectedEnquiry.phone}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{selectedEnquiry.product_name}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={selectedEnquiry.status}
                      onChange={(e) => updateEnquiryStatus(selectedEnquiry.id, e.target.value as any)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="replied">Replied</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{formatDate(selectedEnquiry.created_at)}</span>
                    </div>
                  </div>

                  {(selectedEnquiry.product_slug || selectedEnquiry.category_slug) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-900">
                          {selectedEnquiry.product_slug ? `Product: ${selectedEnquiry.product_slug}` :
                           selectedEnquiry.category_slug ? `Category: ${selectedEnquiry.category_slug}` : ''}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Select an enquiry to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}