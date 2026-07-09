"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Wifi } from "lucide-react";

type TeamMember = {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  roles: { id: string; name: string; color: string }[];
  status: string;
};

const ROLE_COLORS: Record<string, string> = {
  "AC 〢 Owner": "#d8ff00",
  "AC 〢 Co-Owner": "#900057",
  "AC 〢Admin": "#6a0dad",
  "AC 〢Mod": "#2ec4b6",
  "AC 〢Staff": "#000000",
  "AC 〢 Developer": "#0024f3",
  "AC 〢 Tech Support": "#007ba1",
};

const ROLE_ORDER = [
  "AC 〢 Owner",
  "AC 〢 Co-Owner",
  "AC 〢Admin",
  "AC 〢 Developer",
  "AC 〢Mod",
  "AC 〢 Tech Support",
  "AC 〢Staff",
];

function getBadgeColor(roles: { name: string }[]): string {
  for (const order of ROLE_ORDER) {
    if (roles.some((r) => r.name === order)) {
      return ROLE_COLORS[order] || "#B8BFCB";
    }
  }
  const top = roles.find((r) => ROLE_ORDER.includes(r.name));
  return top ? ROLE_COLORS[top.name] || "#B8BFCB" : "#B8BFCB";
}

function getRoleName(roles: { name: string }[]): string {
  for (const order of ROLE_ORDER) {
    if (roles.some((r) => r.name === order)) {
      return order.replace("AC 〢", "");
    }
  }
  return "Staff";
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const memberVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 0,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
    onComplete: (el: HTMLElement) => {
      el.style.opacity = "1";
    },
  },
};

export default function Team() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/discord/team")
      .then((r) => r.json())
      .then((data) => {
        if (data.team) setTeam(data.team);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="team" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800/40 to-dark-900" />

      <motion.div
        className="absolute top-10 left-10 w-40 h-40 rounded-full bg-accent-platinum/3 blur-3xl"
        animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-accent-navy/3 blur-3xl"
        animate={{ x: [0, -20, 15, 0], y: [0, 10, -15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
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
              THE CREW
            </span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            The team behind the scenes keeping the server running
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-text-muted py-20">
            <div className="inline-block w-8 h-8 border-2 border-accent-platinum/40 border-t-accent-platinum rounded-full animate-spin mb-4" />
            <p>Loading team...</p>
          </div>
        ) : team.length === 0 ? (
          <div className="text-center text-text-muted py-20">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>No team data available yet. Add roles in Discord.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {team.map((member) => {
              const color = getBadgeColor(member.roles);
              const roleName = getRoleName(member.roles);
              const isOnline = member.status === "online" || member.status === "idle" || member.status === "dnd";
              return (
                <motion.div
                  key={member.id}
                  variants={memberVariants}
                  data-sfx-hover
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-lg bg-gradient-to-br from-dark-500/50 to-transparent" />

                  <div className="relative bg-dark-700/80 border border-dark-500/50 rounded-2xl p-6 sm:p-8 text-center h-full flex flex-col items-center gap-4 transition-all duration-300 group-hover:border-dark-400/70 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full group-hover:animate-shimmer-sweep" />
                    </div>

                    <div className="relative">
                      <motion.div
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-2 overflow-hidden"
                        style={{
                          borderColor: `${color}60`,
                          boxShadow: `0 0 20px ${color}20`,
                        }}
                        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
                          style={{
                            background: `conic-gradient(from 0deg, transparent, ${color}40, transparent, ${color}20, transparent)`,
                          }}
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                        <img
                          src={member.avatar}
                          alt={member.displayName}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>

                      <motion.div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-dark-900 ${isOnline ? "bg-green-500" : "bg-gray-500"}`}
                        animate={isOnline ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </motion.div>
                    </div>

                    <div>
                      <h3 className="font-orbitron text-lg font-bold text-text-primary mb-1">
                        {member.displayName}
                      </h3>
                      <motion.span
                        className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
                        style={{
                          background: `linear-gradient(135deg, ${color}20, ${color}05)`,
                          color: color,
                          border: `1px solid ${color}30`,
                        }}
                        whileHover={{ scale: 1.05, boxShadow: `0 0 15px ${color}30` }}
                      >
                        {roleName}
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
