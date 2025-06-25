"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Instagram, Facebook, Twitter, Youtube, ExternalLink, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const starlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!starlightRef.current) return

    const container = starlightRef.current
    const containerWidth = container.offsetWidth
    const containerHeight = container.offsetHeight

    // Clear previous stars
    container.innerHTML = ""

    // Create starlight effect (more subtle with fewer stars)
    const createStars = () => {
      // Reduced number of stars for a more subtle effect
      const starCount = Math.min(Math.floor((containerWidth * containerHeight) / 10000), 40)

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div")
        star.classList.add("starlight-star")

        // Random position
        const x = Math.random() * 100
        const y = Math.random() * 100

        // Random size (mostly small with a few larger ones)
        const size = Math.random() < 0.95 ? Math.random() * 1 + 0.3 : Math.random() * 2 + 1

        // Random brightness (more subtle)
        const opacity = Math.random() * 0.4 + 0.2

        // Random twinkle animation
        const duration = Math.random() * 8 + 4 // 4-12s
        const delay = Math.random() * 10 // 0-10s

        // Apply styles
        star.style.left = `${x}%`
        star.style.top = `${y}%`
        star.style.width = `${size}px`
        star.style.height = `${size}px`
        star.style.opacity = opacity.toString()
        star.style.animationDuration = `${duration}s`
        star.style.animationDelay = `${delay}s`

        container.appendChild(star)
      }
    }

    createStars()

    // Recreate stars on resize
    const handleResize = () => {
      if (container) {
        container.innerHTML = ""
        createStars()
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <footer className="relative bg-black py-12 sm:py-16 md:py-24 overflow-hidden">
      {/* Starlight effect container */}
      <div
        ref={starlightRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,1))",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1800px] px-4 sm:px-6 md:px-10">
        <div className="grid gap-8 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 sm:space-y-6 text-center md:text-left">
            <div className="mb-2 sm:mb-4">
              <span className="text-xl sm:text-2xl font-bold tracking-wider text-white">WHEELSTREET</span>
            </div>
            <p className="text-sm sm:text-base text-white/70 max-w-md mx-auto md:mx-0">
              Profesionaliai konsultuojame automobilių įsigijimo klausimais ir padedame rasti transporto priemonę, 
              kuri geriausiai atitiks Jūsų poreikius bei finansines galimybes.
            </p>
            <div className="flex items-center space-x-3 sm:space-x-4 justify-center md:justify-start">
              <Link
                href="#"
                className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/40 hover:text-white"
              >
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/40 hover:text-white"
              >
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/40 hover:text-white"
              >
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/40 hover:text-white"
              >
                <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="mb-4 sm:mb-6 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/50">
              Paslaugos
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link
                  href="#services"
                  className="text-sm sm:text-base text-white/70 transition-colors hover:text-white"
                >
                  Automobilių parinkimas ir įsigijimas
                </Link>
              </li>
              <li>
                <Link
                  href="#financing"
                  className="text-sm sm:text-base text-white/70 transition-colors hover:text-white"
                >
                  Finansavimo sprendimai ir konsultacijos
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="text-sm sm:text-base text-white/70 transition-colors hover:text-white"
                >
                  Draudimo paslaugos
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="text-sm sm:text-base text-white/70 transition-colors hover:text-white"
                >
                  Elektrinių automobilių sprendimai
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="mb-4 sm:mb-6 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/50">
              Apie mus
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link href="#about" className="text-sm sm:text-base text-white/70 transition-colors hover:text-white">
                  Mūsų istorija
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-sm sm:text-base text-white/70 transition-colors hover:text-white">
                  Komanda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm sm:text-base text-white/70 transition-colors hover:text-white">
                  Kontaktai
                </Link>
              </li>
              <li>
                <a
                  href="https://autoplius.lt/Wheelstreet/skelbimai/automobiliai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm sm:text-base text-white transition-colors hover:text-white/80"
                >
                  Mūsų automobiliai
                  <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="mb-4 sm:mb-6 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/50">
              Kontaktai
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-center gap-3 text-sm sm:text-base text-white/70 justify-center md:justify-start">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-white/40 shrink-0" />
                <a href="tel:+37061033377" className="hover:text-white">
                  +37061033377
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm sm:text-base text-white/70 justify-center md:justify-start">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-white/40 shrink-0" />
                <a href="mailto:info@wheelstreet.lt" className="hover:text-white">
                  info@wheelstreet.lt
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-base text-white/70 justify-center md:justify-start">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white/40 mt-1 shrink-0" />
                <span>Žirmūnų g. 139-303, LT-09120 Vilnius</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm text-white/50">
            © {new Date().getFullYear()} WHEELSTREET. Visos teisės saugomos.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <Link href="/privacy" className="text-xs sm:text-sm text-white/50 hover:text-white/70">
              Privatumo politika
            </Link>
            <Link href="/terms" className="text-xs sm:text-sm text-white/50 hover:text-white/70">
              Naudojimosi sąlygos
            </Link>
            <Link href="/cookies" className="text-xs sm:text-sm text-white/50 hover:text-white/70">
              Slapukų politika
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export const EnhancedFooter = () => {
  return <Footer />
}
