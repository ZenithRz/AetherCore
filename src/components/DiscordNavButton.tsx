"use client";

import { motion } from "framer-motion";
import { LogOut, ChevronDown, Shield, Crown } from "lucide-react";
import DiscordIcon from "@/components/DiscordIcon";
import { useDiscordAuth, type DiscordUser } from "@/contexts/DiscordAuthProvider";
import { useLoginModal } from "@/contexts/LoginModalProvider";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useState, useRef, useEffect } from "react";

function getRoleBadge(roles: string[]): { icon: typeof Shield; label: string; color: string } | null {
  if (!roles || roles.length === 0) return null;
  const roleMap: [RegExp, typeof Shield, string, string][] = [
    [/owner/i, Crown, "Owner", "text-yellow-400"],
    [/co.?owner/i, Crown, "Co-Owner", "text-yellow-400"],
    [/admin/i, Shield, "Admin", "text-red-400"],
    [/tech.?support/i, Shield, "Support", "text-blue-400"],
    [/developer/i, Shield, "Dev", "text-purple-400"],
    [/mod/i, Shield, "Mod", "text-green-400"],
  ];
  for (const role of roles) {
    for (const [regex, icon, label, color] of roleMap) {
      if (regex.test(role)) return { icon, label, color };
    }
  }
  return null;
}

export default function DiscordNavButton() {
  const { user, login, logout, loading } = useDiscordAuth();
  const { openLoginModal } = useLoginModal();
  const { lang } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="w-[132px] h-[40px] rounded-xl bg-[var(--surface-alt)]/50 animate-pulse" />
    );
  }

  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="group flex items-center gap-2 py-1.5 pr-3 pl-1.5 rounded-xl bg-[var(--surface-alt)]/40 hover:bg-[var(--border)]/60 border border-[var(--border)]/30 hover:border-accent-platinum/20 transition-all duration-300"
        >
          <div className="relative flex-shrink-0">
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64` : `https://cdn.discordapp.com/embed/avatars/0.png`}
              alt=""
              className="w-7 h-7 rounded-lg object-cover"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[var(--background)]" />
          </div>
          <span className="text-sm font-medium text-[var(--text-primary)] max-w-[80px] truncate">
                {user.globalName || user.username}
          </span>
          <ChevronDown className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} />
        </button>

        <AnimatedDropdown show={showDropdown} user={user} onLogout={logout} lang={lang} onClose={() => setShowDropdown(false)} />
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={openLoginModal}
      className="group relative flex items-center gap-2.5 py-2 px-4 rounded-xl text-sm font-semibold text-white bg-[#5865F2] hover:bg-[#4752C4] transition-all duration-300 shadow-lg shadow-[#5865F2]/25 hover:shadow-[#5865F2]/40 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
        animate={{ x: ["-100%", "300%"] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
      />
      <motion.div
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
      <DiscordIcon className="w-4 h-4" />
          </motion.div>
          <span className="relative text-[13px] tracking-wide whitespace-nowrap">
            {lang === "ar" ? "ديسكورد" : "Discord"}
          </span>
    </motion.button>
  );
}

function AnimatedDropdown({
  show,
  user,
  onLogout,
  lang,
  onClose,
}: {
  show: boolean;
  user: DiscordUser;
  onLogout: () => void;
  lang: string;
  onClose: () => void;
}) {
  const badge = getRoleBadge(user.roles || []);
  const avatarUrl = user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64` : `https://cdn.discordapp.com/embed/avatars/0.png`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={show ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -8, scale: 0.96, pointerEvents: "none" as "none" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-full right-0 mt-2 w-72 z-50"
    >
      <div className="relative rounded-2xl bg-[var(--surface)]/95 backdrop-blur-2xl border border-[var(--border)]/30 shadow-2xl shadow-[var(--background)]/50 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: "linear-gradient(135deg, #5865F2 0%, transparent 50%, #B8BFCB 100%)",
          }}
        />
        <div className="relative p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={avatarUrl}
                alt=""
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--surface)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {user.globalName || user.username}
              </p>
              <p className="text-xs text-[var(--text-muted)] truncate">@{user.username}</p>
            </div>
          </div>

          {badge && (
            <div className="flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-lg bg-[var(--surface-alt)]/50 border border-[var(--border)]/20">
              <badge.icon className={`w-3.5 h-3.5 ${badge.color}`} />
              <span className={`text-xs font-medium ${badge.color}`}>{badge.label}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 mb-4">
            {(user.roles || []).slice(0, 3).map((role, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-alt)]/50 text-[var(--text-muted)] border border-[var(--border)]/20"
              >
                {role}
              </span>
            ))}
            {(user.roles || []).length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-alt)]/50 text-[var(--text-muted)]">
                +{user.roles!.length - 3}
              </span>
            )}
          </div>

          <motion.button
            onClick={() => {
              onLogout();
              onClose();
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="group relative flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-medium overflow-hidden"
            style={{ color: "rgba(248,113,113,0.9)" }}
          >
            <motion.div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg, rgba(248,113,113,0.1), rgba(248,113,113,0.03))" }}
            />
            <motion.div
              className="absolute inset-x-4 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(90deg, transparent, rgba(248,113,113,0.3), transparent)" }}
            />
            <motion.div
              className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100"
              style={{ border: "1px solid rgba(248,113,113,0.15)", transition: "opacity 0.3s" }}
            />
            <span className="relative flex items-center gap-2">
              <motion.span
                className="relative flex"
                whileHover={{ x: [0, 3, 0] }}
                transition={{ duration: 0.4 }}
              >
                <LogOut className="w-3.5 h-3.5" />
              </motion.span>
              <motion.span
                className="relative tracking-wide"
                whileHover={{ letterSpacing: "0.08em" }}
                transition={{ duration: 0.3 }}
              >
                {lang === "ar" ? "تسجيل الخروج" : "Sign Out"}
              </motion.span>
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
