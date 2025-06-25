"use client"

import { useRef, useEffect, useState } from "react"
import { ChevronDown, Car, CreditCard, Shield } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import EnhancedLeadForm from "@/components/enhanced-lead-form"
import EditableSection from "@/components/admin/editable-section"
import { motion, AnimatePresence } from "framer-motion"
import { createBrowserClient } from "@supabase/ssr"
import { ShinyButton } from "@/components/ui/shiny-button"

export default function HeroSectionWithForm() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [contentLoaded, setContentLoaded] = useState(false)
  const [contentData, setContentData] = useState<any>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  
  // Create Supabase client only if environment variables are available
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
    ? createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    : null

  // Handle video playback on component mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((e) => console.log("Video play error:", e))
    }
  }, [isDesktop])

  useEffect(() => {
    const fetchData = async (showLoading = true) => {
      if (showLoading) {
        setIsLoadingData(true)
      }
      
      try {
        if (!supabase) {
          // When Supabase is not available (during build), just set loading to false
          setIsLoadingData(false)
          return
        }
        
        // Fetch directly from Supabase
        const { data, error } = await supabase
          .from("page_sections")
          .select("*")
          .eq("section_type", "hero")
          .eq("is_active", true)
          .single()

        if (error) {
          throw error
        }

        // Always update with fresh data
        setContentData(data)
        
        // Cache the fresh content
        if (data) {
          sessionStorage.setItem("content_hero", JSON.stringify(data))
        }
      } catch (error) {
        console.error("Failed to load content:", error)
        setContentData(null)
      } finally {
        if (showLoading) {
          setIsLoadingData(false)
        }
      }
    }

    // Try to get content from sessionStorage first to avoid flicker
    const cachedContent = sessionStorage.getItem("content_hero")
    if (cachedContent) {
      try {
        setContentData(JSON.parse(cachedContent))
        setIsLoadingData(false)
        // Fetch fresh data in background
        fetchData(false)
      } catch (e) {
        console.error("Error parsing cached content:", e)
        fetchData(true)
      }
    } else {
      fetchData(true)
    }
  }, [supabase])

  // Set contentLoaded to true once content is loaded
  useEffect(() => {
    if (!isLoadingData && contentData) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setContentLoaded(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isLoadingData, contentData])

  const scrollToNextSection = () => {
    const nextSection = document.getElementById("services")
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <EditableSection sectionType="hero" sectionId={contentData?.id || ""} title="Hero">
      <section className="relative min-h-[100svh] w-full overflow-hidden parallax-container">
        {/* Video Background */}
        <div className="absolute inset-0 h-full w-full">
          <video
            ref={videoRef}
            src={
              contentData?.content_json?.video_url ||
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0416-V202qVy68bqtcxev1xgtPTpdSJPuYE.mp4"
            }
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            autoPlay
          />
          {/* Lighter overlay for brighter video visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 py-24 sm:px-6 md:px-10 lg:px-16 safe-area-inset">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left column - Hero text */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <AnimatePresence mode="wait">
                  {contentLoaded ? (
                    <motion.h1
                      key="loaded-title"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="mb-4 sm:mb-6 text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
                      data-parallax
                      data-parallax-speed="0.2"
                      data-parallax-direction="vertical"
                    >
                      {contentData?.title}
                    </motion.h1>
                  ) : (
                    <motion.div
                      key="loading-title"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 0.8 }}
                      exit={{ opacity: 0 }}
                      className="mb-4 sm:mb-6 h-16 sm:h-24 w-full max-w-md bg-white/10 rounded-md animate-pulse"
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {contentLoaded ? (
                    <motion.p
                      key="loaded-description"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                      className="mb-6 sm:mb-8 text-base sm:text-xl text-white md:text-2xl font-medium drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)]"
                      data-parallax
                      data-parallax-speed="0.25"
                      data-parallax-direction="vertical"
                    >
                      {contentData?.description}
                    </motion.p>
                  ) : (
                    <motion.div
                      key="loading-description"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 0.8 }}
                      exit={{ opacity: 0 }}
                      className="mb-6 sm:mb-8 h-8 sm:h-12 w-full max-w-sm bg-white/10 rounded-md animate-pulse"
                    />
                  )}
                </AnimatePresence>

                {/* Service highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: contentLoaded ? 1 : 0, y: contentLoaded ? 0 : 10 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                  className="mb-6 sm:mb-8 grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-md"
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
                      Automobilio parinkimas
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
                      Finansavimo sprendimai
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
                      Profesionalus patikimumas
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: contentLoaded ? 1 : 0, y: contentLoaded ? 0 : 10 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                  data-parallax
                  data-parallax-speed="0.35"
                  data-parallax-direction="vertical"
                >
                  <ShinyButton
                    onClick={scrollToNextSection}
                    variant="outline"
                    className="flex items-center justify-center gap-2 bg-white text-black border-white hover:bg-gray-100 hover:border-gray-200 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-300 animate-float min-h-[44px] min-w-[200px] shadow-2xl shadow-black/50 whitespace-nowrap"
                  >
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      {contentLoaded ? contentData?.cta_text : "Sužinoti daugiau"}
                      <ChevronDown className="h-4 w-4 flex-shrink-0" />
                    </span>
                  </ShinyButton>
                </motion.div>
              </div>

              {/* Right column - Lead form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="w-full max-w-md mx-auto md:ml-auto md:mr-0"
                data-parallax
                data-parallax-speed="0.4"
                data-parallax-direction="vertical"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl shadow-black/30 p-1">
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl">
                    <EnhancedLeadForm />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </EditableSection>
  )
}
