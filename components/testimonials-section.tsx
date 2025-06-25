import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Quote, User } from "lucide-react"

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Their attention to detail and understanding of luxury automobiles is unmatched. They found me a limited edition model I'd been searching for years.",
      author: "Alexander Wright",
      position: "CEO, Wright Enterprises",
    },
    {
      quote:
        "The concierge maintenance service has transformed how I manage my collection. Their team treats each vehicle with the reverence it deserves.",
      author: "Victoria Chen",
      position: "Art Collector & Philanthropist",
    },
    {
      quote:
        "From acquisition to management, their white-glove service has exceeded my expectations at every turn. Truly a cut above.",
      author: "Jonathan Reynolds",
      position: "Private Investor",
    },
  ]

  return (
    <section id="experience" className="bg-zinc-900 py-24">
      <div className="container">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">Client Experiences</h2>
          <p className="mx-auto max-w-2xl text-lg text-white/70">
            Discover what our distinguished clientele has to say about their journey with us.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-white/5 bg-zinc-800/50 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/20"
            >
              <CardContent className="pt-6">
                <Quote className="mb-4 h-8 w-8 text-amber-400 opacity-50" />
                <p className="mb-6 text-lg italic text-white/90">{testimonial.quote}</p>
              </CardContent>
              <CardFooter className="flex items-center gap-4 border-t border-white/5 pt-6">
                {/* Replaced image with icon */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
                  <User className="h-5 w-5 text-gray-300" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{testimonial.author}</h4>
                  <p className="text-sm text-white/70">{testimonial.position}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
