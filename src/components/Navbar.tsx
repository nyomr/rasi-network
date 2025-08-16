// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 backdrop-blur-md bg-gray-900/80 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight hover:text-indigo-400 transition-colors">
            Rasi
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <NavLink href="/analyze" text="Analyze" />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-gray-700 transition" aria-label="Toggle menu">
              <motion.span animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 1 : 0 }} className="block w-6 h-0.5 bg-white mb-1" />
              <motion.span animate={{ opacity: isOpen ? 0 : 1 }} className="block w-6 h-0.5 bg-white mb-1" />
              <motion.span animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -1 : 0 }} className="block w-6 h-0.5 bg-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="md:hidden bg-gray-800/90 backdrop-blur-md px-6 py-4 space-y-3">
            <NavLink href="/analyze" text="Analyze" mobile />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ href, text, mobile = false }: { href: string; text: string; mobile?: boolean }) {
  return (
    <Link href={href} className={`transition-colors ${mobile ? "block text-gray-300 hover:text-indigo-400" : "text-gray-300 hover:text-indigo-400"}`}>
      {text}
    </Link>
  );
}
