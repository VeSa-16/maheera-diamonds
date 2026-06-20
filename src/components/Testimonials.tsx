import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const TESTIMONIALS_DATA = [
  {
    quote: "The Elysian Solitaire is everything I dreamed of. The craftsmanship is unlike anything I found at other jewellers in the city.",
    author: "PRIYA MALHOTRA",
    source: "Mumbai, Maharashtra",
  },
  {
    quote: "I commissioned a bespoke ring for our anniversary. The process was seamless — one consultation, and they understood exactly what I envisioned.",
    author: "ARJUN SINGHANIA",
    source: "New Delhi",
  },
  {
    quote: "The quality of the certification documentation, the packaging, the stone — every detail felt considered. Maheera is the only jeweller I will return to.",
    author: "KAVYA RAO",
    source: "Bengaluru, Karnataka",
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="pt-[64px] md:pt-[120px] pb-[64px] md:pb-[120px] bg-warm-ivory border-b border-blush-rose relative overflow-hidden select-none">
      
      {/* Decorative vector background lines */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-blush-rose/30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
        
        {/* Title Block */}
        <div className="text-center space-y-3 mb-12">
          <p style={{ fontSize: '11px', fontVariant: 'small-caps', letterSpacing: '0.04em', color: 'var(--antique-gold)', fontWeight: 400 }} className="font-display select-none">
            Heritage Stories
          </p>
          <h3 className="font-serif text-2xl md:text-4xl text-obsidian font-light tracking-wide leading-none">
            Loved by women who wear confidence.
          </h3>
        </div>

        {/* Emotion quotation crossfade container */}
        <div className="relative min-h-[220px] md:min-h-[180px]">
          {TESTIMONIALS_DATA.map((testimonial, idx) => (
            <div 
              key={idx} 
              className={`absolute inset-0 flex flex-col justify-start transition-opacity duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                activeIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <p className="font-serif text-xl md:text-[28px] italic font-light tracking-wide text-obsidian leading-relaxed max-w- mx-auto text-center mb-8">
                {testimonial.quote}
              </p>

              {/* Author details */}
              <div className="space-y-1 text-center mt-auto">
                <h5 className="font-display text-[10px] md:text-xs tracking-[0.3em] font-medium text-obsidian uppercase">
                  {testimonial.author}
                </h5>
                <span className="font-serif text-xs text-antique-gold italic block">
                  — {testimonial.source}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel dot controls */}
        <div className="flex justify-start items-center space-x-3 mt-10 md:mt-8 relative z-20">
          {TESTIMONIALS_DATA.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer ${
                activeIndex === idx ? 'w-6 bg-antique-gold' : 'w-1.5 bg-champagne hover:bg-antique-gold/50'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

        </motion.div>
      </div>
    </section>
  );
}
