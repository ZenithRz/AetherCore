"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc3, X, Sparkles, Shield, Zap, Gamepad2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";

interface DiscordLoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 4,
  duration: 3 + Math.random() * 4,
  delay: Math.random() * 2,
}));

const features = [
  { icon: Shield, key: "secure" },
  { icon: Sparkles, key: "perks" },
  { icon: Zap, key: "sync" },
  { icon: Gamepad2, key: "game" },
];

export default function DiscordLoginModal({ open, onClose, onLogin }: DiscordLoginModalProps) {
  const { lang, t } = useLanguage();
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleLogin = useCallback(() => {
    onLogin();
    onClose();
  }, [onLogin, onClose]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-dark-900/80 backdrop-blur-2xl"
            onClick={onClose}
          />

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-accent-platinum/30"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                }}
                animate={{
                  y: [0, -30, 0, 20, 0],
                  x: [0, 15, -10, 5, 0],
                  opacity: [0.2, 0.8, 0.3, 0.6, 0.2],
                  scale: [1, 1.5, 0.8, 1.2, 1],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: p.delay,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md mx-4"
          >
            <div className="relative rounded-2xl bg-gradient-to-b from-dark-700/90 via-dark-800/95 to-dark-900/95 backdrop-blur-2xl border border-dark-500/30 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <motion.div
                  className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-accent-platinum/5 blur-3xl"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-[#5865F2]/5 blur-3xl"
                  animate={{ scale: [1.2, 1, 1.2], rotate: [0, -45, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-dark-600/50 hover:bg-dark-500/70 flex items-center justify-center text-text-muted hover:text-text-primary transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative p-8 pt-10 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                  className="inline-flex mb-6"
                >
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#5865F2]/30 blur-xl"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#5865F2] to-[#4752C4] flex items-center justify-center shadow-lg shadow-[#5865F2]/20">
                      <Disc3 className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="font-orbitron text-2xl font-bold text-text-primary mb-2"
                >
                  {lang === "ar" ? "انضم إلى AETHRECORE" : "Join AETHRECORE"}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-text-secondary text-sm mb-8 max-w-xs mx-auto"
                >
                  {lang === "ar"
                    ? "اربط حساب ديسكورد لفتح الميزات الحصرية والإعدادات المتقدمة"
                    : "Connect your Discord to unlock exclusive features and admin controls"}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="grid grid-cols-2 gap-3 mb-8"
                >
                  {features.map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <motion.div
                        key={f.key}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                        className="flex items-center gap-2 py-2.5 px-3 rounded-xl bg-dark-600/40 border border-dark-500/20"
                      >
                        <Icon className="w-4 h-4 text-accent-platinum flex-shrink-0" />
                        <span className="text-xs text-text-secondary">
                          {lang === "ar"
                            ? ["آمن", "مميزات", "مزامنة", "ألعاب"][i]
                            : ["Secure", "Perks", "Sync", "Gaming"][i]}
                        </span>
                      </motion.div>
                    );
                  })}
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogin}
                  className="relative w-full py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#5865F2] to-[#4752C4] hover:from-[#4752C4] hover:to-[#5865F2] transition-all duration-300 shadow-lg shadow-[#5865F2]/20 overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative flex items-center justify-center gap-2">
                    <Disc3 className="w-5 h-5" />
                    <span>{lang === "ar" ? "تسجيل الدخول بديسكورد" : "Continue with Discord"}</span>
                  </div>
                </motion.button>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                  className="mt-4 text-[10px] text-text-muted"
                >
                  {lang === "ar"
                    ? "بالتسجيل أنت توافق على شروط الخدمة"
                    : "By connecting, you agree to our Terms of Service"}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
