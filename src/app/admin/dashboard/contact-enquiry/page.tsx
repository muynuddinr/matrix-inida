'use client';

import { useState } from 'react';
import { Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';

interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'reviewed' | 'replied';
  date: string;
}

export default function ContactEnquiryPage() {
  const [enquiries] = useState<ContactEnquiry[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 98765 43210',
      subject: 'Web Development Service',
      message: 'I am interested in your web development services for my startup.',
      status: 'new',
      date: '2026-01-30',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+91 87654 32109',
      subject: 'Custom Solutions',
      message: 'Looking for custom enterprise solutions for our company.',
      status: 'reviewed',
      date: '2026-01-29',
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert@example.com',
      phone: '+91 76543 21098',
      subject: 'App Development',
      message: 'Interested in mobile app development.',
      status: 'replied',
      date: '2026-01-28',
    },
  ]);

  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'reviewed' | 'replied'>('all');

  const filteredEnquiries = enquiries.filter((e) => filter === 'all' || e.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'reviewed':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'replied':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <CheckCircle className="w-4 h-4" />;
      case 'replied':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Contact Enquiries</h1>
          <p className="text-gray-600 mt-1">Manage all contact form submissions</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-purple-600">{filteredEnquiries.length}</p>
          <p className="text-gray-600 text-sm">Total Enquiries</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 flex-wrap">
        {(['all', 'new', 'reviewed', 'replied'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition shadow-md ${
              filter === status
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiries List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredEnquiries.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-md">
              <p className="text-gray-600">No enquiries found</p>
            </div>
          ) : (
            filteredEnquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                onClick={() => setSelectedEnquiry(enquiry)}
                className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg hover:border-purple-300 cursor-pointer transition group shadow-md"
              >
                <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 font-semibold text-lg group-hover:text-purple-600 transition">
                      {enquiry.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 break-all">{enquiry.email}</p>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${getStatusColor(
                      enquiry.status
                    )}`}
                  >
                    {getStatusIcon(enquiry.status)}
                    {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                  </div>
                </div>

                <p className="text-purple-600 font-semibold mb-2">{enquiry.subject}</p>
                <p className="text-gray-700 text-sm line-clamp-2 mb-3">{enquiry.message}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 flex-wrap gap-2">
                  <span className="text-gray-600 text-xs">{enquiry.date}</span>
                  <span className="text-gray-600 text-xs">{enquiry.phone}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          {selectedEnquiry ? (
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 sticky top-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Details</h2>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-xs uppercase font-semibold mb-1">Name</p>
                  <p className="text-gray-900 font-semibold">{selectedEnquiry.name}</p>
                </div>

                <div>
                  <p className="text-gray-600 text-xs uppercase font-semibold mb-1">Email</p>
                  <p className="text-purple-600 font-mono text-sm break-all">{selectedEnquiry.email}</p>
                </div>

                <div>
                  <p className="text-gray-600 text-xs uppercase font-semibold mb-1">Phone</p>
                  <p className="text-gray-900 font-semibold">{selectedEnquiry.phone}</p>
                </div>

                <div>
                  <p className="text-gray-600 text-xs uppercase font-semibold mb-1">Status</p>
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border w-fit text-sm ${getStatusColor(
                      selectedEnquiry.status
                    )}`}
                  >
                    {getStatusIcon(selectedEnquiry.status)}
                    {selectedEnquiry.status.charAt(0).toUpperCase() + selectedEnquiry.status.slice(1)}
                  </div>
                </div>

                <div>
                  <p className="text-gray-600 text-xs uppercase font-semibold mb-1">Message</p>
                  <p className="text-gray-700 text-sm leading-relaxed bg-purple-50 p-3 rounded-lg border border-purple-200">
                    {selectedEnquiry.message}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-xs uppercase font-semibold mb-1">Received</p>
                  <p className="text-gray-700 text-sm">{selectedEnquiry.date}</p>
                </div>

                <div className="pt-4 space-y-2 border-t border-gray-200">
                  <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-semibold text-sm shadow-md">
                    Reply
                  </button>
                  <button className="w-full flex items-center justify-center py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg transition font-semibold text-sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 text-center shadow-md">
              <p className="text-gray-600">Select an enquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
