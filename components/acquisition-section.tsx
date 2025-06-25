import { ArrowRight } from "lucide-react"
import LeadFormButton from "@/components/lead-form-button"

export default function AcquisitionSection() {
  const steps = [
    {
      number: "01",
      title: "POKALBIS",
      description:
        "Išsamus pokalbis apie jūsų poreikius, biudžetą ir pageidavimus, padedantis nustatyti tinkamiausią automobilį.",
    },
    {
      number: "02",
      title: "PAIEŠKA",
      description:
        "Pateikiame kruopščiai atrinktus variantus ir organizuojame bandomuosius važiavimus jums patogiu metu.",
    },
    {
      number: "03",
      title: "DERYBOS",
      description: "Profesionaliai derinamės dėl geriausios kainos ir sąlygų, kad gautumėte optimalų pasiūlymą.",
    },
    {
      number: "04",
      title: "FINANSAVIMAS",
      description:
        "Padedame išsirinkti tinkamą finansavimo sprendimą, bendradarbiaudami su patikimais finansų partneriais.",
    },
    {
      number: "05",
      title: "PRISTATYMAS",
      description: "Jūsų automobilis paruošiamas ir pristatomas jūsų nurodytoje vietoje.",
    },
  ]

  return (
    <section id="acquisition" className="relative bg-black py-16 md:py-24">
      <div className="mx-auto max-w-[1800px] px-6 md:px-10">
        <div className="grid gap-12 md:gap-16 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-3xl font-bold uppercase tracking-tight md:text-4xl">
              PADEDAME ĮSIGYTI AUTOMOBILĮ
            </h2>
            <p className="mb-6 max-w-xl text-base md:text-lg text-foreground/80">
              Mūsų patogi ir aiški pagalba užtikrina sklandų automobilio įsigijimą be rūpesčių. Pasirūpiname kiekviena
              detale, kad jūs galėtumėte tiesiog džiaugtis nauju automobiliu.
            </p>

            {/* Replaced image with colored div */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-gradient-to-br from-gray-800 to-gray-900"></div>

            {/* Add the Lead Form Button */}
            <div className="mt-6 flex justify-center sm:justify-start">
              <LeadFormButton
                text="Pradėti pirkimo procesą"
                className="border border-white bg-transparent px-6 py-3 text-sm uppercase tracking-wider text-white transition-colors hover:bg-white/10"
              />
            </div>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group flex gap-6 border-b border-white/10 pb-6 hover:border-white/20 transition-colors"
              >
                <div className="text-3xl font-bold text-white/30">{step.number}</div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-white/70">{step.description}</p>
                </div>
                <div className="ml-auto mt-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
