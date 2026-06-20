import { Product, DiamondShape, Metal, Setting, DiamondShapeType, MetalType, SettingType } from './types';

export const DIAMOND_SHAPES: DiamondShape[] = [
  {
    id: 'round',
    name: 'Round Brilliant',
    symbol: '⚪',
    description: 'The standard of brilliance. Designed for maximum light refraction, featuring 58 facets for incomparable fire and scintillation.',
    basePriceMultiplier: 1.0,
  },
  {
    id: 'oval',
    name: 'Oval',
    symbol: '🥚',
    description: 'Feminine and elongated. This design flatters the finger elegantly, offering a modern poetic look with brilliant-cut radiance.',
    basePriceMultiplier: 0.95,
  },
  {
    id: 'emerald',
    name: 'Emerald Cut',
    symbol: '⬜',
    description: 'Unmistakably sophisticated. Elegant parallel step-cuts and wide open table that showcase high-clarity purity and vintage luxury.',
    basePriceMultiplier: 0.9,
  },
  {
    id: 'princess',
    name: 'Princess Cut',
    symbol: '💎',
    description: 'Vibrant and contemporary. Featuring deep clean square lines and brilliant faceting, offering a bold yet romantic statement.',
    basePriceMultiplier: 0.88,
  },
  {
    id: 'cushion',
    name: 'Cushion Cut',
    symbol: '🟪',
    description: 'The absolute vintage romance. Curved corners with deep romantic facets, combining antique appeal with modern brilliant luster.',
    basePriceMultiplier: 0.85,
  },
];

export const METALS: Metal[] = [
  {
    id: 'platinum',
    name: '950 Platinum',
    colorClass: 'bg-zinc-300',
    bgHex: '#E5E5E5',
    priceDelta: 60000,
    description: 'Rare, naturally white, and hypoallergenic. Its dense weight and permanent luster hold the gemstone with absolute secure durability.',
  },
  {
    id: 'rose-gold',
    name: '18K Rose Gold',
    colorClass: 'bg-rose-200',
    bgHex: '#E8C5C0',
    priceDelta: 20000,
    description: 'Romantic and warm. Enriched with fine copper alloy to cast an iconic, sunset-pink tone that feels beautifully feminine and timeless.',
  },
  {
    id: 'yellow-gold',
    name: '18K Yellow Gold',
    colorClass: 'bg-amber-100',
    bgHex: '#EAD39E',
    priceDelta: 25000,
    description: 'The golden standard. A rich high-purity yellow gold alloy casting a classic solar glow that honors continuous heritage and luxury.',
  },
];

export const SETTINGS: Setting[] = [
  {
    id: 'solitaire',
    name: 'The Eternal Solitaire',
    bgClass: 'border-champagne',
    basePrice: 120000,
    description: 'The ultimate canvas. A sleek polished band with elevated prong mountings designed to draw every ounce of attention directly to your diamond.',
  },
  {
    id: 'halo',
    name: 'The Divine Halo',
    bgClass: 'border-zinc-400',
    basePrice: 180000,
    description: 'Surrounded in light. A delicate border of brilliant-cut micro-diamonds frames the centerpiece, creating an optical illusion of grander scale and luster.',
  },
  {
    id: 'pave',
    name: 'The French Pavé',
    bgClass: 'border-rose-400',
    basePrice: 220000,
    description: 'Interwoven brilliance. Shimmering diamonds hand-set along the shoulders of the band, creating a sparkling river of light beneath the central crown.',
  },
  {
    id: 'three-stone',
    name: 'The Trinity Legacy',
    bgClass: 'border-yellow-600',
    basePrice: 260000,
    description: 'Past, Present, and Future. Two perfectly matched flanking brilliant side stones cuddle the main diamond, telling an emotional lifelong tale of love.',
  },
];

export const CLARITY_LEVELS = [
  { level: 'FL', label: 'Flawless (FL)', priceMultiplier: 2.2, description: 'Completely free from any internal inclusions or surface blemishes under 10x magnification.' },
  { level: 'VVS1', label: 'Very Very Slightly Included 1 (VVS1)', priceMultiplier: 1.8, description: 'Minuscule inclusions that are extremely difficult for even master grade gemologists to spot.' },
  { level: 'VS1', label: 'Very Slightly Included 1 (VS1)', priceMultiplier: 1.4, description: 'Minor inclusions that are completely invisible to the naked eye, representing supreme elite luxury value.' },
  { level: 'SI1', label: 'Slightly Included 1 (SI1)', priceMultiplier: 1.0, description: 'Eye-clean inclusions providing an exceptional compromise between high budget value and beauty.' },
];

export const COLOR_GRADES = [
  { grade: 'D', label: 'D Grade (Colorless)', priceMultiplier: 1.5, description: 'The absolute pinnacle of color excellence. Wholly colorless, permitting perfect light spectrum refraction.' },
  { grade: 'F', label: 'F Grade (Colorless)', priceMultiplier: 1.3, description: 'Vastly colorless category. Professional gemologists can detect trace colors only under strict laboratory environments.' },
  { grade: 'G', label: 'G Grade (Near Colorless)', priceMultiplier: 1.15, description: 'An elegant warm tone that offers the absolute best balance of brilliant look and investment.' },
  { grade: 'H', label: 'H Grade (Near Colorless)', priceMultiplier: 1.0, description: 'Almost colorless to the untrained eye, revealing very slight warm highlights when evaluated face-down.' },
];

export const FEATURED_COLLECTIONS = [
  {
    id: 'solitaire-edit',
    name: 'The Solitaire Edit',
    subtitle: 'Absolute Devotion',
    description: 'Where pristine craftsmanship meets timeless elegance. Hand-curated to express vows of eternal adoration.'
  },
  {
    id: 'gilded-petals',
    name: 'Gilded Petals',
    subtitle: 'Feminine Splendor',
    description: 'Nature’s romance captured in 18k pink and yellow gold. Sculpted contours mirroring organic beauty.'
  },
  {
    id: 'celestial-echo',
    name: 'Celestial Echo',
    subtitle: 'Infinite Refractions',
    description: 'Minimalist architectures adorned with exceptional starfire diamonds, capturing starlight.'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'm-ring-01',
    name: 'Elysian Solitaire',
    category: 'rings',
    price: 490000,
    description: 'The defining statement of eternal devotion. A brilliant-cut center secured in a sleek platinum crown.',
    longDescription: 'The Elysian Solitaire. The cornerstone of House of Maheera. Four platinum prongs secure a flawless round brilliant-cut diamond. A knife-edge band polished by hand. Light return is absolute.',
    details: [
      'Platinum 950 build, heavy comfort-fit profile',
      'Center Diamond: 1.2 Carat, G Color, VS1 Clarity',
      'Accompanied by a digital blockchain GIA Certification',
      'Maheera Signature signature blue gift wrapper'
    ],
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1000&q=85'
    ],
    carat: 1.2,
    metal: 'Platinum',
    isBestSeller: true,
    collection: 'solitaire-edit'
  },
  {
    id: 'm-ring-02',
    name: 'Amour Halo Ring',
    category: 'rings',
    price: 640000,
    description: 'An oval-cut centerpiece surrounded by a crown of light. Set in 18K warm rose gold.',
    longDescription: 'The Amour Halo. Thirty-two hand-selected brilliant micro-diamonds frame a teardrop Oval center. Solid 18k Rose Gold cascades down the micro-pavé bridge. A blush-pink halo of warm light.',
    details: [
      '18K Solid Rose Gold composition',
      'Total Carat Weight: 1.6 Carat (1.1ct Oval Center)',
      'Feminine scalloped edge detailing',
      'Completely conflict-free and ethically tracked diamond provenance'
    ],
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85'
    ],
    carat: 1.6,
    metal: '18K Rose Gold',
    isBestSeller: false,
    collection: 'gilded-petals'
  },
  {
    id: 'm-neck-01',
    name: 'Aura Halo Pendant',
    category: 'necklaces',
    price: 380000,
    description: 'A brilliant-cut diamond pendant resting inside a micro-pavé flower halo.',
    longDescription: 'The Aura Halo Pendant. Floating delicately against the collarbone. Suspended from an ultra-thin Italian platinum chain. An extraordinary testament to everyday luxury.',
    details: [
      '950 Platinum setting and delicate 18-inch cable chain',
      '0.8 Carat brilliant-cut center with 0.35 Carat pavé halo',
      'Secure lobster-clasp closure with iconic M-diamond monogram tag',
      'Available in signature velvet keep-safe drawer'
    ],
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85'
    ],
    carat: 1.15,
    metal: 'Platinum',
    isBestSeller: true,
    collection: 'celestial-echo'
  },
  {
    id: 'm-ear-01',
    name: 'Celestial Dew Drops',
    category: 'earrings',
    price: 725000,
    description: 'Ethereal drop earrings featuring pristine emerald-cut diamonds cascading down.',
    longDescription: 'A study in high-jewelry architecture. Emerald-cut diamonds hang from linear strings of delicate French pavé stones. Designed to shimmer with every tilt of the head. Light prisms against the jawline.',
    details: [
      '950 White Platinum setting and posts',
      'Twin matched Emerald-Cut diamonds (1.0ct each, Total 2.0ct)',
      'Color Grade: E, Clarity: VVS2 (Exceptional purity)',
      'Exquisite compression-fit backings for maximum safety'
    ],
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85'
    ],
    carat: 2.3,
    metal: 'Platinum',
    isBestSeller: false,
    collection: 'celestial-echo'
  },
  {
    id: 'm-brac-01',
    name: 'Infinite Petal Bangle',
    category: 'bracelets',
    price: 890000,
    description: 'An oval-sculpted solid 18K yellow gold bangle adorned with hand-carved micro floras.',
    longDescription: 'The Infinite Petal Bangle. Embracing the wrist. Solid 18K Yellow Gold is delicately shaped into leafy contours. Loaded with thirty-six pristine micro-brilliant diamonds.',
    details: [
      '18K Solid Yellow Gold, weight 18.5 grams',
      'Diamonds: 0.95 Carat overall Pavé',
      'Hidden safety hinge and dual latch release',
      'Custom sizing tailored upon private consultation'
    ],
    image: 'https://images.unsplash.com/photo-1611085583191-a3b1a1a27db2?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1611085583191-a3b1a1a27db2?auto=format&fit=crop&w=1000&q=85'
    ],
    carat: 0.95,
    metal: '18K Yellow Gold',
    isBestSeller: false,
    collection: 'gilded-petals'
  },
  {
    id: 'm-ring-03',
    name: 'Gilded Rosette Ring',
    category: 'rings',
    price: 520000,
    description: 'A brilliant-cut solitaire floating above an organic foliage design in pink gold.',
    longDescription: 'The Gilded Rosette. An intricate ring band hand-carved to mimic wild roses climbing up the crown. Culminating in a flawless center stone. Highly feminine. Deeply poetic.',
    details: [
      '18K Solid Pink Gold, custom comfort band',
      'Center Gem: 1.05 Carat, F Color, FL clarity',
      'Floral prongs with dual rosebud accents',
      'Lifetime sizing and complimentary cleaning'
    ],
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1000&q=85'
    ],
    carat: 1.05,
    metal: '18K Rose Gold',
    isBestSeller: true,
    collection: 'gilded-petals'
  }
];
