"use client"

import { Mail, Phone, MapPin, Clock, Building } from "lucide-react"
import { LocalBusinessJsonLd } from "@/components/json-ld"
import EnhancedLeadForm from "@/components/enhanced-lead-form"

export default function ContactPageClient() {
  return (
    <>
      <LocalBusinessJsonLd />

      <div className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-10">
          <h1 className="mb-4 text-3xl sm:text-4xl font-bold text-center sm:text-left">Susisiekite su mumis</h1>
          <p className="mb-12 max-w-2xl text-foreground/70 text-center sm:text-left mx-auto sm:mx-0">
            Mūsų komanda pasiruošusi atsakyti į visus Jūsų klausimus apie automobilių įsigijimą, finansavimą ir kitas
            paslaugas. Susisiekite su mumis bet kuriuo patogiu būdu.
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div>
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-bold">Telefonas</h3>
                    <p className="text-foreground/70">Skambinkite mums darbo valandomis</p>
                    <a
                      href="tel:+37061033377"
                      className="mt-1 inline-block text-xl font-semibold text-primary hover:underline"
                    >
                      +37061033377
                    </a>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-bold">El. paštas</h3>
                    <p className="text-foreground/70">Atsakysime per 24 valandas</p>
                    <a
                      href="mailto:info@wheelstreet.lt"
                      className="mt-1 inline-block text-xl font-semibold text-primary hover:underline"
                    >
                      info@wheelstreet.lt
                    </a>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-bold">Adresas</h3>
                    <p className="text-foreground/70">Atvykite susitikti asmeniškai</p>
                    <p className="mt-1 text-xl font-semibold">Žirmūnų g. 139-303, LT-09120 Vilnius</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-bold">Darbo laikas</h3>
                    <p className="text-foreground/70">Esame pasiruošę Jums padėti</p>
                    <div className="mt-1 space-y-1">
                      <p>Pirmadienis - Penktadienis: 9:00 - 18:00</p>
                      <p>Šeštadienis: Pagal išankstinį susitarimą</p>
                      <p>Sekmadienis: Nedirbame</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-bold">Įmonės informacija</h3>
                    <p className="text-foreground/70">Juridiniai duomenys</p>
                    <div className="mt-1 space-y-1">
                      <p>Įmonės kodas: 307131927</p>
                      <p>PVM mokėtojo kodas: LT100017717015</p>
                      <p>Adresas: Žirmūnų g. 139-303, LT-09120 Vilnius</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 rounded-sm border border-border p-6 text-center sm:text-left">
                <h3 className="mb-4 text-xl font-bold">Susitikite su mūsų komanda</h3>
                <p className="mb-4 text-foreground/70">
                  Rekomenduojame susitikti asmeniškai su mūsų konsultantais, kurie padės išsirinkti tinkamiausią
                  automobilį pagal Jūsų poreikius.
                </p>
                <a
                  href="/team"
                  className="inline-flex items-center border border-primary bg-transparent px-4 py-2 text-sm uppercase tracking-wider text-primary transition-colors hover:bg-primary/10 min-h-[44px]"
                >
                  Susipažinti su komanda
                </a>
              </div>
            </div>

            {/* Lead Form - Same as home page */}
            <div className="w-full">
              <EnhancedLeadForm />
            </div>
          </div>

          {/* Simple Map Placeholder - Add your real map integration here */}
          <div className="mt-16 h-80 rounded-sm bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center mb-16">
            <p className="text-foreground/40">Google Maps integracijos vieta</p>
          </div>
        </div>
      </div>
    </>
  )
}
