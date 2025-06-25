"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavbarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Navbar({ isOpen, onClose }: NavbarProps) {
  const [mounted, setMounted] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  // Handle escape key to close navbar
  useEffect(() => {
    setMounted(true)

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  // Handle touch swipe to close
  useEffect(() => {
    if (!navRef.current || !isOpen) return

    let startX: number
    let currentX: number
    const threshold = 100 // minimum distance to be considered a swipe

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!startX) return
      currentX = e.touches[0].clientX
    }

    const handleTouchEnd = () => {
      if (startX && currentX && startX - currentX > threshold) {
        onClose()
      }
      startX = 0
      currentX = 0
    }

    const nav = navRef.current
    nav.addEventListener("touchstart", handleTouchStart)
    nav.addEventListener("touchmove", handleTouchMove)
    nav.addEventListener("touchend", handleTouchEnd)

    return () => {
      nav.removeEventListener("touchstart", handleTouchStart)
      nav.removeEventListener("touchmove", handleTouchMove)
      nav.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isOpen, onClose])

  if (!mounted) return null

  // Team members data
  const teamMembers = [
    {
      id: "julius-jankauskas",
      name: "Julius Jankauskas",
      position: "CEO",
      imageSrc: "/team/julius-jankauskas.jpg",
    },
    {
      id: "vainius-mirskis",
      name: "Vainius Mirskis",
      position: "COO",
      imageSrc: "/team/vainius-mirskis.jpg",
    },
    {
      id: "mantas-jauga",
      name: "Mantas Jauga",
      position: "Automobilių konsultantas",
      imageSrc: "/team/mantas-jauga.jpg",
    },
    {
      id: "vytautas-balodas",
      name: "Vytautas Balodas",
      position: "Finansų ekspertas",
      imageSrc: "/team/vytautas-balodas.jpg",
    },
    {
      id: "nedas-mockevicius",
      name: "Nedas Mockevičius",
      position: "Elektromobilių specialistas",
      imageSrc: "/team/nedas-mockevicius.jpg",
    },
    {
      id: "martynas-linge",
      name: "Martynas Lingė",
      position: "Automobilių konsultantas",
      imageSrc: "/team/martynas-linge.jpg",
    },
  ]

  // Main sections
  const mainSections = [
    { id: "services", name: "Paslaugos" },
    { id: "about", name: "Apie mus" },
    { id: "team", name: "Komanda" },
    { id: "contact", name: "Kontaktai" },
  ]

  return (
    <div
      ref={navRef}
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-background transition-opacity duration-300",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="flex h-20 sm:h-24 items-center justify-between border-b border-border px-4 sm:px-6 md:px-10">
        <Link href="/" className="text-xl font-bold tracking-wider text-foreground" onClick={onClose}>
          WHEELSTREET
        </Link>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-foreground"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid flex-1 grid-cols-1 overflow-auto md:grid-cols-2">
        {/* Main Sections */}
        <div className="border-r border-border bg-background/50 p-6 sm:p-10">
          <h2 className="mb-6 sm:mb-8 text-sm font-semibold uppercase tracking-wider text-foreground/50">
            Pagrindiniai puslapiai
          </h2>
          <nav>
            <ul className="space-y-4 sm:space-y-6">
              {mainSections.map((section) => (
                <li key={section.id}>
                  {section.id === "services" || section.id === "about" || section.id === "team" ? (
                    <button
                      onClick={() => {
                        onClose()
                        // Check if we're on the homepage
                        if (window.location.pathname === '/') {
                          // Scroll to section
                          const targetSection = document.getElementById(section.id);
                          if (targetSection) {
                            targetSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        } else {
                          // Navigate to homepage then scroll to section
                          window.location.href = `/#${section.id}`;
                        }
                      }}
                      className="mobile-menu-item text-xl sm:text-2xl font-bold tracking-wide text-foreground transition-colors hover:text-primary text-left"
                    >
                      {section.name}
                    </button>
                  ) : (
                    <Link
                      href={`/${section.id === "services" ? "" : section.id}`}
                      className="mobile-menu-item text-xl sm:text-2xl font-bold tracking-wide text-foreground transition-colors hover:text-primary"
                      onClick={onClose}
                    >
                      {section.name}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <a
                  href="https://autoplius.lt/Wheelstreet/skelbimai/automobiliai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-menu-item text-xl sm:text-2xl font-bold tracking-wide text-foreground transition-colors hover:text-primary"
                  onClick={onClose}
                >
                  Mūsų automobiliai
                </a>
              </li>
            </ul>

            {/* Legal pages */}
            <div className="mt-10 pt-6 border-t border-border/50">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/50">
                Teisinė informacija
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/privacy"
                    className="text-base text-foreground/70 transition-colors hover:text-foreground"
                    onClick={onClose}
                  >
                    Privatumo politika
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-base text-foreground/70 transition-colors hover:text-foreground"
                    onClick={onClose}
                  >
                    Naudojimosi sąlygos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-base text-foreground/70 transition-colors hover:text-foreground"
                    onClick={onClose}
                  >
                    Slapukų politika
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Team Members */}
        <div className="bg-background/30 p-6 sm:p-10">
          <h2 className="mb-6 sm:mb-8 text-sm font-semibold uppercase tracking-wider text-foreground/50">
            Mūsų komanda
          </h2>
          <div className="grid gap-4 grid-cols-2">
            {teamMembers.map((member) => (
              <Link key={member.id} href={`/team/${member.id}`} className="group" onClick={onClose}>
                <div className="flex flex-col items-center p-3 rounded-sm hover:bg-white/5 transition-colors">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full mb-3">
                    <Image
                      src={member.imageSrc || "/team-placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                      objectPosition="center top"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-foreground group-hover:text-primary">{member.name}</h3>
                    {member.position && <p className="text-xs text-foreground/60">{member.position}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-background/50 p-4">
        <div className="flex flex-col items-center justify-center space-y-2 text-sm text-foreground/70 md:flex-row md:space-x-4 md:space-y-0">
          <div className="flex items-center">
            <span className="mr-2">📍</span>
            <span>Žirmūnų g. 139-303, LT-09120 Vilnius</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">📞</span>
            <a href="tel:+37061033377" className="hover:text-white/80">
              +37061033377
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border bg-background/50 p-6 text-center">
        <p className="text-sm text-foreground/50">© {new Date().getFullYear()} WHEELSTREET. Visos teisės saugomos.</p>
      </div>
    </div>
  )
}
