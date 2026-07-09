"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Send, Mail, MapPin, Users, Wifi, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

const socialLinks = [
  {
    name: "Discord",
    href: "https://discord.gg/5t3hUFVcS",
    color: "#5865F2",
    svg: "/icons/discord.svg",
  },
  {
    name: "Twitter/X",
    href: "https://x.com",
    color: "#000000",
    svg: "/icons/x.svg",
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    color: "#FF0000",
    svg: "/icons/youtube.svg",
  },
];

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-dark-700/80 border border-dark-500/50 text-text-primary placeholder-text-muted outline-none transition-all duration-300 focus:border-accent-platinum/60 focus:shadow-[0_0_15px_rgba(184,191,203,0.15)] focus:bg-dark-700";

export default function Footer() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const [discordStats, setDiscordStats] = useState<{
    memberCount: number;
    onlineCount: number;
  } | null>(null);

  useEffect(() => {
    const fetchStats = () => {
      fetch("/api/discord/stats")
        .then((r) => r.json())
        .then((data) => {
          if (data.memberCount !== undefined) {
            setDiscordStats(data);
          }
        })
        .catch(() => {});
    };
    fetchStats();
    const interval = setInterval(fetchStats, 1000);
    return () => clearInterval(interval);
  }, []);

  const [memberHover, setMemberHover] = useState<number | null>(null);

  return (
    <footer id="contact" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800/40 to-dark-900" />

      <motion.div
        className="absolute top-1/4 right-1/4 w-52 h-52 rounded-full bg-accent-platinum/3 blur-3xl"
        animate={{ y: [0, -20, 10, 0], x: [0, 15, -12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-accent-navy/3 blur-3xl"
        animate={{ y: [0, 12, -18, 0], x: [0, -10, 15, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #B8BFCB 1px, transparent 0)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-accent-platinum to-accent-navy bg-clip-text text-transparent">
              GET CONNECTED
            </span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Join the community. Reach out. Stay in the loop.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <h3 className="font-orbitron text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-accent-platinum" />
              Send us a message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div whileFocus={{ scale: 1.01 }}>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                    required
                  />
                </motion.div>
                <motion.div whileFocus={{ scale: 1.01 }}>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClass}
                    required
                  />
                </motion.div>
              </div>
              <motion.div whileFocus={{ scale: 1.005 }}>
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`${inputClass} resize-none`}
                  required
                />
              </motion.div>
              <Button
                type="submit"
                variant="primary"
              >
                Send Message
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Send className="w-4 h-4" />
                </motion.span>
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div>
              <h3 className="font-orbitron text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent-navy" />
                Connect with us
              </h3>

              <div className="space-y-4">
                {socialLinks.map((social, i) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-sfx-hover
                      className="group flex items-center gap-3 p-3 rounded-xl bg-dark-700/40 border border-dark-500/30 transition-all duration-300 relative overflow-hidden"
                      onMouseEnter={() => setMemberHover(i)}
                      onMouseLeave={() => setMemberHover(null)}
                      whileHover={{ x: 6, borderColor: "rgba(184,191,203,0.6)" }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${social.color}08, transparent)`,
                        }}
                      />
                      <motion.div
                        className="w-10 h-10 rounded-lg flex items-center justify-center relative z-10"
                        style={{ backgroundColor: `${social.color}15` }}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                      >
                        <img
                          src={social.svg}
                          alt={social.name}
                          className="w-5 h-5 object-contain"
                          style={{ filter: `brightness(0) invert(1)` }}
                        />
                      </motion.div>
                      <span className="text-text-secondary group-hover:text-text-primary transition-colors duration-300 relative z-10">
                        {social.name}
                      </span>
                    </motion.a>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="font-orbitron text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <Wifi className="w-5 h-5 text-accent-mauve" />
                Server Stats
              </h3>

              <motion.div
                data-sfx-hover
                className="bg-dark-700/40 border border-dark-500/30 rounded-xl p-6 relative overflow-hidden"
                whileHover={{ borderColor: "rgba(184,191,203,0.4)" }}
              >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <motion.div
                    className="absolute w-full h-px bg-gradient-to-r from-transparent via-accent-platinum/10 to-transparent"
                    animate={{ top: ["-10%", "110%"] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <div className="relative z-10 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                      className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent-platinum/10 border border-accent-platinum/20 mb-3"
                    >
                      <Users className="w-6 h-6 text-accent-platinum" />
                    </motion.div>
                    <p className="text-text-muted text-xs mb-1">Members</p>
                    <p className="font-orbitron text-2xl font-bold bg-gradient-to-r from-accent-platinum to-accent-navy bg-clip-text text-transparent">
                      {discordStats?.memberCount ?? "—"}
                    </p>
                  </div>
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                      className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent-muted/10 border border-accent-muted/20 mb-3"
                    >
                      <Wifi className="w-6 h-6 text-accent-muted" />
                    </motion.div>
                    <p className="text-text-muted text-xs mb-1">Online</p>
                    <p className="font-orbitron text-2xl font-bold bg-gradient-to-r from-accent-muted to-accent-navy bg-clip-text text-transparent">
                      {discordStats?.onlineCount ?? "—"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-dark-500/30 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Gamepad2 className="w-5 h-5 text-accent-platinum" />
            </motion.div>
            <span className="font-orbitron text-sm font-bold bg-gradient-to-r from-accent-platinum to-accent-navy bg-clip-text text-transparent">
              AETHRECORE
            </span>
          </div>
          <p className="text-text-muted text-sm">
            &copy; {new Date().getFullYear()} AETHRECORE Gaming Community. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
