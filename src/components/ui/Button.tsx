"use client";

import { useState, type ReactNode, type MouseEvent } from "react";
import { motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  target?: string;
  rel?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-[#06B6D4] to-[#A855F7] text-white font-bold shadow-lg shadow-[#06B6D4]/20",
  secondary:
    "border border-[var(--border)] text-[var(--text-primary)] hover:border-[#06B6D4]/40 hover:text-white",
  ghost:
    "text-text-secondary hover:text-text-primary",
};

export default function Button({
  children,
  variant = "primary",
  href,
  onClick,
  type = "button",
  className = "",
  target,
  rel,
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    e.currentTarget.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  const shared = (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-sfx-hover
      data-sfx-ink
      onClick={onClick}
      className={`group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl overflow-hidden cursor-pointer select-none ${variantStyles[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2 transition-colors duration-300">
        {children}
      </span>

      <motion.span
        className="absolute pointer-events-none rounded-full"
        style={{
          left: "var(--mx, 50%)",
          top: "var(--my, 50%)",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 50%, transparent 70%)",
          filter: "blur(16px)",
        }}
        animate={
          hovered
            ? { width: 600, height: 600, opacity: 1 }
            : { width: 0, height: 0, opacity: 0 }
        }
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      />
    </div>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className="inline-block">
        {shared}
      </a>
    );
  }

  return (
    <button type={type} className="inline-block">
      {shared}
    </button>
  );
}
