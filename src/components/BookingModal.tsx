import React, { useState } from 'react';
import { X, Calendar, MapPin, Phone, Mail, Check, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Appointment } from '../types';
import { WHATSAPP_NUMBER, openWhatsApp, generateConsultationMsg } from '../lib/whatsapp';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (appointment: Appointment) => void;
}

export default function BookingModal({ isOpen, onClose, onSuccess }: BookingModalProps) {
  const [form, setForm] = useState<Partial<Appointment>>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '14:00',
    preferredContact: 'email',
    interest: 'bespoke',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.date) {
      alert('Kindly complete all required fields so we may register your salon reservation.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 1. Post to local backend
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          product: null,
          type: 'Consultation',
          message: form.notes,
          raw_data: form
        })
      });

      // 2. Generate WhatsApp message and Redirect
      const msg = generateConsultationMsg(
        form.date as string,
        form.time as string,
        form.interest as string,
        form.name as string,
        form.phone as string,
        form.notes
      );
      
      openWhatsApp(WHATSAPP_NUMBER, msg);

      const finalAppointment: Appointment = {
        name: form.name as string,
        email: form.email as string,
        phone: form.phone as string,
        date: form.date as string,
        time: form.time || '14:00',
        preferredContact: form.preferredContact as 'email' | 'call' | 'whatsapp',
        interest: form.interest as 'bespoke' | 'collection' | 'repair' | 'sizing',
        notes: form.notes,
      };

      onSuccess(finalAppointment);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-obsidian/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Booking Invite Side Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w- mx-auto h-full bg-warm-ivory shadow-2xl flex flex-col overflow-y-auto border-l border-antique-gold"
          >
            <div className="p-8 flex-grow">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-obsidian transition-colors hover:scale-105 duration-200 cursor-pointer rounded-full hover:bg-black/5"
                aria-label="Close"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>

              {submitted ? (
                <div className="py-16 text-center animate-fade-in flex flex-col items-start justify-center h-full">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blush-rose border border-champagne mb-6">
                    <Check className="h-6 w-6 text-antique-gold" />
                  </div>
                  <h2 className="font-serif text-3xl tracking-wider text-obsidian font-light mb-4">
                    Your Private Invitation Secured
                  </h2>
                  <p className="max-w- mx-auto text-sm text-slate-charcoal tracking-relaxed font-light leading-relaxed leading-[1.8] text-center">
                    Thank you, <span className="font-medium text-obsidian">{form.name}</span>. A Maheera Diamonds private salon concierge is preparing details. We will confirm your session at <span className="font-medium text-obsidian">{form.time} on {form.date}</span> via your preferred channel (<span className="text-antique-gold font-medium uppercase">{form.preferredContact}</span>).
                  </p>
                  <p className="text-[10px] text-antique-gold mt-6 tracking-[0.2em] uppercase text-center font-display">
                    PUNE • MUMBAI • DELHI • DUBAI
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 mt-4">
                  <div className="text-center">
                    <p className="text-[9px] tracking-[0.3em] text-antique-gold uppercase font-display leading-none mb-3">
                      Reserved Showrooms & Consultation
                    </p>
                    <h2 className="font-serif text-3xl md:text-4xl tracking-wider text-obsidian font-light leading-snug">
                      Request Private Salon
                    </h2>
                    <div className="w-12 h-[1px] bg-champagne ml-0 mt-4 mb-2" />
                  </div>

                  <div className="space-y-6">
                    {/* Client Data */}
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
                        EMAIL ADRESS *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="e.g. charlotte@sterling.com"
                        className="w-full bg-transparent border-b border-antique-gold py-2 text-xs focus:outline-none focus:text-champagne focus:shadow-[0_1px_0_0_var(--color-antique-gold)] text-obsidian tracking-wide placeholder-slate-charcoal/50 transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-display tracking-widest text-obsidian uppercase mb-2">
                        PHONE FOR SECURE LOGISTICS *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="e.g. +44 20 7946 0192"
                        className="w-full bg-transparent border-b border-antique-gold py-2 text-xs focus:outline-none focus:text-champagne focus:shadow-[0_1px_0_0_var(--color-antique-gold)] text-obsidian tracking-wide placeholder-slate-charcoal/50 transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-display tracking-widest text-obsidian uppercase mb-2">
                        MAINTAIN CONTACT VIA
                      </label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {(['email', 'call', 'whatsapp'] as const).map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setForm({ ...form, preferredContact: method })}
                            className={`text-[9px] py-2 border tracking-wider uppercase transition-all font-display duration-300 ${
                              form.preferredContact === method
                                ? 'bg-obsidian text-warm-ivory border-obsidian shadow-md'
                                : 'bg-transparent border-antique-gold text-slate-charcoal hover:bg-blush-rose'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Appointment Parameters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-display tracking-widest text-obsidian uppercase mb-2">
                          DATE DESIRED *
                        </label>
                        <input
                          type="date"
                          required
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          className="w-full bg-transparent border-b border-antique-gold py-2 text-xs focus:outline-none focus:text-champagne focus:shadow-[0_1px_0_0_var(--color-antique-gold)] text-obsidian font-sans transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-display tracking-widest text-obsidian uppercase mb-2">
                          HOURLY PREFERENCE *
                        </label>
                        <select
                          value={form.time}
                          onChange={(e) => setForm({ ...form, time: e.target.value })}
                          className="w-full bg-transparent border-b border-antique-gold py-2 text-xs focus:outline-none focus:text-champagne focus:shadow-[0_1px_0_0_var(--color-antique-gold)] text-obsidian font-sans transition-all duration-300"
                        >
                          <option value="10:00">10:00 AM</option>
                          <option value="12:00">12:00 PM</option>
                          <option value="14:00">02:00 PM</option>
                          <option value="16:00">04:00 PM</option>
                          <option value="18:00">06:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-display tracking-widest text-obsidian uppercase mb-2">
                        BESPOKE INQUIRY TYPE
                      </label>
                      <select
                        value={form.interest}
                        onChange={(e) => setForm({ ...form, interest: e.target.value as any })}
                        className="w-full bg-transparent border-b border-antique-gold py-2 text-xs focus:outline-none focus:text-champagne focus:shadow-[0_1px_0_0_var(--color-antique-gold)] text-obsidian font-display tracking-wide transition-all duration-300"
                      >
                        <option value="bespoke">Bespoke Ring Builder & Sourcing</option>
                        <option value="collection">Explore Standard Fine Collection</option>
                        <option value="repair">Heirloom Service & Modification</option>
                        <option value="sizing">Sizing & Custom Casting Assessment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-display tracking-widest text-obsidian uppercase mb-2">
                        SPECIFIC PIECE OR REQUEST DETAILS
                      </label>
                      <textarea
                        rows={3}
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="Mention custom sizing, diamond constraints, metal interests..."
                        className="w-full bg-transparent border-b border-antique-gold py-2 text-xs focus:outline-none focus:text-champagne focus:shadow-[0_1px_0_0_var(--color-antique-gold)] text-obsidian tracking-wide placeholder-slate-charcoal/50 resize-none font-sans transition-all duration-300"
                      />
                    </div>

                    <div className="pt-2 text-center text-[10px] text-slate-charcoal leading-relaxed font-light flex items-center justify-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-antique-gold" />
                      Your appointment is completely confidential.
                    </div>
                  </div>

                  {/* Submission Trigger */}
                  <div className="pt-6 pb-8">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative inline-flex items-center justify-center px-12 py-4 bg-[#25D366] text-white font-display text-xs tracking-widest overflow-hidden hover:bg-[#1DA851] transition-all hover:shadow-lg cursor-pointer w-full flex-gap-2"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {isSubmitting ? 'PROCESSING...' : 'SECURE MY INVITATION'}
                        {!isSubmitting && <Send className="w-4 h-4" />}
                      </span>
                      <span className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left -z-0 opacity-10"></span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
