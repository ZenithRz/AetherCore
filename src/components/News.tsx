"use client";

import { motion } from "framer-motion";
import { Newspaper, Radio, FileText, Signal } from "lucide-react";

const placeholderArticles = [1, 2, 3];

export default function News() {
  return (
    <section id="news" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--surface-alt)]/30 to-[var(--background)]" />

      <motion.div
        className="absolute top-20 right-20 w-36 h-36 rounded-full bg-accent-platinum/3 blur-3xl"
        animate={{ y: [0, -15, 10, 0], scale: [1, 1.1, 0.9, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-44 h-44 rounded-full bg-accent-navy/3 blur-3xl"
        animate={{ y: [0, 10, -15, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-accent-platinum to-accent-navy bg-clip-text text-transparent">
              NEWS & UPDATES
            </span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            Server announcements, patch notes, and community highlights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {placeholderArticles.map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              data-sfx-hover
              className="group relative"
            >
              <motion.div
                className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-accent-platinum/10 via-transparent to-accent-platinum/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
                animate={{ rotate: [0, 1, -1, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                className="relative bg-[var(--surface)]/70 backdrop-blur-md border border-[var(--border)]/40 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center gap-5 min-h-[280px] transition-all duration-300 overflow-hidden"
                whileHover={{ y: -6, scale: 1.01, borderColor: "rgba(184,191,203,0.35)" }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <motion.div
                    className="absolute w-full h-px bg-gradient-to-r from-transparent via-accent-platinum/10 to-transparent"
                    animate={{ top: ["-10%", "110%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                  />
                </div>

                <motion.div
                  className="w-16 h-16 rounded-full bg-[var(--surface-alt)]/80 border border-[var(--border)]/50 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {i === 0 ? (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Radio className="w-7 h-7 text-accent-platinum" />
                    </motion.div>
                  ) : i === 1 ? (
                    <Newspaper className="w-7 h-7 text-accent-navy" />
                  ) : (
                    <FileText className="w-7 h-7 text-accent-mauve" />
                  )}
                </motion.div>

                <h3 className="font-orbitron text-lg font-bold text-[var(--text-primary)]">
                  {i === 0 ? (
                    <span className="flex items-center gap-2 justify-center">
                      <motion.span
                        className="w-2 h-2 rounded-full bg-accent-platinum"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                      LIVE TRANSMISSION
                    </span>
                  ) : (
                    "TRANSMISSION INTERRUPTED"
                  )}
                </h3>

                <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-xs">
                  {i === 0
                    ? "Static fills the airwaves. We are experiencing technical difficulties with our news feed."
                    : "The news feed is currently quiet. Check back soon for server updates and patch notes."}
                </p>

                <div className="flex gap-1.5">
                  {[0, 1, 2].map((dot) => (
                    <motion.div
                      key={dot}
                      animate={{
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: dot * 0.3,
                        ease: "easeInOut",
                      }}
                      className="w-1.5 h-1.5 rounded-full bg-accent-platinum/60"
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
