import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles } from 'lucide-react';
import { Product, CustomRingConfiguration } from '../types';
import { 
  WHATSAPP_NUMBER, 
  openWhatsApp, 
  generateProductInquiryMsg, 
  generateCustomizerMsg 
} from '../lib/whatsapp';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  customConfig?: CustomRingConfiguration;
  estimatedPrice?: number;
}

export default function InquiryModal({ isOpen, onClose, product, customConfig, estimatedPrice }: InquiryModalProps) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    setIsSubmitting(true);

    try {
      const type = customConfig ? 'Diamond Customizer' : 'Product Inquiry';
      const productName = customConfig ? `Bespoke ${customConfig.shape} Ring` : product?.name;

      // 1. Post to local backend
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          product: productName,
          type,
          message: form.message,
          raw_data: customConfig ? { ...customConfig, estimatedPrice } : { productId: product?.id, category: product?.category, price: product?.price }
        })
      });

      if (!res.ok) {
        console.error('Failed to save inquiry locally');
      }

      // 2. Format WhatsApp Message and Redirect
      let msg = '';
      if (customConfig && estimatedPrice) {
        msg = generateCustomizerMsg(
          customConfig.shape,
          customConfig.metal,
          customConfig.setting,
          customConfig.clarity,
          customConfig.colorGrade,
          customConfig.carat,
          estimatedPrice,
          form.name,
          form.phone,
          form.message
        );
      } else if (product) {
        msg = generateProductInquiryMsg(
          product.name,
          product.category,
          product.price,
          form.name,
          form.message
        );
      }

      openWhatsApp(WHATSAPP_NUMBER, msg);
      
      onClose();
      setForm({ name: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-obsidian/85 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w- mx-auto bg-warm-ivory shadow-2xl p-8 sm:rounded-sm border border-antique-gold/30 mt-auto sm:mt-0 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-obsidian transition-colors hover:scale-105 duration-200 cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>

            <div className="text-center mb-8">
              <p className="text-[9px] tracking-[0.3em] text-antique-gold uppercase font-display leading-none mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Private Liaison
              </p>
              <h2 className="font-serif text-3xl tracking-wider text-obsidian font-light leading-snug">
                {customConfig ? 'Enquire This Design' : 'Enquire on WhatsApp'}
              </h2>
              <p className="text-[11px] text-gray-500 max-w- mx-auto leading-relaxed text-center mt-3">
                {customConfig 
                  ? 'Connect with our master jewelers to discuss sourcing and crafting your bespoke piece.'
                  : 'Speak directly with our concierge team regarding availability, sizing, or private viewing.'}
              </p>
            </div>

            {(product || customConfig) && (
              <div className="mb-8 p-4 bg-white/50 border border-antique-gold/20 rounded-xs flex gap-4 items-center shadow-xs">
                {product && (
                  <div className="w-16 h-16 bg-platinum shrink-0 overflow-hidden rounded-xs">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <p className="font-serif text-sm text-obsidian font-medium">
                    {customConfig ? `Bespoke ${customConfig.shape} Ring` : product?.name}
                  </p>
                  <p className="text-[10px] font-display text-slate-charcoal mt-1 tracking-widest uppercase">
                    Estimated: ₹{customConfig ? estimatedPrice?.toLocaleString('en-IN') : product?.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-display tracking-widest text-obsidian uppercase mb-2">
                  YOUR NOBLE NAME *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="E.g., Charlotte Sterling"
                  className="w-full bg-transparent border-b border-antique-gold py-2 text-xs focus:outline-none focus:text-champagne focus:shadow-[0_1px_0_0_var(--color-antique-gold)] text-obsidian tracking-wide placeholder-slate-charcoal/50 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-display tracking-widest text-obsidian uppercase mb-2">
                  PHONE / WHATSAPP NUMBER *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="E.g., +91 98765 43210"
                  className="w-full bg-transparent border-b border-antique-gold py-2 text-xs focus:outline-none focus:text-champagne focus:shadow-[0_1px_0_0_var(--color-antique-gold)] text-obsidian tracking-wide placeholder-slate-charcoal/50 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-[10px] font-display tracking-widest text-obsidian uppercase mb-2">
                  OPTIONAL NOTE
                </label>
                <textarea
                  rows={2}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Mention custom sizing or diamond constraints..."
                  className="w-full bg-transparent border-b border-antique-gold py-2 text-xs focus:outline-none focus:text-champagne focus:shadow-[0_1px_0_0_var(--color-antique-gold)] text-obsidian tracking-wide placeholder-slate-charcoal/50 transition-all duration-300 resize-none font-sans"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#25D366] text-white font-display text-xs tracking-widest overflow-hidden hover:bg-[#1DA851] transition-all hover:shadow-lg cursor-pointer"
                >
                  <span className="relative z-10 flex items-center gap-2 uppercase font-medium">
                    {isSubmitting ? 'Processing...' : 'Continue to WhatsApp'}
                    {!isSubmitting && <Send className="w-3.5 h-3.5" />}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
