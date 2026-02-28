import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Yanci';
const SITE_URL = 'https://yanci.ng';
const DEFAULT_IMAGE = '/pwa-512x512.png';
const DEFAULT_DESCRIPTION = 'Labarai da ra\'ayi daga Najeriya — labaran Hausa masu inganci daga arewacin Najeriya da duniya.';

/**
 * Reusable SEO component. Drop into any page.
 *
 * Props:
 *  title        – page title (will be appended with " | Yanci")
 *  description  – meta description (max 160 chars)
 *  image        – absolute or relative OG image URL
 *  url          – canonical URL (relative path, e.g. "/article/123")
 *  type         – og:type, defaults to "website", use "article" for articles
 *  article      – { publishedTime, modifiedTime, author, section, tags[] }
 *  noindex      – if true, adds noindex,nofollow
 *  jsonLd       – raw JSON-LD object to inject as <script type="application/ld+json">
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = '',
  type = 'website',
  article,
  noindex = false,
  jsonLd,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Labarai da Ra'ayi daga Najeriya`;
  const canonicalUrl = `${SITE_URL}${url}`;
  const resolvedImage = image?.startsWith('http') ? image : `${SITE_URL}${image}`;
  const resolvedDescription = description?.slice(0, 160);

  // Default NewsMediaOrganization JSON-LD if no custom one provided
  const defaultJsonLd = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'NewsArticle' : 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/pwa-192x192.png`,
      },
    },
    ...(type === 'article' && article
      ? {
          headline: title,
          image: resolvedImage,
          datePublished: article.publishedTime,
          dateModified: article.modifiedTime || article.publishedTime,
          author: {
            '@type': 'Person',
            name: article.author || 'Marubuci Yanci',
          },
          articleSection: article.section,
          keywords: article.tags?.join(', '),
          mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        }
      : {}),
  };

  const structuredData = jsonLd || defaultJsonLd;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* RSS Autodiscovery */}
      <link rel="alternate" type="application/rss+xml" title={`${SITE_NAME} — Duk Labarai`} href="/rss/index.xml" />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="ha_NG" />

      {/* Article-specific OG */}
      {type === 'article' && article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {type === 'article' && article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {type === 'article' && article?.author && (
        <meta property="article:author" content={article.author} />
      )}
      {type === 'article' && article?.section && (
        <meta property="article:section" content={article.section} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@YanciNG" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={resolvedImage} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
