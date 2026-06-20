import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Play } from 'lucide-react';

export default function AtelierVideo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section ref={sectionRef} className="relative h-[60vh] md:h-[80vh] w-full bg-obsidian flex items-center justify-center overflow-hidden select-none">
      
      {/* Cinematic Background layer (Slow Pan) */}
      <motion.div
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1.25 }}
        viewport={{ once: true }}
        transition={{ duration: 25, ease: "linear" }}
        style={{ y: yParallax }}
        className="absolute inset-0 z-0 origin-center"
      >
        <img
          src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2000&q=80"
          alt="Atelier Crafting Process"
          className="w-full h-full object-cover opacity-50"
        />
        {/* Deep vignetting overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-obsidian/40 to-obsidian opacity-90" />
      </motion.div>

      {/* Floating Center Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/20 flex items-center justify-center mb-8 backdrop-blur-sm bg-white/5 cursor-pointer hover:bg-white/10 hover:scale-105 transition-all group">
          <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1.5 opacity-80 group-hover:opacity-100 group-hover:text-antique-gold transition-colors" />
        </div>

        <span style={{ fontSize: '11px', fontVariant: 'small-caps', letterSpacing: '0.04em', color: 'var(--antique-gold)', fontWeight: 400 }} className="font-display leading-none block mb-4">
          Inside The Atelier
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-white leading-tight">
          The Art of Precision
        </h2>
      </motion.div>
      
    </section>
  );
}
