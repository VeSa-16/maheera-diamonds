import { motion } from 'motion/react';
import BrandLogo from './BrandLogo';

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] bg-obsidian flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] bg-antique-gold/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 flex flex-col items-center select-none"
      >
        {/* Brand Logo Component */}
        <div className="scale-125 mb-8">
          <BrandLogo variant="light" className="w-12 h-12" />
        </div>

        {/* Brand Name */}
        <h1 className="font-serif text-3xl tracking-[0.15em] text-[#FAF7F2] font-light mb-2">
          MAHEERA
        </h1>
        <p style={{ fontSize: '11px', letterSpacing: '0.4em' }} className="font-display uppercase text-antique-gold font-medium mb-12">
          Diamonds
        </p>

        {/* Loading Progress Line */}
        <div className="w-32 h-[1px] bg-white/10 relative overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }}
            className="absolute top-0 bottom-0 left-0 w-1/2 bg-antique-gold"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
