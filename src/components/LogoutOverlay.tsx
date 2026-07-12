"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDiscordAuth } from "@/contexts/DiscordAuthProvider";
import { useLanguage } from "@/contexts/LanguageProvider";
import DiscordIcon from "@/components/DiscordIcon";

const particles = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * 360;
  const dist = 150 + (i * 29 + 13) % 180;
  const size = 1.5 + (i * 17 + 7) % 5 / 2.5;
  return { angle, dist, size };
});

export default function LogoutOverlay() {
  const { loggingOut } = useDiscordAuth();
  const { lang } = useLanguage();

  return (
    <AnimatePresence>
      {loggingOut && (
        <motion.div
          key="logout-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto"
          style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.98) 100%)" }}
        >
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "linear-gradient(rgba(184,191,203,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(184,191,203,0.2) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(88,101,242,0.15) 0%, transparent 50%)",
            }}
          />

          {/* Scan lines */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(184,191,203,0.3) 2px, rgba(184,191,203,0.3) 4px)",
              backgroundSize: "100% 4px",
            }}
          />

          {/* Outer portal ring */}
          <motion.div
            className="absolute rounded-full border"
            initial={{ width: 0, height: 0, opacity: 0, scale: 0.3 }}
            animate={{ width: [0, 600, 800], height: [0, 600, 800], opacity: [0, 0.2, 0], scale: [0.3, 1, 1.2] }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              borderColor: "rgba(88,101,242,0.15)",
              marginLeft: -400, marginTop: -400, left: "50%", top: "50%",
            }}
          />

          {/* Rotating rings */}
          <motion.div
            className="absolute rounded-full"
            initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
            animate={{ opacity: [0, 0.15, 0.08], scale: [0.5, 1, 1.05], rotate: 360 }}
            transition={{ duration: 2, ease: "easeOut", rotate: { duration: 3, repeat: Infinity, ease: "linear" } }}
            style={{
              width: 200, height: 200,
              marginLeft: -100, marginTop: -100, left: "50%", top: "50%",
              border: "1px solid rgba(88,101,242,0.25)",
              borderRadius: "50%",
            }}
          />
          <motion.div
            className="absolute rounded-full"
            initial={{ opacity: 0, scale: 0.5, rotate: 180 }}
            animate={{ opacity: [0, 0.1, 0.05], scale: [0.5, 1.1, 1.15], rotate: -360 }}
            transition={{ duration: 2.2, ease: "easeOut", rotate: { duration: 4, repeat: Infinity, ease: "linear" } }}
            style={{
              width: 140, height: 140,
              marginLeft: -70, marginTop: -70, left: "50%", top: "50%",
              border: "1px solid rgba(184,191,203,0.2)",
              borderRadius: "50%",
            }}
          />

          {/* Particles burst */}
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: p.size, height: p.size,
                background: i % 3 === 0 ? "#5865F2" : i % 3 === 1 ? "#B8BFCB" : "#3A4A6B",
                left: "50%", top: "50%",
                marginLeft: -p.size / 2, marginTop: -p.size / 2,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: [0, Math.cos((p.angle * Math.PI) / 180) * p.dist],
                y: [0, Math.sin((p.angle * Math.PI) / 180) * p.dist],
                opacity: [1, 0.6, 0],
                scale: [1, 0.5, 0],
              }}
              transition={{ duration: 1 + (i % 5) * 0.1, ease: "easeOut", delay: 0.05 * i }}
            />
          ))}

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-5">
            {/* Discord icon with glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 }}
              className="relative"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute inset-0 rounded-full blur-2xl"
                style={{ background: "radial-gradient(circle, rgba(88,101,242,0.4) 0%, transparent 70%)" }}
              />
              <motion.div
                className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, rgba(88,101,242,0.2), rgba(88,101,242,0.05))", border: "1px solid rgba(88,101,242,0.3)" }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <DiscordIcon className="w-10 h-10 text-white/90" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Connecting dots */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex gap-1.5"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#5865F2" }}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>

            {/* Disconnecting text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="text-sm font-medium tracking-widest uppercase"
              style={{ color: "rgba(184,191,203,0.7)" }}
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {lang === "ar" ? "جاري قطع الاتصال..." : "Disconnecting..."}
              </motion.span>
            </motion.p>

            {/* Secondary text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "rgba(184,191,203,0.25)" }}
            >
              {lang === "ar" ? "نراك قريباً" : "See you soon, legend"}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
