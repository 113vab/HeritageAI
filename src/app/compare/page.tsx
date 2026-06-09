"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/ui/PageTransition";
import { heritageSites } from "@/data/heritageSites";
import { HeritageSite } from "@/types";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { motion } from "framer-motion";
import { ArrowLeftRight, Calendar, MapPin, Award } from "lucide-react";

export default function Compare() {
  const [siteAId, setSiteAId] = useState(heritageSites[0].id);
  const [siteBId, setSiteBId] = useState(heritageSites[1].id);

  const siteA = heritageSites.find((s) => s.id === siteAId) || heritageSites[0];
  const siteB = heritageSites.find((s) => s.id === siteBId) || heritageSites[1];

  return (
    <PageTransition>
      <Navbar />
      <main className="flex-grow pt-32 pb-24 bg-slate-950 text-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <ArrowLeftRight className="h-3.5 w-3.5" />
              Side-by-Side Analysis
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Monument <span className="text-gradient-gold">Comparison</span>
            </h1>
            <p className="text-gray-400 mt-4 text-sm md:text-base leading-relaxed">
              Select any two of India&apos;s 20 World Heritage Sites to compare their historical timelines, construction builders, inscription years, and architectural achievements.
            </p>
          </div>

          {/* Selectors Panel */}
          <div className="glass-panel border border-white/5 rounded-3xl p-6 mb-12 flex flex-col md:flex-row gap-6 justify-between items-center bg-slate-900/30">
            <div className="w-full md:w-5/12 space-y-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Select Monument A</label>
              <select
                value={siteAId}
                onChange={(e) => setSiteAId(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 text-sm font-semibold text-white px-4 py-3 rounded-xl focus:outline-none focus:border-amber-500"
              >
                {heritageSites.map((s) => (
                  <option key={s.id} value={s.id} disabled={s.id === siteBId}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400">
              <ArrowLeftRight className="h-5 w-5" />
            </div>

            <div className="w-full md:w-5/12 space-y-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Select Monument B</label>
              <select
                value={siteBId}
                onChange={(e) => setSiteBId(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 text-sm font-semibold text-white px-4 py-3 rounded-xl focus:outline-none focus:border-amber-500"
              >
                {heritageSites.map((s) => (
                  <option key={s.id} value={s.id} disabled={s.id === siteAId}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Monument A Card */}
            <CompareCard site={siteA} label="A" />

            {/* Monument B Card */}
            <CompareCard site={siteB} label="B" />

          </div>

          {/* Detailed Specifications Table */}
          <div className="mt-12 overflow-hidden border border-white/5 rounded-3xl bg-slate-900/10 backdrop-blur-md">
            <div className="p-6 border-b border-white/5 bg-slate-900/30">
              <h2 className="text-lg font-bold uppercase tracking-wider text-white">Attribute Breakdown</h2>
            </div>
            
            <div className="divide-y divide-white/5 text-sm">
              <ComparisonRow label="Ruling Dynasty / Builder" valA={siteA.builder} valB={siteB.builder} />
              <ComparisonRow label="Geographic Location" valA={`${siteA.location}, ${siteA.state}`} valB={`${siteB.location}, ${siteB.state}`} />
              <ComparisonRow 
                label="UNESCO Inscribed Year" 
                valA={siteA.yearInscribed} 
                valB={siteB.yearInscribed} 
                highlightDiff={true} 
                diffType="year"
              />
              <ComparisonRow 
                label="Category & Status" 
                valA={siteA.category} 
                valB={siteB.category} 
                highlightDiff={true} 
                diffType="category"
              />
              <ComparisonRow 
                label="Historical Chronicle" 
                valA={siteA.description} 
                valB={siteB.description} 
              />
              <ComparisonRow 
                label="Architectural Marvels" 
                valA={siteA.architectureHighlights?.map((h) => h.title).join(", ")} 
                valB={siteB.architectureHighlights?.map((h) => h.title).join(", ")} 
              />
              <ComparisonRow 
                label="Coordinates" 
                valA={`${siteA.coordinates.lat}° N, ${siteA.coordinates.lng}° E`} 
                valB={`${siteB.coordinates.lat}° N, ${siteB.coordinates.lng}° E`} 
              />
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}

function CompareCard({ site, label }: { site: HeritageSite; label: string }) {
  return (
    <motion.div
      key={site.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="group bg-slate-900/40 border border-white/5 hover:border-amber-500/20 rounded-3xl overflow-hidden glass-panel flex flex-col h-full transition-all duration-300"
    >
      <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
        <OptimizedImage 
          src={site.image} 
          alt={site.name} 
          className="transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-extrabold text-sm shadow-md">
            {label}
          </span>
        </div>
      </div>
      <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
            {site.name}
          </h3>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-amber-500" />
              {site.location}, {site.state}
            </p>
            <p className="text-xs text-amber-400/80 font-semibold mt-1">
              Builder: {site.builder || "Historical Dynasties"}
            </p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
            <span className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Year Inscribed</span>
            <span className="text-white font-semibold flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-amber-500" />
              {site.yearInscribed}
            </span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
            <span className="block text-[10px] text-gray-500 uppercase font-bold mb-1">UNESCO Status</span>
            <span className="text-white font-semibold flex items-center gap-1">
              <Award className={`h-3.5 w-3.5 ${site.category === 'Cultural' ? 'text-amber-500' : 'text-teal-400'}`} />
              {site.category}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ComparisonRow({ 
  label, 
  valA, 
  valB, 
  highlightDiff = false, 
  diffType = "" 
}: { 
  label: string; 
  valA: string | number | undefined; 
  valB: string | number | undefined; 
  highlightDiff?: boolean; 
  diffType?: string; 
}) {
  const isIdentical = valA !== undefined && valB !== undefined && String(valA).trim() === String(valB).trim();
  const isDifferent = highlightDiff && valA !== undefined && valB !== undefined && String(valA).trim() !== String(valB).trim();

  const isValALess = typeof valA === "number" && typeof valB === "number" && valA < valB;
  const isValBLess = typeof valA === "number" && typeof valB === "number" && valB < valA;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 p-6 gap-4 md:gap-8 items-start hover:bg-white/[0.02] transition-colors duration-200">
      <div className="md:col-span-2 space-y-2">
        <span className="block text-xs font-bold uppercase tracking-wider text-gray-500">
          {label}
        </span>
        {isIdentical && (
          <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded">
            Similar
          </span>
        )}
        {isDifferent && (
          <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
            Distinct
          </span>
        )}
      </div>
      
      <div className={`md:col-span-5 text-xs md:text-sm leading-relaxed ${
        isIdentical 
          ? "text-gray-400" 
          : isDifferent && diffType === "year" && isValALess 
          ? "text-amber-400 font-bold bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/20" 
          : "text-white"
      }`}>
        {valA}
      </div>
      
      <div className={`md:col-span-5 text-xs md:text-sm leading-relaxed ${
        isIdentical 
          ? "text-gray-400" 
          : isDifferent && diffType === "year" && isValBLess 
          ? "text-amber-400 font-bold bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/20" 
          : "text-white"
      }`}>
        {valB}
      </div>
    </div>
  );
}
