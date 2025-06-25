"use client"

import Head from "next/head"
import { useRouter } from "next/router"

interface SEOProps {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: string
}

export default function SEO({
  title = "WheelStreet | Premium Auto Services",
  description = "WheelStreet - your trusted partner for premium automotive services in Lithuania. Find your perfect car today.",
  canonical,
  ogImage = "/og-image.png",
  ogType = "website",
}: SEOProps) {
  const router = useRouter()
  const fullUrl = canonical || `https://wheelstreet.lt${router.asPath}`
  const fullTitle = title.length > 60 ? title.substring(0, 57) + "..." : title

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={`https://wheelstreet.lt${ogImage}`} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="WheelStreet" />
      <meta property="og:locale" content="lt_LT" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`https://wheelstreet.lt${ogImage}`} />

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  )
}
