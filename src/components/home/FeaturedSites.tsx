"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Compass, Bookmark } from "lucide-react";
import { heritageSites } from "../../data/heritageSites";
import OptimizedImage from "../ui/OptimizedImage";

export default function FeaturedSites() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("heritage-bookmarks");
      if (saved) {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setBookmarks(parsed);
        }, 0);
      }
    } catch (e) {
      console.error("Error reading bookmarks", e);
    }
  }, []);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    let newBookmarks = [...bookmarks];
    if (bookmarks.includes(id)) {
      newBookmarks = newBookmarks.filter((bId) => bId !== id);
    } else {
      newBookmarks.push(id);
    }
    
    setBookmarks(newBookmarks);
    try {
      localStorage.setItem("heritage-bookmarks", JSON.stringify(newBookmarks));
    } catch (e) {
      console.error("Error saving bookmark", e);
    }
  };

  // Get featured sites
  const featuredSites = heritageSites.filter((site) => site.featured).slice(0, 6);

  return (
    <section className="py-24 bg-slate-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Compass className="h-3 w-3" />
              Curated Selection
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Featured <span className="text-gradient-gold">Heritage Wonders</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl text-base">
              Explore some of the most structurally ingenious and historically profound landmarks across the Indian subcontinent.
            </p>
          </div>
          <Link href="/explorer">
            <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm border border-white/10 hover:border-white/20 transition-all cursor-pointer">
              View All 20 Sites
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </span>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredSites.map((site, index) => {
            const isBookmarked = bookmarks.includes(site.id);
            return (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col h-full bg-slate-900/40 border border-white/5 hover:border-amber-500/30 rounded-2xl overflow-hidden glass-panel-hover"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <OptimizedImage
                    src={site.image}
                    alt={site.name}
                    className="transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
                        site.category === "Cultural"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-teal-500/10 text-teal-400 border-teal-500/20"
                      }`}
                    >
                      {site.category}
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => toggleBookmark(site.id, e)}
                    className="absolute top-4 right-4 p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-950 border border-white/10 backdrop-blur-md transition-all text-gray-400 hover:text-white"
                    title={isBookmarked ? "Remove bookmark" : "Bookmark site"}
                    aria-label={isBookmarked ? `Remove ${site.name} from bookmarks` : `Bookmark ${site.name}`}
                  >
                    <Bookmark
                      className={`h-4 w-4 transition-colors ${
                        isBookmarked ? "text-amber-500 fill-amber-500" : "text-gray-400"
                      }`}
                    />
                  </button>
                  
                  {/* Year Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 text-xs text-gray-300 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/5">
                    <Calendar className="h-3 w-3 text-amber-500" />
                    <span>Inscribed {site.yearInscribed}</span>
                  </div>
                </div>

                {/* Text Area */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                    <MapPin className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                    <span>{site.location}, {site.state}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors mb-3 line-clamp-1">
                    {site.name}
                  </h3>
                  
                  <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-grow line-clamp-3">
                    {site.description}
                  </p>

                  {/* Explore Details Link */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
                      Virtual Tour & History
                    </span>
                    <Link href={`/explorer/${site.id}`}>
                      <span className="inline-flex items-center justify-center p-2 rounded-lg bg-white/5 group-hover:bg-amber-500 text-gray-400 group-hover:text-slate-950 transition-all duration-300 cursor-pointer">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
