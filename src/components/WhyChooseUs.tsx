import React from 'react';
import { motion } from 'motion/react';

export default function WhyChooseUs() {
  const values = [
    {
      title: 'IGI Certified',
      desc: 'Every diamond is meticulously graded and certified for absolute authenticity and uncompromised quality.',
    },
    {
      title: 'Ethical Sourcing',
      desc: 'We trace every stone to conflict-free origins, ensuring responsible luxury that respects humanity and earth.',
    },
    {
      title: 'Handcrafted Excellence',
      desc: 'Master artisans shape each piece by hand, blending heritage techniques with modern structural precision.',
    },
    {
      title: 'Lifetime Support',
      desc: 'A lasting relationship with complimentary cleanings, dedicated servicing, and bespoke advisory for life.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
  };

  return (
    <section className="py-[140px] bg-obsidian border-b border-white/5 relative overflow-hidden">
      {/* Subtle background decorative glimmers */}
      <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-antique-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-blush-rose/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-6 md:px-8 relative z-10"
      >
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Heading */}
          <div className="w-full lg:w-[40%]">
            <motion.div variants={itemVariants} className="space-y-8 lg:sticky lg:top-32">
              <p style={{ fontSize: '10px', fontVariant: 'small-caps', letterSpacing: '0.3em', color: 'var(--color-maison-red)', fontWeight: 500 }} className="font-display select-none uppercase">
                Uncompromising Precision
              </p>
              
              <h3 
                className="font-serif font-light text-[#FAF7F2]" 
                style={{ fontSize: '72px', lineHeight: 0.95 }}
              >
                <span className="block">The</span>
                <span className="block text-antique-gold italic">Maheera</span>
                <span className="block">Standard</span>
              </h3>
            </motion.div>
          </div>

          {/* Right Column: Rows */}
          <div className="w-full lg:w-[60%] mt-8 lg:mt-0">
            <div className="flex flex-col border-t border-white/10">
              {values.map((v, i) => (
                <motion.div 
                  variants={itemVariants} 
                  key={i} 
                  className="grid grid-cols-[80px_1fr] md:grid-cols-[140px_1fr] lg:grid-cols-[200px_1fr] gap-0 border-b border-white/10 py-10 lg:py-12 items-start group"
                >
                  <span className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#C8A96B] opacity-40 group-hover:opacity-100 transition-opacity duration-500 select-none">
                    0{i + 1}
                  </span>
                  <div>
                    <h4 className="font-serif text-2xl lg:text-3xl text-white tracking-wide font-light mb-3 group-hover:text-champagne transition-colors duration-300">
                      {v.title}
                    </h4>
                    <p className="text-[12px] md:text-[13px] text-platinum leading-relaxed font-light font-sans max-w-sm text-left">
                      {v.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
        </div>
      </motion.div>
    </section>
  );
}
