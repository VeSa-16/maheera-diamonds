import { motion } from 'motion/react';
import { Pencil, FileCheck, Hammer, Gift } from 'lucide-react';

const TIMELINE_STEPS = [
  {
    icon: <Pencil className="w-6 h-6" />,
    title: 'The Consultation',
    desc: 'We discuss your vision, inspect loose diamonds, and sketch initial architectural concepts.',
    delay: 0.1
  },
  {
    icon: <FileCheck className="w-6 h-6" />,
    title: '3D Render & Wax',
    desc: 'You receive a photorealistic render and a physical wax model to try on before metal casting.',
    delay: 0.3
  },
  {
    icon: <Hammer className="w-6 h-6" />,
    title: 'Master Crafting',
    desc: 'Our artisans cast the gold or platinum, hand-set the stones, and execute microscopic polishing.',
    delay: 0.5
  },
  {
    icon: <Gift className="w-6 h-6" />,
    title: 'The Presentation',
    desc: 'Your bespoke piece is presented in our signature lacquered box with its GIA dossier.',
    delay: 0.7
  }
];

export default function BespokeTimeline() {
  return (
    <section className="py-[100px] md:py-[140px] bg-obsidian border-y border-white/5 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Header Block */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 max-w-2xl mx-auto"
        >
          <span style={{ fontSize: '11px', fontVariant: 'small-caps', letterSpacing: '0.04em', color: 'var(--antique-gold)', fontWeight: 400 }} className="font-display leading-none block mb-4">
            The Commission Journey
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-white leading-tight mb-6">
            From Vision to Heirloom
          </h2>
          <p className="text-gray-400 font-sans font-light text-sm leading-relaxed">
            Every bespoke creation follows a meticulous four-stage journey, ensuring absolute precision and a deeply personal experience.
          </p>
        </motion.div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative">
          
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {TIMELINE_STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: step.delay }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step Number Background */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-serif text-[120px] leading-none text-white/[0.02] pointer-events-none select-none z-0">
                {idx + 1}
              </div>

              {/* Icon */}
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-antique-gold mb-8 relative z-10">
                {step.icon}
              </div>

              {/* Text */}
              <h4 className="font-serif text-xl text-white tracking-wide mb-3 relative z-10">
                {step.title}
              </h4>
              <p className="text-gray-400 font-sans text-xs leading-relaxed max-w-[240px] relative z-10">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
