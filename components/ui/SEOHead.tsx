import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

export function generateSEO({
  title,
  description,
  keywords = [],
  ogImage,
  canonical,
  noindex = false,
}: SEOProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tlv-business-pulse.vercel.app';
  const defaultOgImage = `${baseUrl}/og-image.png`;

  return {
    title: `${title} | TLV Business Pulse`,
    description,
    keywords: keywords.join(', '),
    ...(noindex && { robots: 'noindex, nofollow' }),
    ...(canonical && { alternates: { canonical } }),
    openGraph: {
      title: `${title} | TLV Business Pulse`,
      description,
      type: 'website',
      url: canonical || baseUrl,
      siteName: 'TLV Business Pulse',
      images: [
        {
          url: ogImage || defaultOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | TLV Business Pulse`,
      description,
      images: [ogImage || defaultOgImage],
    },
  };
}
