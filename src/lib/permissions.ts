export type Permission = "manage_events" | "manage_games" | "manage_announcements" | "manage_all";

export type Permissions = {
  canManageEvents: boolean;
  canManageGames: boolean;
  canManageAnnouncements: boolean;
  canManageAll: boolean;
};

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  Owner: ["manage_all", "manage_events", "manage_games", "manage_announcements"],
  "Co-Owner": ["manage_all", "manage_events", "manage_games", "manage_announcements"],
  Admin: ["manage_all", "manage_events", "manage_games", "manage_announcements"],
  "Tech Support": ["manage_events"],
  Developer: ["manage_games"],
  Mod: ["manage_events"],
};

export function getPermissions(hasRole: (keyword: string) => boolean): Permissions {
  const granted = new Set<Permission>();

  for (const [keyword, perms] of Object.entries(ROLE_PERMISSIONS)) {
    if (hasRole(keyword)) {
      for (const p of perms) granted.add(p);
    }
  }

  return {
    canManageEvents: granted.has("manage_events") || granted.has("manage_all"),
    canManageGames: granted.has("manage_games") || granted.has("manage_all"),
    canManageAnnouncements: granted.has("manage_announcements") || granted.has("manage_all"),
    canManageAll: granted.has("manage_all"),
  };
}
