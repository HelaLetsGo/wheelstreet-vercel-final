import AboutPageClient from "./AboutPageClient"
import MainLayout from "@/components/main-layout"

export const metadata = {
  title: "About WheelStreet | Premium Auto Experts Lithuania",
  description: "Learn about WheelStreet's mission to transform car buying in Lithuania with premium services.",
  alternates: {
    canonical: "/about",
  },
}

export default function AboutPage() {
  return (
    <MainLayout>
      <AboutPageClient />
    </MainLayout>
  )
}
