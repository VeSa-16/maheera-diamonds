import { useState } from 'react';
import { Eye, Heart, Plus, ShoppingBag, X, Check, ArrowRight, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, ProductCategory } from '../types';
import { FEATURED_COLLECTIONS } from '../data';
import { useQuery } from '@tanstack/react-query';
import InquiryModal from './InquiryModal';
import SEO from './SEO';
import { getUnsplashSrcSet } from '../lib/imageUtils';
import WebGLImageHover from './WebGLImageHover';

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
}

function ProductCard({
  product,
  isFaved,
  isAdded,
  onQuickLook,
  onToggleFavorite,
  onInquiry
}: {
  product: Product;
  isFaved: boolean;
  isAdded: boolean;
  onQuickLook: (p: Product) => void;
  onToggleFavorite: (id: string) => void;
  onInquiry: (p: Product) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      onClick={() => onQuickLook(product)}
      className="group relative flex flex-col justify-between space-y-3 bg-white p-3 cursor-pointer hover:scale-[1.03] hover:shadow-[0_0_0_1px_rgba(201,168,76,0.4)] cursor-hover"
      style={{ transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 500ms ease' }}
    >
      {/* Product Frame Thumbnail */}
      <div className="aspect-[4/5] w-full overflow-hidden bg-platinum relative">
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
        )}
        {!imgError ? (
          <img
            src={product.image}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} 
            alt={product.name}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
            <span className="text-xs text-gray-400 font-sans">Image unavailable</span>
          </div>
        )}

        {/* Best seller ribbon */}
        {product.isBestSeller && (
          <span className="absolute top-4 left-4 text-obsidian font-serif italic text-sm z-10 px-2 py-1">
            Signature
          </span>
        )}
      </div>

      {/* Card descriptions info */}
      <div className="pt-2 pb-1 text-center relative">
        <span className="font-display text-[9px] tracking-widest text-[#C8A96B] uppercase block font-light mb-1">
          {product.metal || 'PLATINUM & DIAMONDS'}
        </span>
        <h4 className="font-serif text-[16px] text-obsidian tracking-wide font-normal mb-0.5 line-clamp-1">
          {product.name}
        </h4>
        <p className="font-sans text-[13px] text-[#C8A96B] font-medium">
          ₹{product.price.toLocaleString('en-IN')}
        </p>

        {/* Hover action icons */}
        <div className="absolute bottom-1 right-0 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
            className="text-obsidian hover:text-rose-500 transition-colors"
            title={isFaved ? 'Remove favorite' : 'Save favorite'}
          >
            <Heart className={`w-5 h-5 stroke-[1.2] ${isFaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInquiry(product);
            }}
            className="text-obsidian hover:text-[#25D366] transition-colors"
            title="Enquire on WhatsApp"
          >
            <MessageCircle className="w-5 h-5 stroke-[1.2]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductCatalog({
  onAddToCart,
  onToggleFavorite,
  favorites,
}: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [quickLookProduct, setQuickLookProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const handleAddToCartWithFeedback = (product: Product) => {
    onAddToCart(product);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  // Fetch products from backend
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Filter logic
  const filteredProducts = products.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const categoriesList: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'ALL FINE CREATIONS' },
    { id: 'rings', label: 'ENGAGEMENT RINGS' },
    { id: 'necklaces', label: 'FINE NECKLACES' },
    { id: 'earrings', label: 'PREMIUM EARRINGS' },
    { id: 'bracelets', label: 'LUXURY BRACELETS' },
  ];

  return (
    <section id="catalog" className="py-16 md:py-24 bg-warm-ivory border-b border-champagne/40 text-obsidian relative overflow-hidden">
      
      {/* Soft elegant glimmers */}
      <div className="absolute top-[10%] right-[5%] w-[40%] h-[40%] bg-champagne/20 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[40%] h-[40%] bg-blush-rose/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Categories filters menu center */}
        <div className="text-center space-y-6 mb-16">
          <p className="text-[10px] tracking-[0.3em] font-display text-antique-gold uppercase leading-none block">
            HOUSE SELECTION CATALOG
          </p>
          <h3 className="font-serif text-3xl md:text-5xl text-obsidian font-light tracking-wide">
            Explore Curated Jewels
          </h3>
          <div className="w-12 h-[1px] bg-champagne ml-0 border-0 block" />

          {/* Filter Tabs */}
          <div className="flex justify-start items-center flex-wrap gap-4 md:gap-6 pt-4 border-b border-gray-200 pb-px">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{ transition: 'all 200ms ease' }}
                className={`pb-2.5 text-[11px] tracking-[0.1em] font-display uppercase cursor-pointer border-b ${
                  selectedCategory === cat.id
                    ? 'opacity-100 border-antique-gold text-slate-charcoal'
                    : 'bg-transparent border-transparent text-slate-charcoal opacity-50 hover:opacity-100 hover:border-antique-gold/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary grids list */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/5] w-full bg-platinum skeleton-loader rounded-xs" />
            ))}
          </div>
        ) : (
          <div id="catalog-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
            {filteredProducts.map((product, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
              key={product.id}
            >
              <ProductCard
                product={product}
                isFaved={favorites.includes(product.id)}
                isAdded={!!addedItems[product.id]}
                onQuickLook={(p) => {
                  setQuickLookProduct(p);
                  setSelectedImageIndex(0);
                }}
                onToggleFavorite={onToggleFavorite}
                onInquiry={setInquiryProduct}
              />
            </motion.div>
          ))}
          </div>
        )}

      </div>

      {/* QUICK VIEW MODAL WINDOW OVERLAY */}
      {quickLookProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 md:p-8 bg-obsidian/70 backdrop-blur-md">
          <SEO
             title={`${quickLookProduct.name} | Maheera Diamonds`}
             description={quickLookProduct.description}
             schema={{
               "@context": "https://schema.org",
               "@type": "Product",
               "name": quickLookProduct.name,
               "image": quickLookProduct.image,
               "description": quickLookProduct.description,
               "brand": {
                 "@type": "Brand",
                 "name": "Maheera Diamonds"
               },
               "offers": {
                 "@type": "Offer",
                 "url": "https://maheeradiamonds.com/",
                 "priceCurrency": "INR",
                 "price": quickLookProduct.price,
                 "availability": "https://schema.org/InStock",
                 "itemCondition": "https://schema.org/NewCondition",
                 "priceValidUntil": "2027-12-31"
               }
             }}
          />
          <div className="fixed inset-0" onClick={() => setQuickLookProduct(null)} />
          
          <div className="relative w-full max-w- mx-auto bg-obsidian border border-gold-900/40 p-6 md:p-12 shadow-2xl rounded-xs z-10 animate-fade-in flex flex-col md:flex-row gap-8 md:gap-12 text-xs">
            {/* Close button */}
            <button
              aria-label="Close product view"
              onClick={() => setQuickLookProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Gallery images display box */}
            <div className="flex-1 space-y-4">
              {/* Main Large Visual */}
              <div className="relative h-72 md:h-96 w-full overflow-hidden bg-platinum rounded-xs">
                <img
                  src={quickLookProduct.galleryImages ? quickLookProduct.galleryImages[selectedImageIndex] : quickLookProduct.image}
                  srcSet={getUnsplashSrcSet(quickLookProduct.galleryImages ? quickLookProduct.galleryImages[selectedImageIndex] : quickLookProduct.image)}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt={quickLookProduct.name}
                  width="600"
                  height="600"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center animate-fade-in"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Micro thumbnail slider */}
              {quickLookProduct.galleryImages && quickLookProduct.galleryImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto py-2">
                  {quickLookProduct.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 shrink-0 border overflow-hidden cursor-pointer rounded-xs transition-all ${
                        selectedImageIndex === idx ? 'border-antique-gold ring-1 ring-antique-gold' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        srcSet={getUnsplashSrcSet(img)}
                        sizes="64px"
                        alt={`${quickLookProduct.name} thumbnail ${idx + 1}`}
                        width="64"
                        height="64"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product data specs & checkout additions */}
            <div className="flex-1 flex flex-col justify-between py-2 space-y-6">
              <div className="space-y-4">
                <span className="font-display text-[9px] tracking-[0.3em] text-[#C8A96B] block uppercase font-light">
                  Curated Fine Jewelry Sourcing
                </span>
                
                <h3 className="font-serif text-3xl text-white leading-none font-light">
                  {quickLookProduct.name}
                </h3>
                
                <p className="font-display text-lg text-champagne font-medium">
                  ₹{quickLookProduct.price.toLocaleString('en-IN')}
                </p>

                <div className="w-8 h-[1px] bg-antique-gold/30 border-0" />

                <p className="text-gray-300 leading-relaxed font-light font-serif italic text-sm">
                  “{quickLookProduct.longDescription || quickLookProduct.description}”
                </p>

                <div className="space-y-1.5 pt-2">
                  <span className="font-display text-[10px] tracking-wide text-white block uppercase font-medium">
                    SPECIFICATION METALS & DIAMOND CARATS
                  </span>
                  <ul className="list-none space-y-1 pl-0 text-[11px] text-gray-300 leading-relaxed font-light">
                    {quickLookProduct.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-1.5">
                        <span className="text-antique-gold font-medium shrink-0">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3 pt-4 border-t border-gold-900/40">
                <button
                  onClick={() => handleAddToCartWithFeedback(quickLookProduct)}
                  className={`w-full py-4 text-xs font-display tracking-widest transition-all uppercase cursor-pointer flex items-center justify-center gap-2 ${
                    addedItems[quickLookProduct.id] ? 'bg-obsidian text-champagne' : 'bg-antique-gold text-obsidian hover:bg-[#b59659]'
                  }`}
                >
                  {addedItems[quickLookProduct.id] ? (
                    <>
                      <Check className="w-4 h-4" /> ADDED TO VAULT
                    </>
                  ) : (
                    'ADD CREATION TO VAULT'
                  )}
                </button>

                <button
                  onClick={() => {
                    setInquiryProduct(quickLookProduct);
                    setQuickLookProduct(null);
                  }}
                  className="w-full py-4 bg-[#25D366] text-white text-xs font-display tracking-widest hover:bg-[#1DA851] transition-all uppercase cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  ENQUIRE ON WHATSAPP
                </button>

                <button
                  onClick={() => onToggleFavorite(quickLookProduct.id)}
                  className={`w-full py-3.5 border transition-all text-xs font-display tracking-widest uppercase cursor-pointer text-center ${
                    favorites.includes(quickLookProduct.id)
                      ? 'bg-rose-500 border-rose-500 text-white hover:bg-rose-600'
                      : 'border-antique-gold/40 text-antique-gold hover:bg-white/5'
                  }`}
                >
                  {favorites.includes(quickLookProduct.id) ? 'REMOVE FAVORITE' : 'SAVE TO WISHLIST'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* INQUIRY MODAL */}
      <InquiryModal
        isOpen={!!inquiryProduct}
        onClose={() => setInquiryProduct(null)}
        product={inquiryProduct || undefined}
      />

    </section>
  );
}
