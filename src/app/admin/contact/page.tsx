'use client';

import { useState, useEffect } from 'react';

interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  subject: string;
  country: string;
  message: string;
  created_at: string;
}

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);

      const res = await fetch('/api/contact');
      const body = await res.json();

      if (!res.ok) {
        setError(body?.error || 'Failed to fetch contacts');
        setContacts([]);
      } else {
        setContacts(body || []);
      }
    } catch (err) {
      setError('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading contacts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Submissions</h1>
          <p className="text-gray-600">Manage and view contact form submissions</p>
        </div>

        {contacts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No contact submissions yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {contacts.map((contact) => (
              <div key={contact.id} className="bg-white rounded-lg shadow p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{contact.first_name} {contact.last_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{contact.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{contact.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Country</label>
                    <p className="text-gray-900">{contact.country || 'Not specified'}</p>
                  </div>
                  <div className="md:col-span-2 lg:col-span-4">
                    <label className="text-sm font-medium text-gray-500">Subject</label>
                    <p className="text-gray-900 font-medium">{contact.subject}</p>
                  </div>
                  <div className="md:col-span-2 lg:col-span-4">
                    <label className="text-sm font-medium text-gray-500">Message</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{contact.message}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Submitted</label>
                    <p className="text-gray-900 text-sm">
                      {new Date(contact.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}