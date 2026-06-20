import { useState } from 'react';
import { X, Trash2, ShieldCheck, Truck, RotateCcw, Loader2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string, isCustomRing?: boolean) => void;
  onCheckout: () => Promise<void> | void;
}

export default function CartOverlay({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onCheckout,
}: CartOverlayProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-obsidian/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w- mx-auto flex">
        {/* Sliding card panel */}
        <div className="w-screen max-w- mx-auto bg-warm-ivory border-l border-blush-rose flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-blush-rose flex justify-between items-center bg-blush-rose/20">
            <div>
              <h2 className="font-serif text-xl tracking-wider text-obsidian uppercase font-light">
                Your Vault Collection
              </h2>
              <p className="text-[10px] text-antique-gold font-display tracking-widest block uppercase mt-0.5">
                {cartItems.length} curated {cartItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-obsidian transition-colors hover:scale-105"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Cart Content body list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-start justify-center text-center px-4">
                <p className="font-serif text-lg text-gray-400 italic mb-3 text-center">Your Maheera vault is empty...</p>
                <p className="text-xs text-gray-400 font-light leading-relaxed max-w- mx-auto text-center">
                  Begin your romantic journey by exploring our crafted collections or designing a bespoke gemstone masterpiece.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 bg-obsidian text-warm-ivory text-[10px] font-display tracking-widest hover:bg-[#1f1f1f] transition-all"
                >
                  RETURN TO GALLERY
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex text-xs space-x-4 border-b border-blush-rose pb-6 last:border-0 last:pb-0 relative group"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 bg-blush-rose relative overflow-hidden flex-shrink-0 border border-blush-rose rounded-xs">
                      {item.isCustomRing ? (
                        <div className="w-full h-full flex items-center justify-center bg-blush-rose font-serif text-[40px] select-none text-antique-gold">
                          💍
                        </div>
                      ) : (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>

                    {/* Meta Specifications */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1 pr-6">
                        <h4 className="font-serif text-[13px] text-obsidian tracking-wide font-medium">
                          {item.name}
                        </h4>

                        {item.isCustomRing && item.customConfig ? (
                          <div className="text-[10px] text-slate-charcoal space-y-0.5 leading-relaxed font-sans">
                            <p className="text-antique-gold font-display uppercase tracking-widest text-[9px]">Bespoke Creation</p>
                            <p>Shape: <span className="font-medium text-obsidian uppercase">{item.customConfig.shape}</span></p>
                            <p>Metal: <span className="font-medium text-obsidian">{item.customConfig.metal}</span></p>
                            <p>Setting: <span className="font-medium text-obsidian">{item.customConfig.setting}</span></p>
                            <p>Carat size: <span className="font-medium text-obsidian">{item.customConfig.carat} ct</span> ({item.customConfig.clarity}, {item.customConfig.colorGrade} Color)</p>
                          </div>
                        ) : (
                          <p className="text-[10px] text-gray-400 font-display uppercase tracking-wider">
                            {item.details?.[0] || 'Handcrafted Fine Gemstone'}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <p className="font-display text-xs text-obsidian font-medium">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>

                    {/* Delete item button */}
                    <button
                      onClick={() => onRemoveItem(item.id, item.isCustomRing)}
                      className="absolute top-0 right-0 text-gray-300 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4 stroke-[1.2]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Summary Bar */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-blush-rose/30 border-t border-blush-rose space-y-6">
              {/* Premium Perks Info lines */}
              <div className="space-y-2 border-b border-blush-rose/60 pb-4 text-[10px] text-slate-charcoal">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-antique-gold" />
                  <span>Complimentary armored shipping & fast delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-antique-gold" />
                  <span>Fully insured GIA certified stones with lifetime warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-antique-gold" />
                  <span>Complimentary 30-day returns and custom size tailoring</span>
                </div>
              </div>

              {/* Math lines */}
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs text-slate-charcoal">
                  <span className="font-display uppercase tracking-wider">Estimated Vault Value</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-charcoal">
                  <span className="font-display uppercase tracking-wider">Bespoke Insured Transport</span>
                  <span className="text-antique-gold font-display tracking-wide text-[10px] uppercase">Complimentary</span>
                </div>
                <div className="flex justify-between text-sm text-obsidian pt-2.5 border-t border-blush-rose font-medium">
                  <span className="font-serif tracking-wide">GRAND TOTAL</span>
                  <span className="font-display font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action checkout buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={async () => {
                    setIsProcessing(true);
                    try {
                      await onCheckout();
                    } finally {
                      setIsProcessing(false);
                    }
                  }}
                  disabled={isProcessing}
                  className="w-full py-4.5 bg-obsidian text-warm-ivory font-display text-xs tracking-widest hover:bg-[#1a1a1a] transition-all hover:shadow-md cursor-pointer uppercase font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> SECURING VAULT...</> : 'CONTINUE TO PRIVATE BILLING'}
                </button>
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="w-full text-center py-2 text-[10px] text-gray-400 font-display tracking-widest hover:text-antique-gold transition-colors uppercase cursor-pointer disabled:opacity-50"
                >
                  Resume Boutique Browsing
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
