import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  schema?: Record<string, any> | Record<string, any>[];
}

export default function SEO({ title, description, canonical, ogImage, schema }: SEOProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : canonical;
  const baseUrl = 'https://maheeradiamonds.com'; // Change to actual production URL
  const defaultImage = `${baseUrl}/og-image.jpg`; // Fallback image

  return (
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Maheera Diamonds" />
      <meta property="og:locale" content="en_IN" />
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@maheeradiamonds" />
      {currentUrl && <meta name="twitter:url" content={currentUrl} />}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultImage} />

      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(schema) ? schema : [schema])}
        </script>
      )}
    </Helmet>
  );
}
