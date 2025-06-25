"use client"

import { useRef, useEffect } from "react"
import { ChevronDown, Car, CreditCard, Shield } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Handle video playback on component mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((e) => {
        console.log("Video play error:", e)
        // If autoplay fails, try to load a poster image instead
        if (videoRef.current) {
          videoRef.current.poster = "/hero-car-1.jpg"
        }
      })
    }
  }, [isDesktop])

  const scrollToNextSection = () => {
    const nextSection = document.getElementById("services")
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden parallax-container">
      {/* Video Background */}
      <div className="absolute inset-0 h-full w-full">
        <video
          ref={videoRef}
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0416-V202qVy68bqtcxev1xgtPTpdSJPuYE.mp4"
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          autoPlay
          poster="/hero-car-1.jpg" // Add a poster image as fallback
        />
        {/* Enhanced dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 py-24 sm:px-6 md:px-10 lg:px-16 safe-area-inset">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Text container with additional background for better visibility */}
            <div className="relative rounded-lg p-6 md:p-0 md:bg-transparent max-w-3xl w-full">
              {/* Semi-transparent background on mobile only */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-lg md:hidden"></div>

              <div className="relative mobile-center">
                <h1
                  className="mb-4 sm:mb-6 text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
                  data-parallax
                  data-parallax-speed="0.2"
                  data-parallax-direction="vertical"
                >
                  JŪSŲ AUTOPIRKIMO ASISTENTAS
                </h1>
                <p
                  className="mb-6 sm:mb-8 text-base sm:text-xl text-white md:text-2xl font-medium drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)]"
                  data-parallax
                  data-parallax-speed="0.25"
                  data-parallax-direction="vertical"
                >
                  Padedame išsirinkti ir prižiūrėti jūsų automobilį. Paprastas ir skaidrus procesas.
                </p>

                {/* Service highlights */}
                <div
                  className="mb-6 sm:mb-8 grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-md mx-auto"
                  data-parallax
                  data-parallax-speed="0.3"
                  data-parallax-direction="vertical"
                >
                  <div
                    className="flex flex-col items-center"
                    data-parallax
                    data-parallax-speed="0.15"
                    data-parallax-direction="horizontal"
                    data-parallax-offset="-10"
                  >
                    <div className="mb-2 flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                      <Car className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-center">
                      Automobilio paieška
                    </span>
                  </div>
                  <div
                    className="flex flex-col items-center"
                    data-parallax
                    data-parallax-speed="0.15"
                    data-parallax-direction="horizontal"
                  >
                    <div className="mb-2 flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                      <CreditCard className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-center">
                      Finansavimo pagalba
                    </span>
                  </div>
                  <div
                    className="flex flex-col items-center"
                    data-parallax
                    data-parallax-speed="0.15"
                    data-parallax-direction="horizontal"
                    data-parallax-offset="10"
                  >
                    <div className="mb-2 flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                      <Shield className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-center">
                      Patikima apsauga
                    </span>
                  </div>
                </div>

                <button
                  onClick={scrollToNextSection}
                  className="flex items-center justify-center gap-2 border border-white bg-white/10 backdrop-blur-sm px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm uppercase tracking-wider text-white transition-colors hover:bg-white/20 animate-float mx-auto min-h-[44px] min-w-[180px]"
                  data-parallax
                  data-parallax-speed="0.35"
                  data-parallax-direction="vertical"
                >
                  Sužinoti daugiau
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
