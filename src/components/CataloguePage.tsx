import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Search, SlidersHorizontal, Eye, X, Check, ShoppingBag, MessageSquare, MessageCircle, ShieldCheck, Sparkles, Truck, Gift } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import JewelryCategories from './JewelryCategories';
import { useQuery } from '@tanstack/react-query';
import InquiryModal from './InquiryModal';
import SEO from './SEO';
import { getUnsplashSrcSet } from '../lib/imageUtils';

interface CataloguePageProps {
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
  initialGender?: 'all' | 'women' | 'men';
  onGenderChange?: (gender: 'all' | 'women' | 'men') => void;
}

export default function CataloguePage({
  onAddToCart,
  onToggleFavorite,
  favorites,
  initialGender = 'all',
  onGenderChange,
}: CataloguePageProps) {
  // Filters state
  const [selectedGender, setSelectedGender] = useState<'all' | 'women' | 'men'>(initialGender);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [priceRange, setPriceRange] = useState<number>(1000000); // Max 10,00,000
  const [showBestSellersOnly, setShowBestSellersOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // Selected product detail modal
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [zoomStyle, setZoomStyle] = useState<{ backgroundPosition: string; showZoom: boolean }>({
    backgroundPosition: '0% 0%',
    showZoom: false,
  });
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);

  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const handleAddToCartWithFeedback = (product: Product) => {
    onAddToCart(product);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  // Sync state with initialGender prop when it changes
  React.useEffect(() => {
    setSelectedGender(initialGender);
  }, [initialGender]);

  const handleGenderSelect = (gender: 'all' | 'women' | 'men') => {
    setSelectedGender(gender);
    if (onGenderChange) onGenderChange(gender);
    
    // Smooth scroll to the products grid/filters section
    const element = document.getElementById('catalogue-filter-bar');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Fetch products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Filter products
  const filteredProducts = products.filter((p) => {
    // Category filter
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    // Price filter
    if (p.price > priceRange) return false;
    // Best seller filter
    if (showBestSellersOnly && !p.isBestSeller) return false;
    
    // Gender filter
    if (selectedGender === 'women') {
      return true;
    }
    if (selectedGender === 'men') {
      return p.category === 'rings' || p.category === 'bracelets';
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0; // Default/No sorting
  });

  const categories = [
    { id: 'all', label: 'All Collections', desc: 'Sovereign diamonds crafted to perfection.' },
    { id: 'rings', label: 'Rings Collection', desc: 'Elegant statement rings crafted for unforgettable moments.' },
    { id: 'earrings', label: 'Earrings Collection', desc: 'Minimal yet luxurious earrings designed for modern sophistication.' },
    { id: 'necklaces', label: 'Necklaces Collection', desc: 'Timeless necklaces that elevate every occasion.' },
    { id: 'bracelets', label: 'Bracelets Collection', desc: 'Luxury bracelets designed with refined elegance.' },
  ];

  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      backgroundPosition: `${x}% ${y}%`,
      showZoom: true,
    });
  };

  return (
    <div id="catalogue-page" className="bg-warm-ivory text-obsidian selection:bg-blush-rose min-h-screen pt-[80px] md:pt-[140px] pb-[64px] md:pb-[120px]">
      {/* Hero Section */}
      <section className="relative py-[64px] md:py-[120px] px-6 md:px-8 text-left max-w-7xl mx-auto overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 text-left"
        >
          <span className="text-[10px] tracking-[0.4em] text-antique-gold uppercase font-display font-medium block">
            THE BOUTIQUE CATALOGUE
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-extralight tracking-wide text-obsidian leading-tight">
            Explore Our Collections
          </h1>
          <p className="font-serif text-sm md:text-lg italic text-slate-charcoal max-w-2xl leading-relaxed">
            Luxury jewelry designed for timeless elegance.
          </p>
          <div className="w-12 h-[1px] bg-champagne ml-0" />
        </motion.div>
      </section>

      {/* Premium Curated Jewelry Categories */}
      <JewelryCategories onExplore={handleGenderSelect} />

      {/* Luxury Filter Bar Block */}
      <section id="catalogue-filter-bar" className="max-w-7xl mx-auto px-6 md:px-8 mb-16 scroll-mt-28">
        <div className="p-6 md:p-8 bg-white border border-blush-rose rounded-xs shadow-xs space-y-6 lg:space-y-0 lg:flex lg:items-center lg:justify-between gap-8">
          
          <div className="flex flex-col gap-4">
            {/* Gender Filters (All, Women, Men) */}
            <div className="flex gap-4 border-b border-stone-100 pb-2">
              {[
                { id: 'all', label: 'All Jewelry' },
                { id: 'women', label: "Women’s Collection" },
                { id: 'men', label: "Men’s Collection" },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleGenderSelect(g.id as any)}
                  className={`pb-1 px-1 text-[10px] tracking-[0.2em] font-display uppercase transition-all duration-300 relative cursor-pointer ${
                    selectedGender === g.id
                      ? 'text-antique-gold font-medium'
                      : 'text-slate-charcoal hover:text-obsidian'
                  }`}
                >
                  {g.label}
                  {selectedGender === g.id && (
                    <motion.div
                      layoutId="activeGenderBarLine"
                      className="absolute bottom-[-1px] left-0 right-0 h-[1.5px] bg-antique-gold"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Categories Grid Selector */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as ProductCategory | 'all')}
                  className={`px-5 py-2.5 text-[9px] tracking-[0.2em] font-display transition-all duration-300 cursor-pointer uppercase ${
                    selectedCategory === cat.id
                      ? 'bg-obsidian text-white font-medium shadow-xs'
                      : 'bg-warm-ivory text-gray-400 hover:text-obsidian border border-transparent hover:border-champagne'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Filters Panel Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 text-xs text-obsidian">
            
            {/* Price Filter Slider */}
            <div className="space-y-2 min-w-[180px]">
              <div className="flex justify-between text-[10px] font-display uppercase tracking-wider text-slate-charcoal font-medium">
                <span>Max Price:</span>
                <span className="text-obsidian">₹{priceRange.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="350000"
                max="1000000"
                step="50000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-antique-gold cursor-pointer bg-blush-rose"
              />
            </div>

            {/* Toggle Best Sellers / New Arrivals */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowBestSellersOnly(!showBestSellersOnly)}
                className={`px-4 py-2 border text-[10px] uppercase tracking-wider font-display transition-all cursor-pointer ${
                  showBestSellersOnly
                    ? 'border-antique-gold bg-blush-rose/50 text-antique-gold font-medium'
                    : 'border-gray-200 text-gray-400 hover:text-obsidian hover:border-champagne'
                }`}
              >
                Best Sellers
              </button>

              {/* Sort selector dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-2 border border-gray-200 text-[10px] uppercase tracking-wider font-display text-slate-charcoal focus:border-antique-gold focus:outline-none bg-white rounded-xs cursor-pointer"
              >
                <option value="default">Default Sort</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

          </div>

        </div>

        {/* Selected category statement header */}
        <div className="mt-8 text-left bg-blush-rose/20 p-6 border-l-2 border-antique-gold">
          <h3 className="font-serif text-lg md:text-xl text-obsidian font-light text-left">
            {categories.find((c) => c.id === selectedCategory)?.label}
          </h3>
          <p className="text-[11px] text-slate-charcoal font-serif italic mt-1 text-left">
            {categories.find((c) => c.id === selectedCategory)?.desc}
          </p>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 mb-16 md:mb-[120px]">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[4/5] w-full bg-platinum skeleton-loader rounded-lg" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-left p-8 md:p-12 py-[64px] md:py-[120px] space-y-4 bg-white border border-blush-rose rounded-xs">
            <SlidersHorizontal className="w-8 h-8 text-champagne ml-0 opacity-60" />
            <p className="font-serif text-base text-slate-charcoal text-left">None of our current creations match your chosen filter params.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setPriceRange(1000000);
                setShowBestSellersOnly(false);
                setSortBy('default');
              }}
              className="text-xs font-display text-antique-gold font-semibold uppercase tracking-wider hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div id="catalog-cards-grid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
            {filteredProducts.map((p) => {
              const isFav = favorites.includes(p.id);
              const isAdded = addedItems[p.id];
              return (
                <div
                  key={p.id}
                  className="group relative flex flex-col justify-between space-y-4 rounded-lg border border-transparent bg-white p-4 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-antique-gold hover:scale-[1.02] hover:shadow-lg"
                >
                  {/* Dynamic Best Seller Tag */}
                  {p.isBestSeller && (
                    <span className="absolute top-4 left-4 z-10 bg-obsidian text-champagne text-[8px] font-display tracking-widest uppercase px-2.5 py-1 font-medium rounded-sm">
                      Signature Seller
                    </span>
                  )}

                  {/* Favorite Top Right Toggle */}
                  <button
                    onClick={() => onToggleFavorite(p.id)}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/85 hover:bg-white text-obsidian hover:text-rose-500 rounded-full cursor-pointer shadow-xs transition-colors group/fav"
                    aria-label="Add to favorites list"
                  >
                    {isFav && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <svg key={i} className="absolute w-2 h-2 text-rose-500 animate-petal-burst" style={{ transform: `rotate(${i * 72}deg) translateY(-10px)` }} viewBox="0 0 10 10">
                            <circle cx="5" cy="5" r="5" fill="currentColor" />
                          </svg>
                        ))}
                      </div>
                    )}
                    <Heart className={`w-3.5 h-3.5 transition-colors duration-300 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                  </button>

                  <div
                    onClick={() => {
                      setActiveImgIndex(0);
                      setActiveProduct(p);
                    }}
                    className="aspect-[4/5] w-full overflow-hidden bg-platinum cursor-pointer relative rounded-lg image-reveal-container skeleton-loader"
                  >
                    <img
                      src={p.image}
                      srcSet={getUnsplashSrcSet(p.image)}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      alt={p.name}
                      width="400"
                      height="500"
                      loading="lazy"
                      decoding="async"
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 ${p.galleryImages && p.galleryImages.length > 1 ? 'group-hover:opacity-0' : ''}`}
                      referrerPolicy="no-referrer"
                    />
                    {p.galleryImages && p.galleryImages.length > 1 && (
                      <img
                        src={p.galleryImages[1]}
                        srcSet={getUnsplashSrcSet(p.galleryImages[1])}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        alt={`${p.name} alternate view`}
                        width="400"
                        height="500"
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] scale-95 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {/* Hover banner details overlay */}
                    <div className="absolute inset-0 bg-obsidian/10 opacity-0 group-hover:opacity-100 transition-opacity duration-[600ms] flex items-center justify-center">
                      <span className="px-5 py-2.5 bg-warm-ivory text-obsidian text-[9px] font-display tracking-widest uppercase shadow-md flex items-center gap-1 rounded-sm">
                        <Eye className="w-3.5 h-3.5" />
                        Quick View
                      </span>
                    </div>
                  </div>

                  {/* Content details Card */}
                  <div className="space-y-3 text-left p-1">
                    <div className="space-y-1 text-left">
                      <span className="text-[7.5px] font-display text-antique-gold tracking-[0.25em] uppercase text-left block">
                        {p.category.toUpperCase()}
                      </span>
                      <h4 className="font-serif text-[16px] text-obsidian font-light leading-none group-hover:text-antique-gold transition-colors text-left line-clamp-1">
                        {p.name}
                      </h4>
                      <p className="font-display text-[13px] text-obsidian font-medium text-left">
                        ₹{p.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <p className="text-[10px] text-gray-400 font-serif italic line-clamp-2 leading-relaxed px-0">
                      “{p.description}”
                    </p>

                    <div className="pt-2 flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCartWithFeedback(p)}
                          className={`flex-1 py-2 text-[9px] font-display tracking-widest uppercase font-medium transition-all duration-300 rounded-xs cursor-pointer shadow-xs flex items-center justify-center gap-1 ${
                            isAdded ? 'bg-obsidian text-champagne' : 'bg-obsidian hover:bg-antique-gold text-white hover:text-obsidian'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Added
                            </>
                          ) : (
                            'Add to Cart'
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setActiveImgIndex(0);
                            setActiveProduct(p);
                          }}
                          className="px-3 py-2 border border-champagne hover:border-antique-gold text-obsidian text-[9px] font-display tracking-widest uppercase transition-all duration-300 rounded-xs cursor-pointer bg-transparent"
                        >
                          Quick View
                        </button>
                      </div>
                      <button
                        onClick={() => setInquiryProduct(p)}
                        className="w-full py-2 bg-[#25D366] hover:bg-[#1DA851] text-white text-[9px] font-display tracking-widest uppercase font-medium transition-all duration-300 rounded-xs cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Enquire on WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Immersive Selected Product Page / Modal overlay Layout */}
      <AnimatePresence>
        {activeProduct && (
          <div className="fixed inset-0 z-50 bg-obsidian/60 backdrop-blur-md flex items-center justify-center p-4">
            <SEO
               title={`${activeProduct.name} | Maheera Diamonds`}
               description={activeProduct.description}
               schema={{
                 "@context": "https://schema.org",
                 "@type": "Product",
                 "name": activeProduct.name,
                 "image": activeProduct.image,
                 "description": activeProduct.description,
                 "brand": {
                   "@type": "Brand",
                   "name": "Maheera Diamonds"
                 },
                 "offers": {
                   "@type": "Offer",
                   "url": "https://maheeradiamonds.com/catalogue",
                   "priceCurrency": "INR",
                   "price": activeProduct.price,
                   "availability": "https://schema.org/InStock"
                 }
               }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white max-w-5xl w-full h-[90vh] md:h-auto md:max-h-[85vh] rounded-xs shadow-2xl relative overflow-y-auto border border-champagne"
            >
              {/* Close top right */}
              <button
                onClick={() => setActiveProduct(null)}
                className="absolute top-4 right-4 z-20 p-2 text-obsidian hover:text-antique-gold transition-colors"
                aria-label="Close detail modal"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2">
                
                {/* Left Side: Large Product Gallery and Magnifier Zoom */}
                <div className="p-6 md:p-8 space-y-4 bg-warm-ivory flex flex-col justify-between">
                  
                  {/* Large visual preview viewport */}
                  <div
                    onMouseMove={handleZoomMove}
                    onMouseLeave={() => setZoomStyle({ ...zoomStyle, showZoom: false })}
                    className="relative h-96 w-full overflow-hidden border border-blush-rose rounded-xs cursor-zoom-in bg-white"
                    style={{
                      backgroundImage: zoomStyle.showZoom
                        ? `url(${activeProduct.galleryImages ? activeProduct.galleryImages[activeImgIndex] : activeProduct.image})`
                        : 'none',
                      backgroundSize: '200%',
                      backgroundPosition: zoomStyle.backgroundPosition,
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    {!zoomStyle.showZoom && (
                      <img
                        src={activeProduct.galleryImages ? activeProduct.galleryImages[activeImgIndex] : activeProduct.image}
                        srcSet={getUnsplashSrcSet(activeProduct.galleryImages ? activeProduct.galleryImages[activeImgIndex] : activeProduct.image)}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        alt={activeProduct.name}
                        width="600"
                        height="600"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                    )}

                    {/* Temporary Micro instructions overlay */}
                    <span className="absolute bottom-3 left-3 bg-white/70 backdrop-blur-xs text-[7px] text-obsidian font-display tracking-widest px-2 py-1 uppercase rounded-xs">
                      Hover image to zoom center GIA facets
                    </span>
                  </div>

                  {/* Thumbnail gallery carousel - Multiple Angles */}
                  {activeProduct.galleryImages && activeProduct.galleryImages.length > 1 && (
                    <div className="flex gap-2.5 overflow-x-auto py-1">
                      {activeProduct.galleryImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImgIndex(idx)}
                          className={`w-16 h-16 border rounded-xs overflow-hidden shrink-0 cursor-pointer ${
                            idx === activeImgIndex ? 'border-antique-gold shadow-md scale-105' : 'border-gray-200'
                          } transition-all`}
                        >
                          <img
                            src={img}
                            srcSet={getUnsplashSrcSet(img)}
                            sizes="64px"
                            alt={`${activeProduct.name} angle ${idx + 2}`}
                            width="64"
                            height="64"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-center"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                </div>

                {/* Right Side: Product Details & CTA */}
                <div className="p-6 md:p-8 space-y-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-blush-rose">
                  <div className="space-y-4">
                    
                    {/* Category Label */}
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-display text-antique-gold tracking-[0.3em] font-medium uppercase">
                        {activeProduct.category.toUpperCase()}
                      </span>
                      {activeProduct.isBestSeller && (
                        <span className="bg-blush-rose border border-champagne text-antique-gold text-[8px] font-display tracking-widest uppercase px-2 py-0.5 rounded-full">
                          BEST SELLER
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-2xl md:text-3xl text-obsidian font-light leading-none">
                      {activeProduct.name}
                    </h3>
                    
                    <p className="font-display text-xl text-obsidian font-medium leading-none pt-1">
                      ₹{activeProduct.price.toLocaleString('en-IN')}
                    </p>

                    <div className="w-8 h-[1px] bg-champagne border-0" />

                    <div className="space-y-2">
                      <p className="text-xs text-slate-charcoal font-serif leading-relaxed">
                        {activeProduct.longDescription || activeProduct.description}
                      </p>
                    </div>

                    {/* Material Details Checklist */}
                    <div className="space-y-3 pt-3">
                      <p className="font-display text-[9px] uppercase tracking-widest text-obsidian font-medium">
                        Gemstone & Composition Specs
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 font-sans text-xs text-slate-charcoal leading-relaxed font-light">
                        {activeProduct.details.map((detail, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-antique-gold shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="space-y-6 pt-4 border-t border-blush-rose">
                    
                    {/* Dual Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <button
                        onClick={() => {
                          onAddToCart(activeProduct);
                          setActiveProduct(null);
                        }}
                        className="w-full py-4 bg-obsidian hover:bg-antique-gold text-white hover:text-obsidian transition-all font-display text-[11px] tracking-widest uppercase font-medium rounded-xs cursor-pointer shadow-md flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => {
                          setInquiryProduct(activeProduct);
                          setActiveProduct(null);
                        }}
                        className="w-full py-4 bg-[#25D366] hover:bg-[#1DA851] text-white font-display text-[11px] tracking-widest uppercase transition-all duration-300 rounded-xs cursor-pointer shadow-md flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        ENQUIRE ON WHATSAPP
                      </button>
                    </div>

                    {/* Trust Section Indicators */}
                    <div className="grid grid-cols-3 gap-2 text-left text-gray-400 text-[8px] font-display tracking-widest uppercase pt-3 border-t border-blush-rose">
                      <div className="space-y-1 text-left">
                        <Sparkles className="w-4 h-4 text-antique-gold ml-0" />
                        <span className="block text-slate-charcoal leading-tight">Certified Quality</span>
                      </div>
                      <div className="space-y-1 border-l border-r border-blush-rose px-2 text-left">
                        <Truck className="w-4 h-4 text-antique-gold ml-0" />
                        <span className="block text-slate-charcoal leading-tight">Secure Shipping</span>
                      </div>
                      <div className="space-y-1 text-left">
                        <Gift className="w-4 h-4 text-antique-gold ml-0" />
                        <span className="block text-slate-charcoal leading-tight">Premium Packaging</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INQUIRY MODAL */}
      <InquiryModal
        isOpen={!!inquiryProduct}
        onClose={() => setInquiryProduct(null)}
        product={inquiryProduct || undefined}
      />

    </div>
  );
}
