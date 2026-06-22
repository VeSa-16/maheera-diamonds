import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import BrandLogo from './BrandLogo';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const duration = 2000;
    const interval = 20;
    let timePassed = 0;

    const timer = setInterval(() => {
      timePassed += interval;
      const newProgress = Math.min((timePassed / duration) * 100, 100);
      setProgress(newProgress);

      if (timePassed >= duration) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      className="fixed inset-0 z-[100] bg-obsidian flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-antique-gold/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center select-none w-full max-w-sm px-6"
      >
        {/* Brand Logo Reveal */}
        <div className="overflow-hidden mb-10">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="scale-125"
          >
            <BrandLogo variant="light" className="w-16 h-16" />
          </motion.div>
        </div>

        {/* Brand Name Typography */}
        <div className="overflow-hidden mb-2">
          <motion.h1 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="font-serif text-3xl tracking-[0.2em] text-warm-ivory font-light text-center"
          >
            MAHEERA
          </motion.h1>
        </div>

        {/* Subtitle Typography */}
        <div className="overflow-hidden mb-14">
          <motion.p 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            style={{ fontSize: '10px', letterSpacing: '0.4em' }} 
            className="font-display uppercase text-antique-gold font-medium"
          >
            Le Savoir-Faire
          </motion.p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-full flex flex-col items-center gap-4">
          {/* Percentage text */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-display text-[9px] text-warm-ivory/50 tracking-widest tabular-nums"
          >
            {Math.floor(progress)}%
          </motion.div>
          
          {/* Progress track */}
          <div className="w-full max-w-[200px] h-[1px] bg-white/10 relative overflow-hidden rounded-full">
            <motion.div 
              style={{ width: `${progress}%` }}
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-antique-gold/40 to-antique-gold"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
