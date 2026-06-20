import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, HeartHandshake, Compass, Sparkles, Gift } from 'lucide-react';

export default function AboutUsPage() {
  const pillars = [
    {
      icon: <Sparkles className="w-5 h-5 text-antique-gold stroke-[1.2]" />,
      title: 'Premium Quality',
      desc: 'Selected through meticulous procedures to ensure unparalleled diamond light brilliance.',
    },
    {
      icon: <Gift className="w-5 h-5 text-antique-gold stroke-[1.2]" />,
      title: 'Elegant Packaging',
      desc: 'Housed in signature velvet keep-safe boxes tailored to raise the emotion of fine unwrapping.',
    },
    {
      icon: <Compass className="w-5 h-5 text-antique-gold stroke-[1.2]" />,
      title: 'Ethical Sourcing',
      desc: '100% GIA verified conflict-free diamonds tracked from pure sustainable origins.',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-antique-gold stroke-[1.2]" />,
      title: 'Personalized Service',
      desc: 'Private consultant support assigned directly to each patron to guide bespoke creation.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-antique-gold stroke-[1.2]" />,
      title: 'Luxury Experience',
      desc: 'From digital drafting to insured secure transport, we preserve seamless elite service.',
    },
  ];

  return (
    <div id="about-page" className="bg-warm-ivory text-obsidian selection:bg-blush-rose min-h-screen pt-[80px] md:pt-[140px] pb-[64px] md:pb-[120px]">
      {/* Hero Section */}
      <section className="relative py-[64px] md:py-[120px] px-6 md:px-8 overflow-hidden text-left max-w-7xl mx-auto">
        {/* Subtle gold ray gradient */}
        <div className="absolute top-0 left-10 w-72 h-72 bg-champagne/10 blur-3D rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 text-left"
        >
          <span className="text-[10px] tracking-[0.4em] text-antique-gold uppercase font-display font-medium block">
            HOUSE MISSION
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-extralight tracking-wide text-obsidian leading-tight text-left">
            Crafting timeless elegance.
          </h1>
          <p className="font-serif text-sm md:text-lg italic text-slate-charcoal max-w-2xl">
            “Where luxury meets emotion and craftsmanship.”
          </p>
          <div className="w-12 h-[1px] bg-champagne ml-0 pt-1" />
        </motion.div>
      </section>

      {/* Visual Banner Split */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 mb-16 md:mb-[120px]">
        <div className="h-[350px] md:h-[480px] rounded-xs overflow-hidden relative shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1600&h=800&q=85"
            alt="Maheera Solitaire Crafting"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-obsidian/10 mix-blend-multiply" />
        </div>
      </section>

      {/* Legacy of Refraction Quote Block */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 mb-16 md:mb-[120px] text-left space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6 text-left"
        >
          <span className="text-[10px] tracking-[0.35em] text-antique-gold font-display uppercase leading-none block">
            A Legacy of Refraction
          </span>
          <h2 className="text-2xl md:text-4xl font-serif italic font-light tracking-wide text-obsidian block leading-snug max-w-3xl text-left">
            “A jewelry masterpiece does not simply reflect light; it encapsulates a lifelong emotional promise, written in Carbon and Platinum.”
          </h2>
          <div className="w-12 h-[1px] bg-champagne ml-0 mt-6" />
          <p className="text-xs tracking-[0.2em] font-display text-antique-gold uppercase">
            — MEHUL SOLANKI, FOUNDER & CHIEF ATELIER
          </p>
        </motion.div>
      </section>

      {/* Our Story Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 mb-16 md:mb-[120px] space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-left"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-obsidian font-light tracking-wide">
            Our Story
          </h2>
          <div className="w-12 h-[1px] bg-champagne ml-0" />
        </motion.div>

        <div className="space-y-6 font-sans text-xs md:text-sm text-gray-600 font-light leading-relaxed text-left max-w-3xl">
          <p>
            Maheera Diamonds was founded by <strong>Mehul Solanki</strong> with a vision to redefine modern luxury jewelry through elegance, craftsmanship, and timeless design. Under his personal artistic direction, each piece undergoes extensive layout refinements.
          </p>
          <p>
            Every piece is carefully curated to celebrate individuality, femininity, and confidence. We believe jewelry should not only elevate style but also hold emotional meaning.
          </p>
          <p>
            Operating exclusively from our flagship boutique in Pune, India, Maheera Diamonds designs for women who appreciate refined beauty, high-caliber traceabilities, and unparalleled brilliance.
          </p>
        </div>
      </section>

      {/* Mission Section Banner */}
      <section className="bg-obsidian text-warm-ivory py-[64px] md:py-[120px] px-6 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(197,160,89,0.08),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto text-left space-y-6 relative z-10 w-full">
          <span style={{ fontSize: '11px', fontVariant: 'small-caps', letterSpacing: '0.04em', color: 'var(--antique-gold)', fontWeight: 400 }} className="font-display uppercase">
            THE PHILOSOPHY
          </span>
          <h3 className="font-serif text-2xl md:text-3xl text-white font-light tracking-wide">
            Our Mission
          </h3>
          <p className="font-serif text-lg md:text-2xl font-light italic text-[#EFE7DD] leading-relaxed max-w-2xl text-left">
            “To create meaningful luxury jewelry that empowers women to express confidence, elegance, and timeless beauty.”
          </p>
          <div className="w-12 h-[1px] bg-antique-gold ml-0" />
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 mb-16 md:mb-[120px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[10px] tracking-[0.3em] text-antique-gold uppercase font-display font-medium block">
              ATELIER DETAIL
            </span>
            <h3 className="font-serif text-3xl md:text-4xl text-obsidian font-light tracking-wide">
              Crafted with precision.
            </h3>
            <p className="font-sans text-xs md:text-sm text-gray-600 font-light leading-relaxed text-justify">
              Each Maheera Diamonds piece reflects exceptional attention to detail, premium craftsmanship, and luxurious finishing.
            </p>
            <div className="pt-4 space-y-4">
              <p className="font-serif text-xs md:text-sm text-obsidian font-medium uppercase tracking-wider">
                We focus on:
              </p>
              <ul className="space-y-2 font-display text-[11px] tracking-wider text-slate-charcoal">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-antique-gold rounded-full shrink-0" />
                  PRECISION DESIGN
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-antique-gold rounded-full shrink-0" />
                  PREMIUM MATERIALS
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-antique-gold rounded-full shrink-0" />
                  TIMELESS AESTHETICS
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-antique-gold rounded-full shrink-0" />
                  MODERN LUXURY APPEAL
                </li>
              </ul>
            </div>
          </div>

          <div className="h-[300px] md:h-[400px] rounded-xs overflow-hidden relative shadow-md">
            <img
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85"
              alt="Diamond Precision Crafting"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Core Excellence Pillars */}
      <section className="bg-blush-rose/20 py-[64px] md:py-[120px] border-t border-b border-blush-rose">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-left mb-16 space-y-4">
            <p style={{ fontSize: '11px', fontVariant: 'small-caps', letterSpacing: '0.04em', color: 'var(--antique-gold)', fontWeight: 400 }} className="font-display select-none">
              GUARANTEED STANDARDS
            </p>
            <h3 className="font-serif text-2xl md:text-3xl text-obsidian font-light tracking-wide">
              Bespoke Pillars
            </h3>
            <div className="w-12 h-[1px] bg-champagne ml-0" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-6 border border-blush-rose bg-white hover:bg-[#EFE7DD]/10 hover:border-champagne transition-all duration-300 flex flex-col justify-between space-y-4 relative group rounded-xs"
              >
                <div className="bg-[#EFE7DD] w-10 h-10 flex items-center justify-center rounded-xs shrink-0">
                  {pillar.icon}
                </div>
                <div className="space-y-2 mt-2">
                  <h4 className="font-serif text-[15px] font-medium tracking-wide text-obsidian">
                    {pillar.title}
                  </h4>
                  <p className="text-[10px] text-slate-charcoal leading-relaxed font-sans">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
