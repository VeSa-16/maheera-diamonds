import { useState, useMemo } from 'react';
import { Sparkles, ShieldAlert, Award, ChevronRight, Check, MessageCircle } from 'lucide-react';
import { CustomRingConfiguration, DiamondShapeType, MetalType, SettingType } from '../types';
import { DIAMOND_SHAPES, METALS, SETTINGS, CLARITY_LEVELS, COLOR_GRADES } from '../data';
import InquiryModal from './InquiryModal';
import ThreeRingViewer from './ThreeRingViewer';

interface DiamondCustomizerProps {
  onAddCustomToCart: (config: CustomRingConfiguration, finalPrice: number) => void;
}

export default function DiamondCustomizer({ onAddCustomToCart }: DiamondCustomizerProps) {
  const [config, setConfig] = useState<CustomRingConfiguration>({
    shape: 'round',
    metal: 'platinum',
    setting: 'solitaire',
    carat: 1.5,
    clarity: 'VS1',
    colorGrade: 'F',
    engraving: '',
    engravingFont: 'serif',
  });

  const [activeTab, setActiveTab] = useState<'shape' | 'metal' | 'setting' | 'quality' | 'engraving'>('shape');

  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  // Find active configurations
  const activeShape = useMemo(() => DIAMOND_SHAPES.find((s) => s.id === config.shape)!, [config.shape]);
  const activeMetal = useMemo(() => METALS.find((m) => m.id === config.metal)!, [config.metal]);
  const activeSetting = useMemo(() => SETTINGS.find((s) => s.id === config.setting)!, [config.setting]);
  const activeClarity = useMemo(() => CLARITY_LEVELS.find((c) => c.level === config.clarity)!, [config.clarity]);
  const activeColor = useMemo(() => COLOR_GRADES.find((color) => color.grade === config.colorGrade)!, [config.colorGrade]);

  // Pricing math using actual luxury components
  const calculatedPrice = useMemo(() => {
    const baseStoneCost = 2500; // base diamond per carat cost
    const caratFactor = Math.pow(config.carat, 1.6); // exponential pricing for larger diamond carat weights
    const shapeMultiplier = activeShape.basePriceMultiplier;
    const settingCost = activeSetting.basePrice;
    const metalPriceDelta = activeMetal.priceDelta;
    const clarityMultiplier = activeClarity.priceMultiplier;
    const colorMultiplier = activeColor.priceMultiplier;

    const rawDiamondCost = baseStoneCost * caratFactor * shapeMultiplier * clarityMultiplier * colorMultiplier;
    const finalPrice = Math.round(rawDiamondCost + settingCost + metalPriceDelta);

    return finalPrice;
  }, [config, activeShape, activeMetal, activeSetting, activeClarity, activeColor]);



  const renderShapeIcon = (shapeId: string, isSelected: boolean) => {
    const strokeColor = isSelected ? '#C9A84C' : 'rgba(250,247,242,0.6)';
    const props = { stroke: strokeColor, strokeWidth: "1.5", fill: "none", className: "transition-colors duration-300" };
    switch (shapeId) {
      case 'round':
        return (
          <svg viewBox="0 0 36 36" width="36" height="36" {...props}>
            <circle cx="18" cy="18" r="14" />
            <line x1="18" y1="4" x2="18" y2="32" />
            <line x1="4" y1="18" x2="32" y2="18" />
            <line x1="8" y1="8" x2="28" y2="28" />
            <line x1="8" y1="28" x2="28" y2="8" />
          </svg>
        );
      case 'oval':
        return (
          <svg viewBox="0 0 36 36" width="36" height="36" {...props}>
            <ellipse cx="18" cy="18" rx="10" ry="15" />
            <line x1="18" y1="3" x2="18" y2="33" />
            <line x1="8" y1="18" x2="28" y2="18" />
          </svg>
        );
      case 'emerald':
        return (
          <svg viewBox="0 0 36 36" width="36" height="36" {...props}>
            <rect x="10" y="6" width="16" height="24" />
            <rect x="14" y="10" width="8" height="16" />
            <line x1="10" y1="6" x2="14" y2="10" />
            <line x1="26" y1="6" x2="22" y2="10" />
            <line x1="10" y1="30" x2="14" y2="26" />
            <line x1="26" y1="30" x2="22" y2="26" />
          </svg>
        );
      case 'princess':
        return (
          <svg viewBox="0 0 36 36" width="36" height="36" {...props}>
            <rect x="8" y="8" width="20" height="20" />
            <rect x="12" y="12" width="12" height="12" />
            <line x1="8" y1="8" x2="28" y2="28" />
            <line x1="8" y1="28" x2="28" y2="8" />
          </svg>
        );
      case 'cushion':
        return (
          <svg viewBox="0 0 36 36" width="36" height="36" {...props}>
            <rect x="6" y="6" width="24" height="24" rx="8" />
            <rect x="12" y="12" width="12" height="12" rx="4" />
            <line x1="8" y1="8" x2="14" y2="14" />
            <line x1="28" y1="8" x2="22" y2="14" />
            <line x1="8" y1="28" x2="14" y2="22" />
            <line x1="28" y1="28" x2="22" y2="22" />
          </svg>
        );
      default:
        return <svg viewBox="0 0 36 36" width="36" height="36" {...props}><circle cx="18" cy="18" r="14" /></svg>;
    }
  };

  return (
    <section id="customizer" className="py-16 md:py-24 bg-obsidian border-b border-white/5 text-white relative overflow-hidden">
      {/* Background glimmers for three-dimensional visual depth */}
      <div className="absolute top-[20%] left-[-10%] w-[35%] h-[35%] bg-antique-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Title Group */}
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.34em] text-antique-gold uppercase font-display mb-3">
            The Virtual Atelier
          </p>
          <h3 className="font-serif text-3xl md:text-5xl text-white font-light tracking-wide">
            Design Your Bespoke Vow
          </h3>
          <div className="w-12 h-[1px] bg-antique-gold ml-0 mt-6 mb-4" />
          <p className="max-w- mx-auto text-xs text-stone-300 leading-relaxed font-light">
            Every gemstone masterpiece is engineered upon your desire. Choose our settings, fine-tune the carat, metal, and clarity, and witness your crown animate instantly.
          </p>
        </div>

        {/* Master Interactive Columns layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Realistic Interactive Ring/Diamond Preview Frame */}
          <div className="lg:col-span-5 h-[480px] md:h-[550px] bg-white/5 rounded-xs border border-white/10 flex flex-col justify-between p-8 relative overflow-hidden group">
            
            {/* Absolute Brand background watermarks */}
            <div className="absolute top-8 left-8 text-center select-none opacity-20">
              <span className="font-serif text-xs text-antique-gold block tracking-widest font-light">MAHEERA</span>
              <span className="font-display text-[7px] text-antique-gold block tracking-widest font-extralight uppercase">BESPOKE CHASSIS</span>
            </div>

            <div className="absolute top-8 right-8 text-right flex items-center gap-1 bg-white px-3 py-1 border border-champagne/50">
              <Award className="w-3.5 h-3.5 text-antique-gold" />
              <span className="font-display text-[8px] text-obsidian tracking-widest font-medium uppercase">GIA Verified</span>
            </div>

            <div className="flex-1 w-full h-full relative z-20 mt-8">
              <ThreeRingViewer
                metalColor={activeMetal.bgHex || '#d4af37'}
                diamondShape={config.shape}
                caratSize={config.carat}
                settingType={config.setting}
                engraving={config.engraving}
              />
            </div>

            {/* Bottom: Interactive price and quick features summary specs */}
            <div className="text-center space-y-2 relative z-30 pt-4 border-t border-white/5 bg-transparent p-4">
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '10px', letterSpacing: '0.14em', color: 'rgba(250,247,242,0.4)', textTransform: 'uppercase' }} className="block">
                ESTIMATED CRAFT PRICE
              </span>
              <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '36px', fontWeight: 300, color: '#FAF7F2' }} className="leading-none">
                ₹{calculatedPrice.toLocaleString('en-IN')}
              </p>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: 'rgba(201,168,76,0.7)' }}>
                {config.carat.toFixed(2)} Carat {activeShape.name} • {activeMetal.name} • {activeSetting.name}
              </p>
            </div>

          </div>

          {/* Right Column: Customizer selection parameters controls */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Tabs for choosing sections */}
            <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar">
              {(['shape', 'metal', 'setting', 'quality', 'engraving'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 py-4 uppercase cursor-pointer text-center shrink-0 transition-all duration-300 min-w-[80px]"
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    color: activeTab === tab ? 'var(--antique-gold)' : 'rgba(250,247,242,0.4)',
                    borderBottom: activeTab === tab ? '1.5px solid var(--antique-gold)' : 'none'
                  }}
                >
                  0{['shape', 'metal', 'setting', 'quality', 'engraving'].indexOf(tab) + 1} {tab === 'quality' ? 'Grades' : tab}
                </button>
              ))}
            </div>

            {/* Active Control Panels */}
            <div className="min-h-[280px]">
              {/* TAB 1: Shape Choice */}
              {activeTab === 'shape' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-serif text-[18px] text-antique-gold">01</span>
                    <h4 className="font-serif text-[15px] font-medium text-white uppercase tracking-wider">Select Center Diamond Shape</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-5 gap-3">
                    {DIAMOND_SHAPES.map((shape) => {
                      const isSelected = config.shape === shape.id;
                      return (
                        <button
                          key={shape.id}
                          onClick={() => setConfig({ ...config, shape: shape.id })}
                          className="flex flex-col items-center justify-center gap-3 p-4 transition-all duration-300 rounded-none h-32 cursor-pointer border border-transparent"
                          style={{
                            background: isSelected ? 'rgba(201,168,76,0.12)' : 'rgba(250,247,242,0.04)'
                          }}
                        >
                          {renderShapeIcon(shape.id, isSelected)}
                          <span style={{ color: isSelected ? '#C9A84C' : 'rgba(250,247,242,0.6)' }} className="font-display text-[9px] tracking-wider uppercase text-center font-medium">
                            {shape.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed font-light bg-white/5 border border-white/10 mt-4 rounded-xs p-4">
                    {activeShape.description}
                  </p>
                </div>
              )}

              {/* TAB 2: Metal Options */}
              {activeTab === 'metal' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-serif text-[18px] text-antique-gold">02</span>
                    <h4 className="font-serif text-[15px] font-medium text-white uppercase tracking-wider">Select Precious Metal Chassis</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {METALS.map((metal) => (
                      <button
                        key={metal.id}
                        onClick={() => setConfig({ ...config, metal: metal.id })}
                        className={`p-5 text-center border rounded-xs transition-all duration-300 flex items-center space-x-4 cursor-pointer ${
                          config.metal === metal.id
                            ? 'border-antique-gold bg-white/10 shadow-md ring-1 ring-antique-gold text-white'
                            : 'border-white/10 hover:border-antique-gold/50 bg-white/5 text-stone-300'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full border border-gray-300 shrink-0 shadow-xs ${metal.colorClass}`} />
                        <div>
                          <p className="font-display text-[11px] tracking-wide text-white uppercase font-medium">
                            {metal.name}
                          </p>
                          <p className="text-[10px] text-antique-gold font-mono mt-0.5">
                            {metal.priceDelta > 0 ? `+₹${metal.priceDelta.toLocaleString('en-IN')}` : 'Included'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed font-light bg-white/5 border border-white/10 mt-4 rounded-xs p-4">
                    {activeMetal.description}
                  </p>
                </div>
              )}

              {/* TAB 3: Setting Types */}
              {activeTab === 'setting' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-serif text-[18px] text-antique-gold">03</span>
                    <h4 className="font-serif text-[15px] font-medium text-white uppercase tracking-wider">Select Diamond Setting Frame</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {SETTINGS.map((setting) => (
                      <button
                        key={setting.id}
                        onClick={() => setConfig({ ...config, setting: setting.id })}
                        className={`p-4 border text-center rounded-xs transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                          config.setting === setting.id
                            ? 'border-antique-gold bg-white/10 shadow-md ring-1 ring-antique-gold text-white'
                            : 'border-white/10 hover:border-antique-gold/50 bg-white/5 text-stone-300'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <p className="font-display text-[11px] tracking-widest text-white uppercase font-medium">
                            {setting.name}
                          </p>
                          <span className="font-sans text-xs text-champagne font-medium bg-white/5 px-2 py-0.5 border border-white/10">
                            ₹{setting.basePrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-charcoal font-light leading-relaxed mt-2.5">
                          {setting.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Advanced Carat and Grades */}
              {activeTab === 'quality' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif text-[18px] text-antique-gold">04</span>
                    <h4 className="font-serif text-[15px] font-medium text-white uppercase tracking-wider">Configure Carat and Gemstone Clarity</h4>
                  </div>

                  {/* CARAT SIZE SLIDER */}
                  <div className="space-y-2 bg-white/5 p-4 border border-white/10 rounded-xs">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-display text-[10px] tracking-widest text-[#C8A96B] uppercase">
                        CARAT SIZE INDICATION
                      </span>
                      <span className="font-display font-medium text-white text-sm bg-white/5 px-2.5 py-0.5 rounded-xs border border-white/10">
                        {config.carat.toFixed(2)} CT
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0.5"
                      max="4.0"
                      step="0.05"
                      value={config.carat}
                      onChange={(e) => setConfig({ ...config, carat: parseFloat(e.target.value) })}
                      className="w-full accent-antique-gold cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                    />

                    <div className="flex justify-between text-[9px] text-slate-charcoal uppercase font-display leading-none mt-1">
                      <span>0.50 ct (Delicate)</span>
                      <span>2.00 ct (Grand)</span>
                      <span>4.00 ct (Monumental)</span>
                    </div>
                  </div>

                  {/* DOUBLE COLUMNS CLARITY & COLOR */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Diamond Clarity Selector */}
                    <div className="space-y-2">
                      <span className="block text-[10px] uppercase font-display tracking-widest text-slate-charcoal">
                        CLARITY (GIA STANDARD)
                      </span>
                      <select
                        value={config.clarity}
                        onChange={(e) => setConfig({ ...config, clarity: e.target.value })}
                        className="w-full bg-obsidian border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-antique-gold rounded-xs block"
                      >
                        {CLARITY_LEVELS.map((c) => (
                          <option key={c.level} value={c.level} className="bg-obsidian text-white">
                            {c.level} — Multiplier {c.priceMultiplier}x
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-charcoal leading-normal font-light">
                        {activeClarity.description}
                      </p>
                    </div>

                    {/* Diamond Color Selector */}
                    <div className="space-y-2">
                      <span className="block text-[10px] uppercase font-display tracking-widest text-slate-charcoal">
                        COLOR GRADE (GIA CHROMATIC)
                      </span>
                      <select
                        value={config.colorGrade}
                        onChange={(e) => setConfig({ ...config, colorGrade: e.target.value })}
                        className="w-full bg-obsidian border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-antique-gold rounded-xs block"
                      >
                        {COLOR_GRADES.map((color) => (
                          <option key={color.grade} value={color.grade} className="bg-obsidian text-white">
                            {color.grade} — {color.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-charcoal leading-normal font-light">
                        {activeColor.description}
                      </p>
                    </div>

                  </div>

                </div>
              )}
              {/* TAB 5: Engraving */}
              {activeTab === 'engraving' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-serif text-[18px] text-antique-gold">05</span>
                    <h4 className="font-serif text-[15px] font-medium text-white uppercase tracking-wider">Personalize with Engraving</h4>
                  </div>
                  
                  <p className="text-xs text-stone-300 leading-relaxed font-light">
                    Immortalize your milestone. We offer complimentary laser engraving on the interior of your bespoke chassis.
                  </p>

                  <div className="space-y-4 bg-white/5 p-6 border border-white/10 rounded-xs">
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-display tracking-widest text-slate-charcoal">
                        ENGRAVING MESSAGE (MAX 20 CHARS)
                      </label>
                      <input
                        type="text"
                        maxLength={20}
                        value={config.engraving || ''}
                        onChange={(e) => setConfig({ ...config, engraving: e.target.value })}
                        placeholder="e.g. FOREVER YOURS"
                        className="w-full bg-transparent border-b border-white/20 p-2 text-white focus:outline-none focus:border-antique-gold transition-colors font-serif text-lg tracking-widest placeholder:text-white/20"
                      />
                      <div className="flex justify-between mt-1 text-[9px] text-slate-charcoal">
                        <span>Complimentary Service</span>
                        <span>{20 - (config.engraving?.length || 0)} characters remaining</span>
                      </div>
                    </div>

                    <div className="pt-4 space-y-3">
                      <label className="block text-[10px] uppercase font-display tracking-widest text-slate-charcoal">
                        TYPOGRAPHY STYLE
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'serif', label: 'Classic Serif', style: '"Cormorant Garamond", serif', example: 'AMAT VICTORIA CURAM' },
                          { id: 'sans', label: 'Modern Sans', style: '"DM Sans", sans-serif', example: 'AMAT VICTORIA CURAM' },
                          { id: 'script', label: 'Artisan Script', style: '"Pinyon Script", cursive', example: 'Amat Victoria Curam' },
                        ].map((font) => (
                          <button
                            key={font.id}
                            onClick={() => setConfig({ ...config, engravingFont: font.id })}
                            className={`p-3 text-center border rounded-xs transition-colors ${
                              config.engravingFont === font.id
                                ? 'border-antique-gold bg-antique-gold/10 text-white'
                                : 'border-white/10 bg-white/5 text-stone-400 hover:border-white/30'
                            }`}
                          >
                            <span className="block text-[10px] tracking-wider mb-2 font-display uppercase">{font.label}</span>
                            <span className="block text-sm opacity-80" style={{ fontFamily: font.style }}>A.V.C</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quality & Security seal banners */}
            <div className="p-4 bg-transparent flex items-start space-x-4">
              <ShieldAlert strokeWidth={1.2} className="w-6 h-6 text-antique-gold shrink-0 mt-0.5" />
              <p className="text-[11px] text-stone-300 leading-relaxed font-light">
                <span className="font-medium text-white uppercase tracking-wider block mb-1">Insured Handcrafting Process</span>
                Your customized ring is handcasted from recycled precious metal and hand-mounted in our Pune workshop. Every centerpiece diamond of 0.5 ct or higher includes a GIA certificate and an individual blockchain-certified ID.
              </p>
            </div>

            {/* Actions for Customizer */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => setIsInquiryOpen(true)}
                className="flex-[1] h-[56px] flex items-center justify-center gap-2 font-display text-[11px] tracking-widest transition-all duration-300 uppercase cursor-pointer"
                style={{
                  border: '1.5px solid #25D366',
                  color: '#25D366',
                  background: 'rgba(37,211,102,0.08)'
                }}
              >
                <MessageCircle className="w-4 h-4 stroke-[1.5]" />
                Enquire This Design
              </button>
              
              <button
                onClick={() => {
                  onAddCustomToCart(config, calculatedPrice);
                }}
                className="flex-[1] h-[56px] flex items-center justify-center font-display text-[11px] tracking-widest transition-all uppercase cursor-pointer"
                style={{
                  background: 'var(--antique-gold)',
                  color: '#0E0E0E'
                }}
              >
                ADD BESPOKE TO VAULT
              </button>
            </div>

          </div>

        </div>

      </div>

      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        customConfig={config}
        estimatedPrice={calculatedPrice}
      />
    </section>
  );
}
