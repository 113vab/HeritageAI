"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/ui/PageTransition";
import { heritageSites } from "@/data/heritageSites";
import { motion, AnimatePresence } from "framer-motion";
import OptimizedImage from "@/components/ui/OptimizedImage";
import Link from "next/link";
import { Calendar, ArrowRight, History } from "lucide-react";

export default function TimelineExplorer() {
  const [selectedYear, setSelectedYear] = useState(2026);

  // Helper to parse site construction year from timeline
  const sitesWithStartYear = useMemo(() => {
    return heritageSites.map((site) => {
      let startYear = 1900; // fallback
      if (site.timeline && site.timeline.length > 0) {
        const firstEvent = site.timeline[0].year;
        if (firstEvent.toLowerCase().includes("bce") || firstEvent.toLowerCase().includes("bc")) {
          const num = parseInt(firstEvent.replace(/\D/g, ""), 10);
          startYear = -num;
        } else {
          startYear = parseInt(firstEvent.replace(/\D/g, ""), 10) || 1900;
        }
      }
      return { ...site, startYear };
    }).sort((a, b) => a.startYear - b.startYear);
  }, []);

  const visibleSites = useMemo(() => {
    return sitesWithStartYear.filter((site) => site.startYear <= selectedYear);
  }, [sitesWithStartYear, selectedYear]);

  // Compute active historical era and milestone metadata
  const activeEra = useMemo(() => {
    if (selectedYear < 300) {
      return {
        name: "Ancient Era",
        description: "Focuses on Mauryan and Satavahana periods. Rise of early Buddhist republics, Ashokan edicts, trade routes, and first monumental rock-cut shrines.",
        milestone: "Ashokan Edicts & Sanchi Stupa foundation (~250 BCE)",
        color: "from-amber-500 to-orange-500 border-amber-500/20 text-amber-400"
      };
    } else if (selectedYear >= 300 && selectedYear < 600) {
      return {
        name: "Classical Era (Gupta Golden Age)",
        description: "Empires flourish across central India. Zenith of fine stone sculpture, classical Sanskrit literature, and major cave complex excavations.",
        milestone: "Ajanta Caves painting era & Ellora early carvings (~450 CE)",
        color: "from-yellow-500 to-amber-500 border-yellow-500/20 text-yellow-400"
      };
    } else if (selectedYear >= 600 && selectedYear < 1526) {
      return {
        name: "Medieval Period",
        description: "Great dynasties of Southern and Central India. Peak temple building epochs (Cholas, Pallavas, Chalukyas) and monument foundations at Hampi.",
        milestone: "Shore Temples at Mahabalipuram & Khajuraho temples (~1000 CE)",
        color: "from-teal-500 to-emerald-500 border-teal-500/20 text-teal-400"
      };
    } else if (selectedYear >= 1526 && selectedYear < 1707) {
      return {
        name: "Mughal Era",
        description: "Synthesis of Persian, Islamic, and indigenous Indian architecture. Symmetrical marble mausoleums, red sandstone forts, and imperial capital layouts.",
        milestone: "Commissioning of the Taj Mahal in Agra (1631 CE)",
        color: "from-blue-500 to-indigo-500 border-blue-500/20 text-blue-400"
      };
    } else if (selectedYear >= 1707 && selectedYear < 1947) {
      return {
        name: "Late Kingdoms & Colonial Era",
        description: "Later Rajput and Maratha influence, rising European trade networks. Architectural developments include massive astronomical observatories.",
        milestone: "Jaipur Jantar Mantar observatory construction completed (1734 CE)",
        color: "from-purple-500 to-pink-500 border-purple-500/20 text-purple-400"
      };
    } else {
      return {
        name: "Modern India",
        description: "Independent republic. Systematic documentation, archaeological preservation, and restoration of universal cultural treasures under international frameworks.",
        milestone: "First UNESCO inscription wave of Indian sites (1983 CE)",
        color: "from-emerald-500 to-teal-500 border-emerald-500/20 text-emerald-400"
      };
    }
  }, [selectedYear]);

  const yearDisplay = (yr: number) => {
    if (yr < 0) {
      return `${Math.abs(yr)} BCE`;
    }
    return `${yr} CE`;
  };

  return (
    <PageTransition>
      <Navbar />
      <main className="flex-grow pt-32 pb-24 bg-slate-950 text-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <History className="h-3.5 w-3.5" />
              Chronological Epochs
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Historical <span className="text-gradient-gold">Timeline Explorer</span>
            </h1>
            <p className="text-gray-400 mt-4 text-sm md:text-base leading-relaxed">
              Drag the timeline handle to see monuments appear as they were built through ancient, medieval, colonial, and modern periods of Indian history.
            </p>
          </div>

          {/* Slider Panel */}
          <div className="glass-panel border border-white/5 rounded-3xl p-8 mb-12 bg-slate-900/30 text-center space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Historical Era</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-amber-400">{yearDisplay(selectedYear)}</h2>
            </div>

            <div className="relative w-full max-w-2xl mx-auto py-4">
              <input
                type="range"
                min="-250"
                max="2026"
                step="50"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-3">
                <span>Ancient (250 BCE)</span>
                <span>Medieval (1000 CE)</span>
                <span>Modern (2026 CE)</span>
              </div>
            </div>

            {/* Active Era Milestone Panel */}
            <div className={`p-6 rounded-2xl bg-gradient-to-br ${activeEra.color.replace('text-', 'from-')}/5 border ${activeEra.color.split(' ')[2]} text-left max-w-2xl mx-auto space-y-3`}>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold uppercase tracking-wider ${activeEra.color.split(' ')[3]}`}>{activeEra.name}</span>
                <span className="text-[9px] text-gray-500 font-extrabold uppercase bg-white/5 px-2 py-0.5 rounded border border-white/5">Era Focus</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {activeEra.description}
              </p>
              <div className="pt-2.5 border-t border-white/5 flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-400">
                <span className="font-extrabold text-white">Milestone:</span>
                <span>{activeEra.milestone}</span>
              </div>
            </div>

            <div className="text-xs text-gray-400 pt-2">
              Showing <span className="text-white font-semibold">{visibleSites.length}</span> of {heritageSites.length} monuments constructed by this period.
            </div>
          </div>

          {/* Timeline Nodes Grid */}
          <div className="relative border-l border-white/10 pl-6 ml-4 md:ml-8 space-y-12">
            <AnimatePresence mode="popLayout">
              {visibleSites.map((site) => (
                <motion.div
                  key={site.id}
                  layout
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="relative group grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                >
                  {/* Timeline bullet indicator */}
                  <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-slate-950 border-2 border-amber-500 flex items-center justify-center group-hover:scale-125 transition-transform z-10 shadow-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  </div>

                  {/* Year Tag Column */}
                  <div className="lg:col-span-2">
                    <span className="inline-block text-sm font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                      {yearDisplay(site.startYear)}
                    </span>
                  </div>

                  {/* Card Content Column */}
                  <div className="lg:col-span-10 bg-slate-900/20 border border-white/5 rounded-3xl p-6 glass-panel flex flex-col md:flex-row gap-6 items-center">
                    <div className="relative w-full md:w-1/3 aspect-[16/10] rounded-2xl overflow-hidden shrink-0 bg-slate-950 border border-white/5">
                      <OptimizedImage src={site.image} alt={site.name} />
                    </div>
                    
                    <div className="space-y-4 flex-grow">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors mb-1">
                          {site.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {site.location}, {site.state}
                        </p>
                      </div>

                      <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                        {site.description}
                      </p>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-amber-500" />
                          Constructed under: {site.builder || "Historical Dynasties"}
                        </span>
                        <Link href={`/explorer/${site.id}`}>
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-amber-500 text-gray-400 hover:text-slate-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                            Chronicle
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
