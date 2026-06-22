import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';

interface HeroSectionProps {
  onExploreCustomizer: () => void;
  onExploreCatalog: () => void;
  onOpenBooking: () => void;
}

/* ═══════════════════════════════════════════════════════════
   "THE DIAMOND WINDOW" HERO
   
   Concept: The brand name MAHEERA is displayed in massive 
   typography that acts as a WINDOW into a diamond image.
   The user's cursor creates a spotlight effect, like shining
   a jeweler's loupe over a gem. The entrance is a "jewelry 
   box opening" — two dark panels slide apart to reveal the
   experience.
   ═══════════════════════════════════════════════════════════ */

const IMAGES = [
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2000&q=90',
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=2000&q=90',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2000&q=90',
];

export default function HeroSection({
  onExploreCatalog,
  onExploreCustomizer,
  onOpenBooking,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [boxOpened, setBoxOpened] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  // Mouse tracking for the spotlight effect
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Track mouse position as 0-1 ratio
  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  // Jewelry box opening sequence
  useEffect(() => {
    const t1 = setTimeout(() => setBoxOpened(true), 300);
    const t2 = setTimeout(() => setContentReady(true), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Rotate background images
  useEffect(() => {
    const timer = setInterval(() => {
      setImageIndex((p) => (p + 1) % IMAGES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouse}
      className="relative h-screen w-full bg-obsidian overflow-hidden select-none"
    >
      {/* ═══ LAYER 1: Background Diamond Image ═══ */}
      <AnimatePresence mode="sync">
        <motion.img
          key={imageIndex}
          src={IMAGES[imageIndex]}
          alt=""
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1.0 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.5 }, scale: { duration: 8, ease: "linear" } }}
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          fetchPriority={imageIndex === 0 ? "high" : "low"}
        />
      </AnimatePresence>

      {/* ═══ LAYER 2: Cursor-Reactive Spotlight ═══ */}
      <motion.div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: useSpring(
            // This won't work as a direct spring, so we use a different approach
            mouseX // placeholder
          ) ? undefined : undefined,
        }}
      />
      {/* We use a separate div with inline style driven by spring values */}
      <SpotlightOverlay smoothX={smoothX} smoothY={smoothY} />

      {/* ═══ LAYER 3: The Masked Typography Window ═══ */}
      <div className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={contentReady ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* The highlighted brand name — Translucent Liquid Glass Effect */}
          <h1
            className="relative font-serif font-light leading-none text-center"
            style={{
              fontSize: 'clamp(80px, 18vw, 280px)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.1) 50%, rgba(201,168,76,0.6) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.4)',
              mixBlendMode: 'overlay',
              letterSpacing: '0.08em',
              marginRight: '-0.08em',
              filter: 'drop-shadow(0px 15px 35px rgba(0,0,0,0.4)) drop-shadow(0px 4px 10px rgba(255,255,255,0.2))',
            }}
          >
            MAHEERA
          </h1>

          {/* Thin golden underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={contentReady ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 h-[1px] w-32 bg-gradient-to-r from-transparent via-antique-gold to-transparent origin-center"
          />
        </motion.div>
      </div>

      {/* ═══ LAYER 4: Bottom Content ═══ */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-16 md:pb-20 lg:pb-24">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={contentReady ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8"
          >
            {/* Left: Tagline */}
            <div>
              <p
                className="font-display uppercase text-warm-ivory/35 font-medium mb-3"
                style={{ fontSize: '10px', letterSpacing: '0.5em' }}
              >
                Since 1928 — Pune, India
              </p>
              <p className="font-serif text-xl md:text-2xl lg:text-3xl text-warm-ivory/80 italic font-light max-w-lg leading-relaxed">
                Where every facet tells a story of perfection
              </p>
            </div>

            {/* Right: CTAs */}
            <div className="flex items-center gap-6">
              <button
                onClick={onExploreCatalog}
                className="group relative overflow-hidden px-7 py-3 border border-warm-ivory/20 hover:border-antique-gold/60 transition-all duration-700 cursor-pointer"
              >
                <span
                  className="relative z-10 font-display uppercase text-[10px] md:text-[11px] text-warm-ivory group-hover:text-obsidian transition-colors duration-500"
                  style={{ letterSpacing: '0.2em' }}
                >
                  Explore
                </span>
                <div className="absolute inset-0 bg-antique-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              </button>

              <button
                onClick={onExploreCustomizer}
                className="group flex items-center gap-3 cursor-pointer"
              >
                <span
                  className="font-display uppercase text-[10px] md:text-[11px] text-warm-ivory/50 group-hover:text-antique-gold transition-colors duration-500"
                  style={{ letterSpacing: '0.2em' }}
                >
                  Create Yours
                </span>
                <motion.span
                  className="text-warm-ivory/30 text-sm group-hover:text-antique-gold transition-colors duration-500"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══ LAYER 5: Jewelry Box Opening Curtains ═══ */}
      <motion.div
        initial={{ x: '0%' }}
        animate={boxOpened ? { x: '-100%' } : {}}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-y-0 left-0 w-1/2 bg-obsidian z-50"
      />
      <motion.div
        initial={{ x: '0%' }}
        animate={boxOpened ? { x: '100%' } : {}}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-y-0 right-0 w-1/2 bg-obsidian z-50"
      />

      {/* ═══ LAYER 6: Scroll Indicator ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={contentReady ? { opacity: 1 } : {}}
        transition={{ delay: 2, duration: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-10 bg-gradient-to-b from-warm-ivory/20 to-transparent"
        />
      </motion.div>

    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SPOTLIGHT OVERLAY
   A radial gradient that follows the cursor, creating a 
   "jeweler's loupe" effect — as if shining a light across
   the diamond surface. Darkens everything except where 
   the cursor is.
   ═══════════════════════════════════════════════════════════ */

function SpotlightOverlay({
  smoothX,
  smoothY,
}: {
  smoothX: ReturnType<typeof useSpring>;
  smoothY: ReturnType<typeof useSpring>;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    const unsubX = smoothX.on('change', (x) => {
      const y = smoothY.get();
      el.style.background = `radial-gradient(ellipse 600px 500px at ${x * 100}% ${y * 100}%, transparent 0%, rgba(10,10,10,0.55) 100%)`;
    });
    const unsubY = smoothY.on('change', (y) => {
      const x = smoothX.get();
      el.style.background = `radial-gradient(ellipse 600px 500px at ${x * 100}% ${y * 100}%, transparent 0%, rgba(10,10,10,0.55) 100%)`;
    });

    return () => { unsubX(); unsubY(); };
  }, [smoothX, smoothY]);

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-[2] pointer-events-none"
      style={{ background: 'radial-gradient(ellipse 600px 500px at 50% 50%, transparent 0%, rgba(10,10,10,0.55) 100%)' }}
    />
  );
}
