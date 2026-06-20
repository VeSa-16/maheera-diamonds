import React from 'react';
import { Gem } from 'lucide-react';

interface BrandLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
  goldGradientId?: string;
}

export default function BrandLogo({
  className = '',
  size = 40,
  showText = false,
  textColor = 'text-obsidian',
  goldGradientId = 'luxuryGoldGrad'
}: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Elegant, fully responsive vector Gem icon instead of image logo */}
      <div className="flex items-center justify-center text-antique-gold transition-transform duration-500 hover:rotate-12 shrink-0">
        <Gem style={{ width: Math.max(16, size - 12), height: Math.max(16, size - 12) }} className="stroke-[1.2]" />
      </div>

      {showText && (
        <div className="flex flex-col select-none text-center">
          <span 
            className={`font-serif tracking-[0.2em] font-normal leading-none ${textColor}`}
            style={{ fontSize: `${Math.max(11, (size - 10) * 0.45)}px` }}
          >
            MAHEERA
          </span>
          <span 
            className="font-display tracking-[0.4em] text-antique-gold font-medium leading-none block mt-1"
            style={{ fontSize: `${Math.max(6, (size - 10) * 0.2)}px` }}
          >
            DIAMONDS
          </span>
        </div>
      )}
    </div>
  );
}

