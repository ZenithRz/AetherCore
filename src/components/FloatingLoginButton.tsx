"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import DiscordIcon from "@/components/DiscordIcon";
import { useDiscordAuth } from "@/contexts/DiscordAuthProvider";
import { useLoginModal } from "@/contexts/LoginModalProvider";
import { useLanguage } from "@/contexts/LanguageProvider";

export default function FloatingLoginButton() {
  const { user } = useDiscordAuth();
  const { openLoginModal } = useLoginModal();
  const { lang } = useLanguage();
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShow(latest > 600 && !user);
  });

  const handleClick = useCallback(() => {
    openLoginModal();
  }, [openLoginModal]);

  if (!mounted || user) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-[90]"
        >
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleClick}
            className="group relative flex items-center gap-3 py-3 pl-3 pr-5 rounded-2xl bg-gradient-to-r from-[#5865F2] to-[#4752C4] shadow-xl shadow-[#5865F2]/30 hover:shadow-[#5865F2]/50 transition-shadow duration-300"
          >
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2), transparent 70%)",
              }}
            />
            <motion.div
              className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"
              style={{ background: "linear-gradient(135deg, #5865F2, #4752C4)" }}
            />
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-white/15 backdrop-blur-sm">
              <motion.div
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <DiscordIcon className="w-4 h-4 text-white" />
              </motion.div>
            </div>
            <motion.span
              className="relative text-sm font-semibold text-white tracking-wide"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {lang === "ar" ? "ديسكورد" : "Discord"}
            </motion.span>

            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="flex w-2.5 h-2.5">
                <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-50" />
                <span className="relative rounded-full bg-green-500 w-2.5 h-2.5" />
              </span>
            </motion.div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
