"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageProvider";

type Phase = "dawn" | "ignition" | "ascension" | "orbit" | "revelation" | "living";

const assets = [
  { src: "/Ball.png", alt: "Ball", size: 72 },
  { src: "/Gun.png", alt: "Gun", size: 60 },
  { src: "/controler.png", alt: "Controller", size: 64 },
  { src: "/MainCraft.png", alt: "MainCraft", size: 80 },
  { src: "/Smart.png", alt: "Smart", size: 52 },
];

const orbitalAssets = assets.map((asset, i) => ({
  ...asset,
  orbitRadius: 170 + i * 28,
  orbitSpeed: 22 + i * 3,
  startAngle: (i / assets.length) * 360,
}));

const particles = Array.from({ length: 8 }, (_, i) => {
  const n = (i * 137.508 + 57.295) % 1;
  return {
    x: 10 + ((i * 47 + 13) % 80),
    y: 15 + ((i * 83 + 7) % 75),
    size: 1.5 + ((i * 31 + 5) % 10) / 5,
    delay: i * 0.8,
  };
});

export default function Hero() {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>("dawn");
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [showOrbits, setShowOrbits] = useState(false);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("ignition"), 800);
    const t2 = setTimeout(() => setPhase("ascension"), 2200);
    const t3 = setTimeout(() => { setPhase("orbit"); setShowOrbits(true); }, 4000);
    const t4 = setTimeout(() => setPhase("revelation"), 6000);
    const t5 = setTimeout(() => setPhase("living"), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  const mx = (mousePos.x - 0.5) * 2;
  const my = (mousePos.y - 0.5) * 2;
  const showContent = phase === "revelation" || phase === "living";
  const showTitle = phase === "ascension" || phase === "orbit" || phase === "revelation" || phase === "living";
  const isLit = phase !== "dawn";

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center overflow-hidden">
      <div className="absolute inset-0 bg-[var(--background)]" />

      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #B8BFCB 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-accent-platinum/5 blur-3xl" animate={{ scale: isLit ? 2 : 0.6, opacity: isLit ? 0.4 : 0.2 }} transition={{ duration: 3 }} />
      <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent-navy/4 blur-3xl" animate={{ scale: isLit ? 1.8 : 0.4, opacity: isLit ? 0.3 : 0.1 }} transition={{ duration: 4, delay: 0.5 }} />

      <motion.div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-accent-platinum/4 blur-3xl" animate={{ x: mx * -20, y: my * -20 }} />
      <motion.div className="absolute bottom-1/3 -right-16 w-96 h-96 rounded-full bg-accent-navy/4 blur-3xl" animate={{ x: mx * 15, y: my * 15 }} />

      {/* Static grids */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(45deg, rgba(184,191,203,0.3) 1px, transparent 1px), linear-gradient(-45deg, rgba(184,191,203,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <motion.div className="absolute bottom-0 left-0 right-0 h-[45vh]" animate={{ opacity: isLit ? 0.5 : 0.1 }} transition={{ duration: 3, delay: 1 }} style={{ maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)", backgroundImage: "repeating-linear-gradient(90deg, rgba(184,191,203,0.08) 0px, rgba(184,191,203,0.08) 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, rgba(184,191,203,0.06) 0px, rgba(184,191,203,0.06) 1px, transparent 1px, transparent 80px)", perspective: "600px", transform: "rotateX(60deg)", transformOrigin: "bottom center" }} />
      </div>

      {/* Hex pattern SVG (static) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.025]">
        <svg className="w-full h-full">
          <defs>
            <pattern id="hero-hex" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
              <path d="M28 0L56 16.5V49.5L28 66L0 49.5V16.5Z" fill="none" stroke="#B8BFCB" strokeWidth="0.5" />
              <path d="M28 33L56 49.5V82.5L28 99L0 82.5V49.5Z" fill="none" stroke="#B8BFCB" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-hex)" />
        </svg>
      </div>

      {/* Static constellations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <svg className="w-full h-full">
          {["M15,20 L25,35 L18,50 L8,40 Z", "M85,15 L92,30 L82,45 L75,28 Z", "M50,80 L60,90 L45,95 L35,85 Z", "M70,55 L78,65 L65,72 L58,60 Z", "M5,70 L15,78 L10,88 L2,78 Z", "M95,60 L88,72 L92,85 L98,70 Z", "M20,15 L35,8 L30,20 Z", "M78,12 L88,18 L80,25 Z", "M60,78 L72,82 L65,90 Z", "M12,60 L22,68 L15,75 Z"].map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#B8BFCB" strokeWidth="0.4" strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </svg>
      </div>

      {/* Floating dots */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none bg-accent-platinum"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ opacity: [0.1, 0.3, 0.08, 0.2, 0.1], scale: [0.5, 1, 0.6, 0.8, 0.5] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}

      {/* Data nodes */}
      {[
        { x: "8%", y: "15%" }, { x: "92%", y: "25%" }, { x: "10%", y: "80%" },
      ].map((node, i) => (
        <motion.div
          key={`node-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{ left: node.x, top: node.y, width: 3, height: 3, background: "#B8BFCB", boxShadow: "0 0 8px rgba(184,191,203,0.3)" }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
        />
      ))}

      {/* Swirl burst */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 4 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "ignition" || phase === "ascension" ? 1 : phase === "orbit" ? 0 : 0 }}
        transition={{ duration: 1 }}
      >
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * 360;
          const dist = 80 + (i * 17) % 80;
          const sz = 2 + (i * 11) % 4;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: sz, height: sz,
                background: i % 3 === 0 ? "#B8BFCB" : "#3A4A6B",
                left: "50%", top: "50%",
              }}
              animate={{
                x: [0, Math.cos((angle * Math.PI) / 180) * dist * 3],
                y: [0, Math.sin((angle * Math.PI) / 180) * dist * 3],
                opacity: [1, 0.2, 0],
                scale: [1, 0.3, 0],
              }}
              transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.04 }}
            />
          );
        })}
      </motion.div>

      {/* Ignition pulse */}
      {phase === "ignition" && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-platinum/20 pointer-events-none"
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ width: [0, 500, 1000], height: [0, 500, 1000], opacity: [0.5, 0.15, 0] }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          style={{ zIndex: 4 }}
        />
      )}

      {/* Ascension light */}
      {phase === "ascension" && (
        <>
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 pointer-events-none"
            initial={{ height: "0%", opacity: 0, width: 2 }}
            animate={{ height: "70%", opacity: [0, 0.25, 0.1], width: [2, 40, 4] }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ zIndex: 3, background: "linear-gradient(180deg, transparent 0%, rgba(184,191,203,0.08) 30%, rgba(184,191,203,0.12) 50%, rgba(184,191,203,0.08) 70%, transparent 100%)" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.2, 0], scale: [0.5, 1.2, 1.5] }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ zIndex: 4, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(184,191,203,0.12) 0%, transparent 60%)" }}
          />
        </>
      )}

      {/* Ambient glow */}
      {(showTitle || showContent) && (
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2 }}
          style={{ zIndex: 3 }}
        >
          <div className="w-[800px] h-[800px] rounded-full" style={{ background: "radial-gradient(circle, rgba(184,191,203,0.1) 0%, rgba(58,74,107,0.05) 30%, transparent 60%)" }} />
        </motion.div>
      )}

      {/* Portal Rings — CSS rotate only */}
      <div className="absolute pointer-events-none" style={{ left: "50%", top: "50%", zIndex: 4 }}>
        {[
          { size: 280, thickness: 2, speed: "20s", color: "rgba(184,191,203,0.15)" },
          { size: 420, thickness: 1, speed: "28s", color: "rgba(58,74,107,0.2)" },
          { size: 560, thickness: 1, speed: "35s", color: "rgba(107,90,107,0.15)" },
        ].map((ring, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: ring.size, height: ring.size,
              marginLeft: -ring.size / 2, marginTop: -ring.size / 2,
              border: `${ring.thickness}px solid ${ring.color}`,
              opacity: isLit ? 0.15 + i * 0.03 : 0,
              transform: `scale(${isLit ? 1 + i * 0.05 : 0.5})`,
              animation: `spin ${ring.speed} linear infinite`,
              transition: "opacity 1.5s ease-out, transform 1.5s ease-out",
              transitionDelay: `${0.8 + i * 0.3}s`,
              willChange: "transform",
            }}
          />
        ))}
      </div>

      {/* Orbiting Assets */}
      {showOrbits && orbitalAssets.map((asset) => (
        <div
          key={asset.alt}
          className="absolute pointer-events-none"
          style={{
            left: "50%", top: "50%", zIndex: 6,
            animation: `spin ${asset.orbitSpeed}s linear infinite`,
            transform: `rotate(${asset.startAngle}deg)`,
          }}
        >
          <div
            className="absolute"
            style={{
              width: asset.size, height: asset.size,
              marginLeft: -asset.size / 2,
              marginTop: -asset.orbitRadius - asset.size / 2,
              animation: `spin ${asset.orbitSpeed}s linear infinite reverse`,
              filter: `drop-shadow(0 0 ${8 + mx}px rgba(184,191,203,0.25))`,
            }}
          >
            <img src={asset.src} alt={asset.alt} className="w-full h-full object-contain" />
          </div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-[12vh] sm:pt-[15vh]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20, scale: showContent ? 1 : 0.9 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <motion.span
            data-sfx-hover
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-platinum/30 bg-[var(--surface)]/60 backdrop-blur-sm text-accent-platinum/80 text-xs sm:text-sm font-medium tracking-wider uppercase"
            whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 35 } }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t("hero.subtitle")}
          </motion.span>
        </motion.div>

        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, scale: 3, y: 80, filter: "blur(40px)", letterSpacing: "0.6em" }}
            animate={{
              opacity: showTitle ? 1 : 0,
              scale: showTitle ? 1 : 2,
              y: showTitle ? 0 : 60,
              filter: showTitle ? "blur(0px)" : "blur(20px)",
              letterSpacing: showTitle ? "0.02em" : "0.4em",
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], scale: { duration: 1.8, ease: [0.34, 1.56, 0.64, 1] }, filter: { duration: 1.5 } }}
            className="font-orbitron text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-wider mb-6 sm:mb-8"
            style={{
              color: "rgba(184,191,203,0.85)",
              textShadow: showTitle ? "0 0 30px rgba(184,191,203,0.15), 0 0 60px rgba(58,74,107,0.1)" : "0 0 0px transparent",
              transition: "text-shadow 1.5s ease-out",
            }}
          >
            <span
              className="inline-block bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #B8BFCB 0%, #3A4A6B 30%, #B8BFCB 50%, #6B5A6B 70%, #B8BFCB 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
              }}
            >
              AETHRECORE
            </span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20, scale: showContent ? 1 : 0.8 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg sm:text-xl md:text-2xl text-[var(--text-secondary)] font-light tracking-wide mb-4 sm:mb-5 max-w-2xl"
        >
          <motion.span data-sfx-hover className="text-accent-navy font-semibold inline-block" whileHover={{ scale: 1.1, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>{t("hero.slogan1")}</motion.span>{" "}
          <motion.span data-sfx-hover className="text-accent-platinum font-semibold inline-block" whileHover={{ scale: 1.1, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>{t("hero.slogan2")}</motion.span>{" "}
          <motion.span data-sfx-hover className="text-accent-mauve font-semibold inline-block" whileHover={{ scale: 1.1, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>{t("hero.slogan3")}</motion.span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20, scale: showContent ? 1 : 0.8 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="text-sm sm:text-base text-[var(--text-muted)] font-light tracking-[0.25em] uppercase mb-10 sm:mb-12"
        >
          {t("hero.desc")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20, scale: showContent ? 1 : 0.8 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <Button href="https://discord.gg/5t3hUFVcS" target="_blank" rel="noopener noreferrer" variant="primary">
            {t("hero.joinBtn")}
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button href="#tournaments" variant="secondary">
            {t("hero.exploreBtn")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
        <div className="w-6 h-10 rounded-full border-2 border-[var(--border)] flex items-start justify-center p-1.5">
          <motion.div animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-accent-platinum" />
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
