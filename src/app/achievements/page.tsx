"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/ui/PageTransition";
import { heritageSites } from "@/data/heritageSites";
import { Award, Compass, CheckCircle2, Bookmark, Flame } from "lucide-react";

export default function Achievements() {
  const [visited, setVisited] = useState<string[]>([]);

  // Load visited from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("heritage-visited");
      if (saved) {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setVisited(parsed);
        }, 0);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleVisited = (id: string) => {
    let newVisited = [...visited];
    if (visited.includes(id)) {
      newVisited = newVisited.filter((vId) => vId !== id);
    } else {
      newVisited.push(id);
    }
    setVisited(newVisited);
    try {
      localStorage.setItem("heritage-visited", JSON.stringify(newVisited));
    } catch (e) {
      console.error(e);
    }
  };

  const progressPercentage = Math.round((visited.length / heritageSites.length) * 100);

  // Curated list of badges to unlock
  const badgesList = useMemo(() => {
    const totalCount = visited.length;
    const culturalCount = heritageSites.filter((s) => visited.includes(s.id) && s.category === "Cultural").length;
    const naturalCount = heritageSites.filter((s) => visited.includes(s.id) && s.category === "Natural").length;

    return [
      {
        id: "novice",
        title: "Novice Voyager",
        description: "Explore your very first monument",
        unlocked: totalCount >= 1,
        icon: Compass,
        color: "text-amber-400"
      },
      {
        id: "naturalist",
        title: "Naturalist",
        description: "Explore all Natural reserves/parks",
        unlocked: naturalCount >= 3, // Western Ghats, Kaziranga, Sundarbans
        icon: Flame,
        color: "text-teal-400"
      },
      {
        id: "historian",
        title: "Dynastic Archivist",
        description: "Explore at least 5 Cultural temples or palaces",
        unlocked: culturalCount >= 5,
        icon: Bookmark,
        color: "text-blue-400"
      },
      {
        id: "sovereign",
        title: "Heritage Sovereign",
        description: "Explore all 20 heritage monuments of India",
        unlocked: totalCount === 20,
        icon: Award,
        color: "text-purple-400"
      }
    ];
  }, [visited]);

  return (
    <PageTransition>
      <Navbar />
      <main className="flex-grow pt-32 pb-24 bg-slate-950 text-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Award className="h-3.5 w-3.5" />
              Heritage Milestones
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Exploration <span className="text-gradient-gold">Achievements</span>
            </h1>
            <p className="text-gray-400 mt-4 text-sm md:text-base leading-relaxed">
              Track the sites you have visited physically or researched thoroughly, unlock custom badges, and watch your exploration progress grow.
            </p>
          </div>

          {/* Progress Overview Panel */}
          <div className="glass-panel border border-white/5 rounded-3xl p-8 mb-12 bg-slate-900/30 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="space-y-3 flex-grow w-full">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Overall Exploration Progress</span>
              <div className="flex items-center gap-4">
                <div className="flex-grow h-3.5 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-teal-500 transition-all duration-700 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-white shrink-0">{progressPercentage}%</span>
              </div>
              <p className="text-xs text-gray-400">
                You have visited <span className="text-white font-semibold">{visited.length}</span> of {heritageSites.length} registered monuments.
              </p>
            </div>

            <div className="flex gap-4 shrink-0 text-center w-full md:w-auto justify-around">
              <div className="px-5 py-3 bg-slate-950 rounded-2xl border border-white/5">
                <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Badges Unlocked</span>
                <span className="text-2xl font-bold text-amber-400">{badgesList.filter((b) => b.unlocked).length} / {badgesList.length}</span>
              </div>
            </div>
          </div>

          {/* Grid Layout (Left: Visited checklist, Right: Badges cabinet) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Checklist Cabinet (8 Cols) */}
            <div className="lg:col-span-8 bg-slate-900/20 border border-white/5 rounded-3xl p-6 glass-panel space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h2 className="text-lg font-bold uppercase tracking-wider text-white">Monuments Explorer Index</h2>
                <p className="text-xs text-gray-500 mt-1">Mark sites you have explored or researched to record milestones</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {heritageSites.map((site) => {
                  const isVisited = visited.includes(site.id);
                  return (
                    <button
                      key={site.id}
                      onClick={() => toggleVisited(site.id)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all group cursor-pointer ${
                        isVisited
                          ? "bg-amber-500/10 border-amber-500/30 text-white"
                          : "bg-slate-950/40 border-white/5 text-gray-400 hover:text-white hover:bg-slate-900/40"
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="block text-xs font-semibold truncate group-hover:text-amber-400 transition-colors">{site.name}</span>
                        <span className="block text-[10px] text-gray-500 truncate">{site.location}, {site.state}</span>
                      </div>
                      <CheckCircle2 className={`h-5 w-5 shrink-0 transition-colors ${
                        isVisited ? "text-amber-500" : "text-gray-700"
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Badges Cabinet (4 Cols) */}
            <div className="lg:col-span-4 bg-slate-900/20 border border-white/5 rounded-3xl p-6 glass-panel space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h2 className="text-lg font-bold uppercase tracking-wider text-white">Unlocked Badges</h2>
                <p className="text-xs text-gray-500 mt-1">Milestone awards based on exploration index</p>
              </div>

              <div className="space-y-4">
                {badgesList.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={badge.id}
                      className={`flex gap-4 items-center p-4 border rounded-2xl transition-all ${
                        badge.unlocked
                          ? "bg-slate-900/60 border-white/10"
                          : "bg-slate-950/20 border-white/5 opacity-40"
                      }`}
                    >
                      <div className={`p-3 rounded-xl bg-slate-950 border border-white/5 ${badge.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{badge.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{badge.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
