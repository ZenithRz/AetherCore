"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Volume2, VolumeX, Sun, Moon, Globe, Disc3, LogOut, User, CalendarPlus, Gamepad2, Megaphone, Sparkles } from "lucide-react";
import { useSoundCtx } from "@/components/SoundProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useDiscordAuth } from "@/contexts/DiscordAuthProvider";
import { getPermissions } from "@/lib/permissions";
import DiscordLoginModal from "@/components/DiscordLoginModal";
import type { Lang } from "@/translations";

type Tab = "sound" | "theme" | "language" | "discord" | "events" | "games" | "announce";

export default function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("sound");
  const [volume, setVolumeState] = useState(0.5);
  const [muted, setMuted] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const sfx = useSoundCtx();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { user, loading, login, logout, hasRole } = useDiscordAuth();
  const sliderRef = useRef<HTMLInputElement>(null);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const perms = getPermissions(hasRole);

  const baseTabs: { id: Tab; icon: typeof Settings; label: Record<string, string> }[] = [
    { id: "sound", icon: Volume2, label: { en: "Sound", ar: "الصوت" } },
    { id: "theme", icon: Sun, label: { en: "Theme", ar: "المظهر" } },
    { id: "language", icon: Globe, label: { en: "Language", ar: "اللغة" } },
    { id: "discord", icon: Disc3, label: { en: "Discord", ar: "ديسكورد" } },
  ];

  const adminTabs: { id: Tab; icon: typeof Settings; label: Record<string, string>; show: boolean }[] = [
    { id: "events", icon: CalendarPlus, label: { en: "Events", ar: "الإيفنتات" }, show: perms.canManageEvents },
    { id: "games", icon: Gamepad2, label: { en: "Games", ar: "الألعاب" }, show: perms.canManageGames },
    { id: "announce", icon: Megaphone, label: { en: "Announce", ar: "الإعلانات" }, show: perms.canManageAnnouncements },
  ];

  const visibleTabs = [...baseTabs, ...adminTabs.filter((t) => t.show)];

  useEffect(() => {
    setMuted(sfx.isMuted());
    setVolumeState(sfx.getVolume());
  }, [sfx]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolumeState(v);
    sfx.setVolume(v);
  }, [sfx]);

  const handleToggleMute = useCallback(() => {
    sfx.toggleMute();
    setMuted((p) => !p);
  }, [sfx]);

  return (
    <>
      <motion.button
        onClick={() => setOpen((p) => !p)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 1.7 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[var(--surface)]/80 backdrop-blur-md border border-[var(--border)]/40 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-accent-platinum/40 hover:shadow-lg hover:shadow-accent-platinum/10 transition-all duration-300 shadow-lg"
        aria-label={t("settings.title")}
      >
        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Settings className="w-4.5 h-4.5" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-24 right-6 z-50 w-[22rem] max-w-[calc(100vw-2rem)] rounded-2xl bg-[var(--surface)]/90 backdrop-blur-2xl border border-[var(--border)]/40 shadow-2xl shadow-dark-900/30 overflow-hidden"
            >
              <div className="relative p-5">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-platinum/10 to-transparent" />

                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Settings className="w-4 h-4 text-accent-platinum" />
                    </motion.div>
                    <h3 className="text-[var(--text-primary)] font-orbitron text-sm font-semibold tracking-wider uppercase">
                      {t("settings.title")}
                    </h3>
                  </div>
                  {user && (
                    <span className="text-[10px] text-accent-muted font-medium px-2 py-0.5 rounded-full border border-accent-muted/30">
                      {user.globalName}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-5 bg-[var(--surface-alt)] rounded-xl p-1.5">
                  {visibleTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-accent-platinum/10 text-accent-platinum shadow-sm"
                            : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{tab.label[lang]}</span>
                      </motion.button>
                    );
                  })}
                </div>

                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {activeTab === "sound" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--surface-alt)]">
                        <motion.button
                          onClick={handleToggleMute}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 rounded-full bg-[var(--border)]/50 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-accent-platinum/10 transition-all"
                          aria-label={muted ? t("settings.unmute") : t("settings.mute")}
                        >
                          {muted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
                        </motion.button>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-[var(--text-muted)] w-6 text-right font-mono">0%</span>
                            <input
                              ref={sliderRef}
                              type="range"
                              min="0"
                              max="1"
                              step="0.01"
                              value={volume}
                              onChange={handleVolumeChange}
                              className="flex-1 h-2 appearance-none bg-[var(--border)] rounded-full cursor-pointer accent-accent-platinum [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-platinum [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:shadow-accent-platinum/20"
                            />
                            <span className="text-[10px] text-[var(--text-muted)] w-6 font-mono">100%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1">
                        <span>{t("settings.volume")}</span>
                        <motion.span
                          key={Math.round(volume * 100)}
                          initial={{ scale: 1.3 }}
                          animate={{ scale: 1 }}
                          className="text-accent-platinum font-semibold font-mono"
                        >
                          {Math.round(volume * 100)}%
                        </motion.span>
                      </div>
                    </div>
                  )}

                  {activeTab === "theme" && (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        {(["dark", "light"] as const).map((th) => (
                          <motion.button
                            key={th}
                            onClick={toggleTheme}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-200 ${
                              theme === th
                                ? "bg-accent-platinum/10 border border-accent-platinum/30"
                                : "bg-[var(--surface-alt)] border border-transparent hover:border-[var(--border)]/40"
                            }`}
                          >
                            {th === "dark" ? (
                              <Moon className="w-5 h-5 text-accent-platinum" />
                            ) : (
                              <Sun className="w-5 h-5 text-amber-400" />
                            )}
                            <span className="text-xs font-medium text-[var(--text-primary)]">
                              {th === "dark" ? t("settings.dark") : t("settings.light")}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--text-muted)]">
                        <span>{theme === "dark" ? t("settings.dark") : t("settings.light")}</span>
                        <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                        <span>{lang === "ar" ? "المظهر الحالي" : "Current theme"}</span>
                      </div>
                    </div>
                  )}

                  {activeTab === "language" && (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        {(["en", "ar"] as Lang[]).map((l) => (
                          <motion.button
                            key={l}
                            onClick={() => setLang(l)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-200 ${
                              lang === l
                                ? "bg-accent-platinum/10 border border-accent-platinum/30"
                                : "bg-[var(--surface-alt)] border border-transparent hover:border-[var(--border)]/40"
                            }`}
                          >
                            <Globe className="w-5 h-5" style={{ color: lang === l ? "var(--accent-platinum, #B8BFCB)" : "var(--text-muted)" }} />
                            <span className="text-xs font-medium text-[var(--text-primary)]">
                              {l === "en" ? "English" : "العربية"}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "discord" && (
                    <div>
                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Disc3 className="w-6 h-6 text-accent-platinum" />
                          </motion.div>
                        </div>
                      ) : user ? (
                        <div className="space-y-4">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)]/20"
                          >
                            <div className="relative">
                              <img
                                src={
                                  user.avatar
                                    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
                                    : `https://cdn.discordapp.com/embed/avatars/${Number(user.id) % 5}.png`
                                }
                                alt={user.username}
                                className="w-10 h-10 rounded-full"
                              />
                              <motion.div
                                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[var(--surface-alt)]"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-[var(--text-primary)] font-medium truncate">{user.globalName}</p>
                              <p className="text-xs text-[var(--text-muted)] truncate">@{user.username}</p>
                            </div>
                            {perms.canManageAll && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30"
                              >
                                Admin
                              </motion.span>
                            )}
                          </motion.div>
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium text-red-400 bg-[var(--surface-alt)] border border-red-400/10 hover:bg-red-400/5 hover:border-red-400/20 transition-all"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            {t("settings.unlinkDiscord")}
                          </motion.button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)]/20"
                          >
                            <div className="w-10 h-10 rounded-full bg-[#5865F2]/10 flex items-center justify-center">
                              <Disc3 className="w-5 h-5 text-[#5865F2]" />
                            </div>
                            <div>
                              <p className="text-sm text-[var(--text-primary)] font-medium">{t("settings.notLinked")}</p>
                              <p className="text-xs text-[var(--text-muted)]">{t("settings.linkDiscord")}</p>
                            </div>
                          </motion.div>
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={handleLoginClick}
                            className="relative w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#5865F2] to-[#4752C4] hover:from-[#4752C4] hover:to-[#5865F2] transition-all duration-300 shadow-lg shadow-[#5865F2]/20 overflow-hidden"
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                              animate={{ x: ["-100%", "200%"] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                            <Disc3 className="w-3.5 h-3.5 relative" />
                            <span className="relative">{t("settings.loginDiscord")}</span>
                          </motion.button>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "events" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CalendarPlus className="w-4 h-4 text-accent-platinum" />
                        <span className="text-sm font-orbitron text-[var(--text-primary)] font-semibold">Create Event</span>
                      </div>
                      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                        <input
                          type="text"
                          placeholder={lang === "ar" ? "اسم الإيفنت" : "Event name"}
                          className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-accent-platinum/40 focus:shadow-[0_0_12px_rgba(184,191,203,0.08)] transition-all"
                        />
                        <textarea
                          placeholder={lang === "ar" ? "وصف الإيفنت" : "Event description"}
                          rows={3}
                          className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none resize-none focus:border-accent-platinum/40 focus:shadow-[0_0_12px_rgba(184,191,203,0.08)] transition-all"
                        />
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          type="submit"
                          className="w-full py-2.5 rounded-xl text-xs font-semibold text-dark-900 bg-accent-platinum hover:bg-accent-platinum/80 transition-colors"
                        >
                          {lang === "ar" ? "نشر الإيفنت" : "Publish Event"}
                        </motion.button>
                      </form>
                    </div>
                  )}

                  {activeTab === "games" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Gamepad2 className="w-4 h-4 text-accent-platinum" />
                        <span className="text-sm font-orbitron text-[var(--text-primary)] font-semibold">{lang === "ar" ? "إضافة لعبة" : "Add Game"}</span>
                      </div>
                      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                        <input
                          type="text"
                          placeholder={lang === "ar" ? "اسم اللعبة" : "Game name"}
                          className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-accent-platinum/40 focus:shadow-[0_0_12px_rgba(184,191,203,0.08)] transition-all"
                        />
                        <input
                          type="text"
                          placeholder={lang === "ar" ? "رابط الصورة" : "Image URL"}
                          className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-accent-platinum/40 focus:shadow-[0_0_12px_rgba(184,191,203,0.08)] transition-all"
                        />
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          type="submit"
                          className="w-full py-2.5 rounded-xl text-xs font-semibold text-dark-900 bg-accent-platinum hover:bg-accent-platinum/80 transition-colors"
                        >
                          {lang === "ar" ? "إضافة اللعبة" : "Add Game"}
                        </motion.button>
                      </form>
                    </div>
                  )}

                  {activeTab === "announce" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Megaphone className="w-4 h-4 text-accent-platinum" />
                        <span className="text-sm font-orbitron text-[var(--text-primary)] font-semibold">{lang === "ar" ? "إعلان جديد" : "New Announcement"}</span>
                      </div>
                      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                        <input
                          type="text"
                          placeholder={lang === "ar" ? "عنوان الإعلان" : "Announcement title"}
                          className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-accent-platinum/40 focus:shadow-[0_0_12px_rgba(184,191,203,0.08)] transition-all"
                        />
                        <textarea
                          placeholder={lang === "ar" ? "محتوى الإعلان" : "Announcement content"}
                          rows={3}
                          className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none resize-none focus:border-accent-platinum/40 focus:shadow-[0_0_12px_rgba(184,191,203,0.08)] transition-all"
                        />
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          type="submit"
                          className="w-full py-2.5 rounded-xl text-xs font-semibold text-dark-900 bg-accent-platinum hover:bg-accent-platinum/80 transition-colors"
                        >
                          {lang === "ar" ? "نشر الإعلان" : "Send Announcement"}
                        </motion.button>
                      </form>
                    </div>
                  )}
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-platinum/10 to-transparent" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <DiscordLoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={login}
      />
    </>
  );
}
