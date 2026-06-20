import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroSectionProps {
  onExploreCustomizer: () => void;
  onExploreCatalog: () => void;
  onOpenBooking: () => void;
}

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2000&q=90', // Macro ring
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=2000&q=90', // Elegant details
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2000&q=90', // Fashion luxury
];

export default function HeroSection({
  onExploreCatalog,
}: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000); // Crossfade every 6 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full bg-obsidian flex items-center justify-center overflow-hidden">
      
      {/* Background Cinematic Slideshow */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-obsidian)_100%)] opacity-80 z-10" />
          
          <motion.img
            initial={{ scale: 1.0 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: 8, ease: "linear" }}
            src={HERO_IMAGES[currentSlide]}
            alt="Maison Maheera"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* Content wrapper - Ultra Minimal */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 text-center select-none flex flex-col items-center justify-center">
        
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            {/* The Maison Title */}
            <h2 className="font-serif text-5xl md:text-7xl lg:text-[100px] font-light leading-none text-warm-ivory mb-6 tracking-normal drop-shadow-2xl">
              MAHEERA
            </h2>

            {/* Atmosphere Text */}
            <p className="font-serif text-lg md:text-2xl text-warm-ivory/80 italic font-light max-w-2xl mx-auto leading-relaxed mb-12">
              Le Savoir-Faire Diamantaire
            </p>
            
            <p style={{ fontSize: '10px', letterSpacing: '0.4em', fontVariant: 'small-caps', color: 'var(--color-champagne)' }} className="font-display font-medium uppercase mb-16">
              Est. 1928 — Pune
            </p>

            {/* Hairline CTA Link */}
            <button
              onClick={onExploreCatalog}
              className="group flex flex-col items-center gap-3 cursor-pointer"
            >
              <span 
                className="font-display uppercase text-[10px] text-warm-ivory transition-colors group-hover:text-champagne drop-shadow-md"
                style={{ letterSpacing: '0.3em' }}
              >
                Enter the Maison
              </span>
              <div className="w-[1px] h-[40px] bg-warm-ivory/40 group-hover:bg-champagne transition-colors" />
            </button>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
