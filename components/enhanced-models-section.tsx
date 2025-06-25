"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const models = [
  {
    name: "Rolls-Royce Phantom",
    category: "Ultra Luxury",
    image: "/model-phantom.jpg",
    price: "From €500,000",
    features: ["V12 Engine", "Starlight Headliner", "Whisper Quiet"]
  },
  {
    name: "Rolls-Royce Spectre",
    category: "Electric Luxury", 
    image: "/model-spectre.jpg",
    price: "From €400,000",
    features: ["All Electric", "700km Range", "Spirit of Ecstasy"]
  },
  {
    name: "Mercedes GLE",
    category: "Performance SUV",
    image: "/mercedes-gle.jpg", 
    price: "From €80,000",
    features: ["AMG Performance", "Air Suspension", "MBUX System"]
  }
]

export default function EnhancedModelsSection() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-40 left-20 w-[600px] h-[400px] bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-[500px] h-[300px] bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-sm font-semibold tracking-wider uppercase bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block mb-4"
          >
            Curated Collection
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-6"
          >
            Premium Models
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-slate-300 leading-relaxed"
          >
            Discover our meticulously selected collection of the world's finest luxury vehicles.
          </motion.p>
        </motion.div>

        {/* Models Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {models.map((model, index) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="group bg-gradient-to-br from-slate-900/80 to-slate-800/60 border-slate-700/30 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-500 overflow-hidden">
                <CardContent className="p-0">
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent z-10" />
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <Badge className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white border-0 backdrop-blur-sm">
                        {model.category}
                      </Badge>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-sm animate-pulse" />
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {model.name}
                      </h3>
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {model.price}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      {model.features.map((feature, featureIndex) => (
                        <div
                          key={feature}
                          className="flex items-center space-x-2 text-sm text-slate-300"
                        >
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-blue-500/25"
                    >
                      View Details
                    </motion.button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-lg font-semibold border border-slate-600 hover:border-blue-500/50 transition-all duration-300 shadow-xl"
          >
            Explore Full Collection
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}