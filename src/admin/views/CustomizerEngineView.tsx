import React from 'react';
import DiamondCustomizer from '../../components/DiamondCustomizer';

interface CustomizerEngineViewProps {
  theme: 'dark' | 'light';
}

export default function CustomizerEngineView({ theme }: CustomizerEngineViewProps) {
  const isDark = theme === 'dark';

  const handleAdminBespokeCreate = (config: any, finalPrice: number) => {
    alert(`Admin Override: Bespoke design created with price ₹${finalPrice.toLocaleString('en-IN')}.\nShape: ${config.shape}, Metal: ${config.metal}`);
  };

  return (
    <div className={`rounded-xl border shadow-sm overflow-hidden ${
      isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/5'
    }`}>
      <div className={`p-6 border-b ${
        isDark ? 'border-white/10' : 'border-black/5'
      }`}>
        <h2 className={`font-serif text-xl ${
          isDark ? 'text-white' : 'text-obsidian'
        }`}>
          Bespoke Engine Testing Environment
        </h2>
        <p className={`text-sm mt-1 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Use this module to test the live 3D customizer pricing logic and geometry exactly as it appears to end-users. 
          Adding to vault will trigger an admin alert instead of modifying a cart.
        </p>
      </div>
      
      {/* 
        The DiamondCustomizer has its own background colors that fit a dark theme. 
        We render it within a full-width container. 
      */}
      <div className="w-full">
        <DiamondCustomizer onAddCustomToCart={handleAdminBespokeCreate} />
      </div>
    </div>
  );
}
