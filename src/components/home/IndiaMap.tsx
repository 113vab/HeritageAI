"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Compass, Landmark, ArrowRight, Star } from "lucide-react";
import { heritageSites } from "@/data/heritageSites";
import OptimizedImage from "../ui/OptimizedImage";

export default function IndiaMap() {
  const [activeSiteId, setActiveSiteId] = useState<string | null>(null);
  const [hoveredSiteId, setHoveredSiteId] = useState<string | null>(null);

  // Geographic boundaries of India to project onto 0-100 SVG coordinate grid
  // Longitude: 68.0 to 97.4
  // Latitude: 8.0 to 35.5
  const projectedSites = useMemo(() => {
    const minLng = 67.5;
    const maxLng = 98.0;
    const minLat = 6.5;
    const maxLat = 36.5;

    return heritageSites.map((site) => {
      const { lat, lng } = site.coordinates;
      
      // Calculate relative percentage coordinates
      const x = ((lng - minLng) / (maxLng - minLng)) * 100;
      // Invert Y coordinate since SVG Y increases downwards
      const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
      
      return {
        ...site,
        mapX: x,
        mapY: y
      };
    });
  }, []);

  const activeSite = projectedSites.find((s) => s.id === activeSiteId) || projectedSites[0];

  // SVG path for a stylized minimalist outline of India
  const indiaOutlinePath = `
    M 50,5 
    L 55,8 L 54,12 L 57,15 L 56,18 L 58,20 L 55,22 L 53,20 L 51,21 L 49,19 L 45,21 L 44,23 L 42,22 L 40,24 
    L 35,23 L 34,25 L 36,28 L 35,31 L 30,30 L 25,32 L 23,35 L 20,38 L 18,37 L 15,40 L 17,44 L 14,48 L 16,50 
    L 20,49 L 23,46 L 25,48 L 27,51 L 29,49 L 32,53 L 33,56 L 35,59 L 36,65 L 37,70 L 38,76 L 39,83 L 42,88 
    L 46,92 L 48,96 
    L 50,92 L 51,88 L 52,85 L 53,81 L 55,78 L 56,74 L 58,71 L 60,68 L 62,65 L 65,62 L 67,60 L 71,58 L 73,59 
    L 76,57 L 77,53 L 80,51 L 80,48 L 78,47 L 76,48 L 74,47 L 74,43 L 78,41 L 82,40 L 85,38 L 88,39 L 91,37 
    L 94,34 L 96,35 L 94,31 L 91,32 L 89,30 L 86,30 L 85,27 L 88,25 L 85,23 L 82,24 L 79,25 L 77,27 L 75,26 
    L 73,28 L 70,27 L 68,26 L 66,28 L 63,27 L 61,25 L 59,25 L 57,23 L 57,21 L 55,19 L 56,15 L 54,12 Z
  `;

  return (
    <section className="py-24 bg-slate-950 relative border-t border-white/5 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="h-3.5 w-3.5" />
            Geographical Mapping
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Interactive <span className="text-gradient-gold">Heritage Map</span>
          </h2>
          <p className="text-gray-400 mt-4 text-sm md:text-base leading-relaxed">
            Traverse India&apos;s geographic zones and instantly preview monuments by coordinates. Click a marker to explore historical highlights and virtual tours.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* List Sidebar (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-900/30 border border-white/5 rounded-3xl p-5 flex flex-col h-[600px] backdrop-blur-md">
            <div className="border-b border-white/5 pb-4 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                Monuments Index
              </h3>
              <p className="text-xs text-gray-500">
                Select a landmark below to track on map coordinates
              </p>
            </div>
            
            {/* Scrollable list */}
            <div className="flex-grow overflow-y-auto space-y-2 pr-2">
              {projectedSites.map((site) => {
                const isActive = site.id === activeSiteId;
                return (
                  <button
                    key={site.id}
                    onClick={() => setActiveSiteId(site.id)}
                    onMouseEnter={() => setHoveredSiteId(site.id)}
                    onMouseLeave={() => setHoveredSiteId(null)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                      isActive
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400 font-semibold"
                        : "bg-slate-950/20 border-white/5 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-1.5 rounded-lg border shrink-0 transition-colors ${
                        isActive 
                          ? "bg-amber-500/20 border-amber-500/30 text-amber-400" 
                          : "bg-slate-900 border-white/5 text-gray-500 group-hover:text-amber-500"
                      }`}>
                        <Landmark className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs truncate">{site.name}</span>
                        <span className="block text-[10px] text-gray-500 truncate">{site.state}</span>
                      </div>
                    </div>
                    <ArrowRight className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                      isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Map Visual (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900/20 border border-white/5 rounded-3xl p-4 flex items-center justify-center relative min-h-[450px] lg:h-[600px] overflow-hidden backdrop-blur-md">
            
            {/* Map Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40 pointer-events-none" />
            
            {/* Radar Sweep Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-teal-500/0 via-teal-500/5 to-teal-500/0 h-20 w-full animate-[pulse_3s_infinite] pointer-events-none" />

            {/* Aspect Ratio Locked Map Container */}
            <div className="relative aspect-square w-full max-w-[450px] flex items-center justify-center">
              {/* SVG India Outlined Map */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full opacity-20 stroke-slate-700 stroke-[0.35] fill-slate-900/10 pointer-events-none select-none absolute inset-0"
              >
                <path d={indiaOutlinePath} strokeDasharray="1,1" />
              </svg>

              {/* Glowing Map Markers */}
              <div className="absolute inset-0">
                {projectedSites.map((site) => {
                  const isActive = site.id === activeSiteId;
                  const isHovered = site.id === hoveredSiteId;
                  return (
                    <button
                      key={site.id}
                      style={{ left: `${site.mapX}%`, top: `${site.mapY}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full p-0 bg-transparent border-0 appearance-none"
                      onClick={() => setActiveSiteId(site.id)}
                      onMouseEnter={() => setHoveredSiteId(site.id)}
                      onMouseLeave={() => setHoveredSiteId(null)}
                      aria-label={`Select and view details for ${site.name}`}
                    >
                      {/* Glowing outer ring */}
                      <div className={`absolute -inset-2 rounded-full blur-sm transition-all duration-300 ${
                        isActive 
                          ? "bg-amber-500/40 scale-125" 
                          : isHovered 
                          ? "bg-teal-500/30 scale-110" 
                          : "bg-transparent"
                      }`} />
                      
                      {/* Pulsing ring */}
                      {isActive && (
                        <div className="absolute w-6 h-6 -left-1.5 -top-1.5 rounded-full border border-amber-500/50 animate-ping pointer-events-none" />
                      )}

                      {/* Core Point Marker */}
                      <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all flex items-center justify-center ${
                        isActive
                          ? "bg-amber-500 border-white scale-125 shadow-lg shadow-amber-500/30"
                          : isHovered
                          ? "bg-teal-400 border-white scale-110 shadow-lg shadow-teal-400/30"
                          : "bg-slate-950 border-amber-500/70 hover:border-teal-400"
                      }`}>
                        <div className={`w-1 h-1 rounded-full ${isActive ? "bg-slate-950" : "bg-amber-500"}`} />
                      </div>

                      {/* Dynamic Tooltip on Hover or Active state */}
                      <AnimatePresence>
                        {(isHovered || isActive) && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: -40, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute -translate-x-1/2 bg-slate-950/95 border border-white/10 px-3 py-1.5 rounded-lg text-left shadow-2xl backdrop-blur-md z-30 pointer-events-none whitespace-nowrap"
                          >
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-500">
                              {site.category} Site
                            </span>
                            <span className="block text-xs font-bold text-white">
                              {site.name}
                            </span>
                            <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-950 border-r border-b border-white/10 rotate-45" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Site Preview Sidebar (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col justify-between bg-slate-900/30 border border-white/5 rounded-3xl p-6 h-[600px] relative overflow-hidden backdrop-blur-md">
            
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSite.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 flex flex-col h-full justify-between z-10"
              >
                <div className="space-y-5">
                  {/* Photo Preview */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
                    <OptimizedImage
                      src={activeSite.image}
                      alt={activeSite.name}
                      sizes="300px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border bg-slate-950/80 border-white/15 text-white">
                        {activeSite.category}
                      </span>
                    </div>
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {activeSite.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                      <span className="truncate">{activeSite.location}, {activeSite.state}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                      <span>UNESCO Inscribed {activeSite.yearInscribed}</span>
                    </div>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-4">
                    {activeSite.description}
                  </p>
                </div>

                {/* Explore Details Link Button */}
                <div className="pt-4 border-t border-white/5 mt-auto">
                  <Link href={`/explorer/${activeSite.id}`} className="w-full">
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/10 cursor-pointer">
                      <span>View Full Details</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
}
