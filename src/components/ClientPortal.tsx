import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Package, Heart, RefreshCw, ChevronRight, Gem, Calendar, ShieldCheck, Mail } from 'lucide-react';
import { Product } from '../types';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  details?: string;
  isCustomRing?: boolean;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  items: OrderItem[];
  value: number;
}

interface ClientPortalProps {
  onClose: () => void;
  user: any; // User context
}

const PIPELINE_STEPS = [
  'Payment Verified',
  'At Bench',
  'GIA Verification',
  'Armored Transit',
  'Delivered'
];

export default function ClientPortal({ onClose, user }: ClientPortalProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'vault'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch Orders
        const ordersRes = await fetch('/api/user/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }

        // Fetch Favorites (we only have IDs in user.favorites, need to fetch products and filter)
        if (user?.favorites && user.favorites.length > 0) {
          const prodRes = await fetch('/api/products');
          if (prodRes.ok) {
            const allProducts = await prodRes.json();
            setFavorites(allProducts.filter((p: Product) => user.favorites.includes(p.id)));
          }
        }
      } catch (err) {
        console.error('Failed to load portal data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getStepStatus = (currentStatus: string, stepIndex: number) => {
    const currentIndex = PIPELINE_STEPS.indexOf(currentStatus);
    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'active';
    return 'pending';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-warm-ivory flex flex-col md:flex-row overflow-hidden"
    >
      {/* Sidebar Navigation */}
      <div className="w-full md:w-80 bg-obsidian text-white flex flex-col h-auto md:h-full border-b md:border-b-0 md:border-r border-antique-gold/20 flex-shrink-0">
        <div className="p-8 pb-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-antique-gold/20 border border-antique-gold/50 flex items-center justify-center font-serif text-lg text-antique-gold">
              {user?.name?.charAt(0) || 'V'}
            </div>
            <div>
              <p className="text-[10px] font-display tracking-widest uppercase text-antique-gold">VIP Member</p>
              <h2 className="font-serif text-lg">{user?.name || 'Client'}</h2>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-x-auto md:overflow-visible flex md:block no-scrollbar">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all whitespace-nowrap ${activeTab === 'orders' ? 'bg-antique-gold/10 text-antique-gold border border-antique-gold/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Package className="w-4 h-4" />
            <span className="font-medium tracking-wide">Commissions & Orders</span>
          </button>
          <button 
            onClick={() => setActiveTab('vault')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all whitespace-nowrap ${activeTab === 'vault' ? 'bg-antique-gold/10 text-antique-gold border border-antique-gold/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Heart className="w-4 h-4" />
            <span className="font-medium tracking-wide">My Vault</span>
          </button>
          
          <div className="hidden md:block mt-8 pt-8 border-t border-white/10 px-4">
            <h3 className="text-[10px] font-display tracking-widest uppercase text-gray-500 mb-4">Concierge Services</h3>
            <div className="space-y-4">
              <a href="mailto:concierge@maheeradiamonds.com" className="flex items-center gap-3 text-sm text-gray-400 hover:text-antique-gold transition-colors">
                <Mail className="w-4 h-4" />
                Contact Concierge
              </a>
              <button className="flex items-center gap-3 text-sm text-gray-400 hover:text-antique-gold transition-colors">
                <ShieldCheck className="w-4 h-4" />
                Care & Warranty
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-warm-ivory relative custom-scrollbar">
        <button 
          onClick={onClose}
          className="hidden md:flex absolute top-8 right-8 w-10 h-10 rounded-full bg-white border border-antique-gold/20 items-center justify-center text-obsidian hover:bg-antique-gold hover:text-white transition-all shadow-sm z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-12 max-w-5xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-obsidian/60">
              <RefreshCw className="w-8 h-8 animate-spin text-antique-gold mb-4" />
              <p className="font-serif italic text-lg">Retrieving dossier...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'orders' && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-12"
                >
                  <div className="mb-8">
                    <h1 className="font-serif text-3xl md:text-4xl text-obsidian font-light mb-2">Commissions & Orders</h1>
                    <p className="text-obsidian/60 font-light">Track the bespoke crafting process and secure delivery of your jewels.</p>
                  </div>

                  {orders.length === 0 ? (
                    <div className="bg-white border border-antique-gold/20 rounded-2xl p-12 text-center shadow-sm">
                      <Package className="w-12 h-12 text-antique-gold/40 mx-auto mb-4" />
                      <h3 className="font-serif text-xl text-obsidian mb-2">No Active Commissions</h3>
                      <p className="text-sm text-obsidian/60 mb-6">You haven't commissioned any bespoke pieces yet.</p>
                      <button onClick={onClose} className="px-6 py-3 bg-obsidian text-white text-sm tracking-widest font-display uppercase hover:bg-antique-gold transition-colors rounded">
                        Explore Collections
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-white border border-antique-gold/20 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                          {/* Order Header */}
                          <div className="bg-obsidian text-white p-6 md:p-8 flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                              <p className="text-[10px] font-display tracking-widest uppercase text-antique-gold mb-1">Order Ref</p>
                              <h3 className="font-mono text-lg">{order.id}</h3>
                            </div>
                            <div className="flex gap-8">
                              <div>
                                <p className="text-[10px] font-display tracking-widest uppercase text-gray-500 mb-1">Date Placed</p>
                                <p className="font-medium text-sm flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> {new Date(order.created_at).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-display tracking-widest uppercase text-gray-500 mb-1">Total Value</p>
                                <p className="font-medium text-sm text-antique-gold">₹{order.value.toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          </div>

                          {/* Order Content */}
                          <div className="p-6 md:p-8">
                            {/* Items List */}
                            <div className="mb-10 space-y-4">
                              <h4 className="font-serif text-lg text-obsidian border-b border-antique-gold/20 pb-2 mb-4">Commissioned Items</h4>
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                  <div className="w-16 h-16 bg-[#fafafa] rounded flex items-center justify-center border border-antique-gold/10 flex-shrink-0">
                                    <Gem className="w-6 h-6 text-antique-gold/50" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-obsidian">{item.name}</p>
                                    {item.details && <p className="text-sm text-obsidian/60 mt-0.5">{item.details}</p>}
                                    {item.isCustomRing && <span className="inline-block mt-2 px-2 py-0.5 text-[9px] uppercase tracking-widest bg-obsidian text-white rounded">Bespoke Setup</span>}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Logistics Tracker */}
                            <div>
                              <h4 className="font-serif text-lg text-obsidian mb-6">Logistics Pipeline</h4>
                              <div className="relative">
                                {/* Connecting Line */}
                                <div className="absolute top-5 left-4 right-4 h-0.5 bg-gray-200 hidden md:block"></div>
                                <div 
                                  className="absolute top-5 left-4 h-0.5 bg-antique-gold hidden md:block transition-all duration-1000" 
                                  style={{ width: `${(PIPELINE_STEPS.indexOf(order.status) / (PIPELINE_STEPS.length - 1)) * 100}%` }}
                                ></div>

                                <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                                  {PIPELINE_STEPS.map((step, idx) => {
                                    const state = getStepStatus(order.status, idx);
                                    return (
                                      <div key={step} className="flex md:flex-col items-center md:items-center gap-4 md:gap-3 flex-1">
                                        {/* Status Dot */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                                          state === 'completed' ? 'bg-antique-gold border-antique-gold text-white' :
                                          state === 'active' ? 'bg-white border-antique-gold text-antique-gold shadow-[0_0_15px_rgba(201,168,76,0.3)]' :
                                          'bg-[#fafafa] border-gray-200 text-gray-300'
                                        }`}>
                                          {state === 'completed' ? <ShieldCheck className="w-5 h-5" /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                                        </div>
                                        
                                        {/* Mobile Line connecting vertical dots */}
                                        <div className="md:hidden w-[2px] h-full bg-gray-200 absolute left-5 -z-10 top-10 bottom-0" />

                                        {/* Step Label */}
                                        <div className="md:text-center">
                                          <p className={`text-xs font-display tracking-widest uppercase font-bold ${
                                            state === 'pending' ? 'text-gray-400' : 'text-obsidian'
                                          }`}>
                                            {step}
                                          </p>
                                          {state === 'active' && (
                                            <p className="text-[10px] text-antique-gold italic mt-1 font-serif">In Progress</p>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'vault' && (
                <motion.div 
                  key="vault"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="mb-8 flex justify-between items-end">
                    <div>
                      <h1 className="font-serif text-3xl md:text-4xl text-obsidian font-light mb-2">My Vault</h1>
                      <p className="text-obsidian/60 font-light">Your curated collection of saved jewels and diamonds.</p>
                    </div>
                  </div>

                  {favorites.length === 0 ? (
                    <div className="bg-white border border-antique-gold/20 rounded-2xl p-12 text-center shadow-sm">
                      <Heart className="w-12 h-12 text-antique-gold/40 mx-auto mb-4" />
                      <h3 className="font-serif text-xl text-obsidian mb-2">Your Vault is Empty</h3>
                      <p className="text-sm text-obsidian/60 mb-6">Heart items while browsing to save them here for future consideration.</p>
                      <button onClick={onClose} className="px-6 py-3 bg-obsidian text-white text-sm tracking-widest font-display uppercase hover:bg-antique-gold transition-colors rounded">
                        Discover Collections
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites.map((product) => (
                        <div key={product.id} className="group cursor-pointer">
                          <div className="bg-white aspect-square relative overflow-hidden flex justify-center items-center rounded-xl border border-antique-gold/10">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-3/4 h-3/4 object-contain transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
                              />
                            ) : (
                              <Gem className="w-16 h-16 text-antique-gold/30" />
                            )}
                            <div className="absolute inset-0 bg-obsidian/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button className="bg-white text-obsidian px-6 py-2 rounded-full text-xs font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all hover:bg-antique-gold hover:text-white">
                                View Details
                              </button>
                            </div>
                            {/* Always solid heart for vault items */}
                            <button className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-maison-red shadow-sm z-10">
                              <Heart className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                          
                          <div className="mt-4 text-center">
                            <h3 className="font-serif text-lg text-obsidian">{product.name}</h3>
                            <p className="text-antique-gold text-sm font-medium mt-1">₹{product.price.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
}
