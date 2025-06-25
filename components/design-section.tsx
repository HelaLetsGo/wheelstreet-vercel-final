"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DesignSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const designFeatures = [
    {
      title: "AERODYNAMIC EXCELLENCE",
      description:
        "Every curve and contour of the LUXAUTO is designed with aerodynamic efficiency in mind, reducing drag and enhancing stability at high speeds.",
    },
    {
      title: "HANDCRAFTED INTERIOR",
      description:
        "Our interiors feature the finest materials, meticulously crafted by master artisans to create an environment of unparalleled luxury and comfort.",
    },
    {
      title: "ICONIC SILHOUETTE",
      description:
        "The distinctive profile of every LUXAUTO model is instantly recognizable, combining timeless elegance with contemporary design language.",
    },
  ]

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === designFeatures.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? designFeatures.length - 1 : prev - 1))
  }

  return (
    <section id="design" className="relative bg-black py-24">
      <div className="mx-auto max-w-[1800px] px-6 md:px-10">
        <h2 className="mb-16 text-3xl font-bold uppercase tracking-tight md:text-4xl">DESIGN</h2>

        <div className="relative">
          {/* Image Slider - replaced with gradient backgrounds */}
          <div className="relative aspect-[16/9] overflow-hidden">
            {designFeatures.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700",
                  activeIndex === index ? "opacity-100" : "opacity-0",
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              </div>
            ))}

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
              <h3 className="mb-4 text-3xl font-bold uppercase tracking-tight md:text-4xl">
                {designFeatures[activeIndex].title}
              </h3>
              <p className="max-w-xl text-lg text-white/80">{designFeatures[activeIndex].description}</p>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-black/50"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-black/50"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Indicators */}
          <div className="mt-6 flex justify-center space-x-2">
            {designFeatures.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn("h-1 w-10 transition-all", index === activeIndex ? "bg-white" : "bg-white/40")}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
