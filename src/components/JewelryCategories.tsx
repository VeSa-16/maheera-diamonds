import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { getUnsplashSrcSet } from '../lib/imageUtils';

interface JewelryCategoriesProps {
  onExplore: (gender: 'women' | 'men') => void;
}

export default function JewelryCategories({ onExplore }: JewelryCategoriesProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax subtle shift for the background images
  const yParallax = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  const categories = [
    {
      id: 'women',
      title: "Women’s Collection",
      subtitle: "FEMININE GRACE & SCINTILLATION",
      description: "Elegant jewelry crafted to celebrate grace, confidence, and timeless beauty.",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85",
      accent: "from-amber-500/10 via-rose-500/5 to-transparent"
    },
    {
      id: 'men',
      title: "Men’s Collection",
      subtitle: "MASCULINE STRENGTH & SOPHISTICATION",
      description: "Bold and refined jewelry designed for modern sophistication and timeless style.",
      image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1200&q=85",
      accent: "from-amber-600/10 via-zinc-800/5 to-transparent"
    }
  ];

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      id="jewelry-categories" 
      className="py-16 md:py-24 bg-[#FCFAF6] border-b border-[#C8A96B]/20 overflow-hidden relative"
    >
      {/* Decorative ambient lighting overlays */}
      <div className="absolute top-[20%] left-[-10%] w-[45%] h-[45%] bg-amber-200/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45%] h-[45%] bg-antique-gold/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Editorial Header */}
        <div className="text-center flex flex-col items-center mb-16 space-y-4">
          <span style={{ fontSize: '11px', fontVariant: 'small-caps', letterSpacing: '0.04em', color: '#C8A96B', fontWeight: 400 }} className="font-display block leading-none">
            Curated Lineals
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-extralight tracking-wide text-obsidian leading-tight">
            Designed for Generations
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed font-light font-sans tracking-wide max-w-lg mx-auto">
            Discover bespoke jewelry elements designed with extreme care, handcrafted to become modern heirlooms.
          </p>
        </div>

        {/* Categories Symmetric Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-10 leading-none">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-obsidian rounded-none overflow-hidden flex flex-col justify-between group h-[380px] sm:h-[450px] md:h-[520px] lg:min-h-[600px] relative cursor-pointer"
              onClick={() => onExplore(cat.id as 'women' | 'men')}
            >
              {/* Media Container for Parallax Zoom Effect */}
              <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
                <motion.img
                  src={cat.image}
                  srcSet={getUnsplashSrcSet(cat.image)}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  alt={`Explore ${cat.title} collections`}
                  loading="lazy"
                  decoding="async"
                  style={{ y: yParallax, scale: 1.25 }}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.35]"
                />
                
                {/* Modern Luxury Overlay Gradient directly on the image */}
                <div 
                  className="absolute inset-0 z-10" 
                  style={{ background: 'linear-gradient(to top, rgba(10,8,4,0.75) 0%, rgba(10,8,4,0) 60%)' }} 
                />
                <div className={`absolute inset-0 bg-gradient-to-b ${cat.accent} opacity-45 mix-blend-overlay z-10`} />
              </div>

              {/* Text Context at bottom of cinematic card */}
              <div className="relative z-20 p-6 sm:p-8 md:p-12 flex flex-col items-center text-center select-none mt-auto">
                <span style={{ fontSize: '10px', fontVariant: 'small-caps', letterSpacing: '0.04em', color: '#C8A96B', fontWeight: 400 }} className="font-display block mb-3 md:mb-4 sm:text-[11px]">
                  {cat.subtitle}
                </span>
                
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-[42px] font-light tracking-wide text-white leading-tight mb-2">
                  {cat.title}
                </h3>
                
                <p className="text-stone-300 text-[11px] sm:text-xs md:text-sm font-light font-sans leading-relaxed max-w- mx-auto pb-3 md:pb-4">
                  {cat.description}
                </p>

                {/* Editorial Text Link CTA */}
                <div className="pt-2">
                  <div className="group-hover:text-antique-gold inline-flex items-center text-white font-display text-[10px] md:text-[11px] uppercase tracking-[0.2em] transition-colors duration-300">
                    <span className="border-b border-transparent group-hover:border-antique-gold pb-1 transition-colors duration-300">
                      Explore the Edit
                    </span>
                    <span 
                      className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 font-sans ml-2 text-sm"
                      style={{ transform: 'translateX(-4px)' }}
                    >
                      <span className="group-hover:translate-x-[4px] block transition-transform duration-300">→</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </motion.section>
  );
}
