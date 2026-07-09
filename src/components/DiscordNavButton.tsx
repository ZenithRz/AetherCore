"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc3, LogOut, User } from "lucide-react";
import { useDiscordAuth } from "@/contexts/DiscordAuthProvider";
import { useLanguage } from "@/contexts/LanguageProvider";
import { getPermissions } from "@/lib/permissions";

export default function DiscordNavButton() {
  const { user, loading, login, logout, hasRole } = useDiscordAuth();
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const perms = getPermissions(hasRole);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className="relative">
      {user ? (
        <>
          <button
            onClick={() => setOpen((p) => !p)}
            className="w-8 h-8 rounded-full ring-2 ring-accent-platinum/40 hover:ring-accent-platinum/80 transition-all overflow-hidden flex-shrink-0"
            aria-label="Account menu"
          >
            <img
              src={
                user.avatar
                  ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
                  : `https://cdn.discordapp.com/embed/avatars/${Number(user.id) % 5}.png`
              }
              alt={user.username}
              className="w-full h-full object-cover"
            />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={`absolute top-full mt-2 w-56 rounded-xl bg-dark-800/95 backdrop-blur-xl border border-dark-500/30 shadow-2xl shadow-dark-900/50 p-3 z-50 ${lang === "ar" ? "left-0" : "right-0"}`}
              >
                <div className="flex items-center gap-3 pb-3 border-b border-dark-500/30 mb-2">
                  <img
                    src={
                      user.avatar
                        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
                        : `https://cdn.discordapp.com/embed/avatars/${Number(user.id) % 5}.png`
                    }
                    alt={user.username}
                    className="w-9 h-9 rounded-full flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-text-muted">{t("nav.signedInAs")}</p>
                    <p className="text-sm text-text-primary font-medium truncate">{user.globalName}</p>
                  </div>
                  {perms.canManageAll && (
                    <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 flex-shrink-0">
                      Admin
                    </span>
                  )}
                </div>

                <button
                  onClick={() => { logout(); setOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium text-red-400/80 hover:text-red-400 bg-dark-700/50 hover:bg-red-400/10 transition-all duration-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {t("nav.disconnect")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <button
          onClick={login}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/20 hover:border-[#5865F2]/40 transition-all duration-300 text-xs font-medium text-[#5865F2] disabled:opacity-50"
        >
          <Disc3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t("nav.signIn")}</span>
        </button>
      )}

      {user && (
        <MobileDiscordBar user={user} logout={logout} t={t} />
      )}
    </div>
  );
}

function MobileDiscordBar({ user, logout, t }: { user: import("@/contexts/DiscordAuthProvider").DiscordUser; logout: () => void; t: (k: string) => string }) {
  return (
    <div className="md:hidden mt-4 pt-4 border-t border-dark-500/30 space-y-3">
      <div className="flex items-center gap-3 px-2">
        <img
          src={
            user.avatar
              ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
              : `https://cdn.discordapp.com/embed/avatars/${Number(user.id) % 5}.png`
          }
          alt={user.username}
          className="w-8 h-8 rounded-full"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-text-primary font-medium truncate">{user.globalName}</p>
          <p className="text-xs text-text-muted truncate">@{user.username}</p>
        </div>
      </div>
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium text-red-400/80 hover:text-red-400 bg-dark-700/50 transition-colors"
      >
        <LogOut className="w-3.5 h-3.5" />
        {t("nav.disconnect")}
      </button>
    </div>
  );
}
