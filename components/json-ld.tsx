interface LocalBusinessProps {
  name?: string
  description?: string
  url?: string
  telephone?: string
  address?: {
    streetAddress?: string
    addressLocality?: string
    postalCode?: string
    addressCountry?: string
  }
  geo?: {
    latitude?: number
    longitude?: number
  }
  openingHours?: string[]
  image?: string
}

export function LocalBusinessJsonLd({
  name = "WheelStreet",
  description = "Premium automotive services in Lithuania",
  url = "https://wheelstreet.lt",
  telephone = "+37061033377",
  address = {
    streetAddress: "Žirmūnų g. 139-303",
    addressLocality: "Vilnius",
    postalCode: "LT-09120",
    addressCountry: "LT",
  },
  geo = {
    latitude: 54.7157,
    longitude: 25.2836,
  },
  openingHours = ["Mo-Fr 09:00-18:00", "Sa 10:00-15:00"],
  image = "/og-image.png",
}: LocalBusinessProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    name,
    description,
    url,
    telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    openingHours,
    image: `https://wheelstreet.lt${image}`,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

interface ServiceProps {
  name?: string
  description?: string
  provider?: string
  serviceType?: string
  areaServed?: string
}

export function ServiceJsonLd({
  name = "Premium Auto Services",
  description = "Professional automotive services including acquisition, financing, and maintenance",
  provider = "WheelStreet",
  serviceType = "AutomotiveServices",
  areaServed = "Lithuania",
}: ServiceProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider,
    },
    serviceType,
    areaServed,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
