"use client";
 
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Compass, Landmark, ArrowRight, Globe } from "lucide-react";
import { heritageSites } from "@/data/heritageSites";
import OptimizedImage from "../ui/OptimizedImage";

export default function IndiaMap() {
  const router = useRouter();
  const [activeSiteId, setActiveSiteId] = useState<string | null>("taj-mahal");
  const [hoveredSiteId, setHoveredSiteId] = useState<string | null>(null);

  // Geographic boundaries of India to project onto 0-100 SVG coordinate grid
  const projectedSites = useMemo(() => {
    const minLng = 67.5;
    const maxLng = 98.0;
    const minLat = 6.5;
    const maxLat = 36.5;

    return heritageSites.map((site) => {
      const { lat, lng } = site.coordinates;
      const x = ((lng - minLng) / (maxLng - minLng)) * 100;
      const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
      
      return {
        ...site,
        mapX: x,
        mapY: y
      };
    });
  }, []);

  // Sync scroll list item into view
  useEffect(() => {
    const activeId = hoveredSiteId || activeSiteId;
    if (activeId) {
      const element = document.getElementById(`list-item-${activeId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [hoveredSiteId, activeSiteId]);

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

  // Dynamic positioning logic for tooltips based on coordinates
  const getTooltipConfig = (mapX: number, mapY: number) => {
    let positionClass = "";
    const style: React.CSSProperties = {};
    const arrowStyle: React.CSSProperties = {};

    // Vertical alignment
    if (mapY < 25) {
      positionClass += "top-full mt-3 ";
    } else {
      positionClass += "bottom-full mb-3 ";
    }

    // Horizontal boundaries to prevent clipping
    if (mapX < 30) {
      style.left = "0px";
      style.transform = "translateX(-20%)";
      arrowStyle.left = "25%";
    } else if (mapX > 70) {
      style.right = "0px";
      style.transform = "translateX(20%)";
      arrowStyle.right = "25%";
      arrowStyle.left = "auto";
    } else {
      style.left = "50%";
      style.transform = "translateX(-50%)";
      arrowStyle.left = "50%";
      arrowStyle.transform = "translateX(-50%)";
    }

    return { positionClass, style, arrowStyle };
  };

  const handleMarkerClick = (siteId: string) => {
    if (activeSiteId === siteId) {
      router.push(`/explorer/${siteId}`);
    } else {
      setActiveSiteId(siteId);
    }
  };

  const handleListItemClick = (siteId: string) => {
    if (activeSiteId === siteId) {
      router.push(`/explorer/${siteId}`);
    } else {
      setActiveSiteId(siteId);
    }
  };

  return (
    <section className="py-24 bg-slate-950 relative border-t border-white/5 overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="h-3.5 w-3.5 animate-spin-slow" />
            Geographical Mapping
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Interactive <span className="text-gradient-gold">Heritage Map</span>
          </h2>
          <p className="text-gray-400 mt-4 text-sm md:text-base leading-relaxed">
            Traverse India&apos;s geographic zones and preview landmarks in real time. Hover list items or markers to reveal rich previews. Click a selection to explore history, architecture, and tours.
          </p>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Synchronized Side List (4 Cols) - Desktop Only */}
          <div className="hidden lg:flex lg:col-span-4 bg-slate-900/30 border border-white/5 rounded-3xl p-5 flex-col h-[650px] backdrop-blur-md">
            <div className="border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Heritage Index
                </h3>
                <Globe className="h-4 w-4 text-amber-500/80" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Hover to locate, click once to select, click again to visit
              </p>
            </div>
            
            {/* Scrollable list */}
            <div className="flex-grow overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
              {projectedSites.map((site) => {
                const isActive = site.id === activeSiteId;
                const isHovered = site.id === hoveredSiteId;
                const isHighlighted = isActive || isHovered;

                return (
                  <button
                    id={`list-item-${site.id}`}
                    key={site.id}
                    onClick={() => handleListItemClick(site.id)}
                    onMouseEnter={() => setHoveredSiteId(site.id)}
                    onMouseLeave={() => setHoveredSiteId(null)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                      isHighlighted
                        ? "bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-amber-500/40 text-amber-400 font-semibold shadow-lg shadow-amber-500/5"
                        : "bg-slate-950/45 border-white/5 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`p-2 rounded-xl border shrink-0 transition-all duration-300 ${
                        isHighlighted 
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-400 scale-105" 
                          : "bg-slate-900 border-white/5 text-gray-500 group-hover:text-amber-500"
                      }`}>
                        <Landmark className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-semibold truncate leading-tight group-hover:text-white transition-colors">{site.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-gray-500 truncate">{site.state}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-gray-400 font-mono">
                            {site.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className={`h-4 w-4 shrink-0 transition-all duration-300 ${
                      isHighlighted ? "translate-x-0 opacity-100 text-amber-400" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Map Visual (8 Cols) */}
          <div className="col-span-1 lg:col-span-8 bg-slate-900/20 border border-white/5 rounded-3xl p-6 flex items-center justify-center relative h-[520px] lg:h-[650px] overflow-hidden backdrop-blur-md shadow-2xl">
            
            {/* Map Grid Gridlines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30 pointer-events-none" />
            
            {/* Map Sweep Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/0 via-amber-500/5 to-amber-500/0 h-24 w-full animate-[pulse_4s_infinite] pointer-events-none" />
            
            {/* Aspect Ratio Locked Map Container */}
            <div className="relative aspect-[4/5] md:aspect-square w-full max-h-full max-w-[480px] lg:max-w-[550px] flex items-center justify-center">
              
              {/* SVG Map of India with Golden Outlines and Glow */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full select-none absolute inset-0 pointer-events-none"
              >
                <defs>
                  {/* Subtle Grid Coordinates */}
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="0.1"/>
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />

                {/* Latitude/Longitude tick markings */}
                <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.1" strokeDasharray="1,1" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.1" strokeDasharray="1,1" />
                <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.1" strokeDasharray="1,1" />
                <line x1="30" y1="0" x2="30" y2="100" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.1" strokeDasharray="1,1" />
                <line x1="60" y1="0" x2="60" y2="100" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.1" strokeDasharray="1,1" />

                <text x="2" y="19" className="fill-white/10 text-[1.8px] font-mono select-none">32° N</text>
                <text x="2" y="49" className="fill-white/10 text-[1.8px] font-mono select-none">20° N</text>
                <text x="2" y="79" className="fill-white/10 text-[1.8px] font-mono select-none">8° N</text>
                <text x="29" y="98" className="fill-white/10 text-[1.8px] font-mono select-none">75° E</text>
                <text x="59" y="98" className="fill-white/10 text-[1.8px] font-mono select-none">90° E</text>

                {/* Glowing Outline Backdrop */}
                <path
                  d={indiaOutlinePath}
                  className="stroke-amber-500/15 stroke-[1.8] fill-transparent filter blur-[1.5px]"
                />
                {/* Main Outline Path */}
                <path
                  d={indiaOutlinePath}
                  className="stroke-amber-500/50 stroke-[0.38] fill-amber-500/[0.02] transition-all duration-700"
                />

                {/* Cartographic Compass Rose */}
                <g transform="translate(85, 80)" className="opacity-25 stroke-amber-500/50 fill-transparent">
                  <circle r="6" strokeWidth="0.1" />
                  <circle r="5" strokeWidth="0.05" strokeDasharray="0.3,0.3" />
                  <line x1="-7.5" y1="0" x2="7.5" y2="0" strokeWidth="0.1" />
                  <line x1="0" y1="-7.5" x2="0" y2="7.5" strokeWidth="0.1" />
                  <path d="M 0,-6.5 L 1,-1.5 L 0,0 L -1,-1.5 Z" fill="rgba(217, 119, 6, 0.2)" strokeWidth="0.08" />
                  <path d="M 0,6.5 L 1,1.5 L 0,0 L -1,1.5 Z" fill="rgba(217, 119, 6, 0.1)" strokeWidth="0.08" />
                  <path d="M 6.5,0 L 1.5,1 L 0,0 L 1.5,-1 Z" fill="rgba(217, 119, 6, 0.1)" strokeWidth="0.08" />
                  <path d="M -6.5,0 L -1.5,1 L 0,0 L -1.5,-1 Z" fill="rgba(217, 119, 6, 0.1)" strokeWidth="0.08" />
                  <text x="0" y="-7.5" className="text-[2.2px] font-bold fill-amber-500/80 font-mono text-center" textAnchor="middle">N</text>
                </g>
              </svg>

              {/* Glowing Interactive Map Markers */}
              <div className="absolute inset-0">
                {projectedSites.map((site) => {
                  const isActive = site.id === activeSiteId;
                  const isHovered = site.id === hoveredSiteId;
                  const isHighlighted = isActive || isHovered;
                  
                  const tooltipConfig = getTooltipConfig(site.mapX, site.mapY);

                  return (
                    <div
                      key={site.id}
                      style={{ left: `${site.mapX}%`, top: `${site.mapY}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                      {/* Interactive Button Anchor */}
                      <button
                        className="relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full p-0 bg-transparent border-0 appearance-none flex items-center justify-center w-6 h-6"
                        onClick={() => handleMarkerClick(site.id)}
                        onMouseEnter={() => {
                          setHoveredSiteId(site.id);
                          setActiveSiteId(site.id);
                        }}
                        onMouseLeave={() => setHoveredSiteId(null)}
                        aria-label={`Select and view details for ${site.name}`}
                      >
                        {/* Gold Radial Aura / Glow */}
                        {isHighlighted && (
                          <motion.div
                            layoutId="activeGlow"
                            className={`absolute rounded-full blur-md pointer-events-none transition-all duration-300 ${
                              isActive ? "inset-[-8px] bg-amber-500/25" : "inset-[-6px] bg-teal-500/15"
                            }`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}

                        {/* Framer Motion Pulse Animation Ring */}
                        <motion.div
                          className={`absolute rounded-full border pointer-events-none ${
                            isActive
                              ? "w-7 h-7 border-amber-400/50"
                              : isHovered
                              ? "w-6 h-6 border-teal-400/40"
                              : "w-5 h-5 border-amber-500/30"
                          }`}
                          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ repeat: Infinity, duration: isActive ? 1.8 : 2.6, ease: "easeInOut" }}
                        />

                        {/* Ring Marker Core */}
                        <motion.div
                          className={`w-3.5 h-3.5 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? "bg-amber-500 border-white scale-125 shadow-lg shadow-amber-500/50"
                              : isHovered
                              ? "bg-teal-400 border-white scale-110 shadow-lg shadow-teal-400/40"
                              : "bg-slate-950 border-amber-500/80 hover:border-amber-400"
                          }`}
                          whileHover={{ scale: 1.35 }}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-slate-950" : "bg-amber-500"}`} />
                        </motion.div>
                      </button>

                      {/* Rich Visual Monument Tooltip Card */}
                      <AnimatePresence>
                        {isHighlighted && (
                          <motion.div
                            initial={{ opacity: 0, y: site.mapY < 25 ? -12 : 12, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: site.mapY < 25 ? -12 : 12, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                            className={`absolute ${tooltipConfig.positionClass} z-50 pointer-events-auto w-72 bg-slate-950/95 border border-amber-500/35 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-md`}
                            style={tooltipConfig.style}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link href={`/explorer/${site.id}`} className="flex items-center gap-3.5 group/card cursor-pointer">
                              {/* Left side: optimized image thumbnail */}
                              <div className="relative w-24 h-24 shrink-0 bg-slate-900 border-r border-white/5 overflow-hidden">
                                <OptimizedImage
                                  src={site.image}
                                  alt={site.name}
                                  sizes="100px"
                                  className="group-hover/card:scale-105 transition-transform duration-500 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                              </div>
                              
                              {/* Right side: details */}
                              <div className="flex-grow p-3 min-w-0 pr-4">
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                    site.category === 'Cultural'
                                      ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                                      : site.category === 'Natural'
                                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                      : 'bg-teal-500/10 border border-teal-500/20 text-teal-400'
                                  }`}>
                                    {site.category}
                                  </span>
                                  <span className="text-[9px] text-gray-400 font-medium font-mono">
                                    Est. {site.yearInscribed}
                                  </span>
                                </div>
                                
                                <h4 className="text-xs font-bold text-white group-hover/card:text-amber-400 transition-colors leading-snug line-clamp-2">
                                  {site.name}
                                </h4>
                                
                                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-gray-400">
                                  <MapPin className="h-3 w-3 text-gray-500 shrink-0" />
                                  <span className="truncate">{site.state}</span>
                                </div>
                              </div>
                            </Link>

                            {/* Arrow Pointer */}
                            <div 
                              className={`absolute w-2.5 h-2.5 bg-slate-950 border rotate-45 pointer-events-none ${
                                site.mapY < 25
                                  ? "top-[-5px] border-l border-t border-amber-500/35"
                                  : "bottom-[-5px] border-r border-b border-amber-500/35"
                              }`}
                              style={tooltipConfig.arrowStyle}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

