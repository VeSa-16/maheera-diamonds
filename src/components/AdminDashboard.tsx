import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Users, Gem, Box, ShieldCheck, Settings, 
  Search, Bell, LogOut, TrendingUp, TrendingDown, Clock, CheckCircle2, ChevronRight 
} from 'lucide-react';
import BrandLogo from './BrandLogo';

interface AdminDashboardProps {
  onExit: () => void;
}

export default function AdminDashboard({ onExit }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('analytics');

  // Mock Data
  const kpis = [
    { title: 'Monthly Gross Revenue', value: '₹4,25,80,000', trend: '+14.5%', isUp: true },
    { title: 'Active Bespoke Orders', value: '18', trend: '+2', isUp: true },
    { title: 'GIA Diamonds In Transit', value: '42', trend: '-5', isUp: false },
    { title: 'Private Salon Bookings', value: '12', trend: '+4', isUp: true },
  ];

  const recentOrders = [
    { id: 'ORD-7742', client: 'Aarav Singhania', item: 'Bespoke Oval 3.2ct', status: 'At Bench', value: '₹14,50,000', date: '2 Hrs Ago' },
    { id: 'ORD-7741', client: 'Priya Mehra', item: 'Heritage Polki Set', status: 'GIA Verification', value: '₹22,00,000', date: '5 Hrs Ago' },
    { id: 'ORD-7740', client: 'Vikram Desai', item: 'Classic Tennis Bracelet', status: 'Armored Transit', value: '₹8,40,000', date: '1 Day Ago' },
    { id: 'ORD-7739', client: 'Neha Kapoor', item: 'Emerald Cut Solitaire', status: 'Delivered', value: '₹11,20,000', date: '1 Day Ago' },
  ];

  return (
    <div className="min-h-screen bg-obsidian text-warm-ivory flex font-sans selection:bg-antique-gold/30">
      
      {/* 1. Sidebar Navigation */}
      <aside className="w-64 border-r border-white/10 bg-[#121212] flex flex-col hidden md:flex">
        <div className="h-20 border-b border-white/10 flex items-center justify-center">
          <BrandLogo size={32} textColor="text-antique-gold" showText={false} />
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-2">
          {[
            { id: 'analytics', icon: BarChart3, label: 'Analytics Hub' },
            { id: 'crm', icon: Users, label: 'VIP Concierge CRM' },
            { id: 'customizer', icon: Gem, label: 'Customizer Engine' },
            { id: 'inventory', icon: Box, label: 'Global Inventory' },
            { id: 'logistics', icon: ShieldCheck, label: 'Armored Logistics' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                activeTab === item.id 
                  ? 'bg-antique-gold/10 text-antique-gold border border-antique-gold/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="font-medium tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={onExit}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Ecosystem</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* 2. Top Executive Header */}
        <header className="h-20 border-b border-white/10 bg-[#121212]/80 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
          
          <div className="flex items-center gap-6 flex-1">
            <h1 className="font-serif text-xl tracking-wider text-white">
              Executive Dashboard
            </h1>
            {/* Live Ticker */}
            <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest text-gray-400">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> LIVE FEED</span>
              <span className="text-antique-gold">XAU/INR: ₹6,240/g</span>
              <span className="text-antique-gold">RAPAPORT: +0.2%</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-white transition-colors"><Search className="w-5 h-5" /></button>
            <button className="text-gray-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-maison-red rounded-full border-2 border-obsidian" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-antique-gold/20 border border-antique-gold/50 flex items-center justify-center text-antique-gold font-serif text-sm">
                VS
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-white">Vedant S.</p>
                <p className="text-[9px] text-gray-400 font-display tracking-widest uppercase">Director</p>
              </div>
            </div>
          </div>
        </header>

        {/* 3. Main Viewport Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-obsidian">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((kpi, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="p-6 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden group hover:border-antique-gold/30 transition-colors"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <BarChart3 className="w-16 h-16 text-antique-gold" />
                  </div>
                  <p className="text-[10px] font-display tracking-widest uppercase text-gray-400 mb-2">{kpi.title}</p>
                  <h3 className="font-serif text-2xl md:text-3xl text-white font-light">{kpi.value}</h3>
                  <div className={`flex items-center gap-1 mt-4 text-xs font-medium ${kpi.isUp ? 'text-green-400' : 'text-red-400'}`}>
                    {kpi.isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{kpi.trend} vs last month</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Split Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Recent Orders Table */}
              <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl text-white font-light">Recent High-Value Commissions</h3>
                  <button className="text-[10px] font-display tracking-widest uppercase text-antique-gold hover:text-white transition-colors">View All</button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] font-display tracking-widest uppercase text-gray-500 border-b border-white/10">
                        <th className="pb-4 font-medium">Order ID</th>
                        <th className="pb-4 font-medium">VIP Client</th>
                        <th className="pb-4 font-medium">Item Description</th>
                        <th className="pb-4 font-medium">Status</th>
                        <th className="pb-4 font-medium text-right">Value</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {recentOrders.map((order, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 font-mono text-gray-400 text-xs">{order.id}</td>
                          <td className="py-4 font-medium text-white">{order.client}</td>
                          <td className="py-4 text-gray-300">{order.item}</td>
                          <td className="py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-antique-gold/10 text-antique-gold border border-antique-gold/20">
                              {order.status === 'Delivered' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 text-right font-medium text-white">{order.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Live Activity Feed */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                 <h3 className="font-serif text-xl text-white font-light mb-6">Live Activity Log</h3>
                 <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[1px] before:bg-white/10">
                    {[
                      { time: 'Just Now', text: 'Client added "1.5ct Solitaire" to Vault', type: 'action' },
                      { time: '12 mins ago', text: 'Mehul S. approved Margin Adjustment for Round Cuts', type: 'system' },
                      { time: '45 mins ago', text: 'New Consultation booked for Flagship Salon (Tomorrow 14:00)', type: 'booking' },
                      { time: '2 hrs ago', text: 'Armored pickup confirmed for ORD-7740 via Brink\'s', type: 'logistics' },
                    ].map((log, i) => (
                      <div key={i} className="relative pl-8">
                        <div className={`absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full flex items-center justify-center bg-obsidian border-2 ${log.type === 'action' ? 'border-antique-gold' : log.type === 'system' ? 'border-blue-400' : log.type === 'booking' ? 'border-maison-red' : 'border-green-400'}`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                        </div>
                        <p className="text-[10px] text-gray-500 font-mono mb-1">{log.time}</p>
                        <p className="text-sm text-gray-300 leading-relaxed">{log.text}</p>
                      </div>
                    ))}
                 </div>
              </div>

            </div>

          </div>
        </div>

      </main>

    </div>
  );
}
