"use client";

import React from "react";
import Link from "next/link";
import { Landmark, ArrowRight, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Subscription registered (Mock)!");
  };

  return (
    <footer className="bg-slate-950 border-t border-white/5 text-gray-400">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="p-1.5 rounded-lg bg-gradient-to-tr from-amber-500 to-teal-500 p-[1px]">
                <div className="bg-slate-950 p-1.5 rounded-[7px]">
                  <Landmark className="h-4 w-4 text-amber-500" />
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Heritage<span className="text-gradient-gold font-extrabold">AI</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Preserving and presenting the spectacular architectural history of India. Experience the timeless legacy of 20 UNESCO World Heritage sites digitized for the modern era.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ y: -3 }}
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white p-2 rounded-lg bg-white/5 border border-white/5 transition-colors"
              >
                <svg className="h-4 w-4 text-gray-400 hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white p-2 rounded-lg bg-white/5 border border-white/5 transition-colors"
              >
                <svg className="h-4 w-4 text-gray-400 hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white p-2 rounded-lg bg-white/5 border border-white/5 transition-colors"
              >
                <svg className="h-4 w-4 text-gray-400 hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Explore
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home Landing
                </Link>
              </li>
              <li>
                <Link href="/explorer" className="hover:text-white transition-colors">
                  Heritage Explorer
                </Link>
              </li>
              <li>
                <Link href="/timeline" className="hover:text-white transition-colors">
                  Timeline Explorer
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Monument Compare
                </Link>
              </li>
              <li>
                <Link href="/ai-assistant" className="hover:text-white transition-colors">
                  AI Assistant & Planner
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-white transition-colors">
                  Achievements
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Sites */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Featured Sites
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/explorer/taj-mahal" className="hover:text-white transition-colors">
                  Taj Mahal
                </Link>
              </li>
              <li>
                <Link href="/explorer/hampi" className="hover:text-white transition-colors">
                  Group at Hampi
                </Link>
              </li>
              <li>
                <Link href="/explorer/ajanta-caves" className="hover:text-white transition-colors">
                  Ajanta Caves
                </Link>
              </li>
              <li>
                <Link href="/explorer/ellora-caves" className="hover:text-white transition-colors">
                  Ellora Caves
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
              Stay Informed
            </h3>
            <p className="text-sm text-gray-400">
              Receive updates, historical deep-dives, and information on new heritage virtual tours.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter email"
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition-colors flex items-center justify-center shrink-0"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-slate-950 border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© {currentYear} HeritageAI. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>honoring Indian Heritage.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
