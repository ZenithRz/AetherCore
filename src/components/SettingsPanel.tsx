"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Volume2, Sun, Moon, Globe, LogOut, Hash, Clock, Link2, Shield, ArrowLeft } from "lucide-react";
import DiscordIcon from "@/components/DiscordIcon";
import { useSoundCtx } from "@/components/SoundProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useDiscordAuth } from "@/contexts/DiscordAuthProvider";
import { useLoginModal } from "@/contexts/LoginModalProvider";
import { getPermissions } from "@/lib/permissions";
import type { Lang } from "@/translations";
import { useRouter } from "next/navigation";

type Tab = "sound" | "theme" | "language" | "discord";

function SoundBars({ volume, muted }: { volume: number; muted: boolean }) {
  const bars = [1, 2, 3, 4];
  return (
    <div className="flex items-end gap-[2px] h-4 w-5">
      {bars.map((i) => {
        const threshold = i * 0.25;
        const active = !muted && volume >= threshold;
        return (
          <motion.div
            key={i}
            className="w-[3px] rounded-full bg-current"
            animate={{
              height: active ? `${Math.max(3, i * 3 + (volume * 2))}px` : "2px",
              opacity: active ? 1 : 0.25,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

export default function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("sound");
  const [isSerialAdmin, setIsSerialAdmin] = useState(false);
  const sfx = useSoundCtx();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { user, loading, loggingOut, login, logout } = useDiscordAuth();
  const { openLoginModal } = useLoginModal();
  const router = useRouter();
  const sliderRef = useRef<HTMLInputElement>(null);

  const [volume, setVolumeState] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sfx_volume");
      if (stored === null) return 1.0;
      return Math.max(0, Math.min(1, parseFloat(stored)));
    }
    return 1.0;
  });
  const [muted, setMuted] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sfx_muted");
      return stored !== "false";
    }
    return true;
  });

  useEffect(() => {
    if (user?.serialNumber) {
      fetch("/api/admin/admins").then(r => r.json()).then(data => {
        setIsSerialAdmin(data.mainAdmin === user.serialNumber || data.subAdmins?.some((a: { serialNumber: string }) => a.serialNumber === user.serialNumber));
      }).catch(() => setIsSerialAdmin(false));
    } else { setIsSerialAdmin(false); }
  }, [user]);

  const perms = getPermissions(() => false);
  const isAdmin = isSerialAdmin || user?.roles?.some(r => ["Owner", "Admin", "Co-Owner"].includes(r));

  const handleLoginClick = () => openLoginModal();

  const tabs: { id: Tab; icon: React.ComponentType<{ className?: string }>; label: Record<string, string> }[] = [
    { id: "sound", icon: () => <SoundBars volume={volume} muted={muted} />, label: { en: "Sound", ar: "الصوت" } },
    { id: "theme", icon: Sun, label: { en: "Theme", ar: "المظهر" } },
    { id: "language", icon: Globe, label: { en: "Language", ar: "اللغة" } },
    { id: "discord", icon: DiscordIcon, label: { en: "Discord", ar: "ديسكورد" } },
  ];

  useEffect(() => {
    const checkMute = () => { setMuted(sfx.isMuted()); };
    checkMute();
    const storedVol = localStorage.getItem("sfx_volume");
    if (storedVol === null || parseFloat(storedVol) < 1.0) {
      sfx.setVolume(1.0); setVolumeState(1.0); localStorage.setItem("sfx_volume", "1");
    }
    const interval = setInterval(checkMute, 500);
    return () => clearInterval(interval);
  }, [sfx]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolumeState(v);
    sfx.setVolume(v);
    if (v > 0 && sfx.isMuted()) { sfx.toggleMute(); setMuted(false); }
    else if (v === 0 && !sfx.isMuted()) { sfx.toggleMute(); setMuted(true); }
  }, [sfx]);

  const handleToggleMute = useCallback(() => {
    sfx.toggleMute();
    setMuted((p) => !p);
  }, [sfx]);

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { year: "numeric", month: "long", day: "numeric" });
    } catch { return iso; }
  };

  return (
    <>
      <motion.button onClick={() => setOpen((p) => !p)}
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 1.7 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-[var(--surface)]/80 backdrop-blur-md border border-[var(--border)]/40 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-accent-platinum/40 hover:shadow-lg hover:shadow-accent-platinum/10 transition-all duration-300 shadow-lg"
      >
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.3 }}>
          <Settings className="w-4.5 h-4.5" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

            <motion.div initial={{ opacity: 0, y: 24, scale: 0.93 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.95 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-24 left-6 z-50 w-[28rem] max-w-[calc(100vw-3rem)] rounded-2xl bg-[var(--surface)]/90 backdrop-blur-2xl border border-[var(--border)]/40 shadow-2xl shadow-dark-900/30 overflow-hidden"
            >
              <div className="relative p-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-platinum/10 to-transparent" />

                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 text-accent-platinum">
                      <Settings className="w-full h-full" />
                    </div>
                    <h3 className="text-[var(--text-primary)] font-orbitron text-base font-semibold tracking-wider uppercase">
                      {t("settings.title")}
                    </h3>
                  </div>
                  {user && (
                    <span className="text-[10px] text-accent-muted font-medium px-2.5 py-1 rounded-full border border-accent-muted/30">
                      {user.globalName}
                    </span>
                  )}
                </div>

                <div className="flex gap-1 mb-5 bg-[var(--surface-alt)] rounded-xl p-1.5">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                          activeTab === tab.id ? "bg-accent-platinum/10 text-accent-platinum shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label[lang]}</span>
                      </motion.button>
                    );
                  })}
                </div>

                <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                  {activeTab === "sound" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--surface-alt)]">
                        <motion.button onClick={handleToggleMute} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          className="w-11 h-11 rounded-full bg-[var(--border)]/50 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-accent-platinum/10 transition-all"
                        >
                          <SoundBars volume={volume} muted={muted} />
                        </motion.button>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-[var(--text-muted)] w-8 text-right font-mono">0%</span>
                            <input ref={sliderRef} type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange}
                              className="flex-1 h-2 appearance-none bg-[var(--border)] rounded-full cursor-pointer accent-accent-platinum [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-platinum [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:shadow-accent-platinum/20" />
                            <span className="text-[10px] text-[var(--text-muted)] w-8 font-mono">100%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1">
                        <span>{t("settings.volume")}</span>
                        <motion.span key={Math.round(volume * 100)} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
                          className="text-accent-platinum font-semibold font-mono">{Math.round(volume * 100)}%</motion.span>
                      </div>
                    </div>
                  )}

                  {activeTab === "theme" && (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        {(["dark", "light"] as const).map((th) => (
                          <motion.button key={th} onClick={toggleTheme} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            className={`flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-200 ${
                              theme === th ? "bg-accent-platinum/10 border border-accent-platinum/30" : "bg-[var(--surface-alt)] border border-transparent hover:border-[var(--border)]/40"
                            }`}
                          >
                            {th === "dark" ? <Moon className="w-5 h-5 text-accent-platinum" /> : <Sun className="w-5 h-5 text-amber-400" />}
                            <span className="text-xs font-medium text-[var(--text-primary)]">{th === "dark" ? t("settings.dark") : t("settings.light")}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "language" && (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        {(["en", "ar"] as Lang[]).map((l) => (
                          <motion.button key={l} onClick={() => setLang(l)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            className={`flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-200 ${
                              lang === l ? "bg-accent-platinum/10 border border-accent-platinum/30" : "bg-[var(--surface-alt)] border border-transparent hover:border-[var(--border)]/40"
                            }`}
                          >
                            <Globe className="w-5 h-5" style={{ color: lang === l ? "var(--accent-platinum, #B8BFCB)" : "var(--text-muted)" }} />
                            <span className="text-xs font-medium text-[var(--text-primary)]">{l === "en" ? "English" : "العربية"}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "discord" && (
                    <div>
                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                            <DiscordIcon className="w-6 h-6 text-accent-platinum" />
                          </motion.div>
                        </div>
                      ) : user ? (
                        <div className="space-y-4">
                          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="relative flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[var(--surface-alt)] to-[var(--surface-alt)] border border-[var(--border)]/20 overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#5865F2]/5 to-transparent opacity-50" />
                            <div className="relative">
                              <img src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64` : `https://cdn.discordapp.com/embed/avatars/${Number(user.id) % 5}.png`} alt={user.username} className="w-11 h-11 rounded-full ring-2 ring-[#5865F2]/30" />
                              <motion.div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[var(--surface-alt)]"
                                animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                            </div>
                            <div className="flex-1 min-w-0 relative">
                              <p className="text-sm text-[var(--text-primary)] font-medium truncate">{user.globalName}</p>
                              <p className="text-xs text-[var(--text-muted)] truncate">@{user.username}</p>
                            </div>
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                              className="relative text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30"
                            >Admin</motion.span>
                          </motion.div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)]/10">
                              <Hash className="w-3.5 h-3.5 text-accent-platinum/60" />
                              <div>
                                <p className="text-[10px] text-[var(--text-muted)]">{lang === "ar" ? "رقم تسلسلي" : "Serial No."}</p>
                                <p className="text-xs text-[var(--text-primary)] font-mono font-semibold">{user.serialNumber}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)]/10">
                              <Clock className="w-3.5 h-3.5 text-accent-platinum/60" />
                              <div>
                                <p className="text-[10px] text-[var(--text-muted)]">{lang === "ar" ? "تاريخ الربط" : "Linked on"}</p>
                                <p className="text-xs text-[var(--text-primary)] font-medium">{formatDate(user.linkedAt)}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)]/10">
                            <Link2 className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-xs text-green-400 font-medium">{lang === "ar" ? "حساب مرتبط" : "Account linked"}</span>
                            <span className="ml-auto text-[10px] text-[var(--text-muted)]">ID: {user.id}</span>
                          </div>

                          {isAdmin && (
                            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                              onClick={() => { setOpen(false); router.push("/admin"); }}
                              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium text-accent-platinum bg-gradient-to-r from-[var(--surface-alt)] to-[var(--surface-alt)] border border-accent-platinum/20 hover:border-accent-platinum/40 hover:bg-accent-platinum/5 transition-all"
                            >
                              <Shield className="w-3.5 h-3.5" />
                              {lang === "ar" ? "لوحة التحكم" : "Admin Panel"}
                            </motion.button>
                          )}

                          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                            onClick={logout} disabled={loggingOut}
                            className="relative w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium text-red-400 bg-[var(--surface-alt)] border border-red-400/10 hover:bg-red-400/5 hover:border-red-400/20 transition-all overflow-hidden disabled:opacity-70"
                          >
                            <AnimatePresence mode="wait">
                              {loggingOut ? (
                                <motion.div key="logging-out" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                  className="flex items-center gap-2"
                                >
                                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>
                                    <DiscordIcon className="w-4 h-4" />
                                  </motion.div>
                                  <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                                    {lang === "ar" ? "جاري قطع الاتصال..." : "Disconnecting..."}
                                  </motion.span>
                                </motion.div>
                              ) : (
                                <motion.div key="logout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                  className="flex items-center gap-2"
                                >
                                  <LogOut className="w-3.5 h-3.5" />
                                  {t("settings.unlinkDiscord")}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                            className="relative flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#5865F2]/5 to-transparent border border-[#5865F2]/10 overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#5865F2]/5 to-transparent" />
                            <motion.div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-[#5865F2]/5 blur-xl"
                              animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity }} />
                            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#5865F2] to-[#4752C4] flex items-center justify-center shadow-lg shadow-[#5865F2]/20">
                              <DiscordIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="relative">
                              <p className="text-sm text-[var(--text-primary)] font-medium">{t("settings.notLinked")}</p>
                              <p className="text-xs text-[var(--text-muted)]">{t("settings.linkDiscord")}</p>
                            </div>
                          </motion.div>
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleLoginClick}
                            className="group relative w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#5865F2] via-[#5865F2] to-[#4752C4] hover:from-[#4752C4] hover:via-[#5865F2] hover:to-[#5865F2] transition-all duration-500 shadow-lg shadow-[#5865F2]/25 overflow-hidden"
                          >
                            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                              animate={{ x: ["-100%", "250%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1 }} />
                            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12), transparent 70%)" }} />
                            <DiscordIcon className="w-4 h-4 relative z-10" />
                            <span className="relative z-10">{t("settings.loginDiscord")}</span>
                          </motion.button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-platinum/10 to-transparent" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  );
}
