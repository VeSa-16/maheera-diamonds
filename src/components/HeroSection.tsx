import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import Magnetic from './Magnetic';

interface HeroSectionProps {
  onExploreCustomizer: () => void;
  onExploreCatalog: () => void;
  onOpenBooking: () => void;
}

/* ═══════════════════════════════════════════════════════════
   "THE DIAMOND WINDOW" HERO — WORLD-CLASS EDITION
   
   Layers:
   0. Marquee Ticker (top edge — awareness strip)
   1. Background Diamond Image (Ken Burns + Parallax)
   2. Film Grain Texture (separates luxury from the rest)
   3. Cursor-Reactive Jeweler's Spotlight
   4. Liquid Glass "MAHEERA" Typography
   5. Bottom Editorial Layout (tagline + slide counter + CTAs)
   6. Jewelry Box Opening Curtains (entrance)
   7. Scroll indicator
   ═══════════════════════════════════════════════════════════ */

const IMAGES = [
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2400&q=95',
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=2400&q=95',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2400&q=95',
];

const TAGLINES = [
  'Where every facet tells a story of perfection',
  'Diamonds shaped for those who define elegance',
  'Heirlooms crafted for the next century',
];

const TICKER_ITEMS = [
  'GIA Certified Diamonds',
  'Est. 1928 · Pune',
  'Conflict-Free Sourcing',
  'Handcrafted Excellence',
  'Lifetime Guarantee',
  'Private Salon Available',
];

const SLIDE_DURATION = 7000;

/* ═══════════════════════════════════════════════════════════
   SPOTLIGHT OVERLAY — GPU-accelerated via direct DOM mutation
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
    const update = () => {
      const x = smoothX.get();
      const y = smoothY.get();
      el.style.background = `radial-gradient(ellipse 700px 600px at ${x * 100}% ${y * 100}%, transparent 0%, rgba(8,8,8,0.65) 100%)`;
    };
    const u1 = smoothX.on('change', update);
    const u2 = smoothY.on('change', update);
    return () => { u1(); u2(); };
  }, [smoothX, smoothY]);

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-[2] pointer-events-none"
      style={{ background: 'radial-gradient(ellipse 700px 600px at 50% 40%, transparent 0%, rgba(8,8,8,0.65) 100%)' }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   MARQUEE TICKER — Infinite horizontal luxury strip
   ═══════════════════════════════════════════════════════════ */
function MarqueeTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="absolute top-0 left-0 right-0 z-30 h-8 flex items-center overflow-hidden border-b border-warm-ivory/8 bg-obsidian/60 backdrop-blur-sm">
      <motion.div
        className="flex items-center gap-0 whitespace-nowrap will-change-transform"
        animate={{ x: ['0%', '-33.333%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-6">
            <span
              className="font-display uppercase text-[9px] text-warm-ivory/40 font-medium"
              style={{ letterSpacing: '0.3em' }}
            >
              {item}
            </span>
            <span className="text-antique-gold/30 text-xs">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE COUNTER — "01 / 03" editorial number
   ═══════════════════════════════════════════════════════════ */
function SlideCounter({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      <AnimatePresence mode="wait">
        <motion.span
          key={current}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-antique-gold tabular-nums"
          style={{ fontSize: '11px', letterSpacing: '0.1em' }}
        >
          {String(current + 1).padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
      <div className="w-10 h-[1px] bg-warm-ivory/20">
        <motion.div
          className="h-full bg-antique-gold origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
          key={`progress-${current}`}
        />
      </div>
      <span
        className="font-display text-warm-ivory/25 tabular-nums"
        style={{ fontSize: '11px', letterSpacing: '0.1em' }}
      >
        {String(total).padStart(2, '0')}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN HERO SECTION
   ═══════════════════════════════════════════════════════════ */
export default function HeroSection({
  onExploreCatalog,
  onExploreCustomizer,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [boxOpened, setBoxOpened] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  // Mouse tracking
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 18 });

  // Parallax — image drifts slightly opposite to cursor
  const parallaxX = useTransform(smoothX, [0, 1], ['2%', '-2%']);
  const parallaxY = useTransform(smoothY, [0, 1], ['2%', '-2%']);

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const t1 = setTimeout(() => setBoxOpened(true), 300);
    const t2 = setTimeout(() => setContentReady(true), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setImageIndex((p) => (p + 1) % IMAGES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouse}
      className="relative h-screen w-full bg-obsidian overflow-hidden select-none"
    >
      {/* ═══ MARQUEE TICKER ═══ */}
      <MarqueeTicker />

      {/* ═══ LAYER 1: Background — Ken Burns + Mouse Parallax ═══ */}
      <AnimatePresence mode="sync">
        <motion.div
          key={imageIndex}
          className="absolute inset-0 z-0 scale-110"
          style={{ x: parallaxX, y: parallaxY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        >
          <motion.img
            src={IMAGES[imageIndex]}
            alt=""
            initial={{ scale: 1.0 }}
            animate={{ scale: 1.07 }}
            transition={{ duration: SLIDE_DURATION / 1000 + 2, ease: 'linear' }}
            className="w-full h-full object-cover object-center"
            fetchPriority={imageIndex === 0 ? 'high' : 'low'}
            loading={imageIndex === 0 ? 'eager' : 'lazy'}
          />
        </motion.div>
      </AnimatePresence>

      {/* ═══ LAYER 2: Film Grain Texture ═══ */}
      {/* SVG turbulence-based grain — renders in GPU, zero performance cost */}
      <svg className="absolute inset-0 w-full h-full z-[3] opacity-[0.045] pointer-events-none mix-blend-overlay" aria-hidden="true">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* ═══ LAYER 3: Cursor-Reactive Jeweler's Spotlight ═══ */}
      <SpotlightOverlay smoothX={smoothX} smoothY={smoothY} />

      {/* ═══ LAYER 4: Vignette ═══ */}
      <div className="absolute inset-0 z-[4] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(8,8,8,0.7)_100%)]" />
      {/* Bottom gradient for text readability */}
      <div className="absolute inset-0 z-[4] pointer-events-none bg-gradient-to-t from-obsidian/90 via-transparent to-transparent" />

      {/* ═══ LAYER 5: Liquid Glass "MAHEERA" ═══ */}
      <div className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={contentReady ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center"
        >
          {/* Ambient golden glow BEHIND the text — makes it self-luminous */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: '110%',
              aspectRatio: '3 / 1',
              background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.06) 50%, transparent 75%)',
              filter: 'blur(24px)',
            }}
          />

          <div className="relative">
            {/* Base Layer: Structural legibility & shadow (ignores blend mode) */}
            <h1
              className="font-serif font-light leading-none text-center"
              style={{
                fontSize: 'clamp(72px, 16vw, 240px)',
                color: 'transparent',
                WebkitTextStroke: '1px rgba(255,255,255,0.3)',
                letterSpacing: '0.1em',
                marginRight: '-0.1em',
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8)) drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
              }}
            >
              MAHEERA
            </h1>

            {/* Reactive Layer: Highlights dynamically based on the image behind it */}
            <h1
              className="absolute inset-0 font-serif font-light leading-none text-center pointer-events-none"
              style={{
                fontSize: 'clamp(72px, 16vw, 240px)',
                background: 'linear-gradient(160deg, rgba(255,255,255,0.9) 0%, rgba(201,168,76,0.8) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mixBlendMode: 'color-dodge', /* This makes the text highlight react to the image! */
                letterSpacing: '0.1em',
                marginRight: '-0.1em',
              }}
              aria-hidden="true"
            >
              MAHEERA
            </h1>
          </div>

          {/* Hairline separator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={contentReady ? { scaleX: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 h-[1px] w-36 bg-gradient-to-r from-transparent via-antique-gold to-transparent origin-center opacity-80"
          />

          {/* Sub-brand tagline beneath the name */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={contentReady ? { opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 1.2 }}
            className="font-display mt-5 text-warm-ivory/40 font-medium uppercase"
            style={{ fontSize: '9px', letterSpacing: '0.45em' }}
          >
            Diamonds & Fine Jewellery
          </motion.p>
        </motion.div>
      </div>

      {/* ═══ LAYER 6: Bottom Editorial Bar ═══ */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-14 md:pb-18 lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={contentReady ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-7xl mx-auto px-8 md:px-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8"
        >
          {/* Left: Tagline with slide counter */}
          <div className="flex flex-col gap-4">
            <SlideCounter current={imageIndex} total={IMAGES.length} />
            <AnimatePresence mode="wait">
              <motion.p
                key={imageIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-lg md:text-xl lg:text-2xl text-warm-ivory/70 italic font-light max-w-sm leading-relaxed"
              >
                {TAGLINES[imageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Right: CTAs */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <Magnetic strength={20}>
              <button
                onClick={onExploreCatalog}
                className="group relative overflow-hidden px-8 py-3.5 border border-warm-ivory/15 hover:border-antique-gold/50 transition-all duration-700 cursor-pointer"
              >
                <span
                  className="relative z-10 font-display uppercase text-[10px] md:text-[11px] text-warm-ivory group-hover:text-obsidian transition-colors duration-500"
                  style={{ letterSpacing: '0.25em' }}
                >
                  Explore Collection
                </span>
                <div className="absolute inset-0 bg-antique-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              </button>
            </Magnetic>

            <Magnetic strength={15}>
              <button
                onClick={onExploreCustomizer}
                className="group flex items-center gap-3 cursor-pointer"
              >
                <span
                  className="font-display uppercase text-[10px] md:text-[11px] text-warm-ivory/40 group-hover:text-antique-gold transition-colors duration-500"
                  style={{ letterSpacing: '0.2em' }}
                >
                  Design Your Own
                </span>
                <motion.span
                  className="text-warm-ivory/25 text-sm group-hover:text-antique-gold transition-colors duration-500"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  →
                </motion.span>
              </button>
            </Magnetic>
          </div>
        </motion.div>
      </div>

      {/* ═══ LAYER 7: Jewelry Box Opening Curtains ═══ */}
      <motion.div
        initial={{ y: '0%' }}
        animate={boxOpened ? { y: '-100%' } : {}}
        transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-x-0 top-0 h-1/2 bg-obsidian z-50 flex items-end justify-center pb-1"
      >
        {/* Golden seam line at split point */}
        <div className="w-24 h-[1px] bg-antique-gold/30" />
      </motion.div>
      <motion.div
        initial={{ y: '0%' }}
        animate={boxOpened ? { y: '100%' } : {}}
        transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-obsidian z-50 flex items-start justify-center pt-1"
      >
        {/* Golden seam line at split point */}
        <div className="w-24 h-[1px] bg-antique-gold/30" />
      </motion.div>

      {/* ═══ LAYER 8: Scroll Indicator ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={contentReady ? { opacity: 1 } : {}}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5"
      >
        <span
          className="font-display uppercase text-[7px] text-warm-ivory/20"
          style={{ letterSpacing: '0.35em' }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-8 bg-gradient-to-b from-warm-ivory/20 to-transparent"
        />
      </motion.div>

    </section>
  );
}
