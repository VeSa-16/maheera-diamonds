import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Download, Phone, CheckCircle2, Circle, Search, ChevronRight, MessageSquare, Clock, User, Calendar, Plus, Save } from 'lucide-react';
import { motion } from 'motion/react';

interface Note {
  text: string;
  timestamp: string;
}

interface Inquiry {
  id: string;
  type: string;
  name: string;
  phone: string;
  product?: string;
  message?: string;
  status: 'New' | 'Read';
  stage?: string;
  notes?: Note[];
  timestamp: string;
  created_at?: string;
}

const PIPELINE_STAGES = [
  'New Lead',
  'Consultation',
  'Designing',
  'Crafting',
  'Delivered',
  'Archived'
];

export default function CRMView({ theme }: { theme: 'dark' | 'light' }) {
  const isDark = theme === 'dark';
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');

  const { data: inquiries = [], isLoading } = useQuery<Inquiry[]>({
    queryKey: ['inquiries'],
    queryFn: async () => {
      const res = await fetch('/api/inquiries');
      if (!res.ok) throw new Error('Failed to fetch inquiries');
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Inquiry> }) => {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update inquiry');
      return { id, updates };
    },
    onSuccess: ({ id, updates }) => {
      queryClient.setQueryData(['inquiries'], (oldData: Inquiry[] | undefined) => 
        oldData ? oldData.map(inq => inq.id === id ? { ...inq, ...updates } : inq) : []
      );
    }
  });

  const handleStageChange = (id: string, stage: string) => {
    updateMutation.mutate({ id, updates: { stage, status: stage === 'Archived' ? 'Read' : 'Read' } });
  };

  const handleAddNote = (id: string) => {
    if (!newNote.trim()) return;
    const inquiry = inquiries.find(i => i.id === id);
    if (!inquiry) return;

    const currentNotes = inquiry.notes || [];
    const updatedNotes = [...currentNotes, { text: newNote, timestamp: new Date().toISOString() }];
    
    updateMutation.mutate({ id, updates: { notes: updatedNotes } });
    setNewNote('');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Name', 'Phone', 'Product', 'Message', 'Stage'];
    const rows = inquiries.map(inq => [
      inq.id,
      new Date(inq.timestamp || inq.created_at || '').toLocaleString(),
      inq.type,
      inq.name,
      inq.phone,
      inq.product || '',
      `"${(inq.message || '').replace(/"/g, '""')}"`,
      inq.stage || 'New Lead'
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `maheera_crm_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(i => 
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      i.phone.includes(searchQuery) ||
      (i.product && i.product.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [inquiries, searchQuery]);

  const selectedInquiry = inquiries.find(i => i.id === selectedId) || null;

  // Compute VIP stats for selected client
  const clientStats = useMemo(() => {
    if (!selectedInquiry) return null;
    const clientHistory = inquiries.filter(i => i.phone === selectedInquiry.phone);
    return {
      totalInquiries: clientHistory.length,
      firstContact: clientHistory[clientHistory.length - 1]?.timestamp || clientHistory[clientHistory.length - 1]?.created_at,
      activeCommissions: clientHistory.filter(i => i.stage !== 'Archived' && i.stage !== 'Delivered').length,
    };
  }, [selectedInquiry, inquiries]);

  // Set default selection if none selected
  if (!selectedId && filteredInquiries.length > 0 && !isLoading) {
    setSelectedId(filteredInquiries[0].id);
  }

  return (
    <div className={`h-[calc(100vh-88px-4rem)] flex flex-col animate-fade-in ${isDark ? 'text-white' : 'text-obsidian'}`}>
      
      {/* Header Panel */}
      <div className={`flex justify-between items-end p-6 rounded-xs border shadow-xs mb-6 shrink-0 transition-colors ${isDark ? 'bg-obsidian border-gold-900/40' : 'bg-white border-champagne'}`}>
        <div>
          <h2 className={`font-serif text-2xl tracking-wide ${isDark ? 'text-white' : 'text-obsidian'}`}>Executive CRM</h2>
          <p className={`font-sans text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>360° VIP Clienteling & Pipeline Management</p>
        </div>
        <button
          onClick={handleExportCSV}
          className={`flex items-center gap-2 text-[10px] font-display uppercase tracking-widest border border-antique-gold hover:bg-antique-gold/10 px-4 py-2 transition-colors cursor-pointer ${isDark ? 'text-white' : 'text-obsidian'}`}
        >
          <Download className="w-3 h-3" />
          Export Ledger
        </button>
      </div>

      {/* 3-Pane Layout */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* PANE 1: Lead Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`col-span-3 flex flex-col border rounded-xs shadow-xs overflow-hidden ${isDark ? 'bg-obsidian border-gold-900/40' : 'bg-white border-champagne'}`}
        >
          <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-black/5'}`}>
            <div className="relative">
              <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input 
                type="text" 
                placeholder="Search clients, phone..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 text-xs border rounded-xs focus:outline-none focus:border-antique-gold transition-colors ${
                  isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-black/10 text-obsidian'
                }`}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {isLoading ? (
              <p className="p-4 text-xs italic text-center text-gray-500">Loading feed...</p>
            ) : filteredInquiries.length === 0 ? (
              <p className="p-4 text-xs italic text-center text-gray-500">No matching inquiries.</p>
            ) : (
              filteredInquiries.map(inq => {
                const isSelected = inq.id === selectedId;
                const stage = inq.stage || 'New Lead';
                const isNew = inq.status === 'New' || inq.status === 'new';
                
                return (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    key={inq.id}
                    onClick={() => setSelectedId(inq.id)}
                    className={`w-full text-left p-3 rounded-xs flex flex-col gap-2 transition-colors border ${
                      isSelected 
                        ? (isDark ? 'bg-antique-gold/10 border-antique-gold/30' : 'bg-antique-gold/5 border-antique-gold/30') 
                        : (isDark ? 'border-transparent hover:bg-white/5' : 'border-transparent hover:bg-gray-50')
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`font-serif text-sm truncate pr-2 ${isDark ? 'text-white' : 'text-obsidian'}`}>
                        {inq.name}
                      </span>
                      {isNew && <Circle className="w-2 h-2 fill-rose-500 text-rose-500 mt-1 shrink-0" />}
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className={`px-2 py-0.5 rounded uppercase font-display tracking-widest ${
                        stage === 'Archived' ? 'bg-gray-500/20 text-gray-400' :
                        stage === 'New Lead' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-antique-gold/20 text-antique-gold'
                      }`}>
                        {stage}
                      </span>
                      <span className="text-gray-500 font-sans">
                        {new Date(inq.timestamp || inq.created_at || '').toLocaleDateString()}
                      </span>
                    </div>
                  </motion.button>
                )
              })
            )}
          </div>
        </motion.div>

        {/* PANE 2: Commission Thread */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`col-span-6 flex flex-col border rounded-xs shadow-xs overflow-hidden ${isDark ? 'bg-obsidian border-gold-900/40' : 'bg-white border-champagne'}`}
        >
          {selectedInquiry ? (
            <motion.div 
              key={selectedInquiry.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col h-full"
            >
              {/* Thread Header */}
              <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-white/10' : 'border-black/5'}`}>
                <div>
                  <h3 className="font-serif text-xl">{selectedInquiry.type} Commission</h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    ID: <span className="font-mono">{selectedInquiry.id}</span>
                  </p>
                </div>
                
                {/* Pipeline Stage Selector */}
                <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase font-display tracking-widest text-gray-500 mb-1">Pipeline Stage</span>
                  <select
                    value={selectedInquiry.stage || 'New Lead'}
                    onChange={(e) => handleStageChange(selectedInquiry.id, e.target.value)}
                    className={`text-xs font-display uppercase tracking-widest py-1.5 px-3 rounded-xs border focus:outline-none focus:border-antique-gold cursor-pointer ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-warm-ivory border-black/10 text-obsidian'
                    }`}
                  >
                    {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Thread Scroll Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Initial Inquiry Message */}
                <div className={`p-4 rounded-xs border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-display uppercase tracking-widest text-antique-gold flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3" /> Initial Request
                    </span>
                    <span className="text-[10px] font-sans text-gray-500">
                      {new Date(selectedInquiry.timestamp || selectedInquiry.created_at || '').toLocaleString()}
                    </span>
                  </div>
                  {selectedInquiry.product && (
                    <div className="mb-3">
                      <span className="text-[10px] uppercase font-display text-gray-500">Target Piece: </span>
                      <span className="text-sm font-medium">{selectedInquiry.product}</span>
                    </div>
                  )}
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    "{selectedInquiry.message || 'No additional message provided.'}"
                  </p>
                </div>

                {/* Internal Notes History */}
                {selectedInquiry.notes && selectedInquiry.notes.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className={`h-px flex-1 ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>
                      <span className="text-[9px] uppercase font-display tracking-widest text-gray-500">Internal Timeline</span>
                      <div className={`h-px flex-1 ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>
                    </div>
                    
                    {selectedInquiry.notes.map((note, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx} 
                        className={`p-4 rounded-xs border-l-2 border-l-antique-gold ${isDark ? 'bg-[#151515] border-y border-r border-white/5' : 'bg-white border-y border-r border-black/5 shadow-sm'}`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-display uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> Exec Note
                          </span>
                          <span className="text-[10px] font-sans text-gray-500">
                            {new Date(note.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {note.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Note Input */}
              <div className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-black/5'}`}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add an internal note or log a call..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote(selectedInquiry.id)}
                    className={`flex-1 px-4 py-2.5 text-sm border rounded-xs focus:outline-none focus:border-antique-gold transition-colors ${
                      isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-black/10 text-obsidian'
                    }`}
                  />
                  <button
                    onClick={() => handleAddNote(selectedInquiry.id)}
                    disabled={!newNote.trim() || updateMutation.isPending}
                    className={`px-4 py-2.5 flex items-center justify-center rounded-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDark ? 'bg-antique-gold text-obsidian hover:bg-[#b59659]' : 'bg-obsidian text-white hover:bg-obsidian/90'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-500">
              Select a lead from the feed to view details.
            </div>
          )}
        </motion.div>

        {/* PANE 3: VIP 360 Profile */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`col-span-3 flex flex-col border rounded-xs shadow-xs overflow-hidden ${isDark ? 'bg-obsidian border-gold-900/40' : 'bg-white border-champagne'}`}
        >
          {selectedInquiry && clientStats ? (
            <motion.div 
              key={`profile-${selectedInquiry.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col h-full"
            >
              <div className={`p-6 border-b flex flex-col items-center text-center ${isDark ? 'border-white/10' : 'border-black/5'}`}>
                <div className="w-16 h-16 rounded-full bg-antique-gold/20 flex items-center justify-center border border-antique-gold mb-4">
                  <User className="w-8 h-8 text-antique-gold" />
                </div>
                <h3 className="font-serif text-xl">{selectedInquiry.name}</h3>
                <span className={`text-[10px] font-display uppercase tracking-widest mt-2 px-2 py-0.5 rounded-full ${clientStats.totalInquiries > 1 ? 'bg-antique-gold/20 text-antique-gold' : 'bg-gray-500/20 text-gray-400'}`}>
                  {clientStats.totalInquiries > 1 ? 'Returning VIP' : 'First-time Lead'}
                </span>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <span className="text-[10px] uppercase font-display tracking-widest text-gray-500 block mb-1">Direct Contact</span>
                  <p className={`text-sm font-medium flex items-center gap-2 ${isDark ? 'text-white' : 'text-obsidian'}`}>
                    <Phone className="w-3 h-3 text-antique-gold" /> {selectedInquiry.phone}
                  </p>
                </div>

                <div className={`h-px w-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>

                <div>
                  <span className="text-[10px] uppercase font-display tracking-widest text-gray-500 block mb-3">Client Analytics</span>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Inquiries</span>
                      <span className="font-serif text-lg">{clientStats.totalInquiries}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Commissions</span>
                      <span className="font-serif text-lg text-antique-gold">{clientStats.activeCommissions}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className={`text-xs flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Calendar className="w-3 h-3" /> First Contact
                      </span>
                      <span className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(clientStats.firstContact || '').toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-500">
              Profile details will appear here.
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
