"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";
import DiscordNavButton from "@/components/DiscordNavButton";

export default function Navbar() {
  const { t, lang } = useLanguage();

  const navLinks = useMemo(() => [
    { href: "/", label: t("nav.home") },
    { href: "/#tournaments", label: t("nav.tournaments") },
    { href: "/games", label: t("nav.games") },
    { href: "/#team", label: t("nav.team") },
    { href: "/#news", label: t("nav.news") },
    { href: "/#contact", label: t("nav.contact") },
  ], [lang]);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
    const vh = typeof window !== "undefined" ? window.innerHeight : 900;
    setHeroProgress(Math.min(Math.max(latest / vh, 0), 1));
  });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" as const }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--border)]/30 shadow-lg shadow-[var(--background)]/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a href="/" className="flex items-center gap-1.5 group">
            <motion.img
              src="/logo.png"
              alt="AETHRECORE logo"
              style={{
                x: heroProgress * 70,
                rotate: heroProgress * 360,
                scale: 1 + heroProgress * 0.3,
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-[0_0_12px_rgba(184,191,203,0.4)] relative z-10"
            />
            <div className="relative flex items-center">
              <div className="relative overflow-hidden">
                <motion.span
                  className="relative font-orbitron text-lg sm:text-xl font-bold tracking-wider bg-gradient-to-r from-accent-platinum to-accent-navy bg-clip-text text-transparent"
                  style={{
                    maskImage: `linear-gradient(to right, transparent 0%, transparent ${heroProgress * 100 - 3}%, black ${heroProgress * 100}%, black 100%)`,
                    WebkitMaskImage: `linear-gradient(to right, transparent 0%, transparent ${heroProgress * 100 - 3}%, black ${heroProgress * 100}%, black 100%)`,
                  }}
                >
                  AETHRECORE
                </motion.span>
                <motion.div
                  className="absolute top-0 bottom-0 w-px"
                  style={{
                    left: `${heroProgress * 100}%`,
                    background: "linear-gradient(to bottom, #B8BFCB, #3A4A6B)",
                    boxShadow: "0 0 6px #B8BFCB, 0 0 20px #3A4A6B, 0 0 40px #B8BFCB",
                    opacity: heroProgress < 0.03 ? 0 : 1,
                  }}
                />
              </div>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                data-sfx-hover
                whileHover={{ scale: 1.05 }}
                className="group relative text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300"
              >
                {link.label}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-platinum opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100" />
              </motion.a>
            ))}
          </div>

          <div className="hidden md:flex items-center ml-4">
            <DiscordNavButton />
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            data-sfx-click
            className="md:hidden relative z-50 p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[var(--surface)]/95 backdrop-blur-xl border-t border-[var(--border)]/30"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  data-sfx-hover
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, delay: i * 0.06, ease: "easeOut" }}
                  whileHover={{ x: 8 }}
                  className="flex items-center gap-3 text-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300"
                >
                  <span className="w-1 h-1 rounded-full bg-accent-platinum/50 group-hover:bg-accent-platinum transition-colors" />
                  {link.label}
                </motion.a>
              ))}
              <div className="pt-2">
                <DiscordNavButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
