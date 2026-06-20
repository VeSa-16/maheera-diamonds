import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  schema?: Record<string, any>;
}

export default function SEO({ title, description, canonical, ogImage, schema }: SEOProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : canonical;
  const baseUrl = 'https://maheeradiamonds.com'; // Change to actual production URL
  const defaultImage = `${baseUrl}/og-image.jpg`; // Fallback image

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || defaultImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {currentUrl && <meta name="twitter:url" content={currentUrl} />}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultImage} />

      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
