"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

export type DiscordUser = {
  id: string;
  username: string;
  globalName: string;
  avatar: string;
  roles: string[];
};

type DiscordAuthContextType = {
  user: DiscordUser | null;
  loading: boolean;
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

  useEffect(() => {
    const stored = localStorage.getItem("discord_auth");
    setLoading(false);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("authenticated") === "true") {
      const discordUser: DiscordUser = {
        id: params.get("discord_id") || "",
        username: params.get("username") || "",
        globalName: params.get("global_name") || params.get("username") || "",
        avatar: params.get("avatar") || "",
        roles: params.get("roles") ? params.get("roles")!.split(",").filter(Boolean) : [],
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
    setUser(null);
    localStorage.removeItem("discord_auth");
  }, []);

  const hasRole = useCallback((roleName: string): boolean => {
    if (!user) return false;
    return user.roles.some((r) => r.toLowerCase().includes(roleName.toLowerCase()));
  }, [user]);

  const hasAnyRole = useCallback((roleNames: string[]): boolean => {
    return roleNames.some((name) => hasRole(name));
  }, [hasRole]);

  return (
    <DiscordAuthContext.Provider value={{ user, loading, login, logout, hasRole, hasAnyRole }}>
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
      login: () => {},
      logout: () => {},
      hasRole: () => false,
      hasAnyRole: () => false,
    };
  }
  return ctx;
}
