'use client';

import { useState } from 'react';
import { Trash2, Eye, Mail as MailIcon, Check } from 'lucide-react';

interface NewsletterEnquiry {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  subscriptionDate: string;
  status: 'active' | 'inactive' | 'unsubscribed';
  lastEmail: string;
}

export default function NewsletterEnquiryPage() {
  const [enquiries] = useState<NewsletterEnquiry[]>([
    {
      id: '1',
      email: 'user1@example.com',
      firstName: 'Alice',
      lastName: 'Johnson',
      subscriptionDate: '2026-01-15',
      status: 'active',
      lastEmail: '2026-01-28',
    },
    {
      id: '2',
      email: 'user2@example.com',
      firstName: 'Bob',
      lastName: 'Williams',
      subscriptionDate: '2025-12-20',
      status: 'active',
      lastEmail: '2026-01-28',
    },
    {
      id: '3',
      email: 'user3@example.com',
      firstName: 'Carol',
      lastName: 'Brown',
      subscriptionDate: '2025-11-10',
      status: 'inactive',
      lastEmail: '2026-01-21',
    },
    {
      id: '4',
      email: 'user4@example.com',
      firstName: 'David',
      lastName: 'Davis',
      subscriptionDate: '2025-10-05',
      status: 'unsubscribed',
      lastEmail: '2026-01-14',
    },
    {
      id: '5',
      email: 'user5@example.com',
      firstName: 'Emma',
      lastName: 'Miller',
      subscriptionDate: '2026-01-25',
      status: 'active',
      lastEmail: '2026-01-28',
    },
  ]);

  const [selectedEnquiry, setSelectedEnquiry] = useState<NewsletterEnquiry | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'unsubscribed'>('all');

  const filteredEnquiries = enquiries.filter((e) => filter === 'all' || e.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'unsubscribed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Check className="w-4 h-4" />;
      case 'inactive':
        return <Eye className="w-4 h-4" />;
      default:
        return <MailIcon className="w-4 h-4" />;
    }
  };

  const stats = [
    { label: 'Total Subscribers', value: enquiries.length, color: 'text-purple-600' },
    { label: 'Active', value: enquiries.filter((e) => e.status === 'active').length, color: 'text-green-600' },
    { label: 'Inactive', value: enquiries.filter((e) => e.status === 'inactive').length, color: 'text-yellow-600' },
    { label: 'Unsubscribed', value: enquiries.filter((e) => e.status === 'unsubscribed').length, color: 'text-red-600' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Newsletter Enquiries</h1>
          <p className="text-gray-600 mt-1">Manage newsletter subscriptions and subscribers</p>
        </div>
        <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition shadow-md">
          Send Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 flex-wrap">
        {(['all', 'active', 'inactive', 'unsubscribed'] as const).map((status) => (
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
        {/* Subscribers List */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
            {filteredEnquiries.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">No subscribers found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-purple-50">
                      <th className="px-4 md:px-6 py-4 text-left text-purple-900 font-semibold">Name</th>
                      <th className="px-4 md:px-6 py-4 text-left text-purple-900 font-semibold">Email</th>
                      <th className="px-4 md:px-6 py-4 text-left text-purple-900 font-semibold">Status</th>
                      <th className="px-4 md:px-6 py-4 text-left text-purple-900 font-semibold hidden md:table-cell">Subscribed</th>
                      <th className="px-4 md:px-6 py-4 text-left text-purple-900 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnquiries.map((enquiry) => (
                      <tr
                        key={enquiry.id}
                        className="border-b border-gray-200 hover:bg-purple-50 transition cursor-pointer"
                        onClick={() => setSelectedEnquiry(enquiry)}
                      >
                        <td className="px-4 md:px-6 py-4">
                          <p className="text-gray-900 font-semibold">
                            {enquiry.firstName} {enquiry.lastName}
                          </p>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <p className="text-purple-600 font-mono break-all">{enquiry.email}</p>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border w-fit text-xs ${getStatusColor(enquiry.status)}`}>
                            {getStatusIcon(enquiry.status)}
                            <span className="hidden sm:inline">{enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}</span>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                          <p className="text-gray-600 text-xs">{enquiry.subscriptionDate}</p>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEnquiry(enquiry);
                            }}
                            className="text-purple-600 hover:text-purple-700 transition text-xs font-semibold"
                          >
                            View
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
        <div className="lg:col-span-1">
          {selectedEnquiry ? (
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 sticky top-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Subscriber Details</h2>
                <button onClick={() => setSelectedEnquiry(null)} className="text-gray-600 hover:text-gray-900">
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">
                    {selectedEnquiry.firstName.charAt(0)}
                    {selectedEnquiry.lastName.charAt(0)}
                  </div>
                  <p className="text-gray-900 font-bold">
                    {selectedEnquiry.firstName} {selectedEnquiry.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-xs uppercase font-semibold mb-1">Email</p>
                  <p className="text-purple-600 font-mono text-sm break-all">{selectedEnquiry.email}</p>
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

                <div className="pt-4 space-y-2 border-t border-gray-200">
                  <div>
                    <p className="text-gray-600 text-xs uppercase font-semibold mb-1">Subscribed Since</p>
                    <p className="text-gray-700 text-sm">{selectedEnquiry.subscriptionDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs uppercase font-semibold mb-1">Last Email Sent</p>
                    <p className="text-gray-700 text-sm">{selectedEnquiry.lastEmail}</p>
                  </div>
                </div>

                <div className="pt-4 space-y-2 border-t border-gray-200">
                  <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-semibold text-sm shadow-md">
                    Send Email
                  </button>
                  {selectedEnquiry.status !== 'unsubscribed' && (
                    <button className="w-full py-2 px-4 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-lg transition font-semibold text-sm">
                      {selectedEnquiry.status === 'active' ? 'Deactivate' : 'Reactivate'}
                    </button>
                  )}
                  <button className="w-full flex items-center justify-center py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg transition font-semibold text-sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 text-center shadow-md">
              <p className="text-gray-600">Select a subscriber to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
