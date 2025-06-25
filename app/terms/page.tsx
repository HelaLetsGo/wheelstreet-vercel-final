import TermsPageClient from "./TermsPageClient"

export const metadata = {
  title: "Terms of Service | WheelStreet Auto Services",
  description: "WheelStreet's terms of service - the conditions for using our services.",
  alternates: {
    canonical: "/terms",
  },
}

export default function TermsPage() {
  return <TermsPageClient />
}
