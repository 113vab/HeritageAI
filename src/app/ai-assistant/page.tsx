"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/ui/PageTransition";
import { heritageSites } from "@/data/heritageSites";
import { Bot, Plane, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GeminiAIProvider } from "@/utils/aiProvider";

export default function AIAssistant() {
  const [activeTab, setActiveTab] = useState<"chat" | "planner">("chat");

  // Chat Guide States
  const [selectedSiteId, setSelectedSiteId] = useState(heritageSites[0].id);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    { sender: "bot", text: "Namaste! I am your AI Heritage Guide. Select a monument and ask me about its builder, architectural style, historical importance, construction techniques, or interesting legends!" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "Who built this monument?",
    "What is its architectural style?",
    "Tell me an interesting legend.",
    "What are its construction techniques?",
    "What is its UNESCO significance?",
    "What are some nearby attractions?"
  ]);

  // Planner States
  const [selectedState, setSelectedState] = useState("Delhi");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState("mid");
  const [itinerary, setItinerary] = useState<Array<{ day: string; details: string }> | null>(null);

  // States List for Planner
  const statesList = Array.from(new Set(heritageSites.map((s) => s.state.split(",")[0].trim()))).sort();

  // Chat Guide Bot Response Logic
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessages: Array<{ sender: "user" | "bot"; text: string }> = [
      ...messages,
      { sender: "user", text }
    ];
    setMessages(newMessages);
    setInputVal("");

    // Simulate AI response delay
    setTimeout(async () => {
      const currentSite = heritageSites.find((s) => s.id === selectedSiteId) || heritageSites[0];
      const provider = new GeminiAIProvider();
      const response = await provider.generateResponse(text, currentSite, heritageSites);
      
      setMessages((prev) => [...prev, { sender: "bot", text: response.text }]);
      
      if (response.switchedSiteId) {
        setSelectedSiteId(response.switchedSiteId);
      }
      if (response.suggestedQuestions && response.suggestedQuestions.length > 0) {
        setSuggestedQuestions(response.suggestedQuestions);
      }
    }, 550);
  };



  // Itinerary Planner Generator Logic
  const handleGenerateItinerary = (e: React.FormEvent) => {
    e.preventDefault();
    const stateSites = heritageSites.filter((s) => s.state.toLowerCase().includes(selectedState.toLowerCase()));
    
    const hotelOptions = {
      budget: "Budget hotels, heritage youth hostels, or guest houses (₹1,500 - ₹2,500 / night)",
      mid: "Mid-range boutique properties and heritage home-stays (₹4,000 - ₹7,000 / night)",
      luxury: "5-star grand luxury palaces and premium signature suites (₹15,000+ / night)"
    };
    
    const chosenHotel = hotelOptions[budget as keyof typeof hotelOptions] || hotelOptions.mid;
    const plan = [];

    plan.push({
      day: "Day 1: Arrival & Local Acclimatization",
      details: `Arrive in your target city. Check-in to your selected accommodation: ${chosenHotel}. Spend the afternoon relaxing or exploring local markets.`
    });

    stateSites.forEach((site, index) => {
      if (index < days - 1) {
        plan.push({
          day: `Day ${index + 2}: Discover ${site.name}`,
          details: `Tour the majestic ${site.name} in the morning (Schedule: ${site.visitorInfo.timings}). Recommended budget: ${site.visitorInfo.entryFee}. Best activity: Architectural tour of ${site.architectureHighlights?.map((h) => h.title).slice(0, 2).join(" & ")}. Afternoon: Check out nearby spots like ${site.nearbyAttractions?.slice(0, 2).join(" & ") || "local bazaars"}.`
        });
      }
    });

    if (plan.length < days) {
      plan.push({
        day: `Day ${days}: Local Craftsmanship & Departure`,
        details: "Spend your final day shopping for traditional handicrafts and tasting regional cuisines before your journey home."
      });
    }

    setItinerary(plan);
  };

  return (
    <PageTransition>
      <Navbar />
      <main className="flex-grow pt-32 pb-24 bg-slate-950 text-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Bot className="h-3.5 w-3.5" />
              AI Intelligence Suite
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Heritage <span className="text-gradient-gold">AI Assistant</span>
            </h1>
            <p className="text-gray-400 mt-4 text-sm md:text-base leading-relaxed">
              Explore monuments with our site-aware AI guide or generate customized day-by-day travel itineraries based on states, budget, and durations.
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="flex justify-center mb-10">
            <div className="bg-slate-900 border border-white/10 p-1.5 rounded-2xl flex gap-2">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "chat"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/15"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Bot className="h-4 w-4" />
                AI Guide Chat
              </button>
              <button
                onClick={() => setActiveTab("planner")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "planner"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/15"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Plane className="h-4 w-4" />
                AI Trip Planner
              </button>
            </div>
          </div>

          {/* Active Tab Panel */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === "chat" ? (
                <motion.div
                  key="chat-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 glass-panel flex flex-col h-[600px]"
                >
                  {/* Site Selector for Chat */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-4 border-b border-white/5 mb-4 shrink-0">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Site Focus</span>
                    <select
                      value={selectedSiteId}
                      onChange={(e) => {
                        setSelectedSiteId(e.target.value);
                        const site = heritageSites.find((s) => s.id === e.target.value);
                        setMessages([
                          { sender: "bot", text: `I am now tuned to the ${site?.name || "selected site"}. Ask me about its builder, architectural style, interesting legends, or visitor guide!` }
                        ]);
                        setSuggestedQuestions([
                          "Who built this monument?",
                          "What is its architectural style?",
                          "Tell me an interesting legend.",
                          "What are its construction techniques?",
                          "What is its UNESCO significance?",
                          "What are some nearby attractions?"
                        ]);
                      }}
                      className="bg-slate-950 border border-white/10 text-xs font-medium text-white px-3 py-2 rounded-lg focus:outline-none focus:border-amber-500"
                    >
                      {heritageSites.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message Window */}
                  <div className="flex-grow overflow-y-auto space-y-4 pb-4 pr-2 scrollbar-thin">
                    {messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed ${
                            m.sender === "user"
                              ? "bg-amber-500 text-slate-950 font-semibold rounded-tr-none"
                              : "bg-slate-950 border border-white/10 text-gray-300 rounded-tl-none"
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Suggested questions row */}
                  <div className="flex flex-wrap gap-2 py-3 border-t border-white/5 overflow-x-auto shrink-0 scrollbar-none">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSendMessage(q)}
                        className="px-3 py-1.5 rounded-lg border border-white/5 hover:border-amber-500/30 text-[10px] text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* Chat input box */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage(inputVal);
                    }}
                    className="flex gap-2 shrink-0 pt-2"
                  >
                    <input
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      placeholder="Ask the AI Heritage Guide..."
                      className="flex-grow bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="p-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="planner-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <form
                    onSubmit={handleGenerateItinerary}
                    className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 glass-panel grid grid-cols-1 sm:grid-cols-3 gap-6 items-end"
                  >
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Target State</label>
                      <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 text-xs font-semibold text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-amber-500"
                      >
                        {statesList.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Duration (Days)</label>
                      <input
                        type="number"
                        min="1"
                        max="7"
                        value={days}
                        onChange={(e) => setDays(Math.min(7, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                        className="w-full bg-slate-950 border border-white/10 text-xs font-semibold text-white px-4 py-3 rounded-xl focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Budget Level</label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 text-xs font-semibold text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-amber-500"
                      >
                        <option value="budget">Budget (Economy)</option>
                        <option value="mid">Mid-Range (Boutique)</option>
                        <option value="luxury">Luxury (Grand Palace)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3 pt-2">
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/10 cursor-pointer"
                      >
                        <Plane className="h-4 w-4" />
                        Generate AI Itinerary
                      </button>
                    </div>
                  </form>

                  {itinerary && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-900/20 border border-white/5 rounded-3xl p-6 glass-panel space-y-6"
                    >
                      <div className="border-b border-white/5 pb-4">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Custom Itinerary: {selectedState}</h3>
                        <p className="text-xs text-gray-500">Plan designed for {days} days on {budget} budget tier</p>
                      </div>

                      <div className="space-y-6">
                        {itinerary.map((item, idx) => (
                          <div key={idx} className="relative pl-6 border-l border-white/10 space-y-1.5">
                            <div className="absolute -left-[5.5px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500" />
                            <h4 className="text-sm font-bold text-amber-400">{item.day}</h4>
                            <p className="text-xs text-gray-300 leading-relaxed">{item.details}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
