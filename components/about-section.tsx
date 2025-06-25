import SectionStarlight from "@/components/section-starlight"
import TeamSection from "@/components/team-section"
import { GridPattern } from "@/components/magicui/grid-pattern"
import { cn } from "@/lib/utils"

export default function AboutSection() {
  return (
    <section id="about" className="relative bg-slate-950 py-20 md:py-32 overflow-hidden">
      {/* GridPattern Background */}
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "absolute inset-0 h-full w-full fill-slate-800/20 stroke-slate-700/30",
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
        )}
      />

      <SectionStarlight density="low" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">APIE MUS</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-white to-slate-300 mx-auto"></div>
        </div>
        
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
              <p className="text-xl sm:text-2xl font-medium text-white leading-tight">
                WheelStreet – tai naujoviškas požiūris į automobilio pirkimą. Mūsų komanda padeda išsirinkti būtent tą
                automobilį, kuris geriausiai atitiks jūsų poreikius.
              </p>
              <p>
                Siekiame klientams rasti geriausius pasiūlymus ne tik automobiliui, bet ir jo išlaikymui: palankiausias
                lizingo sąlygas, draudimo kainas ir techninės priežiūros sprendimus.
              </p>
              <p>
                Mūsų tikslas – kad kuo daugiau naujų automobilių riedėtų Lietuvos keliais. Naujas automobilis suteikia
                ne tik ramybę ir komfortą, bet ir užtikrina didesnį saugumą.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-10 border border-slate-700/50">
              <h3 className="mb-6 text-xl sm:text-2xl font-bold text-white">KUO MES SKIRIAMĖS</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="mt-2 w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                  <span className="text-base sm:text-lg text-slate-200 leading-relaxed">Visapusiška pagalba perkant ir parduodant automobilius</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-2 w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                  <span className="text-base sm:text-lg text-slate-200 leading-relaxed">Geriausios garantijos perkant naudotą automobilį</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-2 w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                  <span className="text-base sm:text-lg text-slate-200 leading-relaxed">Visapusis skaidrumas parduodant ar įsigijant automobilį</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-2 w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                  <span className="text-base sm:text-lg text-slate-200 leading-relaxed">Profesionalus automobilio atstovavimas</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-10 border border-white/20">
              <h3 className="mb-6 text-xl sm:text-2xl font-bold text-white">MŪSŲ PAŽADAS</h3>
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
                Suteiksime malonų automobilio pirkimo ar pardavimo procesą, pakonsultuosime visose sudėtingose
                situacijose net ir po automobilio pardavimo, kad viskas kas liktų jums - džiaugtis parduotų/įsigytu
                automobiliu.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add the Team Section */}
      <TeamSection />
    </section>
  )
}
