// app/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-950 text-white px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-700/30 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Hero */}
      <motion.section initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Rasi Network</h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          Unveiling hidden corporate connections through <br className="hidden md:block" />
          <span className="text-indigo-400 font-medium">Network Analysis</span>
        </p>
        {/* <div className="mt-8">
          <Link href="/analyze" className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-lg font-medium shadow-lg hover:shadow-indigo-500/40 transition">
            Start Analysis
          </Link>
        </div> */}
      </motion.section>

      {/* Key Features */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="mt-20 grid gap-8 md:grid-cols-2 max-w-5xl w-full">
        <FeatureCard title="Graph Visualization" description="Explore corporate ownership structures through an interactive network graph." />
        <FeatureCard title="Network Analysis" description="Discover and identify influential entities and central players." />
      </motion.section>

      {/* Secondary CTA */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }} className="mt-16 text-center">
        <p className="text-gray-400 mb-4">Ready to dive deeper into corporate networks?</p>
        <Link href="/analyze" className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-lg font-medium shadow-lg hover:shadow-purple-500/40 transition">
          Try it Now
        </Link>
      </motion.div>

      {/* Footer */}
      <footer className="mt-20 text-gray-500 text-sm border-t border-gray-800 pt-6 w-full text-center">© {new Date().getFullYear()} Rasi Network. All rights reserved.</footer>
    </main>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 200 }} className="p-6 rounded-2xl bg-gray-800/80 hover:bg-gray-700/80 transition shadow-lg backdrop-blur">
      <h3 className="text-xl font-semibold mb-2 text-indigo-400">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
}
