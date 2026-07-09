"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Volume2, VolumeX, Sun, Moon, Globe, Disc3, LogOut, User, CalendarPlus, Gamepad2, Megaphone } from "lucide-react";
import { useSoundCtx } from "@/components/SoundProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useDiscordAuth } from "@/contexts/DiscordAuthProvider";
import { getPermissions } from "@/lib/permissions";
import type { Lang } from "@/translations";

type Tab = "sound" | "theme" | "language" | "discord" | "events" | "games" | "announce";

export default function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("sound");
  const [volume, setVolumeState] = useState(0.5);
  const [muted, setMuted] = useState(true);
  const sfx = useSoundCtx();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { user, loading, login, logout, hasRole } = useDiscordAuth();
  const sliderRef = useRef<HTMLInputElement>(null);

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
        className="fixed bottom-6 right-20 z-50 w-11 h-11 rounded-full bg-[var(--surface)]/80 backdrop-blur-md border border-[var(--border)]/40 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-accent-platinum/40 transition-all duration-300 shadow-lg"
        aria-label={t("settings.title")}
      >
        <Settings className="w-4 h-4" />
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
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed bottom-24 right-6 z-50 w-80 rounded-xl bg-[var(--surface)]/90 backdrop-blur-xl border border-[var(--border)]/40 shadow-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[var(--text-primary)] font-orbitron text-sm font-semibold tracking-wider uppercase">
                  {t("settings.title")}
                </h3>
                {user && (
                  <span className="text-[10px] text-accent-muted font-medium px-2 py-0.5 rounded-full border border-accent-muted/30">
                    {user.globalName}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1 mb-4 bg-[var(--surface-alt)] rounded-lg p-1">
                {visibleTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-accent-platinum/10 text-accent-platinum"
                          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{tab.label[lang]}</span>
                    </button>
                  );
                })}
              </div>

              {activeTab === "sound" && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={handleToggleMute}
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      aria-label={muted ? t("settings.unmute") : t("settings.mute")}
                    >
                      {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-xs text-[var(--text-muted)] w-8 text-right">0%</span>
                      <input
                        ref={sliderRef}
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="flex-1 h-1.5 appearance-none bg-[var(--border)] rounded-full cursor-pointer accent-accent-platinum [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-platinum [&::-webkit-slider-thumb]:shadow-md"
                      />
                      <span className="text-xs text-[var(--text-muted)] w-8">100%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>{t("settings.volume")}</span>
                    <span className="text-accent-platinum font-medium">{Math.round(volume * 100)}%</span>
                  </div>
                </div>
              )}

              {activeTab === "theme" && (
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-[var(--surface-alt)] hover:bg-[var(--border)]/40 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? <Moon className="w-4 h-4 text-accent-platinum" /> : <Sun className="w-4 h-4 text-amber-400" />}
                    <span className="text-sm text-[var(--text-primary)]">
                      {theme === "dark" ? t("settings.dark") : t("settings.light")}
                    </span>
                  </div>
                  <div className="w-10 h-5 rounded-full bg-[var(--border)] relative transition-colors">
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-[var(--text-primary)] shadow-md transition-all duration-300 ${theme === "light" ? "left-5" : "left-0.5"}`} />
                  </div>
                </button>
              )}

              {activeTab === "language" && (
                <div className="flex gap-2">
                  {(["en", "ar"] as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`flex-1 py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        lang === l
                          ? "bg-accent-platinum/10 text-accent-platinum border border-accent-platinum/30"
                          : "bg-[var(--surface-alt)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <span>{l === "en" ? "English" : "العربية"}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === "discord" && (
                <div>
                  {loading ? (
                    <div className="text-center py-6 text-[var(--text-muted)] text-sm">Loading...</div>
                  ) : user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 py-3 px-4 rounded-lg bg-[var(--surface-alt)]">
                        <img
                          src={
                            user.avatar
                              ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                              : `https://cdn.discordapp.com/embed/avatars/${Number(user.id) % 5}.png`
                          }
                          alt={user.username}
                          className="w-9 h-9 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--text-primary)] font-medium truncate">{user.globalName}</p>
                          <p className="text-xs text-[var(--text-muted)] truncate">@{user.username}</p>
                        </div>
                        {perms.canManageAll && (
                          <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30">Admin</span>
                        )}
                      </div>
                      <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium text-red-400 bg-[var(--surface-alt)] hover:bg-red-400/10 transition-all duration-200"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        {t("settings.unlinkDiscord")}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 py-3 px-4 rounded-lg bg-[var(--surface-alt)]">
                        <User className="w-9 h-9 p-1.5 rounded-full bg-[var(--border)] text-[var(--text-muted)]" />
                        <div>
                          <p className="text-sm text-[var(--text-primary)] font-medium">{t("settings.notLinked")}</p>
                          <p className="text-xs text-[var(--text-muted)]">{t("settings.linkDiscord")}</p>
                        </div>
                      </div>
                      <button
                        onClick={login}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium text-white bg-[#5865F2] hover:bg-[#4752C4] transition-all duration-200"
                      >
                        <Disc3 className="w-3.5 h-3.5" />
                        {t("settings.loginDiscord")}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "events" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarPlus className="w-4 h-4 text-accent-platinum" />
                    <span className="text-sm font-orbitron text-[var(--text-primary)] font-semibold">Create Event</span>
                  </div>
                  <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      placeholder={lang === "ar" ? "اسم الإيفنت" : "Event name"}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--surface-alt)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-accent-platinum/40 transition-colors"
                    />
                    <textarea
                      placeholder={lang === "ar" ? "وصف الإيفنت" : "Event description"}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--surface-alt)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none resize-none focus:border-accent-platinum/40 transition-colors"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-lg text-xs font-semibold text-dark-900 bg-accent-platinum hover:bg-accent-platinum/80 transition-colors"
                    >
                      {lang === "ar" ? "نشر الإيفنت" : "Publish Event"}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "games" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Gamepad2 className="w-4 h-4 text-accent-platinum" />
                    <span className="text-sm font-orbitron text-[var(--text-primary)] font-semibold">{lang === "ar" ? "إضافة لعبة" : "Add Game"}</span>
                  </div>
                  <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      placeholder={lang === "ar" ? "اسم اللعبة" : "Game name"}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--surface-alt)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-accent-platinum/40 transition-colors"
                    />
                    <input
                      type="text"
                      placeholder={lang === "ar" ? "رابط الصورة" : "Image URL"}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--surface-alt)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-accent-platinum/40 transition-colors"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-lg text-xs font-semibold text-dark-900 bg-accent-platinum hover:bg-accent-platinum/80 transition-colors"
                    >
                      {lang === "ar" ? "إضافة اللعبة" : "Add Game"}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "announce" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Megaphone className="w-4 h-4 text-accent-platinum" />
                    <span className="text-sm font-orbitron text-[var(--text-primary)] font-semibold">{lang === "ar" ? "إعلان جديد" : "New Announcement"}</span>
                  </div>
                  <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      placeholder={lang === "ar" ? "عنوان الإعلان" : "Announcement title"}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--surface-alt)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-accent-platinum/40 transition-colors"
                    />
                    <textarea
                      placeholder={lang === "ar" ? "محتوى الإعلان" : "Announcement content"}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--surface-alt)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none resize-none focus:border-accent-platinum/40 transition-colors"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-lg text-xs font-semibold text-dark-900 bg-accent-platinum hover:bg-accent-platinum/80 transition-colors"
                    >
                      {lang === "ar" ? "نشر الإعلان" : "Send Announcement"}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
