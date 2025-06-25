"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, ExternalLink, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Navbar from "@/components/navbar"

export default function Header({ scrolled = false }: { scrolled?: boolean }) {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(scrolled)

  // Handle scroll event to update header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    // Initialize on mount
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (teamDropdownOpen && !target.closest('[data-dropdown="team"]')) {
        setTeamDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [teamDropdownOpen])

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen)
  }

  const toggleTeamDropdown = () => {
    setTeamDropdownOpen(!teamDropdownOpen)
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-40 w-full transition-all duration-300",
          isScrolled ? "bg-header-bg/80 backdrop-blur-md border-b border-white/10 shadow-sm" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-20 sm:h-24 max-w-[1800px] items-center justify-between px-4 sm:px-6 md:px-10">
          <Link href="/" className="z-50 flex items-center">
            <span className="text-lg sm:text-xl font-bold tracking-wider text-header-text">WHEELSTREET</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center md:flex">
            <ul className="flex items-center space-x-4 lg:space-x-6">
              <li>
                <button
                  onClick={() => {
                    // Check if we're on the homepage
                    if (window.location.pathname === '/') {
                      // Scroll to services section
                      const servicesSection = document.getElementById('services');
                      if (servicesSection) {
                        servicesSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    } else {
                      // Navigate to homepage then scroll to services
                      window.location.href = '/#services';
                    }
                  }}
                  className="text-xs sm:text-sm font-medium uppercase tracking-wider text-header-text/80 transition-colors hover:text-header-text"
                >
                  Paslaugos
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    // Check if we're on the homepage
                    if (window.location.pathname === '/') {
                      // Scroll to about section
                      const aboutSection = document.getElementById('about');
                      if (aboutSection) {
                        aboutSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    } else {
                      // Navigate to homepage then scroll to about
                      window.location.href = '/#about';
                    }
                  }}
                  className="text-xs sm:text-sm font-medium uppercase tracking-wider text-header-text/80 transition-colors hover:text-header-text"
                >
                  Apie mus
                </button>
              </li>
              <li className="relative" data-dropdown="team">
                <button
                  className="flex items-center space-x-1 text-xs sm:text-sm font-medium uppercase tracking-wider text-header-text/80 transition-colors hover:text-header-text"
                  onClick={toggleTeamDropdown}
                  aria-expanded={teamDropdownOpen}
                  aria-haspopup="true"
                >
                  <span>Komanda</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${teamDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Team Dropdown */}
                {teamDropdownOpen && (
                  <div className="absolute left-0 z-50 mt-2 w-80 rounded-md border border-border bg-background shadow-lg">
                    <div className="p-4">
                      <h3 className="mb-3 text-sm font-semibold uppercase text-foreground/70">Mūsų komanda</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Link
                          href="/team/julius-jankauskas"
                          className="group flex flex-col items-center text-center p-3 rounded-sm hover:bg-muted"
                          onClick={() => setTeamDropdownOpen(false)}
                        >
                          <div className="relative h-16 w-16 overflow-hidden rounded-full mb-2">
                            <Image
                              src="/team/julius-jankauskas.jpg"
                              alt="Julius Jankauskas"
                              fill
                              className="object-cover"
                              objectPosition="center top"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Julius Jankauskas</p>
                            <p className="text-xs text-foreground/60">CEO</p>
                          </div>
                        </Link>
                        <Link
                          href="/team/vainius-mirskis"
                          className="group flex flex-col items-center text-center p-3 rounded-sm hover:bg-muted"
                          onClick={() => setTeamDropdownOpen(false)}
                        >
                          <div className="relative h-16 w-16 overflow-hidden rounded-full mb-2">
                            <Image
                              src="/team/vainius-mirskis.jpg"
                              alt="Vainius Mirskis"
                              fill
                              className="object-cover"
                              objectPosition="center top"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Vainius Mirskis</p>
                            <p className="text-xs text-foreground/60">COO</p>
                          </div>
                        </Link>
                        <Link
                          href="/team/mantas-jauga"
                          className="group flex flex-col items-center text-center p-3 rounded-sm hover:bg-muted"
                          onClick={() => setTeamDropdownOpen(false)}
                        >
                          <div className="relative h-16 w-16 overflow-hidden rounded-full mb-2">
                            <Image
                              src="/team/mantas-jauga.jpg"
                              alt="Mantas Jauga"
                              fill
                              className="object-cover"
                              objectPosition="center top"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Mantas Jauga</p>
                          </div>
                        </Link>
                        <Link
                          href="/team/vytautas-balodas"
                          className="group flex flex-col items-center text-center p-3 rounded-sm hover:bg-muted"
                          onClick={() => setTeamDropdownOpen(false)}
                        >
                          <div className="relative h-16 w-16 overflow-hidden rounded-full mb-2">
                            <Image
                              src="/team/vytautas-balodas.jpg"
                              alt="Vytautas Balodas"
                              fill
                              className="object-cover"
                              objectPosition="center top"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Vytautas Balodas</p>
                          </div>
                        </Link>
                        <Link
                          href="/team/nedas-mockevicius"
                          className="group flex flex-col items-center text-center p-3 rounded-sm hover:bg-muted"
                          onClick={() => setTeamDropdownOpen(false)}
                        >
                          <div className="relative h-16 w-16 overflow-hidden rounded-full mb-2">
                            <Image
                              src="/team/nedas-mockevicius.jpg"
                              alt="Nedas Mockevičius"
                              fill
                              className="object-cover"
                              objectPosition="center top"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Nedas Mockevičius</p>
                          </div>
                        </Link>
                        <Link
                          href="/team/martynas-linge"
                          className="group flex flex-col items-center text-center p-3 rounded-sm hover:bg-muted"
                          onClick={() => setTeamDropdownOpen(false)}
                        >
                          <div className="relative h-16 w-16 overflow-hidden rounded-full mb-2">
                            <Image
                              src="/team/martynas-linge.jpg"
                              alt="Martynas Lingė"
                              fill
                              className="object-cover"
                              objectPosition="center top"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Martynas Lingė</p>
                          </div>
                        </Link>
                      </div>
                      <div className="mt-3 border-t border-border pt-2">
                        <Link
                          href="/team"
                          className="flex items-center justify-center rounded-sm p-2 text-sm text-primary hover:bg-primary/10"
                          onClick={() => setTeamDropdownOpen(false)}
                        >
                          Visa komanda
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-xs sm:text-sm font-medium uppercase tracking-wider text-header-text/80 transition-colors hover:text-header-text"
                >
                  Kontaktai
                </Link>
              </li>
            </ul>
            <div className="ml-8 flex items-center gap-4">
              <a
                href="tel:+37061033377"
                className="hidden items-center gap-1.5 text-sm text-header-text/80 transition-colors hover:text-header-text lg:flex"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                +37061033377
              </a>

              {/* Main CTA Button */}
              <a
                href="https://autoplius.lt/Wheelstreet/skelbimai/automobiliai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-sm bg-gray-200/10 backdrop-blur-sm px-4 py-2 text-sm font-medium uppercase tracking-wider text-header-text transition-colors hover:bg-gray-200/20"
              >
                Peržiūrėti automobilius
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              {/* Navbar Toggle */}
              <button
                onClick={toggleNavbar}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-header-text transition-colors hover:bg-background/20"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Mobile CTA Button */}
            <a
              href="tel:+37061033377"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200/10 text-header-text"
              aria-label="Call us"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleNavbar}
              className="z-50 flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-header-text"
              aria-label="Toggle menu"
              aria-expanded={navbarOpen}
            >
              {navbarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Navbar Component */}
      <Navbar isOpen={navbarOpen} onClose={() => setNavbarOpen(false)} />
    </>
  )
}
