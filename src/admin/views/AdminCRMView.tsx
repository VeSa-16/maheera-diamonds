import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, RefreshCw, CheckCircle2, Circle } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  preferredContact: string;
  date?: string;
  time?: string;
  status: string;
  created_at: string;
}

export default function AdminCRMView() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Optimistic update
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    try {
      await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error('Failed to update status', err);
      // Revert on failure
      fetchInquiries();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Contacted': return 'text-antique-gold bg-antique-gold/10 border-antique-gold/20';
      case 'Closed': return 'text-gray-400 bg-white/5 border-white/10';
      default: return 'text-gray-300 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-serif text-2xl text-white font-light flex items-center gap-3">
            <Users className="w-6 h-6 text-antique-gold" />
            VIP Concierge CRM
          </h2>
          <p className="text-sm text-gray-400 mt-1">Manage private consultations and lead pipeline.</p>
        </div>
      </div>

      {/* CRM Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-display tracking-widest uppercase text-gray-500 border-b border-white/10 bg-white/5">
                <th className="p-4 font-medium">Client</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Interest</th>
                <th className="p-4 font-medium">Requested Time</th>
                <th className="p-4 font-medium text-right">Pipeline Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-antique-gold" />
                    Loading leads...
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500 font-serif italic">
                    No active inquiries in the pipeline.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-white">{inq.name || 'Anonymous'}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">
                        {new Date(inq.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-2 text-gray-300 text-xs">
                        <Mail className="w-3.5 h-3.5" />
                        <a href={`mailto:${inq.email}`} className="hover:text-antique-gold">{inq.email}</a>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 text-xs">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{inq.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize text-gray-300">{inq.interest || 'General'}</span>
                    </td>
                    <td className="p-4">
                      {inq.date ? (
                        <div className="flex items-center gap-2 text-gray-300 text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{inq.date} {inq.time ? `at ${inq.time}` : ''}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic text-xs">As soon as possible</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {inq.status === 'New' && <Circle className="w-2.5 h-2.5 text-blue-400 fill-blue-400" />}
                        {inq.status === 'Closed' && <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />}
                        <select
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                          className={`appearance-none bg-transparent text-xs font-medium uppercase tracking-wider text-right cursor-pointer focus:outline-none hover:opacity-80 transition-opacity ${getStatusColor(inq.status).split(' ')[0]}`}
                        >
                          <option className="bg-obsidian text-white" value="New">New Lead</option>
                          <option className="bg-obsidian text-white" value="Contacted">Contacted</option>
                          <option className="bg-obsidian text-white" value="In Progress">In Progress</option>
                          <option className="bg-obsidian text-white" value="Closed">Closed</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
