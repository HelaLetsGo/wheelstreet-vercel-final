"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ModelsSection() {
  const [activeModel, setActiveModel] = useState(0)

  const models = [
    {
      name: "BMW 5 Series",
      specs: {
        power: "245 AG",
        acceleration: "6.2s",
        topSpeed: "250 km/h",
      },
      description: "Elegantiškas ir dinamiškas sedanas su moderniausiomis technologijomis.",
    },
    {
      name: "Audi Q7",
      specs: {
        power: "286 AG",
        acceleration: "6.9s",
        topSpeed: "226 km/h",
      },
      description: "Erdvus ir komfortiškas SUV su aukštos kokybės interjeru.",
    },
    {
      name: "Mercedes-Benz E-Class",
      specs: {
        power: "258 AG",
        acceleration: "6.4s",
        topSpeed: "250 km/h",
      },
      description: "Pažangių technologijų ir komforto derinys su išskirtiniu vokišku meistriškumu.",
    },
    {
      name: "Volkswagen Touareg",
      specs: {
        power: "231 AG",
        acceleration: "7.5s",
        topSpeed: "222 km/h",
      },
      description: "Patikimas ir aukštos kokybės SUV su puikiomis važiavimo savybėmis.",
    },
  ]

  return (
    <section id="models" className="relative bg-section-bg-primary py-16 md:py-24 parallax-section">
      <div className="relative z-10 mx-auto max-w-[1800px] px-6 md:px-10">
        <h2
          className="mb-4 text-3xl font-bold tracking-tight md:text-4xl"
          data-parallax
          data-parallax-speed="0.1"
          data-parallax-direction="vertical"
        >
          AUTOMOBILIAI
        </h2>
        <p
          className="mb-10 max-w-2xl text-base text-foreground/70 md:mb-16 md:text-lg"
          data-parallax
          data-parallax-speed="0.15"
          data-parallax-direction="vertical"
        >
          Padedame išsirinkti ir įsigyti patikimus automobilius pagal jūsų poreikius ir biudžetą.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {models.map((model, index) => (
            <div
              key={index}
              className={cn(
                "group cursor-pointer rounded-sm border border-border bg-custom-card-bg p-4 transition-all duration-300 hover:border-border/50 hover:bg-custom-card-hover",
                activeModel === index ? "opacity-100" : "opacity-70",
              )}
              onClick={() => setActiveModel(index)}
              data-parallax
              data-parallax-speed={`${0.05 + index * 0.02}`}
              data-parallax-direction="vertical"
              data-parallax-offset={`${index * 5}`}
            >
              {/* Replaced image with colored div */}
              <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-sm bg-gradient-to-br from-gray-700 to-gray-900"></div>
              <h3 className="mb-2 text-xl font-bold">{model.name}</h3>
              <p className="mb-3 line-clamp-2 text-sm text-foreground/70">{model.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-3 text-sm text-foreground/80">
                  <span className="rounded-sm bg-secondary px-2 py-1">{model.specs.power}</span>
                  <span className="rounded-sm bg-secondary px-2 py-1">{model.specs.acceleration}</span>
                  <span className="rounded-sm bg-secondary px-2 py-1">{model.specs.topSpeed}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-foreground/50 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-10 flex justify-center md:mt-16"
          data-parallax
          data-parallax-speed="0.2"
          data-parallax-direction="vertical"
        >
          <a
            href="#"
            className="w-full border border-primary bg-transparent px-6 py-3 text-center text-sm uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:w-auto"
          >
            Visi siūlomi modeliai
          </a>
        </div>
      </div>
    </section>
  )
}
