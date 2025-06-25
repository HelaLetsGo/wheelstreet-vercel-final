import CookiesPageClient from "./CookiesPageClient"

export const metadata = {
  title: "Cookie Policy | WheelStreet Auto Services",
  description: "WheelStreet's cookie policy - how we use cookies on our website.",
  alternates: {
    canonical: "/cookies",
  },
}

export default function CookiesPage() {
  return <CookiesPageClient />
}
