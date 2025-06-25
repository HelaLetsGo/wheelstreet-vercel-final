"use client"

import { useRef, useEffect, useState } from "react"
import { ChevronDown, Car, CreditCard, Shield, ArrowRight, Play, Sparkles } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import EnhancedLeadForm from "@/components/enhanced-lead-form"
import EditableSection from "@/components/admin/editable-section"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { createBrowserClient } from "@supabase/ssr"

export default function EnhancedHeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [contentLoaded, setContentLoaded] = useState(false)
  const [contentData, setContentData] = useState<any>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  // Parallax effect
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 1000], [0, -200])
  const y2 = useTransform(scrollY, [0, 1000], [0, -100])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  // Handle video playback
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => setIsVideoPlaying(true))
        .catch((e) => console.log("Video play error:", e))
    }
  }, [isDesktop])

  useEffect(() => {
    const fetchData = async (showLoading = true) => {
      if (showLoading) {
        setIsLoadingData(true)
      }
      
      try {
        const { data, error } = await supabase
          .from("page_sections")
          .select("*")
          .eq("section_type", "hero")
          .eq("is_active", true)
          .single()

        if (error) throw error

        setContentData(data)
        
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

    const cachedContent = sessionStorage.getItem("content_hero")
    if (cachedContent) {
      try {
        setContentData(JSON.parse(cachedContent))
        setIsLoadingData(false)
        fetchData(false)
      } catch (e) {
        console.error("Error parsing cached content:", e)
        fetchData(true)
      }
    } else {
      fetchData(true)
    }
  }, [supabase])

  useEffect(() => {
    if (!isLoadingData && contentData) {
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
    <EditableSection 
      sectionType="hero" 
      className="relative"
    >
      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black"
        aria-label="Hero section"
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-10 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
        </div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Video Background */}
        <div className="absolute inset-0 h-full w-full">
          <video
            ref={videoRef}
            src={
              contentData?.content_json?.video_url ||
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0416-V202qVy68bqtcxev1xgtPTpdSJPuYE.mp4"
            }
            className="h-full w-full object-cover opacity-40"
            muted
            loop
            playsInline
            autoPlay
          />
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
        </div>

        {/* Floating Elements */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 right-20 hidden lg:block"
        >
          <div className="w-20 h-20 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="w-8 h-8 text-white/30" />
          </div>
        </motion.div>

        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-32 left-20 hidden lg:block"
        >
          <div className="w-16 h-16 border border-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm rotate-45">
            <Car className="w-6 h-6 text-white/30 -rotate-45" />
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          style={{ opacity }}
          className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-24 sm:px-6 md:px-10 lg:px-16"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
              {/* Left column - Hero content */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
                
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-sm font-medium text-white/90">Premium Car Marketplace</span>
                </motion.div>

                {/* Main Heading */}
                <div className="space-y-4">
                  <AnimatePresence mode="wait">
                    {contentLoaded ? (
                      <motion.h1
                        key="loaded-title"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight"
                      >
                        <span className="bg-gradient-to-r from-white via-white to-blue-100 bg-clip-text text-transparent">
                          {contentData?.title}
                        </span>
                      </motion.h1>
                    ) : (
                      <motion.div
                        key="loading-title"
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        className="h-20 w-full max-w-2xl bg-gradient-to-r from-white/10 to-white/5 rounded-lg animate-pulse"
                      />
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    {contentLoaded ? (
                      <motion.p
                        key="loaded-subtitle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-xl sm:text-2xl font-light text-blue-100/90 leading-relaxed"
                      >
                        {contentData?.subtitle}
                      </motion.p>
                    ) : (
                      <motion.div
                        key="loading-subtitle"
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        className="h-8 w-3/4 bg-gradient-to-r from-white/10 to-white/5 rounded animate-pulse"
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Description */}
                <AnimatePresence mode="wait">
                  {contentLoaded ? (
                    <motion.p
                      key="loaded-description"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="text-lg text-white/70 leading-relaxed max-w-xl"
                    >
                      {contentData?.description}
                    </motion.p>
                  ) : (
                    <motion.div
                      key="loading-description"
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2 w-full max-w-xl"
                    >
                      <div className="h-6 bg-gradient-to-r from-white/10 to-white/5 rounded animate-pulse" />
                      <div className="h-6 w-4/5 bg-gradient-to-r from-white/10 to-white/5 rounded animate-pulse" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Feature highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex flex-wrap gap-6 pt-4"
                >
                  {[
                    { icon: Shield, text: "Guaranteed Quality" },
                    { icon: CreditCard, text: "Flexible Financing" },
                    { icon: Car, text: "Premium Selection" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-white/80 font-medium">{feature.text}</span>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="pt-4"
                >
                  <button 
                    onClick={scrollToNextSection}
                    className="group relative inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                  >
                    <span className="relative z-10">Explore Our Services</span>
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                  </button>
                </motion.div>
              </div>

              {/* Right column - Enhanced Lead Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                {/* Form Container */}
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
                  
                  {/* Form background */}
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                    
                    <div className="relative z-10">
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">Get Started Today</h3>
                        <p className="text-white/70">Tell us what you're looking for</p>
                      </div>
                      
                      <EnhancedLeadForm />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <button
            onClick={scrollToNextSection}
            className="group flex flex-col items-center space-y-2 text-white/60 hover:text-white transition-colors duration-300"
            aria-label="Scroll to next section"
          >
            <span className="text-sm font-medium">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center group-hover:border-white/60 transition-colors duration-300">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce group-hover:bg-white/80"></div>
            </div>
          </button>
        </motion.div>
      </section>
    </EditableSection>
  )
}