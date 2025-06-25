import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
import LayoutClient from "@/components/layout-client"
import AnalyticsScripts from "@/components/analytics-scripts"

export const metadata = {
  title: "WheelStreet | Premium Auto Services",
  description:
    "WheelStreet - your trusted partner for premium automotive services in Lithuania. Find your perfect car today.",
  keywords: "luxury cars, premium auto, car services, Lithuania, auto financing, car leasing",
  authors: [{ name: "WheelStreet" }],
  creator: "WheelStreet",
  publisher: "WheelStreet",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://wheelstreet.lt"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "WheelStreet | Premium Auto Services",
    description: "Your trusted partner for premium automotive services in Lithuania.",
    url: "https://wheelstreet.lt",
    siteName: "WheelStreet",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WheelStreet Logo",
      },
    ],
    locale: "lt_LT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WheelStreet | Premium Auto Services",
    description: "Your trusted partner for premium automotive services in Lithuania.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="lt" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="font-sans">
        <AnalyticsScripts />
        
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KV6VW62T"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <Suspense>
            <LayoutClient>{children}</LayoutClient>
            <Analytics />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
