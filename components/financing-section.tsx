import { Calculator, Shield, Clock } from "lucide-react"
import LeadFormButton from "@/components/lead-form-button"

export default function FinancingSection() {
  return (
    <section id="financing" className="relative bg-zinc-900 py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 md:px-10">
        <div className="grid gap-8 sm:gap-12 md:gap-16 md:grid-cols-2">
          <div>
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold uppercase tracking-tight md:text-4xl">
              FINANSAVIMAS
            </h2>
            <p className="mb-5 sm:mb-6 max-w-xl text-sm sm:text-base md:text-lg text-white/80">
              Pritaikome finansavimo sprendimus pagal jūsų individualią situaciją, užtikrindami optimalias sąlygas ir
              skaidrų procesą.
            </p>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex gap-4 sm:gap-5 bg-black/30 p-4 sm:p-5 border border-white/10 rounded-sm hover:border-white/20 transition-colors">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-black/30 shrink-0">
                  <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-1 sm:mb-2 text-lg sm:text-xl font-bold text-white">LIZINGAS SU LIKUTINE VERTE</h3>
                  <p className="text-sm sm:text-base text-white/70">
                    Mažesni mėnesiniai mokėjimai ir didesnis lankstumas. Finansuojate tik apie 55% automobilio vertės.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-5 bg-black/30 p-4 sm:p-5 border border-white/10 rounded-sm hover:border-white/20 transition-colors">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-black/30 shrink-0">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-1 sm:mb-2 text-lg sm:text-xl font-bold text-white">DRAUDIMO PAKETAI</h3>
                  <p className="text-sm sm:text-base text-white/70">
                    Išsamus KASKO ir civilinės atsakomybės draudimas su lengvatinėmis sąlygomis.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-5 bg-black/30 p-4 sm:p-5 border border-white/10 rounded-sm hover:border-white/20 transition-colors">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-black/30 shrink-0">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-1 sm:mb-2 text-lg sm:text-xl font-bold text-white">PRATĘSTA GARANTIJA</h3>
                  <p className="text-sm sm:text-base text-white/70">
                    Papildoma apsauga iki 3 metų po gamintojo garantijos, apsauganti nuo nenumatytų remonto išlaidų.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center mt-4 md:mt-0">
            <div className="border border-white/10 bg-black/30 p-5 sm:p-8 backdrop-blur-sm rounded-sm">
              <h3 className="mb-5 sm:mb-6 text-xl sm:text-2xl font-bold uppercase">MŪSŲ PRIVALUMAI</h3>
              <ul className="space-y-4 sm:space-y-5 text-white/80">
                <li className="flex items-start gap-3 sm:gap-4">
                  <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs sm:text-sm font-bold shrink-0">
                    01
                  </span>
                  <div>
                    <h4 className="mb-1 font-bold text-white text-base sm:text-lg">Mažesnės palūkanos</h4>
                    <p className="text-sm sm:text-base">
                      Išsiderėtos žemesnės nei rinkos palūkanų normos per mūsų finansinius partnerius.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 sm:gap-4">
                  <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs sm:text-sm font-bold shrink-0">
                    02
                  </span>
                  <div>
                    <h4 className="mb-1 font-bold text-white text-base sm:text-lg">Didesnis lankstumas</h4>
                    <p className="text-sm sm:text-base">
                      Galimybė keisti automobilio modelį ar grąžinti jį anksčiau be didelių papildomų išlaidų.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 sm:gap-4">
                  <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs sm:text-sm font-bold shrink-0">
                    03
                  </span>
                  <div>
                    <h4 className="mb-1 font-bold text-white text-base sm:text-lg">Skaidrus procesas</h4>
                    <p className="text-sm sm:text-base">
                      Aiškiai paaiškiname visas sąlygas ir užtikriname, kad sutartyse nebūtų paslėptų mokesčių.
                    </p>
                  </div>
                </li>
              </ul>

              {/* Add the Lead Form Button */}
              <div className="mt-6 flex justify-center sm:justify-start">
                <LeadFormButton
                  text="Asmeninis finansavimo pasiūlymas"
                  className="w-full border border-white bg-transparent px-6 py-3 text-sm uppercase tracking-wider text-white transition-colors hover:bg-white/10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
