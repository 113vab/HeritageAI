"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Landmark, Map, Calendar, ShieldCheck } from "lucide-react";

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({ value, suffix = "", duration = 1500 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setCount(Math.floor(progress * value));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(value);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Statistics() {
  const stats = [
    {
      icon: Landmark,
      targetValue: 20,
      suffix: "+",
      label: "Heritage Sites",
      description: "Carefully curated Indian landmarks from North to South.",
    },
    {
      icon: Map,
      targetValue: 12,
      suffix: "+",
      label: "States Mapped",
      description: "Spanning across diverse regional territories and states.",
    },
    {
      icon: Calendar,
      targetValue: 2300,
      suffix: "+",
      label: "Years of History",
      description: "Timeline from 3rd Century BCE Ashokan era to 17th Century.",
    },
    {
      icon: ShieldCheck,
      targetValue: 100,
      suffix: "%",
      label: "UNESCO Listed",
      description: "Globally recognized sites of outstanding universal value.",
    },
  ];

  return (
    <section className="py-24 bg-slate-950/40 border-y border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-teal-500/5 opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group p-6 rounded-2xl hover:bg-slate-900/20 border border-transparent hover:border-white/5 transition-all"
              >
                {/* Icon Circle */}
                <div className="inline-flex items-center justify-center p-3.5 bg-slate-900 border border-white/5 text-amber-500 rounded-xl mb-6 group-hover:scale-110 group-hover:text-teal-400 group-hover:border-amber-500/20 transition-all duration-300">
                  <Icon className="h-6 w-6" />
                </div>
                
                {/* Large Counter Number */}
                <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
                  <span className="text-gradient-gold">
                    <AnimatedCounter value={stat.targetValue} suffix={stat.suffix} />
                  </span>
                </div>
                
                {/* Stat title */}
                <div className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-2">
                  {stat.label}
                </div>
                
                {/* Stat description */}
                <div className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                  {stat.description}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
