import React, { useState } from 'react';
import { Instagram } from 'lucide-react';
import { motion } from 'motion/react';

const INSTA_POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&h=600&q=80',
    likes: '1.2k',
    tag: '#maheeradiamonds',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&h=600&q=80',
    likes: '3.4k',
    tag: '#elysiansolitaire',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&h=600&q=80',
    likes: '2.1k',
    tag: '#celestialdew',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1611085583191-a3b1a1a27db2?auto=format&fit=crop&w=600&h=600&q=80',
    likes: '912',
    tag: '#infinitepetal',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&h=600&q=80',
    likes: '4.8k',
    tag: '#solitaireedit',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&h=600&q=80',
    likes: '1.5k',
    tag: '#amourhalo',
  }
];

function InstaPostCard({ post }: { post: typeof INSTA_POSTS[0] }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <a
      href="https://www.instagram.com/diamonds.by.maheera"
      target="_blank"
      rel="noopener noreferrer"
      className="relative w-full h-full overflow-hidden group border border-blush-rose/50 bg-blush-rose block"
    >
      {!imgLoaded && !imgError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
      )}
      {!imgError ? (
        <img
          src={post.image}
          alt={`Maheera Diamond Instagram post ${post.id}`}
          onError={() => setImgError(true)}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-[1500ms] group-hover:scale-[1.03] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
          <span className="text-xs text-gray-400 font-sans">Image unavailable</span>
        </div>
      )}

      {/* Minimal hover overlay */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 z-10 transition-opacity ease-in-out"
        style={{ background: 'rgba(14, 14, 14, 0.4)', transitionDuration: '250ms' }}
      >
        <Instagram className="w-5 h-5 text-white opacity-80 mb-2" />
        <span className="font-sans text-[10px] tracking-[0.12em] uppercase text-white">View Post</span>
      </div>
    </a>
  );
}

export default function InstagramFeed() {
  return (
    <section className="py-[64px] md:py-[120px] bg-white border-b border-blush-rose select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header Block */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-left mb-12 space-y-4"
        >
          <p style={{ fontSize: '11px', fontVariant: 'small-caps', letterSpacing: '0.04em', color: 'var(--antique-gold)', fontWeight: 400 }} className="font-display leading-none">
            Curated Atmospheres
          </p>
          <h3 className="font-serif text-3xl md:text-5xl text-obsidian font-light tracking-wide">
            The Digital Salon
          </h3>
          <p className="text-xs text-gray-400 font-light max-w-sm">
            Glimpse the liquid prisms and styling narratives curated daily by our Pune creative studio.
          </p>
        </motion.div>

        {/* Gallery grid of 6 - asymmetric layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 [&>*:nth-child(3)]:row-span-2 auto-rows-[200px] md:auto-rows-[280px]">
          {INSTA_POSTS.map((post, idx) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              key={post.id} 
              className="w-full h-full"
            >
              <InstaPostCard post={post} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
