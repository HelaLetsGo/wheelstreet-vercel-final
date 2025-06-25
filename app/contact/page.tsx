import ContactPageClient from "./ContactPageClient"

export const metadata = {
  title: "Contact WheelStreet | Premium Auto Services Lithuania",
  description: "Contact WheelStreet's automotive experts for personalized car buying assistance in Lithuania.",
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
