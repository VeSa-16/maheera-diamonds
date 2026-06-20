import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Diamond, Sparkles, Droplet, Scale } from 'lucide-react';

const C_DATA = [
  {
    id: 'cut',
    title: 'The Cut',
    icon: <Diamond className="w-5 h-5" />,
    description: "The most critical metric of a diamond's brilliance. Our master artisans enforce a rigorous cut standard that exceeds GIA 'Excellent', ensuring maximum light return and fire.",
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80',
    stats: [
      { label: 'Maheera Standard', value: 'Triple Excellent' },
      { label: 'Light Return', value: '99.8%' }
    ]
  },
  {
    id: 'color',
    title: 'The Color',
    icon: <Droplet className="w-5 h-5" />,
    description: "True luxury is colorless. We source exclusively from the top color grades (D-F), guaranteeing icy, absolute transparency without any yellow hues.",
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    stats: [
      { label: 'Acceptable Range', value: 'D, E, F Only' },
      { label: 'Fluorescence', value: 'None' }
    ]
  },
  {
    id: 'clarity',
    title: 'The Clarity',
    icon: <Sparkles className="w-5 h-5" />,
    description: "Every stone is examined under 10x magnification. We reject diamonds with visible inclusions, selecting only those that are eye-clean to flawless.",
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    stats: [
      { label: 'Minimum Grade', value: 'VS2 or Higher' },
      { label: 'Microscope Test', value: 'Passed' }
    ]
  },
  {
    id: 'carat',
    title: 'The Carat',
    icon: <Scale className="w-5 h-5" />,
    description: "Weight is just a number; visual presence is what matters. Our stones are cut to maximize face-up size, giving you a larger, more impactful appearance per carat.",
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
    stats: [
      { label: 'Face-Up Spread', value: 'Optimized' },
      { label: 'Sourcing Limits', value: 'No Limit' }
    ]
  }
];

export default function Masterclass4C() {
  const [activeTab, setActiveTab] = useState(C_DATA[0].id);

  const activeData = C_DATA.find(c => c.id === activeTab)!;

  return (
    <section className="py-[100px] md:py-[140px] bg-[#0A0804] border-y border-white/5 relative overflow-hidden select-none">
      {/* Background Glow */}
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-antique-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <span style={{ fontSize: '11px', fontVariant: 'small-caps', letterSpacing: '0.04em', color: 'var(--antique-gold)', fontWeight: 400 }} className="font-display leading-none block mb-4">
            The Maheera Masterclass
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-white leading-tight">
            Understanding the 4Cs
          </h2>
        </motion.div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          
          {/* Left: Tab Selection & Text */}
          <div className="w-full lg:w-1/2 space-y-12">
            
            {/* Tabs */}
            <div className="flex justify-between border-b border-white/10 pb-4">
              {C_DATA.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveTab(c.id)}
                  className={`flex flex-col items-center gap-2 sm:gap-3 transition-colors cursor-pointer ${
                    activeTab === c.id ? 'text-antique-gold' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <div className={`p-2 sm:p-3 rounded-full border transition-all ${
                    activeTab === c.id ? 'border-antique-gold bg-antique-gold/10' : 'border-transparent bg-white/5'
                  }`}>
                    {c.icon}
                  </div>
                  <span className="font-display text-[8px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em]">
                    {c.id}
                  </span>
                </button>
              ))}
            </div>

            {/* Dynamic Text Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeData.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <h3 className="font-serif text-4xl text-white font-light">
                  {activeData.title}
                </h3>
                <p className="text-gray-400 font-sans font-light leading-relaxed text-sm max-w-md">
                  {activeData.description}
                </p>

                <div className="grid grid-cols-2 gap-8 pt-4">
                  {activeData.stats.map((stat, idx) => (
                    <div key={idx} className="space-y-2">
                      <span className="block font-display text-[9px] uppercase tracking-widest text-antique-gold">
                        {stat.label}
                      </span>
                      <span className="block font-serif text-lg text-white">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Visual Image */}
          <div className="w-full lg:w-1/2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeData.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="aspect-[4/5] md:aspect-square w-full rounded-xs overflow-hidden border border-white/10 relative"
              >
                <img
                  src={activeData.image}
                  alt={activeData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0804] via-transparent to-transparent opacity-60" />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
