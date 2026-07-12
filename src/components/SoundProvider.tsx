"use client";

import { createContext, useContext, useEffect, useRef, useCallback, type ReactNode } from "react";

type SoundType = "hover" | "click" | "inkSpread" | "uiSlide" | "notification";

type SoundContextType = {
  play: (type: SoundType) => void;
  playInkSpread: () => void;
  toggleMute: () => void;
  isMuted: () => boolean;
  setVolume: (v: number) => void;
  getVolume: () => number;
};

const SoundContext = createContext<SoundContextType | null>(null);

const VOLUMES: Record<SoundType, number> = {
  hover: 0.10,
  click: 0.14,
  inkSpread: 0.18,
  uiSlide: 0.12,
  notification: 0.16,
};

const RATES: Record<SoundType, number> = {
  hover: 1.6,
  click: 1.0,
  inkSpread: 0.75,
  uiSlide: 1.2,
  notification: 0.9,
};

const SFX_SRC = "/bluearchive-click-sound.mp3";

const SFX_VOLUME_KEY = "sfx_volume";

export function SoundProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mutedRef = useRef(true);
  const volumeRef = useRef(1.0);
  const lastHoveredRef = useRef<Element | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverCountRef = useRef(0);

  const getBase = useCallback(() => {
    if (!audioRef.current) audioRef.current = new Audio(SFX_SRC);
    return audioRef.current;
  }, []);

  const play = useCallback((type: SoundType) => {
    if (mutedRef.current) return;
    try {
      const base = getBase();
      const clone = base.cloneNode() as HTMLAudioElement;
      clone.volume = VOLUMES[type] * volumeRef.current;
      clone.playbackRate = RATES[type];
      clone.play().catch(() => {});
    } catch {}
  }, [getBase]);

  const playInkSpread = useCallback(() => {
    if (mutedRef.current) return;
    try {
      const base = getBase();
      for (let i = 0; i < 3; i++) {
        const clone = base.cloneNode() as HTMLAudioElement;
        clone.volume = (0.06 - i * 0.015) * volumeRef.current;
        clone.playbackRate = 0.7 + i * 0.15;
        setTimeout(() => clone.play().catch(() => {}), i * 60);
      }
    } catch {}
  }, [getBase]);

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current;
    localStorage.setItem("sfx_muted", String(mutedRef.current));
    if (mutedRef.current) {
      document.body.removeAttribute("data-sfx");
    } else {
      document.body.setAttribute("data-sfx", "on");
    }
  }, []);

  const isMuted = useCallback(() => mutedRef.current, []);

  const setVolume = useCallback((v: number) => {
    volumeRef.current = Math.max(0, Math.min(1, v));
    localStorage.setItem(SFX_VOLUME_KEY, String(volumeRef.current));
  }, []);

  const getVolume = useCallback(() => volumeRef.current, []);

  useEffect(() => {
    const stored = localStorage.getItem("sfx_muted");
    mutedRef.current = stored !== "false";
    if (!mutedRef.current) document.body.setAttribute("data-sfx", "on");
    const vol = localStorage.getItem(SFX_VOLUME_KEY);
    if (vol !== null) volumeRef.current = Math.max(0, Math.min(1, parseFloat(vol)));
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (mutedRef.current) return;
      const target = e.target as HTMLElement;
      const clickEl = target.closest("[data-sfx-click]");
      if (clickEl) play("click");
      const inkEl = target.closest("[data-sfx-ink]");
      if (inkEl) playInkSpread();
    };

    const handleMouseOver = (e: MouseEvent) => {
      if (mutedRef.current) return;
      const target = e.target as HTMLElement;
      const hoverEl = target.closest("[data-sfx-hover]");
      if (hoverEl && hoverEl !== lastHoveredRef.current) {
        lastHoveredRef.current = hoverEl;
        hoverCountRef.current += 1;
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = setTimeout(() => play("hover"), 30);
      }
    };

    document.addEventListener("click", handleClick, true);
    document.addEventListener("mouseover", handleMouseOver, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("mouseover", handleMouseOver, true);
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, [play, playInkSpread]);

  return (
    <SoundContext.Provider value={{ play, playInkSpread, toggleMute, isMuted, setVolume, getVolume }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundCtx() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSoundCtx must be used within SoundProvider");
  return ctx;
}
