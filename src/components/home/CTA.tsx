"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, Mail, ArrowRight } from "lucide-react";

export default function CTA() {
  const [email, setEmail] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Mock registration for: ${email}`);
    setEmail("");
  };

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-gradient-to-r from-amber-500/10 to-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 rounded-3xl p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
          
          {/* Subtle line mesh */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Ready to Explore India&apos;s <span className="text-gradient-gold">Ancient Splendor</span>?
            </h2>
            
            <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Unlock the historical narratives, structural architectures, and visiting rules of 20 iconic UNESCO sites. Entirely free, offline-ready, and optimized for research.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/explorer">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/10 flex items-center gap-2 text-sm md:text-base cursor-pointer"
                >
                  <Compass className="h-4.5 w-4.5" />
                  Launch Heritage Explorer
                </motion.button>
              </Link>

              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all text-sm md:text-base flex items-center gap-1"
              >
                Back to Top
              </button>
            </div>

            {/* Inline Newsletter signup inside the box */}
            <div className="pt-8 border-t border-white/5 max-w-md mx-auto">
              <p className="text-xs text-gray-400 mb-4 font-semibold tracking-wide uppercase">
                Join our premium historical archive newsletter
              </p>
              <form onSubmit={handleRegister} className="flex gap-2 p-1 bg-slate-950/80 border border-white/5 rounded-xl">
                <div className="flex items-center pl-3 text-gray-500 shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-transparent border-0 py-2.5 px-2 text-xs text-white focus:outline-none focus:ring-0 placeholder-gray-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap"
                >
                  Join List
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
