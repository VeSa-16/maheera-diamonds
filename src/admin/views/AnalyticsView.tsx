import { TrendingUp, Activity, Users, Gem } from 'lucide-react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { Product } from '../../types';

export default function AnalyticsView({ theme }: { theme: 'dark' | 'light' }) {
  const isDark = theme === 'dark';

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['adminProducts'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
  });

  const { data: inquiries = [] } = useQuery<any[]>({
    queryKey: ['inquiries'],
    queryFn: async () => {
      const res = await fetch('/api/inquiries');
      if (!res.ok) throw new Error('Failed to fetch inquiries');
      return res.json();
    },
  });

  const totalValue = products.reduce((acc, p) => acc + (p.price || 0), 0);
  const activePieces = products.length;
  const totalInquiries = inquiries.length;
  const pendingInquiries = inquiries.filter(i => i.status === 'New' || i.status === 'new').length;

  const kpis = [
    { label: 'Total Inventory Value', value: `₹${(totalValue / 100000).toFixed(2)}L`, trend: 'Live', isPositive: true, icon: Gem },
    { label: 'Active Jewelry Pieces', value: activePieces.toString(), trend: 'Live', isPositive: true, icon: Activity },
    { label: 'Total Client Inquiries', value: totalInquiries.toString(), trend: 'Live', isPositive: true, icon: Users },
    { label: 'Pending Requests', value: pendingInquiries.toString(), trend: 'Action Needed', isPositive: pendingInquiries === 0, icon: TrendingUp },
  ];

  // Calculate category breakdown
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryCounts).map(([stage, count]) => ({
    stage: stage.charAt(0).toUpperCase() + stage.slice(1),
    count,
    percentage: activePieces ? Math.round((count / activePieces) * 100) : 0,
  })).sort((a, b) => b.count - a.count);

  // Recent inquiries list
  const recentInquiries = [...inquiries].sort((a, b) => new Date(b.timestamp || b.created_at).getTime() - new Date(a.timestamp || a.created_at).getTime()).slice(0, 3);

  return (
    <div className={`space-y-8 animate-fade-in ${isDark ? 'text-white' : 'text-obsidian'}`}>
      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`border p-6 rounded-xs relative overflow-hidden transition-colors ${isDark ? 'bg-obsidian border-gold-900/40' : 'bg-white border-champagne shadow-xs'}`}
          >
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <kpi.icon className="w-12 h-12" />
            </div>
            <p className="text-[10px] uppercase font-display tracking-widest text-antique-gold mb-2">{kpi.label}</p>
            <p className="font-serif text-3xl font-light">{kpi.value}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className={`text-xs font-medium ${kpi.isPositive ? 'text-[#25D366]' : 'text-rose-500'}`}>
                {kpi.trend}
              </span>
              <span className="text-[10px] text-gray-500 font-sans">Current System Data</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customizer Conversion Funnel */}
        <div className={`lg:col-span-2 border rounded-xs p-6 flex flex-col transition-colors ${isDark ? 'bg-obsidian border-gold-900/40' : 'bg-white border-champagne shadow-xs'}`}>
          <div className="mb-6">
            <h3 className={`font-serif text-xl font-light ${isDark ? 'text-white' : 'text-obsidian'}`}>Inventory Categories</h3>
            <p className={`text-xs mt-1 font-sans ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Breakdown of your current jewelry collections.</p>
          </div>
          
          <div className="flex-1 flex flex-col justify-center space-y-4">
            {categoryData.length === 0 && <p className="text-sm italic text-gray-500">No products in inventory.</p>}
            {categoryData.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex justify-between text-xs mb-1.5 font-sans">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{step.stage}</span>
                  <div className="flex gap-4">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{step.count} items</span>
                    <span className="text-antique-gold font-medium w-10 text-right">{step.percentage}%</span>
                  </div>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-obsidian/5'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${step.percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                    className="h-full bg-antique-gold relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inquiries Widget */}
        <div className={`border rounded-xs p-6 transition-colors ${isDark ? 'bg-obsidian border-gold-900/40' : 'bg-white border-champagne shadow-xs'}`}>
          <div className="mb-6">
            <h3 className={`font-serif text-xl font-light ${isDark ? 'text-white' : 'text-obsidian'}`}>Recent Inquiries</h3>
            <p className={`text-xs mt-1 font-sans ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Latest contact requests from clients.</p>
          </div>

          <div className="space-y-4">
            {recentInquiries.length === 0 && <p className="text-sm italic text-gray-500">No inquiries yet.</p>}
            {recentInquiries.map(inq => (
              <div key={inq.id} className={`flex flex-col p-3 border rounded-xs transition-colors ${isDark ? 'border-white/5 bg-white/5' : 'border-obsidian/5 bg-obsidian/5'}`}>
                <div className="flex justify-between items-center mb-1">
                  <p className={`text-sm font-serif ${isDark ? 'text-white' : 'text-obsidian'}`}>{inq.name}</p>
                  <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded ${inq.status === 'New' || inq.status === 'new' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'}`}>
                    {inq.status === 'New' || inq.status === 'new' ? 'New' : 'Logged'}
                  </span>
                </div>
                <p className={`text-xs font-sans truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{inq.type} - {inq.product || 'General'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
