import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, Clock, CheckCircle2, ChevronDown, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  user_id: string;
  client: string;
  created_at: string;
  status: string;
  items: OrderItem[];
  value: number;
}

export default function AdminLogisticsView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error('Failed to update order status', err);
      fetchOrders();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payment Verified': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'At Bench': return 'text-antique-gold bg-antique-gold/10 border-antique-gold/20';
      case 'GIA Verification': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Armored Transit': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Delivered': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-300 bg-white/5 border-white/10';
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-serif text-2xl text-white font-light flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-antique-gold" />
            Armored Logistics
          </h2>
          <p className="text-sm text-gray-400 mt-1">Order fulfillment and secure transit pipeline.</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-display tracking-widest uppercase text-gray-500 border-b border-white/10 bg-white/5">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Client</th>
                <th className="p-4 font-medium">Items Summary</th>
                <th className="p-4 font-medium text-right">Fulfillment Status</th>
                <th className="p-4 font-medium text-right">Value</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <Package className="w-6 h-6 animate-pulse mx-auto mb-2 text-antique-gold" />
                    Syncing vault ledger...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500 font-serif italic">
                    No active commissions in the pipeline.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${expandedOrderId === order.id ? 'bg-white/5' : ''}`} onClick={() => toggleExpand(order.id)}>
                      <td className="p-4 font-mono text-gray-400 text-xs">
                        <div className="flex items-center gap-2">
                          <ChevronDown className={`w-4 h-4 transition-transform ${expandedOrderId === order.id ? 'rotate-180' : ''}`} />
                          {order.id}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-white">{order.client || 'VIP Member'}</p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="p-4 text-gray-300">
                        {order.items?.length || 0} {(order.items?.length === 1) ? 'item' : 'items'}
                        <span className="ml-2 text-xs text-gray-500 font-serif italic">
                           ({order.items?.[0]?.name.substring(0, 20)}...)
                        </span>
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`appearance-none bg-transparent text-xs font-medium uppercase tracking-wider text-right cursor-pointer focus:outline-none hover:opacity-80 transition-opacity rounded-full px-3 py-1.5 border ${getStatusColor(order.status)}`}
                        >
                          <option className="bg-obsidian text-white" value="Payment Verified">Payment Verified</option>
                          <option className="bg-obsidian text-white" value="At Bench">At Bench</option>
                          <option className="bg-obsidian text-white" value="GIA Verification">GIA Verification</option>
                          <option className="bg-obsidian text-white" value="Armored Transit">Armored Transit</option>
                          <option className="bg-obsidian text-white" value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="p-4 text-right font-medium text-white">
                        ₹{order.value?.toLocaleString('en-IN') || 0}
                      </td>
                    </tr>
                    
                    {/* Expanded Details Row */}
                    <AnimatePresence>
                      {expandedOrderId === order.id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <td colSpan={5} className="p-0 border-b border-white/5 bg-[#1a1a1a]/50">
                            <div className="p-6 ml-6 border-l-2 border-antique-gold/30">
                              <h4 className="text-[10px] font-display tracking-widest uppercase text-gray-500 mb-4">Commission Details</h4>
                              <div className="space-y-4">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-lg">
                                    <div>
                                      <p className="font-serif text-sm text-white">{item.name}</p>
                                      {item.details && <p className="text-xs text-gray-400 mt-1">{item.details}</p>}
                                      {item.isCustomRing && <p className="text-[10px] text-antique-gold uppercase tracking-widest mt-2 border border-antique-gold/20 inline-block px-2 py-0.5 rounded">Bespoke Configuration</p>}
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-medium text-white">₹{item.price.toLocaleString('en-IN')}</p>
                                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
