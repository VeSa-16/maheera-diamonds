import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mail, Instagram, Send, Sparkles, MapPin, ArrowUpRight } from 'lucide-react';
import BrandLogo from './BrandLogo';

interface FooterProps {
  onPageChange: (page: 'home' | 'about' | 'catalogue' | 'contact') => void;
}

export default function Footer({ onPageChange }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate luxury email registration API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubscribed(true);
      setEmail('');
    }, 1200);
  };

  const handleQuickLink = (page: 'home' | 'about' | 'catalogue' | 'contact' | 'admin') => {
    if (page === 'admin') {
      window.location.href = '/admin';
      return;
    }
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-obsidian text-champagne border-t border-antique-gold/20 pt-[80px] md:pt-[120px] pb-12 relative overflow-hidden select-none font-sans">
      
      {/* Editorial background elements / ambient lighting glow */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-antique-gold/5 blur-[200px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Responsive 3-Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-0 lg:divide-x lg:divide-antique-gold/20 py-[64px] md:py-[80px] border-b border-antique-gold/20">
          
          {/* COLUMN 1: Brand & Contact */}
          <div className="space-y-8 lg:pr-12 text-center">
            <div className="flex items-center">
              <BrandLogo size={40} showText={true} textColor="text-champagne" />
            </div>
            <p className="font-serif italic text-sm text-platinum leading-relaxed font-light">
              “Timeless jewelry crafted for elegance, confidence, and unforgettable moments.”
            </p>
            
            <div className="space-y-4 pt-4 text-[11px] font-sans tracking-wide text-platinum">
              {/* Phone number removed pending real data */}

              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-antique-gold/80 block">EMAIL ENQUIRIES</span>
                <a href="mailto:maheeradiamonds@gmail.com" className="hover:text-champagne transition-colors flex items-center gap-1.5 group select-all">
                  <Mail className="w-3.5 h-3.5 text-antique-gold" />
                  <span>maheeradiamonds@gmail.com</span>
                </a>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-antique-gold/80 block">FLAGSHIP ATELIER</span>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-antique-gold" />
                  <span>Pune, Maharashtra, India</span>
                </p>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Navigation */}
          <div className="space-y-8 lg:px-12 text-center">
            <h4 className="font-serif text-[14px] md:text-[16px] text-antique-gold tracking-[0.25em] uppercase font-medium">
              Navigation
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Quick Links */}
              <ul className="space-y-4 list-none pl-0 text-[11px] font-sans tracking-widest uppercase">
                {[
                  { label: 'Home', action: () => handleQuickLink('home') },
                  { label: 'About Us', action: () => handleQuickLink('about') },
                  { label: 'Catalogue', action: () => handleQuickLink('catalogue') },
                  { label: 'Contact Us', action: () => handleQuickLink('contact') }
                ].map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={link.action}
                      className="text-platinum hover:text-champagne transition-colors duration-300 cursor-pointer flex items-center group text-center"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-antique-gold transition-all duration-300 group-hover:w-full" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Jewelry */}
              <ul className="space-y-4 list-none pl-0 text-[11px] font-sans tracking-widest uppercase">
                {['Rings', 'Earrings', 'Necklaces', 'Bracelets'].map((col, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleQuickLink('catalogue')}
                      className="text-platinum hover:text-champagne transition-colors duration-300 cursor-pointer flex items-center group text-center"
                    >
                      <span className="relative">
                        {col}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-antique-gold transition-all duration-300 group-hover:w-full" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-4">
              <a
                href="https://www.instagram.com/diamonds.by.maheera"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-platinum hover:text-champagne transition-all text-[11px] tracking-widest uppercase group font-display"
              >
                <Instagram className="w-4 h-4 text-antique-gold group-hover:scale-110 transition-transform duration-300" />
                <span>@diamonds.by.maheera</span>
                <ArrowUpRight className="w-3 h-3 text-antique-gold opacity-40 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* COLUMN 3: Newsletter */}
          <div className="space-y-6 lg:pl-12 text-center">
            <span className="text-antique-gold font-serif tracking-[0.25em] text-[10px] uppercase font-medium flex items-center gap-1.5 leading-none">
              <Sparkles className="w-3.5 h-3.5" />
              THE PRIVATE ATELIER CIRCLE
            </span>
            <h3 className="font-serif text-2xl font-light tracking-wide text-champagne leading-normal">
              Subscribe to Rare Collections & Exclusive Previews
            </h3>
            
            <AnimatePresence mode="wait">
              {!subscribed ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubscribe}
                  className="flex flex-col gap-4 w-full pt-4"
                >
                  <div className="relative w-full h-12 flex">
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ENTER YOUR EMAIL..."
                      disabled={isSubmitting}
                      className="w-full h-full bg-transparent text-champagne placeholder-slate-charcoal text-[11px] tracking-widest border-b border-antique-gold focus:border-champagne focus:text-champagne pl-0 pr-28 font-sans outline-none transition-all duration-300 uppercase"
                    />
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="absolute right-0 top-0 h-full px-5 bg-antique-gold text-obsidian text-[11px] tracking-[0.1em] uppercase border-none hover:bg-[#b59659] transition-colors cursor-pointer font-medium"
                    >
                      {isSubmitting ? '...' : 'JOIN'}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="pt-4 text-center space-y-2"
                >
                  <span className="text-antique-gold font-serif text-[11px] tracking-widest uppercase block font-medium">
                    YOUR INTAKE STATUS ISSUED SUCCESSFULLY
                  </span>
                  <p className="text-[12px] text-platinum font-light leading-relaxed">
                    Thank you. Your address is registered in our master directory.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* BOTTOM BAR: Copyright Information */}
        <div className="pt-10 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] text-platinum space-y-4 sm:space-y-0 text-center select-none">
          <p className="font-serif italic text-[16px] text-[#FAF7F2]/40 text-center">
            Handcrafted in Pune. Since 1928.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-center">
            <p className="font-medium uppercase tracking-[0.1em] text-[9.5px]">
              &copy; {new Date().getFullYear()} Maheera Diamonds. All Rights Reserved.
            </p>
            <span className="hidden sm:inline text-slate-charcoal">|</span>
            <p className="font-display tracking-widest text-slate-charcoal text-[8.5px] uppercase">
              Conflict-Free GIA Assured • Secure Armored Delivery
            </p>
            <span className="hidden sm:inline text-slate-charcoal">|</span>
            <button 
              onClick={() => handleQuickLink('admin')}
              className="text-slate-charcoal hover:text-antique-gold transition-colors font-display tracking-widest text-[8.5px] uppercase cursor-pointer flex items-center gap-1"
            >
              Executive Access
            </button>
          </div>
        </div>

      </div>

    </footer>
  );
}
