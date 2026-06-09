"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, MapPin, Calendar, Compass, Clock, Ticket, Award, 
  Map as MapIcon, ChevronLeft, ChevronRight, Bookmark, Star, Eye 
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { heritageSites } from "@/data/heritageSites";
import OptimizedImage from "@/components/ui/OptimizedImage";
import PageTransition from "@/components/ui/PageTransition";


export default function HeritageDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const site = heritageSites.find((s) => s.id === id);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [visited, setVisited] = useState<string[]>([]);

  // Load bookmarks & visited on mount
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem("heritage-bookmarks");
      if (savedBookmarks) {
        const parsed = JSON.parse(savedBookmarks);
        setTimeout(() => {
          setBookmarks(parsed);
        }, 0);
      }

      const savedVisited = localStorage.getItem("heritage-visited");
      if (savedVisited) {
        const parsed = JSON.parse(savedVisited);
        setTimeout(() => {
          setVisited(parsed);
        }, 0);
      }
    } catch (e) {
      console.error("Error reading storage on mount", e);
    }
  }, []);

  const toggleBookmark = (siteId: string) => {
    let newBookmarks = [...bookmarks];
    if (bookmarks.includes(siteId)) {
      newBookmarks = newBookmarks.filter((bId) => bId !== siteId);
    } else {
      newBookmarks.push(siteId);
    }
    setBookmarks(newBookmarks);
    try {
      localStorage.setItem("heritage-bookmarks", JSON.stringify(newBookmarks));
    } catch (e) {
      console.error("Error saving bookmark", e);
    }
  };

  const toggleVisited = (siteId: string) => {
    let newVisited = [...visited];
    if (visited.includes(siteId)) {
      newVisited = newVisited.filter((vId) => vId !== siteId);
    } else {
      newVisited.push(siteId);
    }
    setVisited(newVisited);
    try {
      localStorage.setItem("heritage-visited", JSON.stringify(newVisited));
    } catch (e) {
      console.error("Error saving visited sites", e);
    }
  };

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!site) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 text-white font-sans">
        <Navbar />
        <main className="flex-grow pt-32 pb-24 flex items-center justify-center">
          <div className="text-center py-20 bg-slate-900/40 border border-white/10 rounded-3xl p-8 max-w-lg mx-auto backdrop-blur-md">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
              <Compass className="h-8 w-8 text-amber-500 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Monument Not Found</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              The heritage monument you are trying to view does not exist in our database.
            </p>
            <button
              onClick={() => router.push("/explorer")}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-lg text-xs tracking-wide transition-all cursor-pointer"
            >
              Back to Explorer
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const allImages = [site.image, ...site.gallery];
  const isBookmarked = bookmarks.includes(site.id);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pb-24">
        {/* Large Hero Image Section */}
        <section className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-slate-950">
            <OptimizedImage
              src={site.image}
              alt={site.name}
              priority={true}
              className="opacity-75"
            />
          </div>
          
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent hidden md:block" />

          {/* Floating Back & Bookmark Buttons */}
          <div className="absolute top-28 left-0 right-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <button
                onClick={() => router.push("/explorer")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 text-xs font-semibold tracking-wide uppercase transition-all backdrop-blur-md cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back <span className="hidden sm:inline">to Explorer</span></span>
              </button>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleVisited(site.id)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 text-xs font-semibold tracking-wide uppercase transition-all backdrop-blur-md cursor-pointer"
                  title={visited.includes(site.id) ? "Mark as unexplored" : "Mark as explored"}
                >
                  <Award className={`h-4 w-4 ${visited.includes(site.id) ? "text-amber-500 fill-amber-500" : "text-gray-400"}`} />
                  <span>{visited.includes(site.id) ? "Explored" : "Mark Explored"}</span>
                </button>

                <button
                  onClick={() => toggleBookmark(site.id)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 text-xs font-semibold tracking-wide uppercase transition-all backdrop-blur-md cursor-pointer"
                  title={isBookmarked ? "Remove bookmark" : "Bookmark this site"}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? "text-amber-500 fill-amber-500" : "text-gray-400"}`} />
                  <span>{isBookmarked ? "Saved" : "Save"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Banner Contents */}
          <div className="absolute bottom-0 left-0 right-0 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl space-y-4">
                
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold border ${
                      site.category === "Cultural"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-teal-500/10 text-teal-400 border-teal-500/20"
                    }`}
                  >
                    {site.category} site
                  </span>
                  
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 backdrop-blur-sm">
                    <Award className="h-3.5 w-3.5 text-amber-500" />
                    UNESCO Inscribed {site.yearInscribed}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {site.name}
                </h1>

                {/* Location row */}
                <div className="flex items-center gap-2 text-sm sm:text-base text-gray-300">
                  <MapPin className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>{site.location}, {site.state}, India</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Details Layout */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Column (Overview, Highlights, Timeline, Gallery) */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* Introduction & Description */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white uppercase tracking-wider border-l-2 border-amber-500 pl-3">
                  Historical Chronicle
                </h2>
                <p className="text-base text-gray-300 leading-relaxed font-medium">
                  {site.description}
                </p>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed pt-2">
                  {site.historicalOverview}
                </p>
              </div>

              {/* Construction Timeline */}
              {site.timeline && site.timeline.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider border-l-2 border-amber-500 pl-3">
                    Construction Timeline
                  </h2>
                  <div className="relative border-l border-white/10 pl-6 ml-3 space-y-8">
                    {site.timeline.map((event, idx) => (
                      <div key={idx} className="relative group">
                        {/* Dot indicator */}
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-950 border-2 border-amber-500 flex items-center justify-center group-hover:scale-125 transition-transform">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        </div>
                        
                        {/* Event Details */}
                        <div className="space-y-1.5">
                          <span className="inline-block text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {event.year}
                          </span>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {event.event}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Architectural Highlights */}
              {site.architectureHighlights && site.architectureHighlights.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider border-l-2 border-amber-500 pl-3">
                    Architectural Marvels
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {site.architectureHighlights.map((hl, idx) => (
                      <div
                        key={idx}
                        className="p-6 bg-slate-900/40 border border-white/5 hover:border-amber-500/10 rounded-2xl flex flex-col justify-between transition-colors glass-panel"
                      >
                        <div className="space-y-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                            <Star className="h-4 w-4 fill-amber-500" />
                          </div>
                          <h3 className="text-base font-bold text-white">{hl.title}</h3>
                          <p className="text-xs text-gray-400 leading-relaxed">{hl.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Facts / Interesting Trivia */}
              {site.interestingFacts && site.interestingFacts.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider border-l-2 border-amber-500 pl-3">
                    Key Facts & Trivia
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {site.interestingFacts.map((fact, idx) => (
                      <div
                        key={idx}
                        className="p-5 bg-gradient-to-r from-slate-900/60 to-slate-950/40 border border-white/5 rounded-2xl flex gap-4 items-start hover:border-amber-500/20 transition-all"
                      >
                        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                          <span className="text-xs font-bold font-mono">0{idx + 1}</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Photo Gallery Grid */}
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-white uppercase tracking-wider border-l-2 border-amber-500 pl-3">
                  Media Archives
                </h2>
                
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-slate-950 group">
                  <OptimizedImage
                    src={allImages[activeImageIndex]}
                    alt={`${site.name} gallery image ${activeImageIndex + 1}`}
                  />
                  
                  {/* Overlay Index */}
                  <div className="absolute bottom-4 left-4 text-xs font-semibold text-white bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                    Viewpoint {activeImageIndex + 1} of {allImages.length}
                  </div>

                  {/* Open Lightbox Button */}
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="absolute bottom-4 right-4 p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-white/10 text-white transition-colors cursor-pointer"
                    title="Enlarge image"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  {/* Left / Right Navigators */}
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/60 hover:bg-slate-950 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/60 hover:bg-slate-950 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Thumbnails row */}
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-24 aspect-[4/3] rounded-xl overflow-hidden border shrink-0 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? "border-amber-500 scale-95"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <OptimizedImage src={img} alt="Thumbnail" sizes="100px" />
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (UNESCO panel, Visitor Info, Maps coordinates) */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* UNESCO Protection justification */}
              {site.unescoInfo && (
                <div className="bg-gradient-to-tr from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden space-y-4">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center gap-2 text-amber-400">
                    <Award className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">UNESCO Protection</span>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="block text-xs text-gray-500 font-bold uppercase">Inscription Criteria</span>
                    <span className="block text-sm font-semibold text-white bg-slate-950/50 px-3 py-1.5 rounded-lg border border-white/5">
                      Criteria {site.unescoInfo.criteria}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-xs text-gray-500 font-bold uppercase">Historical Significance</span>
                    <p className="text-xs text-gray-300 leading-relaxed italic">
                      &ldquo;{site.unescoInfo.justification}&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {/* Visitor Guide Card */}
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden space-y-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <h3 className="text-base font-bold text-white border-b border-white/5 pb-4 uppercase tracking-wider">
                  Visitor Information
                </h3>

                <div className="space-y-6">
                  {/* Timings */}
                  <div className="flex gap-4 items-start">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hours & Schedule</h4>
                      <p className="text-xs text-gray-200 mt-1 font-semibold leading-relaxed">{site.visitorInfo.timings}</p>
                    </div>
                  </div>

                  {/* Best Time */}
                  <div className="flex gap-4 items-start">
                    <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Best Period to Visit</h4>
                      <p className="text-xs text-gray-200 mt-1 font-semibold leading-relaxed">{site.visitorInfo.bestTimeToVisit}</p>
                    </div>
                  </div>

                  {/* Entry Fees */}
                  <div className="flex gap-4 items-start">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                      <Ticket className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Admissions & Tickets</h4>
                      <p className="text-xs text-gray-200 mt-1 font-semibold leading-relaxed">{site.visitorInfo.entryFee}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Geographic Location block */}
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-6">
                <h3 className="text-base font-bold text-white border-b border-white/5 pb-4 uppercase tracking-wider">
                  Geographic Location
                </h3>
                
                {/* Coordinates grid */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
                    <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Latitude</span>
                    <span className="text-xs font-semibold text-white">{site.coordinates.lat}° N</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
                    <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Longitude</span>
                    <span className="text-xs font-semibold text-white">{site.coordinates.lng}° E</span>
                  </div>
                </div>

                {/* Mock Map view */}
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-950 flex flex-col justify-end p-4">
                  {/* Mock grid to represent coordinates/radar */}
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:16px_16px] flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-amber-500/20 animate-ping absolute" />
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/50 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-amber-500 animate-bounce" />
                    </div>
                  </div>
                  
                  <div className="relative z-10 w-full text-center">
                    <p className="text-[10px] text-gray-400 font-semibold bg-slate-950/90 backdrop-blur-md py-1.5 px-3 rounded-lg border border-white/5 inline-block">
                      {site.location}, {site.state}
                    </p>
                  </div>
                </div>

                {/* Direct Google Maps link */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${site.coordinates.lat},${site.coordinates.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold rounded-xl transition-all uppercase tracking-wider cursor-pointer"
                >
                  <MapIcon className="h-4 w-4 text-amber-500" />
                  View on Google Maps
                </a>
              </div>

              {/* Nearby Attractions */}
              {site.nearbyAttractions && site.nearbyAttractions.length > 0 && (
                <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-6">
                  <h3 className="text-base font-bold text-white border-b border-white/5 pb-4 uppercase tracking-wider">
                    Nearby Attractions
                  </h3>
                  <div className="space-y-3">
                    {site.nearbyAttractions.map((attraction, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-slate-950/40 border border-white/5 rounded-xl text-gray-300 hover:text-white hover:bg-slate-900/40 hover:border-amber-500/20 transition-all"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="text-xs font-medium">{attraction}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </section>
      </main>

      {/* Lightbox / Enlarged Modal for Gallery */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white focus:outline-none cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5 rotate-90" />
            </button>

            {/* Carousel Content */}
            <div className="relative max-w-5xl max-h-[80vh] w-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={allImages[activeImageIndex]}
                alt="Enlarged gallery view"
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              />

              {/* Floating indicators */}
              <button
                onClick={handlePrevImage}
                className="absolute left-0 p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-white/15 text-white cursor-pointer"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-0 p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-white/15 text-white cursor-pointer"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </PageTransition>
  );
}
