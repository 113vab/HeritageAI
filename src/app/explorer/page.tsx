"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Compass, RefreshCw, SlidersHorizontal, ArrowRight, Bookmark } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { heritageSites } from "@/data/heritageSites";
import OptimizedImage from "@/components/ui/OptimizedImage";
import PageTransition from "@/components/ui/PageTransition";


export default function Explorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc"); // name-asc, name-desc, year-asc, year-desc
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [filterBookmarksOnly, setFilterBookmarksOnly] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Load bookmarks on mount
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

  // Trigger search loading state when filters change
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsSearching(true);
    }, 0);
    const endTimer = setTimeout(() => {
      setIsSearching(false);
    }, 450);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [searchQuery, selectedCategory, selectedState, sortBy, filterBookmarksOnly]);

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
      console.error("Error saving bookmarks", e);
    }
  };

  // Dynamically extract states from mock data for the state selector
  const statesList = useMemo(() => {
    const states = new Set<string>();
    heritageSites.forEach((site) => {
      if (site.state.includes(",")) {
        site.state.split(",").forEach((s) => states.add(s.trim()));
      } else {
        states.add(site.state.trim());
      }
    });
    return ["All", ...Array.from(states).sort()];
  }, []);

  // Filter and sort sites
  const filteredSites = useMemo(() => {
    return heritageSites
      .filter((site) => {
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          site.name.toLowerCase().includes(query) ||
          site.location.toLowerCase().includes(query) ||
          site.state.toLowerCase().includes(query) ||
          site.category.toLowerCase().includes(query) ||
          site.yearInscribed.toString().includes(query) ||
          site.description.toLowerCase().includes(query);

        const matchesCategory =
          selectedCategory === "All" || site.category === selectedCategory;

        const matchesState =
          selectedState === "All" ||
          site.state.toLowerCase().includes(selectedState.toLowerCase());

        const matchesBookmarks =
          !filterBookmarksOnly || bookmarks.includes(site.id);

        return matchesSearch && matchesCategory && matchesState && matchesBookmarks;
      })
      .sort((a, b) => {
        if (sortBy === "name-asc") {
          return a.name.localeCompare(b.name);
        } else if (sortBy === "name-desc") {
          return b.name.localeCompare(a.name);
        } else if (sortBy === "year-asc") {
          return a.yearInscribed - b.yearInscribed;
        } else if (sortBy === "year-desc") {
          return b.yearInscribed - a.yearInscribed;
        } else if (sortBy === "state-asc") {
          return a.state.localeCompare(b.state);
        }
        return 0;
      });
  }, [searchQuery, selectedCategory, selectedState, sortBy, filterBookmarksOnly, bookmarks]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedState("All");
    setSortBy("name-asc");
    setFilterBookmarksOnly(false);
  };

  const categories = ["All", "Cultural", "Natural", "Mixed"];

  return (
    <PageTransition>
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Compass className="h-3.5 w-3.5" />
              UNESCO Archives
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Heritage <span className="text-gradient-gold">Explorer</span>
            </h1>
            <p className="text-gray-400 mt-4 text-sm md:text-base leading-relaxed">
              Browse through our collection of 20 iconic landmarks and sanctuaries, filter by state or categorization, and uncover the narratives behind their preservation.
            </p>
          </div>

          {/* Search, Filter, Sort Controls Bar */}
          <div className="glass-panel border border-white/5 rounded-2xl p-4 md:p-6 mb-10 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              
              {/* Search input */}
              <div className="relative w-full lg:max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Search className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search monument..."
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                />
              </div>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center gap-4 w-full lg:w-auto justify-end">
                {/* Bookmarks filter */}
                <button
                  onClick={() => setFilterBookmarksOnly(!filterBookmarksOnly)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-medium border transition-all ${
                    filterBookmarksOnly
                      ? "bg-amber-500 border-amber-500 text-slate-950 font-bold"
                      : "bg-slate-950 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  <Bookmark className={`h-3.5 w-3.5 ${filterBookmarksOnly ? "fill-slate-950 text-slate-950" : ""}`} />
                  <span>Bookmarks ({bookmarks.length})</span>
                </button>

                {/* Category selectors */}
                <div className="flex items-center gap-2">
                  <div className="flex bg-slate-950 p-1 rounded-lg border border-white/10">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          selectedCategory === cat
                            ? "bg-amber-500 text-slate-950 font-bold"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* State selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">State</span>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="bg-slate-950 border border-white/10 text-xs font-medium text-white px-3 py-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                  >
                    {statesList.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sort</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-950 border border-white/10 text-xs font-medium text-white px-3 py-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                  >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="year-asc">UNESCO Year (Oldest)</option>
                    <option value="year-desc">UNESCO Year (Newest)</option>
                    <option value="state-asc">State (A-Z)</option>
                  </select>
                </div>

                {/* Reset button */}
                <button
                  onClick={resetFilters}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors"
                  title="Reset filters"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile filter toggle */}
              <div className="flex lg:hidden w-full justify-between items-center pt-2 border-t border-white/5 lg:border-0 lg:pt-0">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-gray-300"
                >
                  <SlidersHorizontal className="h-4 w-4 text-amber-500" />
                  <span>Filters & Sorting</span>
                </button>
                
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              </div>

            </div>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
              {showMobileFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5"
                >
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilterBookmarksOnly(!filterBookmarksOnly)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium border transition-all ${
                        filterBookmarksOnly
                          ? "bg-amber-500 border-amber-500 text-slate-950 font-bold"
                          : "bg-slate-950 border-white/10 text-gray-400"
                      }`}
                    >
                      <Bookmark className="h-3.5 w-3.5" />
                      <span>Bookmarks ({bookmarks.length})</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                    <div className="flex bg-slate-950 p-1 rounded-lg border border-white/10 w-full">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`flex-1 text-center py-2 rounded-md text-xs font-medium transition-all ${
                            selectedCategory === cat
                              ? "bg-amber-500 text-slate-950 font-bold"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">State</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="bg-slate-950 border border-white/10 text-xs font-medium text-white px-3 py-2.5 rounded-lg focus:outline-none focus:border-amber-500 w-full"
                    >
                      {statesList.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-slate-950 border border-white/10 text-xs font-medium text-white px-3 py-2.5 rounded-lg focus:outline-none focus:border-amber-500 w-full"
                    >
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                      <option value="year-asc">UNESCO Year (Oldest)</option>
                      <option value="year-desc">UNESCO Year (Newest)</option>
                      <option value="state-asc">State (A-Z)</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-8 text-sm text-gray-400 px-1">
            <p>Showing <span className="font-semibold text-white">{filteredSites.length}</span> of {heritageSites.length} monuments</p>
            {(selectedCategory !== "All" || selectedState !== "All" || searchQuery !== "" || filterBookmarksOnly) && (
              <span className="text-xs text-amber-500 font-medium bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                Filters Active
              </span>
            )}
          </div>

          {/* Cards Grid */}
          <AnimatePresence mode="popLayout">
            {isSearching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex flex-col h-full bg-slate-900/20 border border-white/5 rounded-2xl overflow-hidden animate-pulse">
                    {/* Image Placeholder */}
                    <div className="relative aspect-[16/10] bg-slate-950/80 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center bg-slate-900">
                        <Compass className="h-5 w-5 text-gray-700 animate-spin" style={{ animationDuration: "3s" }} />
                      </div>
                    </div>
                    {/* Content Placeholder */}
                    <div className="p-6 flex flex-col flex-grow space-y-4">
                      <div className="h-3 bg-white/5 rounded w-1/3" />
                      <div className="h-5 bg-white/10 rounded w-3/4" />
                      <div className="space-y-2">
                        <div className="h-3.5 bg-white/5 rounded w-full" />
                        <div className="h-3.5 bg-white/5 rounded w-5/6" />
                        <div className="h-3.5 bg-white/5 rounded w-4/6" />
                      </div>
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                        <div className="h-3 bg-white/5 rounded w-1/4" />
                        <div className="w-8 h-8 rounded-lg bg-white/5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredSites.length > 0 ? (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredSites.map((site) => {
                  const isBookmarked = bookmarks.includes(site.id);
                  return (
                    <motion.div
                      layout
                      key={site.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="group flex flex-col h-full bg-slate-900/40 border border-white/5 hover:border-amber-500/30 rounded-2xl overflow-hidden glass-panel-hover"
                    >
                      {/* Image */}
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
                        
                        {/* Inscribed Year */}
                        <div className="absolute bottom-4 left-4 flex items-center gap-1 text-xs text-gray-300 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/5">
                          <Calendar className="h-3 w-3 text-amber-500" />
                          <span>Inscribed {site.yearInscribed}</span>
                        </div>
                      </div>

                      {/* Content */}
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
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="text-center py-20 bg-slate-900/20 border border-white/5 rounded-2xl p-8 max-w-lg mx-auto"
              >
                <div className="inline-flex items-center justify-center p-4 bg-slate-900 border border-white/10 text-amber-500 rounded-full mb-6">
                  <Compass className="h-8 w-8 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Heritage Sites Found</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  We couldn&apos;t find any sites matching your search parameters. Try adjusting or resetting your filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-lg text-xs tracking-wide transition-all shadow-md shadow-amber-500/10 cursor-pointer"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      <Footer />
    </PageTransition>
  );
}
