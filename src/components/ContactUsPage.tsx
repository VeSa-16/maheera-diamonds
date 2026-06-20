import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MessageSquare, Instagram, MapPin, CheckCircle, Sparkles } from 'lucide-react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent("Hello Maheera Diamonds, I would like to schedule a private consultation.");
    window.open(`https://wa.me/447700900077?text=${text}`, '_blank');
  };

  return (
    <div id="contact-page" className="bg-warm-ivory text-obsidian selection:bg-blush-rose min-h-screen pt-[80px] md:pt-[140px] pb-[64px] md:pb-[120px]">
      {/* Hero Section */}
      <section className="relative py-[64px] md:py-[120px] px-6 md:px-8 text-center max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-0 left-10 w-64 h-64 bg-rose-200/5 blur-3D rounded-full pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 text-center"
        >
          <span className="text-[10px] tracking-[0.4em] text-antique-gold uppercase font-display font-medium block">
            PRIVATE LIAISON
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-extralight tracking-wide text-obsidian leading-tight">
            We would love to hear from you.
          </h1>
          <p className="font-sans text-xs md:text-sm font-light text-gray-400 max-w- mx-auto leading-relaxed">
            Connect with Maheera Diamonds for inquiries, consultations, or personalized assistance.
          </p>
          <div className="w-12 h-[1px] bg-champagne ml-0" />
        </motion.div>
      </section>

      {/* Main Grid: Form and Contact Info */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 mb-16 md:mb-[120px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          
          {/* Contact Form Panel */}
          <div className="bg-white p-8 md:p-12 border border-blush-rose rounded-xs flex flex-col justify-between shadow-xs">
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-obsidian font-light tracking-wide">
                Send a Message
              </h3>
              <p className="text-[11px] text-slate-charcoal font-sans font-light">
                Our diamond directors review each inquiry privately. You will receive a bespoke breakdown within three salon hours.
              </p>
              
              {isSubmitted ? (
                <div className="p-6 bg-blush-rose/50 border border-champagne/50 text-obsidian space-y-3 rounded-xs text-center">
                  <CheckCircle className="w-8 h-8 text-antique-gold ml-0 stroke-[1.2]" />
                  <p className="font-serif text-sm font-medium">Liaison Request Registered Successfully</p>
                  <p className="text-xs font-sans font-light text-slate-charcoal leading-relaxed text-center">
                    A dedicated Maheera specialist has locked in your details. We will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 text-xs font-sans mt-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-obsidian font-medium mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Charlotte Sterling"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-transparent p-0 py-2 text-obsidian focus:bg-transparent border-b border-antique-gold focus:border-obsidian focus:shadow-[0_1px_0_0_var(--color-obsidian)] outline-none transition-all rounded-none placeholder-slate-charcoal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-obsidian font-medium mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. charlotte@sterling.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-transparent p-0 py-2 text-obsidian focus:bg-transparent border-b border-antique-gold focus:border-obsidian focus:shadow-[0_1px_0_0_var(--color-obsidian)] outline-none transition-all rounded-none placeholder-slate-charcoal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-obsidian font-medium mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +44 7700 900077"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-transparent p-0 py-2 text-obsidian focus:bg-transparent border-b border-antique-gold focus:border-obsidian focus:shadow-[0_1px_0_0_var(--color-obsidian)] outline-none transition-all rounded-none placeholder-slate-charcoal/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-obsidian font-medium mb-1.5">
                      Message / Request *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Please share sizing requests, GIA shapes of interest, or custom parameters..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-transparent p-0 py-2 text-obsidian focus:bg-transparent border-b border-antique-gold focus:border-obsidian focus:shadow-[0_1px_0_0_var(--color-obsidian)] outline-none transition-all rounded-none resize-none placeholder-slate-charcoal/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-obsidian hover:bg-[#1a1a1a] text-warm-ivory transition-all font-display text-[11px] tracking-widest uppercase font-medium rounded-none cursor-pointer mt-4"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="flex flex-col justify-between p-8 md:p-12 bg-obsidian text-warm-ivory rounded-xs relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.06),transparent_50%)] pointer-events-none" />
            
            <div className="space-y-8 relative z-10">
              <h3 className="font-serif text-2xl text-white font-light tracking-wide">
                Salon Directorates
              </h3>

              <div className="space-y-6 text-[#dcdcdc] font-sans text-xs">
                
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white/5 border border-white/5 rounded-xs mt-0.5 text-antique-gold">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-champagne font-medium">Email Inquiries</p>
                    <p className="text-white mt-1 select-all font-light">maheeradiamonds@gmail.com</p>
                    <p className="text-[#a5a5a5] mt-0.5 font-light">By Director Mehul Solanki</p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white/5 border border-white/5 rounded-xs mt-0.5 text-antique-gold">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-champagne font-medium">WhatsApp Direct</p>
                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-white mt-1 hover:text-antique-gold transition-colors select-all font-light block">+91 98765 43210</a>
                    <p className="text-[#98e29a] mt-0.5 font-light">● Live Specialists Active</p>
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white/5 border border-white/5 rounded-xs mt-0.5 text-antique-gold">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-champagne font-medium">Instagram Handle</p>
                    <a
                      href="https://www.instagram.com/diamonds.by.maheera"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white mt-1 hover:text-antique-gold transition-colors font-light block cursor-pointer underline decoration-antique-gold/30 font-medium"
                    >
                      @diamonds.by.maheera
                    </a>
                  </div>
                </div>

                {/* Showroom */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white/5 border border-white/5 rounded-xs mt-0.5 text-antique-gold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-champagne font-medium">Flagship Salon — Pune</p>
                    <p className="text-white mt-1 font-light">Exclusive Luxury Boutique, Pune</p>
                    <p className="text-[#a5a5a5] mt-0.5 font-light">Maharashtra, India</p>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 text-[9px] text-slate-charcoal tracking-widest font-mono text-center relative z-10 uppercase">
              Pune, India
            </div>
          </div>

        </div>
      </section>

      {/* WhatsApp Consultation Banner */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 mb-16 md:mb-[120px]">
        <div className="bg-[#EFE7DD] py-12 px-8 md:px-16 border border-champagne/50 text-obsidian rounded-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-xs">
          <div className="space-y-2 text-center relative z-10 max-w- mx-auto">
            <span style={{ fontSize: '11px', fontVariant: 'small-caps', letterSpacing: '0.04em', color: '#C8A96B', fontWeight: 400 }} className="font-display block">
              INSTANT CONNECTIVITY
            </span>
            <h3 className="font-serif text-xl md:text-2xl text-obsidian font-light">
              Need personalized assistance?
            </h3>
            <p className="text-xs text-gray-600 font-sans font-light text-center">
              We provide immediate support on sizing, diamonds availability, and local showroom hours.
            </p>
          </div>
          <button
            onClick={handleWhatsApp}
            className="w-full md:w-auto px-8 py-3.5 bg-obsidian hover:bg-antique-gold text-warm-ivory hover:text-obsidian font-display text-[11px] tracking-widest uppercase transition-all duration-300 rounded-xs block select-none text-center cursor-pointer shadow-md font-medium"
          >
            Chat on WhatsApp
          </button>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="space-y-6 text-center mb-10">
          <span className="text-[10px] tracking-[0.3em] text-antique-gold uppercase font-display block">
            VISIT OUR PUNE FLAGSHIP ATELIER
          </span>
          <h3 className="font-serif text-2xl text-obsidian font-light tracking-wide">
            House of Maheera Map
          </h3>
          <div className="w-12 h-[1px] bg-champagne ml-0" />
        </div>

        {/* Elegant Iframe map with golden border */}
        <div className="h-[400px] w-full rounded-xs overflow-hidden border border-champagne shadow-md relative bg-zinc-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15132.880572887302!2d73.874316!3d18.52043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c06fa5b44279%3A0x8990247a3f4e6e0b!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            title="House of Maheera Pune Flagship Salon Location"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
