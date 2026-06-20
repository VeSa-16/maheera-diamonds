import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Award, Star, Compass, Phone, Mail, Instagram, Sparkles, Check, ChevronUp, Clock } from 'lucide-react';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductCatalog from './components/ProductCatalog';
import DiamondCustomizer from './components/DiamondCustomizer';
import StorySection from './components/StorySection';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import InstagramFeed from './components/InstagramFeed';
import BookingModal from './components/BookingModal';
import CartOverlay from './components/CartOverlay';
import BrandLogo from './components/BrandLogo';
import Footer from './components/Footer';
import JewelryCategories from './components/JewelryCategories';
import LoadingScreen from './components/LoadingScreen';
import Masterclass4C from './components/Masterclass4C';
import BespokeTimeline from './components/BespokeTimeline';
import AtelierVideo from './components/AtelierVideo';
import VIPConcierge from './components/VIPConcierge';
import LiveChat from './components/LiveChat';

const AboutUsPage = lazy(() => import('./components/AboutUsPage'));
const CataloguePage = lazy(() => import('./components/CataloguePage'));
const ContactUsPage = lazy(() => import('./components/ContactUsPage'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
import SEO from './components/SEO';

import { Product, CartItem, CustomRingConfiguration, Appointment } from './types';
import { useQuery } from '@tanstack/react-query';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'catalogue' | 'contact' | 'admin'>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Dynamic success/alert notification bars
  const [premiumAlert, setPremiumAlert] = useState<{ message: string; sub?: string } | null>(null);
  const [selectedGender, setSelectedGender] = useState<'all' | 'women' | 'men'>('all');

  // Fetch products
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleExploreGender = (gender: 'women' | 'men') => {
    setSelectedGender(gender);
    handlePageChangeWithTransition('catalogue');
    triggerAlert(
      `Viewing Selected ${gender === 'women' ? "Women's" : "Men's"} Collection`,
      `We have filtered the gallery to feature our finest ${gender === 'women' ? "women's" : "men's"} jewelry. All items are open to full customization.`
    );
  };

  // Initial premium loading screen timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const handlePageChangeWithTransition = (page: 'home' | 'about' | 'catalogue' | 'contact' | 'admin') => {
    if (page === currentPage) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'instant' });
      // Short buffer before lifting the curtain
      setTimeout(() => setIsTransitioning(false), 200);
    }, 600);
  };

  // Scroll listener to activate navbar highlighting and Back to Top
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);

      const scrollPosition = window.scrollY + 250;
      const hero = document.getElementById('hero');
      const story = document.getElementById('story');
      const catalog = document.getElementById('catalog');
      const customizer = document.getElementById('customizer');

      const sections = [
        { id: 'hero', offset: hero?.offsetTop || 0 },
        { id: 'story', offset: story?.offsetTop || 0 },
        { id: 'catalog', offset: catalog?.offsetTop || 0 },
        { id: 'customizer', offset: customizer?.offsetTop || 0 },
      ];

      // Sort descending by offset so we check from bottom-most section upwards
      sections.sort((a, b) => b.offset - a.offset);

      const active = sections.find((s) => scrollPosition >= s.offset);
      if (active) {
        setActiveSection(active.id);
      } else {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerAlert = (message: string, sub?: string) => {
    setPremiumAlert({ message, sub });
    setTimeout(() => {
      setPremiumAlert(null);
    }, 5000);
  };

  // Add standard product to cart
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id && !item.isCustomRing);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id && !item.isCustomRing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          details: product.details[0],
          isCustomRing: false,
        },
      ];
    });
    triggerAlert(`“${product.name}” Added to Vault`, 'Your personal boutique piece is safe in your private order drawer.');
    setIsCartOpen(true);
  };

  // Add custom diamond ring configuration to cart
  const handleAddCustomToCart = (config: CustomRingConfiguration, price: number) => {
    const customId = `bespoke-${Date.now()}`;
    const name = `The Bespoke ${config.shape.toUpperCase()} Diamond Set`;
    const detailsText = `${config.carat} ct ${config.shape.toUpperCase()} Diamond, ${config.metal.toUpperCase()} setting, Clarity: ${config.clarity}, Color: ${config.colorGrade}`;

    setCartItems((prev) => [
      ...prev,
      {
        id: customId,
        name,
        price,
        image: '', // custom rings use a fallback vector/emoji box in CartOverlay
        quantity: 1,
        details: detailsText,
        isCustomRing: true,
        customConfig: config,
      },
    ]);
    triggerAlert('Bespoke Engineering Confirmed', 'The master craft template is locked in your vault.');
    setIsCartOpen(true);
  };

  // Remove standard/custom item from cart
  const handleRemoveCartItem = (id: string, isCustomRing?: boolean) => {
    setCartItems((prev) => prev.filter((item) => !(item.id === id && item.isCustomRing === isCustomRing)));
  };

  // Toggle favorite
  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(productId);
      if (isFav) {
        triggerAlert('Removed from Selection', 'Jewel removed from your favorites.');
        return prev.filter((id) => id !== productId);
      } else {
        const prod = products.find((p) => p.id === productId);
        triggerAlert('Added to Curated Favorites', prod ? `“${prod.name}” has been saved to your personal registry.` : '');
        return [...prev, productId];
      }
    });
  };

  // Trigger booking success
  const handleBookingSuccess = (appt: Appointment) => {
    // Optionally trigger real-time saving or alert logging
  };

  // Simulated premium checkout leading to billing secure success page
  const handleCheckout = () => {
    setIsCartOpen(false);
    triggerAlert(
      'Secure Private Gateway Initialized',
      'Opening encrypted checkout panel to authenticate secure vault routing in Pune, India. Check email for invoice details.'
    );
    setTimeout(() => {
      setCartItems([]);
      triggerAlert('Transaction Fully Authorized', 'Thank you. Your escrow payment is locked and GIA sizing begins tomorrow.');
    }, 4500);
  };

  // Scroll smooth anchor
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-warm-ivory min-h-screen flex flex-col justify-between text-obsidian selection:bg-blush-rose selection:text-obsidian relative">
      
      {/* Full Screen Premium Loader */}
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      {/* Cinematic Curtain Transition */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0, transformOrigin: 'bottom' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            style={{ transformOrigin: 'top' }}
            className="fixed inset-0 z-[9999] bg-obsidian flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <BrandLogo size={42} showText={false} textColor="text-antique-gold" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Overlay Alerts banner */}
      <AnimatePresence>
        {premiumAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -30, x: '-50%' }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-obsidian text-warm-ivory border border-champagne px-6 py-4 shadow-2xl flex items-start gap-4 max-w-sm md:max-w-md w-[90%] rounded-xs"
          >
            <div className="bg-antique-gold text-obsidian p-1.5 rounded-full mt-0.5 shrink-0">
              <Check className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <p className="font-display text-[10px] tracking-widest uppercase font-medium text-champagne">
                {premiumAlert.message}
              </p>
              {premiumAlert.sub && (
                <p className="text-[10px] text-gray-300 leading-relaxed font-light font-sans">
                  {premiumAlert.sub}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Overhead Header Navigation bar */}
      {currentPage !== 'admin' && (
        <Navbar
          cartCount={cartItems.reduce((acc, current) => acc + current.quantity, 0)}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenBooking={() => setIsBookingOpen(true)}
          favoritesCount={favorites.length}
          currentPage={currentPage}
          onPageChange={handlePageChangeWithTransition}
        />
      )}

      {/* Master Main section */}
      <main className="flex-1">
        {/* Dynamic SEO Injection */}
        {currentPage === 'home' && (
          <SEO 
            title="Maheera Diamonds | Certified Diamond Jewellery in Pune, India" 
            description="Discover luxury diamond jewelry. GIA certified rings, necklaces, and bespoke designs in Pune."
            canonical="https://maheeradiamonds.com/"
            schema={{
              "@context": "https://schema.org",
              "@type": "JewelryStore",
              "name": "Maheera Diamonds",
              "image": "https://maheeradiamonds.com/og-image.jpg",
              "telephone": "+919876543210",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Pune",
                "addressRegion": "MH",
                "addressCountry": "IN"
              }
            }}
          />
        )}
        {currentPage === 'catalogue' && (
          <SEO title="Diamond Rings, Necklaces & Earrings | Maheera Diamonds" description="Explore our curated collection of luxury diamond jewelry." canonical="https://maheeradiamonds.com/catalogue" />
        )}
        {currentPage === 'about' && (
          <SEO title="Our Story | GIA Certified Conflict-Free Diamonds | Maheera Diamonds" description="Learn about the heritage and craftsmanship of Maheera Diamonds." canonical="https://maheeradiamonds.com/about" />
        )}
        {currentPage === 'contact' && (
          <SEO title="Contact Maheera Diamonds | Pune Showroom & Virtual Consultation" description="Book a private salon appointment or virtual consultation with our diamond experts." canonical="https://maheeradiamonds.com/contact" />
        )}

        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Cinematic Slider Hero banner */}
              <section id="hero" className="scroll-mt-0">
                <HeroSection
                  onExploreCustomizer={() => {
                    handleScrollToSection('customizer');
                  }}
                  onExploreCatalog={() => {
                    handlePageChangeWithTransition('catalogue');
                  }}
                  onOpenBooking={() => setIsBookingOpen(true)}
                />
              </section>

              {/* Curated Jewelry Categories - "Designed for Generations" */}
              <JewelryCategories onExplore={handleExploreGender} />

              {/* Brand Core Values - Why Choose Us */}
              <WhyChooseUs />

              {/* Visual store product categories list catalog */}
              <ProductCatalog
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />

              {/* The 4Cs Diamond Masterclass */}
              <Masterclass4C />

              {/* Dynamic Jewelry Interactive Customized Builder */}
              <DiamondCustomizer onAddCustomToCart={handleAddCustomToCart} />

              {/* Bespoke Journey Timeline */}
              <BespokeTimeline />

              {/* Brand narrative quotes and details / OUR PORTFOLIO STORY */}
              <StorySection />

              {/* Editorial Testimonials Panel */}
              <Testimonials />

              {/* Atelier Video Section */}
              <AtelierVideo />

              {/* Instagram Luxury Feed Curation */}
              <InstagramFeed />

              {/* VIP Concierge Banner */}
              <VIPConcierge onOpenBooking={() => setIsBookingOpen(true)} />


            </motion.div>
          )}

          {currentPage === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Suspense fallback={<div className="h-screen flex items-center justify-center text-antique-gold font-serif">Loading Story...</div>}>
                <AboutUsPage />
              </Suspense>
            </motion.div>
          )}

          {currentPage === 'catalogue' && (
            <motion.div
              key="catalogue"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Suspense fallback={<div className="h-screen flex items-center justify-center text-antique-gold font-serif">Loading Gallery...</div>}>
                <CataloguePage
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                  favorites={favorites}
                  initialGender={selectedGender}
                  onGenderChange={setSelectedGender}
                />
              </Suspense>
            </motion.div>
          )}

          {currentPage === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Suspense fallback={<div className="h-screen flex items-center justify-center text-antique-gold font-serif">Loading Contact Details...</div>}>
                <ContactUsPage />
              </Suspense>
            </motion.div>
          )}

          {currentPage === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Suspense fallback={<div className="h-screen flex items-center justify-center text-antique-gold font-serif bg-obsidian">Loading Admin Ecosystem...</div>}>
                <AdminDashboard onExit={() => handlePageChangeWithTransition('home')} />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Back to top dynamic button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-40 p-3 bg-obsidian/90 text-warm-ivory border border-champagne/40 rounded-full cursor-pointer hover:bg-antique-gold hover:text-obsidian transition-all"
            aria-label="Scroll back to top of page"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Private Consultation reservation and slot booking form overlay card */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={handleBookingSuccess}
      />

      {/* Curated shopping bag drawers panel overlay */}
      <CartOverlay
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
      />

      {/* Live VIP Concierge Chat globally available */}
      {currentPage !== 'admin' && <LiveChat />}

      {/* Premium Luxury Boutique Footer Section */}
      {currentPage !== 'admin' && <Footer onPageChange={handlePageChangeWithTransition} />}

    </div>
  );
}
