export type ProductCategory = 'rings' | 'necklaces' | 'earrings' | 'bracelets';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  longDescription?: string;
  details: string[];
  image: string;
  galleryImages?: string[];
  carat?: number;
  metal?: string;
  isBestSeller?: boolean;
  collection: string;
}

export type DiamondShapeType = 'round' | 'princess' | 'emerald' | 'oval' | 'cushion';

export interface DiamondShape {
  id: DiamondShapeType;
  name: string;
  symbol: string;
  description: string;
  basePriceMultiplier: number;
  imageOffset?: string;
}

export type MetalType = 'rose-gold' | 'yellow-gold' | 'platinum';

export interface Metal {
  id: MetalType;
  name: string;
  colorClass: string;
  bgHex: string;
  priceDelta: number;
  description: string;
}

export type SettingType = 'solitaire' | 'halo' | 'pave' | 'three-stone';

export interface Setting {
  id: SettingType;
  name: string;
  bgClass: string;
  basePrice: number;
  description: string;
}

export interface CustomRingConfiguration {
  shape: DiamondShapeType;
  metal: MetalType;
  setting: SettingType;
  carat: number;
  clarity: string;
  colorGrade: string; // 'D' | 'F' | 'G' | 'H'
  engraving?: string;
  engravingFont?: string;
}

export interface Appointment {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  preferredContact: 'email' | 'call' | 'whatsapp';
  notes?: string;
  interest: 'bespoke' | 'collection' | 'repair' | 'sizing';
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  details?: string;
  isCustomRing?: boolean;
  customConfig?: CustomRingConfiguration;
}
