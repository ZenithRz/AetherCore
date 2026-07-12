"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const defaultGames = [
  {
    name: "Valorant", category: "Tactical FPS / Hero Shooter",
    gradient: "from-red-500/20 via-red-500/5 to-transparent", accent: "#FF4655", svg: "/icons/valorant.svg",
  },
  {
    name: "Counter-Strike 2", category: "Tactical FPS / Competitive",
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent", accent: "#FFA41B", svg: "/icons/counterstrike.svg",
  },
  {
    name: "Call of Duty", category: "Action FPS / Battle Royale",
    gradient: "from-green-500/20 via-green-500/5 to-transparent", accent: "#00CC66", svg: "/icons/callofduty.svg",
  },
  {
    name: "Fortnite", category: "Battle Royale / Sandbox",
    gradient: "from-purple-500/20 via-purple-500/5 to-transparent", accent: "#9B59B6", svg: "/icons/fortnite.svg",
  },
  {
    name: "PUBG", category: "Battle Royale / Survival",
    gradient: "from-yellow-500/20 via-yellow-500/5 to-transparent", accent: "#F5A623", svg: "/icons/pubg.svg",
  },
  {
    name: "Apex Legends", category: "Fast-Paced Battle Royale / Hero Shooter",
    gradient: "from-red-600/20 via-red-600/5 to-transparent", accent: "#DA291C", svg: "/icons/apexlegends.svg",
  },
  {
    name: "League of Legends", category: "MOBA / Strategy",
    gradient: "from-blue-500/20 via-blue-500/5 to-transparent", accent: "#0AC8B9", svg: "/icons/leagueoflegends.svg",
  },
  {
    name: "Dota 2", category: "MOBA / Competitive Strategy",
    gradient: "from-teal-500/20 via-teal-500/5 to-transparent", accent: "#E74C3C", svg: "/icons/dota2.svg",
  },
  {
    name: "FC 25", category: "Sports / Simulation",
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent", accent: "#00A651", svg: "/icons/easportsfc.svg",
  },
  {
    name: "Rocket League", category: "Sports / Arcade Physics",
    gradient: "from-sky-500/20 via-sky-500/5 to-transparent", accent: "#00BFFF", svg: "/icons/rocketleague.svg",
  },
  {
    name: "Minecraft", category: "Sandbox / Survival Automation",
    gradient: "from-green-600/20 via-green-600/5 to-transparent", accent: "#4CAF50", svg: "/icons/minecraft.svg",
  },
  {
    name: "Roblox", category: "Sandbox / User-Generated Universe",
    gradient: "from-rose-500/20 via-rose-500/5 to-transparent", accent: "#E2231A", svg: "/icons/roblox.svg",
  },
];

const categoryAccents: Record<string, string> = {
  MOBA: "#0AC8B9", FPS: "#FF4655", "Battle Royale": "#F5A623",
  Strategy: "#3498DB", Racing: "#E74C3C", Sports: "#00A651",
  Fighting: "#E74C3C", RPG: "#9B59B6", "Open World": "#2ECC71",
  Simulation: "#00BFFF", Casual: "#FFA41B", Party: "#E2231A",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

type Props = { limit?: number; showMore?: boolean };

export default function GamesGrid({ limit, showMore }: Props) {
  const [adminGames, setAdminGames] = useState<{ id?: string; name: string; type: string; image?: string }[]>([]);

  useEffect(() => {
    fetch("/api/admin/games").then(r => r.json()).then(setAdminGames).catch(() => {});
  }, []);

  const allGames = [
    ...defaultGames,
    ...adminGames.map(g => ({
      name: g.name,
      category: g.type,
      accent: categoryAccents[g.type] || "#B8BFCB",
      gradient: "from-accent-platinum/10 via-accent-navy/5 to-transparent" as const,
      svg: g.image || "",
      custom: true,
    })),
  ];

  const displayGames = limit ? allGames.slice(0, limit) : allGames;

  return (
    <section id="games" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--surface-alt)]/30 to-[var(--background)]" />

      <motion.div className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full bg-accent-platinum/3 blur-3xl" animate={{ y: [0, -20, 10, 0], x: [0, 15, -10, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-1/4 left-1/4 w-56 h-56 rounded-full bg-accent-navy/3 blur-3xl" animate={{ y: [0, 15, -20, 0], x: [0, -10, 20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />

      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #B8BFCB 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-accent-platinum to-accent-navy bg-clip-text text-transparent">GAMES ROSTER</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">The battlegrounds where our community dominates</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {displayGames.map((game, i) => (
            <motion.div key={game.name} variants={cardVariants} data-sfx-hover whileHover={{ scale: 1.03, y: -6 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 35 }} className="group relative">
              <div className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md" style={{ background: `linear-gradient(135deg, ${game.accent}40, transparent)` }} />
              <div className="relative bg-[var(--surface)]/80 backdrop-blur-md border border-[var(--border)]/50 rounded-xl p-6 h-full flex flex-col items-start gap-4 transition-all duration-300 group-hover:border-[var(--border)]/80 overflow-hidden">
                <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${(game as any).gradient})` }} />
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <motion.div className="absolute w-full h-px bg-gradient-to-r from-transparent via-accent-platinum/8 to-transparent" animate={{ top: ["-10%", "110%"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: i * 0.3 }} />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer-sweep" />
                </div>

                <motion.div className="relative z-10 w-12 h-12 rounded-lg bg-[var(--surface-alt)]/80 flex items-center justify-center border border-[var(--border)]/30 p-2" whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.15 }} transition={{ duration: 0.5 }}>
                  {game.svg ? (
                    <img src={game.svg} alt={game.name} className="w-full h-full object-contain" style={{ filter: `drop-shadow(0 0 4px ${game.accent}60)` }} />
                  ) : (
                    <span className="text-lg font-bold" style={{ color: game.accent }}>{game.name[0]}</span>
                  )}
                </motion.div>

                <motion.div className="relative z-10 flex-1" whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 200 }}>
                  <h3 className="font-orbitron text-base sm:text-lg font-bold text-[var(--text-primary)] mb-2">{game.name}</h3>
                  <motion.span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium tracking-wide" style={{ backgroundColor: `${game.accent}15`, color: game.accent, borderColor: `${game.accent}30`, borderWidth: 1 }} whileHover={{ scale: 1.05 }}>
                    {game.category}
                  </motion.span>
                </motion.div>

                <motion.div className="relative z-10 w-full h-0.5 rounded-full opacity-0 group-hover:opacity-100" style={{ background: `linear-gradient(90deg, ${game.accent}, transparent)` }} layoutId={`underline-${game.name}`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {showMore && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-12 text-center">
            <a href="/games" data-sfx-click className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-lg border border-accent-platinum/30 bg-[var(--surface)]/60 backdrop-blur-md text-accent-platinum text-sm font-medium tracking-wider uppercase overflow-hidden transition-all duration-300 hover:border-accent-platinum/50">
              <span className="absolute inset-0 bg-gradient-to-r from-accent-platinum/5 via-accent-platinum/10 to-accent-platinum/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10">More Games</span>
              <motion.span className="relative z-10" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </motion.span>
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
