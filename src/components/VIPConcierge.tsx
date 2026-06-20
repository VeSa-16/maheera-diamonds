import { motion } from 'motion/react';
import { ShieldCheck, Plane, Glasses } from 'lucide-react';
import MagneticButton from './MagneticButton';

export default function VIPConcierge({ onOpenBooking }: { onOpenBooking: () => void }) {
  return (
    <section className="py-16 md:py-24 bg-[#0A0804] border-t border-white/5 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Text & CTA */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <span style={{ fontSize: '11px', fontVariant: 'small-caps', letterSpacing: '0.04em', color: 'var(--antique-gold)', fontWeight: 400 }} className="font-display leading-none block">
              Private Advisory
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-white leading-tight">
              The Maheera Concierge
            </h2>
            <p className="text-gray-400 font-sans font-light text-sm leading-relaxed max-w- mx-auto">
              For high-net-worth acquisitions and bespoke commissions, our private concierge handles everything from secure transport to private viewing sessions in your preferred location.
            </p>

            <MagneticButton>
              <button
                onClick={onOpenBooking}
                className="font-display transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase rounded-none hover:bg-white/10"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#FAF7F2',
                  padding: '16px 44px',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  fontWeight: 500
                }}
              >
                Request Private Viewing
              </button>
            </MagneticButton>
          </motion.div>

          {/* Right: Service Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
            {[
              { icon: <ShieldCheck className="w-5 h-5" />, title: 'Secure Vaulting', desc: 'Insured storage prior to final delivery.' },
              { icon: <Plane className="w-5 h-5" />, title: 'Global Delivery', desc: 'Armored transport to global locations.' },
              { icon: <Glasses className="w-5 h-5" />, title: 'Gemology Advisory', desc: '1-on-1 portfolio consultation.' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className="space-y-3"
              >
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-antique-gold bg-white/5">
                  {feature.icon}
                </div>
                <h4 className="font-serif text-lg text-white">{feature.title}</h4>
                <p className="font-sans text-[11px] text-gray-500 leading-relaxed max-w- mx-auto">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
