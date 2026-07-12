"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gamepad2, Users, MessageCircle, Sparkles, ChevronRight, Shield, Crown } from "lucide-react";
import DiscordIcon from "@/components/DiscordIcon";
import { useLanguage } from "@/contexts/LanguageProvider";

type Phase = "landing" | "discord";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const features = [
  { icon: Shield, label_en: "Secure Authentication", label_ar: "تسجيل آمن", desc_en: "Enterprise-grade security", desc_ar: "أمان من الدرجة الأولى" },
  { icon: Crown, label_en: "Exclusive Perks", label_ar: "مميزات حصرية", desc_en: "Unlock admin & mod tools", desc_ar: "فتح أدوات الإدارة والتحكم" },
  { icon: Users, label_en: "Live Sync", label_ar: "مزامنة حية", desc_en: "Real-time role & rank sync", desc_ar: "مزامنة الرتب في الوقت الفعلي" },
  { icon: MessageCircle, label_en: "Community Hub", label_ar: "مركز المجتمع", desc_en: "Full integration", desc_ar: "تكامل كامل" },
];

export default function DiscordLoginModal({ open, onClose, onLogin }: LoginModalProps) {
  const { lang } = useLanguage();
  const [phase, setPhase] = useState<Phase>("landing");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) { setPhase("landing"); }
  }, [open]);

  const handleProceed = useCallback(() => {
    setPhase("discord");
  }, []);

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
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-dark-900/80 backdrop-blur-2xl"
            onClick={phase === "landing" ? onClose : () => setPhase("landing")}
          />

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, rgba(184,191,203,0.12), transparent 70%)" }} animate={{ scale: [1, 1.3, 0.9, 1.1, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, rgba(58,74,107,0.1), transparent 70%)" }} animate={{ scale: [0.9, 1.2, 1, 1.1, 0.9] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
            <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-8" style={{ background: "radial-gradient(circle, rgba(107,90,107,0.08), transparent 70%)" }} animate={{ scale: [1, 1.1, 0.95, 1.05, 1], rotate: [0, 30, -20, 10, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
          </div>

          <AnimatePresence mode="wait">
            {phase === "landing" ? (
              <motion.div
                key="landing"
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-md mx-4"
              >
                <div className="relative rounded-3xl bg-gradient-to-b from-dark-700 via-dark-800/95 to-dark-900/95 backdrop-blur-2xl border border-dark-500/30 shadow-2xl shadow-dark-900/50 overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none">
                    <motion.div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(184,191,203,0.3), transparent)" }} />
                  </div>

                  <button onClick={onClose} className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-dark-600/50 hover:bg-dark-500/70 flex items-center justify-center text-text-muted hover:text-[var(--text-primary)] transition-all">
                    <X className="w-4 h-4" />
                  </button>

                  <div className="relative p-8 pt-12 text-center">
                    {/* Animated logo rings */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                      className="inline-flex mb-6"
                    >
                      <div className="relative">
                        <motion.div className="absolute inset-0 rounded-full blur-2xl" style={{ background: "radial-gradient(circle, rgba(184,191,203,0.2), transparent)" }} animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                        <motion.div className="absolute -inset-4 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(184,191,203,0.08), transparent)" }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                        {/* Outer ring */}
                        <motion.div className="w-24 h-24 rounded-full border border-accent-platinum/15 flex items-center justify-center" animate={{ rotate: [0, 360] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
                          <motion.div className="w-16 h-16 rounded-full border border-accent-navy/20 flex items-center justify-center" animate={{ rotate: [360, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-platinum/20 to-accent-platinum/5 flex items-center justify-center border border-accent-platinum/10">
                              <Gamepad2 className="w-5 h-5 text-accent-platinum" />
                            </div>
                          </motion.div>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Title */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
                      <h2 className="font-orbitron text-2xl font-bold text-[var(--text-primary)] mb-1 tracking-wider">
                        {lang === "ar" ? "انضم إلى AETHRECORE" : "Join AETHRECORE"}
                      </h2>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <motion.span className="w-6 h-px bg-accent-platinum/30" animate={{ width: ["1rem", "3rem", "1rem"] }} transition={{ duration: 3, repeat: Infinity }} />
                        <Sparkles className="w-3.5 h-3.5 text-accent-platinum/60" />
                        <motion.span className="w-6 h-px bg-accent-platinum/30" animate={{ width: ["1rem", "3rem", "1rem"] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5 }} />
                      </div>
                    </motion.div>

                    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }} className="text-[var(--text-secondary)] text-sm mb-8 leading-relaxed">
                      {lang === "ar" ? "اربط حسابك لفتح الميزات الحصرية" : "Connect your account to unlock exclusive features"}
                    </motion.p>

                    {/* Feature cards */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }} className="grid grid-cols-2 gap-2.5 mb-8">
                      {features.map((f, i) => {
                        const Icon = f.icon;
                        return (
                          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.55 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                            className="group relative flex flex-col items-start gap-1 py-3 px-3 rounded-2xl bg-dark-600/30 border border-dark-500/20 overflow-hidden cursor-default"
                          >
                            <motion.div className="absolute inset-0 bg-gradient-to-r from-accent-platinum/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative flex items-center gap-2 w-full">
                              <motion.div className="w-7 h-7 rounded-lg bg-accent-platinum/8 flex items-center justify-center" whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                                <Icon className="w-3.5 h-3.5 text-accent-platinum" />
                              </motion.div>
                              <span className="text-[11px] text-[var(--text-secondary)] font-medium">{lang === "ar" ? f.label_ar : f.label_en}</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>

                    {/* Sign In button */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.75 }}>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleProceed}
                        className="group relative w-full py-3.5 rounded-2xl font-semibold text-sm text-white bg-gradient-to-r from-accent-platinum/30 via-accent-platinum/20 to-accent-navy/30 hover:from-accent-platinum/40 hover:via-accent-platinum/30 hover:to-accent-navy/40 transition-all duration-500 shadow-lg border border-accent-platinum/20 overflow-hidden"
                      >
                        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" animate={{ x: ["-100%", "250%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1 }} />
                        <motion.div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(circle at 50% 50%, rgba(184,191,203,0.1), transparent 70%)" }} />
                        <span className="relative tracking-wider uppercase text-xs">
                          {lang === "ar" ? "تسجيل الدخول" : "Sign In"}
                        </span>
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="discord"
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-md mx-4"
              >
                <div className="relative rounded-3xl bg-gradient-to-b from-dark-700 via-dark-800/95 to-dark-900/95 backdrop-blur-2xl border border-dark-500/30 shadow-2xl shadow-dark-900/50 overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none">
                    <motion.div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(88,101,242,0.5), rgba(184,191,203,0.3), transparent)" }} />
                    <motion.div className="absolute top-1/2 left-0 w-px h-1/3" style={{ background: "linear-gradient(180deg, transparent, rgba(88,101,242,0.2), transparent)" }} animate={{ top: ["20%", "60%", "20%"] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
                  </div>

                  <button onClick={() => setPhase("landing")} className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-dark-600/50 hover:bg-dark-500/70 flex items-center justify-center text-text-muted hover:text-[var(--text-primary)] transition-all">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>

                  <button onClick={onClose} className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-dark-600/50 hover:bg-dark-500/70 flex items-center justify-center text-text-muted hover:text-[var(--text-primary)] transition-all">
                    <X className="w-4 h-4" />
                  </button>

                  <div className="relative p-8 pt-12 text-center">
                    <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }} className="inline-flex mb-6">
                      <div className="relative">
                        <motion.div className="absolute inset-0 rounded-full bg-[#5865F2]/20 blur-2xl" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                        <motion.div className="absolute -inset-4 rounded-full bg-[#5865F2]/8 blur-3xl" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5865F2] via-[#5865F2] to-[#4752C4] flex items-center justify-center shadow-xl shadow-[#5865F2]/30 rotate-45">
                          <motion.div className="-rotate-45" animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                            <DiscordIcon className="w-10 h-10 text-white" />
                          </motion.div>
                        </div>
                        <motion.div className="absolute -top-1 -right-1" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                          <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-dark-800" />
                        </motion.div>
                      </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
                      <h2 className="font-orbitron text-xl font-bold text-[var(--text-primary)] mb-1 tracking-wider">
                        {lang === "ar" ? "تسجيل عبر ديسكورد" : "Sign in with Discord"}
                      </h2>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <motion.span className="w-6 h-px bg-accent-platinum/30" animate={{ width: ["1rem", "3rem", "1rem"] }} transition={{ duration: 3, repeat: Infinity }} />
                        <DiscordIcon className="w-3.5 h-3.5 text-[#5865F2]" />
                        <motion.span className="w-6 h-px bg-accent-platinum/30" animate={{ width: ["1rem", "3rem", "1rem"] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5 }} />
                      </div>
                    </motion.div>

                    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }} className="text-[var(--text-secondary)] text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                      {lang === "ar" ? "اربط حساب ديسكورد لفتح الميزات الحصرية" : "Connect your Discord to unlock exclusive features"}
                    </motion.p>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.45 }}>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogin}
                        className="group relative w-full py-4 rounded-2xl font-semibold text-sm text-white bg-gradient-to-r from-[#5865F2] via-[#5865F2] to-[#4752C4] hover:from-[#4752C4] hover:via-[#5865F2] hover:to-[#5865F2] transition-all duration-500 shadow-lg shadow-[#5865F2]/25 overflow-hidden"
                      >
                        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" animate={{ x: ["-100%", "250%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1 }} />
                        <motion.div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12), transparent 70%)" }} />
                        <motion.div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-40 blur-xl transition-all duration-500" style={{ background: "linear-gradient(135deg, #5865F2, #4752C4)" }} />
                        <div className="relative flex items-center justify-center gap-3">
                          <motion.div animate={{ rotate: [0, -12, 12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                            <DiscordIcon className="w-5 h-5" />
                          </motion.div>
                          <span className="tracking-wide">{lang === "ar" ? "متابعة مع ديسكورد" : "Continue with Discord"}</span>
                          <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
                            <ChevronRight className="w-4 h-4" />
                          </motion.div>
                        </div>
                      </motion.button>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.7 }} className="mt-5 flex items-center justify-center gap-2 text-[10px] text-text-muted">
                      <motion.span className="w-1 h-1 rounded-full bg-accent-platinum/30" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                      {lang === "ar" ? "بالتسجيل أنت توافق على الشروط" : "By connecting, you agree to our Terms"}
                      <motion.span className="w-1 h-1 rounded-full bg-accent-platinum/30" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
