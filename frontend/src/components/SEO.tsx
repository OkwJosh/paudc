import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
    type?: string;
    canonical?: string;
}

const SITE_URL = 'https://www.paudc2026.com';
const DEFAULT_IMAGE = `${SITE_URL}/paudc.png`;

export function SEO({
    title,
    description,
    image,
    url,
    type = 'website',
    canonical
}: SEOProps) {
    const fullTitle = `${title} | PAUDC 2026`;
    const canonicalUrl = canonical || url || (typeof window !== 'undefined' ? window.location.href : SITE_URL);
    // Always resolve to an absolute URL so social crawlers can find it
    const absoluteImage = image
        ? (image.startsWith('http') ? image : `${SITE_URL}${image}`)
        : DEFAULT_IMAGE;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta property="og:site_name" content="PAUDC 2026" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:image" content={absoluteImage} />
            <meta property="og:image:width" content="512" />
            <meta property="og:image:height" content="512" />
            <meta property="og:url" content={canonicalUrl} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@paudc2026" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={absoluteImage} />
            <link rel="canonical" href={canonicalUrl} />
        </Helmet>
    );
}
