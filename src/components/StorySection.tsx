import { motion } from 'motion/react';

export default function StorySection() {
  return (
    <section id="story" className="py-16 md:py-24 bg-warm-ivory text-obsidian relative overflow-hidden">
      
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Asymmetrical Editorial Layout */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-16 lg:gap-32">
          
          {/* Left Column: Massive Portrait Image */}
          <motion.div 
            initial={{ opacity: 0, clipPath: 'inset(10% 0 10% 0)' }}
            whileInView={{ opacity: 1, clipPath: 'inset(0% 0 0% 0)' }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-5/12 aspect-[3/4] lg:aspect-[4/5] relative overflow-hidden"
          >
            <img 
              src="https://images.unsplash.com/photo-1596515438870-745d16a503fc?auto=format&fit=crop&w=1200&q=90" 
              alt="Diamond craftsmanship" 
              className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000"
            />
            {/* Subtle maison red overlay line */}
            <div className="absolute top-0 right-0 w-[1px] h-full bg-[#6A0A18]/30" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#6A0A18]/30" />
          </motion.div>

          {/* Right Column: High-end Minimalist Copy */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-6/12 flex flex-col justify-center lg:pt-24"
          >
            <div className="space-y-12 max-w-lg">
              
              <div className="space-y-4">
                <span 
                  style={{ letterSpacing: '0.4em' }} 
                  className="font-display text-[9px] uppercase text-[#6A0A18] font-medium block"
                >
                  La Maison
                </span>
                
                <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] text-obsidian">
                  A Legacy of <br/><span className="italic text-gray-500">Excellence.</span>
                </h3>
              </div>
              
              <div className="space-y-8">
                <p className="font-serif text-sm md:text-base text-slate-charcoal leading-loose font-light">
                  For nearly a century, Maheera has pursued the extraordinary. Every creation is an intimate dialogue between master artisans and the earth’s most precious elements. We do not simply craft jewelry; we architect emotions, forging pieces that transcend time.
                </p>

                <p className="font-serif text-sm md:text-base text-slate-charcoal leading-loose font-light">
                  Our commitment to uncompromising quality means that only the most exceptional, conflict-free diamonds are selected. GIA certified. Ethically sourced. Unmistakably brilliant.
                </p>
              </div>

              {/* Signature Line */}
              <div className="pt-8">
                <p 
                  style={{ letterSpacing: '0.3em' }} 
                  className="font-display text-[9px] uppercase text-gray-400 font-medium"
                >
                  Flagship Atelier
                </p>
                <p className="font-serif italic text-lg text-obsidian mt-2">
                  Pune, India
                </p>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
