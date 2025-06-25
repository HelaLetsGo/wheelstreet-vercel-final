import TeamPageClient from "./TeamPageClient"

export const metadata = {
  title: "Our Team | WheelStreet Auto Experts Lithuania",
  description: "Meet WheelStreet's team of automotive experts ready to help you find your perfect car.",
  alternates: {
    canonical: "/team",
  },
}

export default function TeamPage() {
  return <TeamPageClient />
}
