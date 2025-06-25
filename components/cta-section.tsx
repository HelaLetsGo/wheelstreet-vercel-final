import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 z-0">
        {/* Replaced image with gradient background */}
        <div className="h-full w-full bg-gradient-to-br from-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      </div>

      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Begin Your Exceptional Journey
          </h2>
          <p className="mb-8 text-lg text-white/80">
            Schedule a private consultation with our automotive specialists to discuss your unique requirements and
            aspirations.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-300 to-amber-500 text-black hover:from-amber-400 hover:to-amber-600"
            >
              Book Private Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Explore Collection
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
