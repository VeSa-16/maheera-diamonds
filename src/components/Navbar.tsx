import { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, Menu, X, Heart, Mail, MapPin, Sparkles, Truck, ShieldCheck, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenBooking: () => void;
  onOpenAuth: () => void;
  onOpenClientPortal: () => void;
  onLogout: () => void;
  user: any;
  favoritesCount: number;
  currentPage: 'home' | 'about' | 'catalogue' | 'contact' | 'admin';
  onPageChange: (page: 'home' | 'about' | 'catalogue' | 'contact' | 'admin') => void;
}

export default function Navbar({
  cartCount,
  onOpenCart,
  onOpenBooking,
  onOpenAuth,
  onOpenClientPortal,
  onLogout,
  user,
  favoritesCount,
  currentPage,
  onPageChange,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<'home' | 'about' | 'catalogue' | 'contact' | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (megaMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setHoveredLink(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [megaMenuOpen]);

  const navItems: { id: 'home' | 'about' | 'catalogue' | 'contact'; label: string; image: string }[] = [
    { id: 'home', label: 'Home', image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=80' },
    { id: 'about', label: 'Our Heritage', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80' },
    { id: 'catalogue', label: 'The Collection', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80' },
    { id: 'contact', label: 'Private Advisory', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1200&q=80' },
  ];

  const isDarkBase = currentPage === 'home' && !scrolled;

  const currentHoverImage = hoveredLink 
    ? navItems.find(n => n.id === hoveredLink)?.image 
    : navItems[0].image;

  return (
    <header
      className={`fixed top-0 left-0 right-0 select-none ${
        megaMenuOpen ? 'z-[1000] h-screen overflow-hidden' : 'z-50 h-auto'
      }`}
    >
      {/* Top Trust Bar */}
      <div className="w-full bg-obsidian text-[8px] sm:text-[9px] font-sans tracking-[0.25em] text-antique-gold py-1.5 text-center uppercase font-medium relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-4 sm:gap-8 overflow-hidden whitespace-nowrap opacity-90">
          <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> 100% GIA Certified</span>
          <span className="hidden sm:inline-flex text-antique-gold/40">|</span>
          <span className="hidden sm:flex items-center gap-1.5"><Truck className="w-3 h-3" /> Secure Armored Delivery</span>
          <span className="hidden md:inline-flex text-antique-gold/40">|</span>
          <span className="hidden md:flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Conflict-Free Diamonds</span>
        </div>
      </div>
      
      {/* Scroll-responsive Background and Border Plate */}
      <div
        className={`absolute inset-0 transition-all duration-300 ease-out -z-10 ${
          scrolled && !megaMenuOpen
            ? 'bg-warm-ivory shadow-md shadow-obsidian/5'
            : 'bg-transparent border-b border-transparent'
        }`}
      />

      {/* Main Content Area */}
      <div
        className={`w-full max-w-7xl mx-auto px-6 md:px-8 relative flex items-center justify-between transition-all duration-300 ease-out ${
          scrolled ? 'h-[80px]' : 'h-[100px]'
        }`}
      >
        {/* Left column: Universal Menu Trigger */}
        <div className="flex items-center flex-1 justify-start">
          <button
            className={`flex items-center gap-2 hover:opacity-70 transition-all cursor-pointer ${
              isDarkBase && !megaMenuOpen ? 'text-white' : 'text-obsidian'
            }`}
            onClick={() => setMegaMenuOpen(true)}
            aria-label="Open Mega Menu"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
            <span className="hidden md:block font-display text-[10px] tracking-[0.2em] uppercase mt-0.5">Menu</span>
          </button>
        </div>

        {/* Center column: Brand logo */}
        <div className="flex items-center justify-center flex-initial px-4 relative z-[1001]">
          <button 
            aria-label="Home"
            onClick={() => {
              onPageChange('home');
              setMegaMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="focus:outline-none cursor-pointer flex items-center justify-center hover:opacity-85 transition-opacity"
          >
            <BrandLogo 
              size={36} 
              showText={true} 
              textColor={isDarkBase && !megaMenuOpen ? 'text-white' : 'text-obsidian'} 
            />
          </button>
        </div>

        {/* Right column: Action Icons */}
        <div className={`flex items-center justify-end flex-1 gap-3 sm:gap-4 md:gap-5 relative z-[1001] ${isDarkBase && !megaMenuOpen ? 'text-white' : 'text-obsidian'}`}>
          <button
            aria-label="Book Consultation"
            onClick={() => {
              setMegaMenuOpen(false);
              onOpenBooking();
            }}
            className={`hidden lg:flex items-center gap-2 px-5 py-2 border transition-all cursor-pointer text-[10px] font-sans tracking-[0.15em] font-medium rounded-xs active:scale-97 ${
              isDarkBase && !megaMenuOpen
                ? 'border-white text-white hover:bg-white/10' 
                : 'border-antique-gold text-antique-gold hover:bg-antique-gold/5'
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 stroke-[1.5] ${isDarkBase && !megaMenuOpen ? 'text-white' : 'text-antique-gold'}`} />
            BOOK CONSULTATION
          </button>

          <button
            aria-label="Book Consultation (Mobile)"
            onClick={() => {
              setMegaMenuOpen(false);
              onOpenBooking();
            }}
            className={`hidden md:flex lg:hidden p-2 rounded-full border transition-all cursor-pointer ${
              isDarkBase && !megaMenuOpen
                ? 'border-white text-white hover:bg-white/10' 
                : 'border-antique-gold text-antique-gold hover:bg-antique-gold/5'
            }`}
          >
            <Calendar className={`w-4 h-4 stroke-[1.5] ${isDarkBase && !megaMenuOpen ? 'text-white' : 'text-antique-gold'}`} />
          </button>

          <button 
            aria-label="Favorites"
            onClick={() => {
              setMegaMenuOpen(false);
              onPageChange('catalogue');
            }}
            className="relative p-2 hover:scale-105 active:scale-95 transition-all cursor-pointer hover:text-[#C8A96B]"
          >
            <Heart className="w-4 h-4 sm:w-5 h-5 stroke-[1.5]" />
            {favoritesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-antique-gold text-white text-[8px] font-sans rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-xs">
                {favoritesCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-1">
              <button
                aria-label="Client Portal"
                onClick={() => {
                  setMegaMenuOpen(false);
                  onOpenClientPortal();
                }}
                className="flex items-center gap-2 relative p-2 hover:scale-105 active:scale-95 transition-all cursor-pointer hover:text-[#C8A96B]"
                title="Client Portal"
              >
                <User className="w-4 h-4 sm:w-5 h-5 stroke-[1.5]" />
                <span className="hidden md:block text-[10px] font-sans uppercase tracking-widest text-antique-gold mt-0.5">
                  {user.name.split(' ')[0]}
                </span>
              </button>
              <button
                aria-label="Log Out"
                onClick={onLogout}
                className="relative p-2 hover:scale-105 active:scale-95 transition-all cursor-pointer hover:text-red-400"
                title="Log Out"
              >
                <LogOut className="w-4 h-4 sm:w-5 h-5 stroke-[1.5]" />
              </button>
            </div>
          ) : (
            <button
              aria-label="Sign In"
              onClick={() => {
                setMegaMenuOpen(false);
                onOpenAuth();
              }}
              className="relative p-2 hover:scale-105 active:scale-95 transition-all cursor-pointer hover:text-[#C8A96B]"
              title="Sign In"
            >
              <User className="w-4 h-4 sm:w-5 h-5 stroke-[1.5]" />
            </button>
          )}

          <button
            aria-label="Shopping Cart"
            onClick={() => {
              setMegaMenuOpen(false);
              onOpenCart();
            }}
            className="relative p-2 hover:scale-105 active:scale-95 transition-all cursor-pointer hover:text-[#C8A96B]"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 h-5 stroke-[1.5]" />
            {cartCount > 0 && (
              <span className={`absolute -top-0.5 -right-0.5 text-white text-[8px] font-sans rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-xs ${
                isDarkBase && !megaMenuOpen ? 'bg-white text-obsidian' : 'bg-obsidian'
              }`}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Full-Screen Mega Menu Overlay */}
      <AnimatePresence>
        {megaMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[1000] bg-warm-ivory text-obsidian flex"
          >
            {/* Close Button Overlay Level */}
            <button
              className="absolute top-6 left-6 md:top-8 md:left-8 z-[1002] p-3 border border-obsidian/10 text-obsidian rounded-full hover:rotate-90 hover:text-antique-gold transition-all duration-300 cursor-pointer bg-warm-ivory"
              onClick={() => setMegaMenuOpen(false)}
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Left Column: Navigation Links */}
            <div className="w-full lg:w-[45%] h-full flex flex-col justify-center px-6 md:px-20 py-20 md:py-24 relative z-10 overflow-y-auto">
              <span className="text-[9px] font-sans tracking-[0.3em] text-[#af8f4a] uppercase font-medium mb-8 md:mb-12 mt-8 md:mt-0">
                MEMBER OF RESPONSIBLE JEWELLERY COUNCIL
              </span>
              
              <nav className="flex flex-col space-y-4 md:space-y-6">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onMouseEnter={() => setHoveredLink(item.id)}
                    onClick={() => {
                      setMegaMenuOpen(false);
                      onPageChange(item.id);
                    }}
                    className={`group text-left transition-all cursor-pointer ${
                      currentPage === item.id || hoveredLink === item.id ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                    }`}
                  >
                    <span className="font-serif text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-obsidian group-hover:text-antique-gold transition-colors duration-500">
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </nav>

              {/* Contact Block */}
              <div className="mt-20 space-y-4">
                <div className="flex items-center gap-2 text-[#af8f4a]">
                  <MapPin className="w-4 h-4 text-[#C8A96B]" />
                  <span className="tracking-[0.25em] font-sans text-[#C8A96B] text-[9.5px] uppercase font-medium">
                    PUNE Flagship Atelier
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-charcoal font-sans">
                  <Mail className="w-3.5 h-3.5 text-[#C8A96B]" />
                  <a href="mailto:maheeradiamonds@gmail.com" className="hover:text-black transition-colors underline decoration-[#C8A96B]/30">
                    maheeradiamonds@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Editorial Imagery (Desktop Only) */}
            <div className="hidden lg:block w-[55%] h-full relative overflow-hidden bg-obsidian">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentHoverImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  src={currentHoverImage}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
