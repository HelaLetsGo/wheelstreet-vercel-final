import PrivacyPageClient from "./PrivacyPageClient"

export const metadata = {
  title: "Privacy Policy | WheelStreet Auto Services",
  description: "WheelStreet's privacy policy - how we protect and handle your personal information.",
  alternates: {
    canonical: "/privacy",
  },
}

export default function PrivacyPage() {
  return <PrivacyPageClient />
}
