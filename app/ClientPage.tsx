"use client"

import { useEffect } from "react"
import { useSmoothScroll } from "@/lib/smooth-scroll"
import HeroSectionWithForm from "@/components/hero-section-with-form"
import ServicesSection from "@/components/services-section"
import AboutSectionWrapper from "@/components/about-section-wrapper"
import { LocalBusinessJsonLd, ServiceJsonLd } from "@/components/json-ld"

export default function ClientPage() {
  // Enable smooth scrolling
  useSmoothScroll()

  // Add scroll-based animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      // You can add scroll-based animations here if needed
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* JSON-LD Structured Data */}
      <LocalBusinessJsonLd />
      <ServiceJsonLd />

      <HeroSectionWithForm />
      <ServicesSection />
      <AboutSectionWrapper />
    </>
  )
}
