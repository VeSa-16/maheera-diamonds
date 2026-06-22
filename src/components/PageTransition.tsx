import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

export default function PageTransition({ children, locationKey }: { children: React.ReactNode, locationKey: string }) {
  // We use AnimatePresence with mode="wait" in App.tsx.
  // This component handles the exit animation (curtain closing) and enter animation (curtain opening).

  return (
    <>
      <motion.div
        key={locationKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        className="w-full h-full"
      >
        {children}
      </motion.div>

      {/* The Curtain Overlay (enters from bottom, exits to top) */}
      <motion.div
        key={`curtain-${locationKey}`}
        initial={{ top: '100%' }}
        animate={{ top: '100%' }}
        exit={{ top: '0%' }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-[9000] bg-obsidian border-t border-antique-gold/30 flex items-center justify-center pointer-events-none"
      >
        <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-antique-gold to-transparent" />
      </motion.div>
      
      {/* The Un-Curtain (reveals new page by sliding up) */}
      <motion.div
        key={`reveal-${locationKey}`}
        initial={{ top: '0%' }}
        animate={{ top: '-100%' }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
        className="fixed inset-0 z-[8999] bg-obsidian border-b border-antique-gold/30 flex items-center justify-center pointer-events-none"
      />
    </>
  );
}
