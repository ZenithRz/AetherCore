"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { generateSerialNumber } from "@/lib/serial";

export type DiscordUser = {
  id: string;
  username: string;
  globalName: string;
  avatar: string;
  roles: string[];
  linkedAt: string;
  serialNumber: string;
};

type DiscordAuthContextType = {
  user: DiscordUser | null;
  loading: boolean;
  loggingOut: boolean;
  login: () => void;
  logout: () => void;
  hasRole: (roleName: string) => boolean;
  hasAnyRole: (roleNames: string[]) => boolean;
};

const DiscordAuthContext = createContext<DiscordAuthContextType | null>(null);

const ROLE_KEYWORDS = ["Owner", "Co-Owner", "Admin", "Tech Support", "Developer", "Mod"];

export function DiscordAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("discord_auth");
    setLoading(false);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (!parsed.linkedAt) parsed.linkedAt = new Date().toISOString();
        if (!parsed.serialNumber) parsed.serialNumber = generateSerialNumber(parsed.id || "0");
        setUser(parsed);
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("authenticated") === "true") {
      const now = new Date().toISOString();
      const discordId = params.get("discord_id") || "";
      const existingStored = localStorage.getItem("discord_auth");
      let linkedAt = now;
      if (existingStored) {
        try {
          const parsed = JSON.parse(existingStored);
          if (parsed.linkedAt) linkedAt = parsed.linkedAt;
        } catch {}
      }
      const discordUser: DiscordUser = {
        id: discordId,
        username: params.get("username") || "",
        globalName: params.get("global_name") || params.get("username") || "",
        avatar: params.get("avatar") || "",
        roles: params.get("roles") ? params.get("roles")!.split(",").filter(Boolean) : [],
        linkedAt,
        serialNumber: params.get("serial") || generateSerialNumber(discordId),
      };
      setUser(discordUser);
      localStorage.setItem("discord_auth", JSON.stringify(discordUser));
      const url = new URL(window.location.href);
      url.search = "";
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const login = useCallback(() => {
    window.location.href = "/api/auth/discord";
  }, []);

  const logout = useCallback(() => {
    setLoggingOut(true);
    setTimeout(() => {
      setUser(null);
      setLoggingOut(false);
      localStorage.removeItem("discord_auth");
    }, 1800);
  }, []);

  const hasRole = useCallback((roleName: string): boolean => {
    if (!user) return false;
    return user.roles.some((r) => r.toLowerCase().includes(roleName.toLowerCase()));
  }, [user]);

  const hasAnyRole = useCallback((roleNames: string[]): boolean => {
    return roleNames.some((name) => hasRole(name));
  }, [hasRole]);

  return (
    <DiscordAuthContext.Provider value={{ user, loading, loggingOut, login, logout, hasRole, hasAnyRole }}>
      {children}
    </DiscordAuthContext.Provider>
  );
}

export function useDiscordAuth() {
  const ctx = useContext(DiscordAuthContext);
  if (!ctx) {
    return {
      user: null,
      loading: false,
      loggingOut: false,
      login: () => {},
      logout: () => {},
      hasRole: () => false,
      hasAnyRole: () => false,
    };
  }
  return ctx;
}
