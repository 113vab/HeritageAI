"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Image, Compass, Smartphone, Landmark, Check } from "lucide-react";
import OptimizedImage from "../ui/OptimizedImage";

export default function WhyHeritageAI() {
  const features = [

    {
      icon: Sparkles,
      title: "AI-Curated Metadata",
      description: "Get detailed historical overviews, geographical coordinates, and interesting architectural details curated for each monument.",
      gradient: "from-amber-500 to-yellow-500",
    },
    {
      icon: Image,
      title: "High-Resolution Galleries",
      description: "Visual archives featuring multiple angles and viewpoints of ancient temple carvings, royal forts, and natural sanctuaries.",
      gradient: "from-teal-500 to-emerald-500",
    },
    {
      icon: Compass,
      title: "Smart Tourism Planning",
      description: "Detailed travel recommendations including optimal visiting months, active ticket pricing, and opening hours for each site.",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      icon: Smartphone,
      title: "Premium Mobile Experience",
      description: "A mobile-first fully responsive interface designed for fast loading times and smooth animations on any portable device.",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section id="why-heritage-ai" className="py-24 bg-slate-950 relative overflow-hidden scroll-mt-20">
      {/* Background glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Landmark className="h-3 w-3" />
            Platform Capabilities
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Elevating the Study of <span className="text-gradient-teal">Ancient Monuments</span>
          </h2>
          <p className="text-gray-400 mt-4 text-base md:text-lg leading-relaxed">
            HeritageAI bridges ancient craftsmanship and modern web technology to preserve Indian history for scholars, tourists, and enthusiasts alike.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative p-8 bg-slate-900/40 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden glass-panel-hover"
              >
                {/* Gradient background effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Icon Circle */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-[1px] mb-6 flex items-center justify-center shrink-0`}>
                  <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Visual Callout block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 p-8 md:p-12 bg-gradient-to-tr from-slate-900 to-slate-950 border border-white/5 rounded-3xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Designed for Historical Accuracy and Deep Exploration
              </h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                Unlike simple photo blogs, HeritageAI offers deep structures with dedicated details for coordinates, architectural eras, historical builders, and interesting lesser-known legends of each site.
              </p>
              <div className="space-y-3.5">
                {[
                  "Complete integration with geological mapping tools",
                  "Accurate UNESCO classification (Cultural, Natural, Mixed)",
                  "Verified visitor regulations and entry parameters"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-amber-400" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-950">
              <OptimizedImage
                src="/images/heritage/hampi.jpg"
                alt="Hampi Temple Complex Detail"
                className="opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-gray-400 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/5">
                <span>Stone Chariot, Hampi</span>
                <span className="text-amber-400">14th Century Monument</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
