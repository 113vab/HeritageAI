"use client";

import React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Compass, Sparkles, ArrowRight } from "lucide-react";
import OptimizedImage from "../ui/OptimizedImage";

export default function Hero() {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);
  const showcaseY = useTransform(scrollY, [0, 500], [0, -40]);
  const textY = useTransform(scrollY, [0, 500], [0, 25]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Gradients & Effects */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#0c1020_1px,transparent_1px),linear-gradient(to_bottom,#0c1020_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" 
      />
      
      {/* Radial glows */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.15, 1, 1.15],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-white/10 mb-8"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-semibold tracking-wide text-gray-300 uppercase">
            A Premium Digital Heritage Vault
          </span>
        </motion.div>

        {/* Main Heading with subtle parallax */}
        <motion.h1
          style={{ y: textY }}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight max-w-5xl mx-auto"
        >
          Journey Through India&apos;s{" "}
          <span className="text-gradient-gold">Ancient Wonders</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12"
        >
          Embark on an immersive journey across centuries of architectural genius. 
          Traverse 20 historic landmarks, structures, and sanctuaries of ancient India 
          with detailed guides, historical breakdowns, and visitor statistics.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          style={{ y: textY }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/explorer" className="w-full sm:w-auto">
            <motion.span
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-teal-600 hover:from-amber-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-xl shadow-amber-500/10 hover:shadow-amber-500/20 transition-all duration-300 flex items-center justify-center gap-2.5 text-base border border-amber-400/20 cursor-pointer"
            >
              <Compass className="h-5 w-5" />
              Explore the Archive
            </motion.span>
          </Link>
          
          <motion.button
            initial="initial"
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              document.getElementById("why-heritage-ai")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 bg-slate-900/60 border border-white/10 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 text-base backdrop-blur-sm cursor-pointer hover:border-white/20 hover:text-white"
          >
            <span>Learn More</span>
            <motion.span
              variants={{
                initial: { x: 0 },
                hover: { x: 4 }
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ArrowRight className="h-4 w-4 text-amber-500" />
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Floating Card Showcases / Visual Anchor with Parallax */}
        <motion.div
          style={{ y: showcaseY }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950/40 p-2 backdrop-blur-md"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl">
            <OptimizedImage
              src="/images/heritage/taj-mahal.jpg"
              alt="Taj Mahal Showcase"
              className="opacity-80"
            />
          </div>
          <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between text-left gap-4">
            <div>
              <p className="text-xs font-semibold text-amber-400 tracking-wider uppercase mb-1">Spotlight Monument</p>
              <h3 className="text-lg sm:text-2xl font-bold text-white">Taj Mahal, Agra</h3>
            </div>
            <Link href="/explorer/taj-mahal">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 backdrop-blur-md transition-colors cursor-pointer">
                View Site Details
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
