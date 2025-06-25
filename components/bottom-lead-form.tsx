"use client"

import EnhancedLeadForm from "@/components/enhanced-lead-form"
import { Check } from "lucide-react"

export default function BottomLeadForm() {
  return (
    <section className="relative bg-black py-16 sm:py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-black"></div>

      <div className="relative z-10 mx-auto max-w-[1800px] px-4 sm:px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Gaukite asmeninį pasiūlymą
            </h2>
            <p className="text-sm sm:text-base text-white/70 max-w-xl">
              Užpildykite formą ir mūsų komanda paruoš jums individualų pasiūlymą pagal jūsų poreikius ir biudžetą. Mūsų
              ekspertai padės išsirinkti tinkamiausią automobilį ir pasiūlys optimaliausias finansavimo sąlygas.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 mt-0.5">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <p className="text-white/80">Profesionalios konsultacijos</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 mt-0.5">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <p className="text-white/80">Individualūs pasiūlymai</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 mt-0.5">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <p className="text-white/80">Greitas atsakymas per 24 val.</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto md:ml-auto md:mr-0">
            <EnhancedLeadForm />
          </div>
        </div>
      </div>
    </section>
  )
}
