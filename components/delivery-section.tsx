"use client"

import { useState } from "react"
import { ChevronRight, Globe, Truck, Shield, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DeliverySection() {
  const [activeTab, setActiveTab] = useState(0)

  const availableCars = [
    {
      name: "BMW M5",
      description:
        "Galingas ir sportiškas sedanas su patogiu interjeru, puikiai tinkantis kasdieniam vairavimui ir savaitgalio išvykoms.",
      deliveryTime: "4-6 savaitės",
    },
    {
      name: "Audi Q7",
      description:
        "Erdvus ir komfortiškas SUV su pažangiomis technologijomis ir puikiu valdymu įvairiomis kelio sąlygomis.",
      deliveryTime: "5-7 savaitės",
    },
    {
      name: "Mercedes-Benz E-Class",
      description:
        "Elegantiškas ir komfortiškas verslo klasės sedanas su aukštos kokybės interjeru ir pažangiomis technologijomis.",
      deliveryTime: "4-7 savaitės",
    },
    {
      name: "Volkswagen Touareg",
      description: "Patikimas ir aukštos kokybės SUV su moderniu interjeru ir puikiomis važiavimo savybėmis.",
      deliveryTime: "5-8 savaitės",
    },
  ]

  const deliveryFeatures = [
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "PLATUS TINKLAS",
      description:
        "Bendradarbiaujame su patikimais dileriais ir tiekėjais, kad galėtume pasiūlyti platų automobilių pasirinkimą.",
    },
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: "PATOGUS PRISTATYMAS",
      description: "Organizuojame patogų automobilio pristatymą tiesiai į jūsų nurodytą vietą.",
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "DOKUMENTŲ TVARKYMAS",
      description: "Pasirūpiname visais reikalingais dokumentais ir formalumais, kad jums nereikėtų.",
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "AIŠKŪS TERMINAI",
      description: "Nustatome aiškius terminus ir laikomės susitarimų, kad viskas vyktų sklandžiai.",
    },
  ]

  return (
    <section id="delivery" className="relative bg-section-bg-primary py-16 md:py-24 parallax-section">
      <div className="relative z-10 mx-auto max-w-[1800px] px-6 md:px-10">
        <h2
          className="mb-4 text-3xl font-bold uppercase tracking-tight md:text-4xl"
          data-parallax
          data-parallax-speed="0.1"
          data-parallax-direction="vertical"
        >
          PADEDAME RASTI BET KOKĮ AUTOMOBILĮ
        </h2>
        <p
          className="mb-10 max-w-2xl text-base text-foreground/70 md:mb-16 md:text-lg"
          data-parallax
          data-parallax-speed="0.15"
          data-parallax-direction="vertical"
        >
          Nesvarbu, ar ieškote naujo, ar naudoto automobilio – mūsų komanda gali jį surasti ir padėti įsigyti. Mūsų
          patirtis ir kontaktai leidžia mums rasti jums tinkamiausią variantą.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {deliveryFeatures.map((feature, index) => (
            <div
              key={index}
              className="rounded-sm border border-border bg-custom-card-bg p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              data-parallax
              data-parallax-speed={`${0.05 + index * 0.02}`}
              data-parallax-direction="vertical"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
              <p className="text-sm text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 border-b border-border">
          <div className="flex flex-wrap">
            {availableCars.map((car, index) => (
              <button
                key={index}
                className={cn(
                  "px-6 py-3 text-sm font-medium transition-colors",
                  activeTab === index
                    ? "border-b-2 border-primary text-primary"
                    : "text-foreground/60 hover:text-foreground",
                )}
                onClick={() => setActiveTab(index)}
              >
                {car.name}
              </button>
            ))}
          </div>
        </div>

        {availableCars.map((car, index) => (
          <div
            key={index}
            className={cn(
              "grid gap-8 md:grid-cols-2 transition-opacity duration-300",
              activeTab === index ? "block opacity-100" : "hidden opacity-0",
            )}
          >
            <div>
              <h3 className="mb-4 text-2xl font-bold">{car.name}</h3>
              <p className="mb-6 text-foreground/80">{car.description}</p>

              <div className="mb-6 rounded-sm border border-border bg-background/50 p-6">
                <h4 className="mb-2 text-lg font-bold">PRISTATYMO INFORMACIJA</h4>
                <p className="mb-4 text-foreground/80">
                  Vidutinis pristatymo laikas: <span className="font-semibold">{car.deliveryTime}</span>
                </p>
                <p className="text-foreground/80">
                  Galime padėti rasti šį modelį pagal jūsų pageidavimus, įskaitant spalvą, interjerą ir papildomą
                  įrangą. Mūsų komanda pasirūpins visais dokumentais ir pristatymu.
                </p>
              </div>

              <button className="flex items-center gap-2 border border-primary bg-transparent px-6 py-3 text-sm uppercase tracking-wider text-primary transition-colors hover:bg-primary/10">
                Sužinoti daugiau
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              {/* Simple gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground/20">{car.name}</span>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-16 text-center">
          <a
            href="https://autoplius.lt/Wheelstreet/skelbimai/automobiliai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-primary bg-primary/10 px-8 py-4 text-sm uppercase tracking-wider text-primary transition-colors hover:bg-primary/20"
          >
            Peržiūrėti visus automobilius
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
