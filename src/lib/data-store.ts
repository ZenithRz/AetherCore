import fs from "fs";
import path from "path";

export type RegisteredUser = {
  discordId: string;
  username: string;
  globalName: string;
  avatar: string;
  registeredAt: string;
};

export type EventItem = {
  id: string;
  name: string;
  description: string;
  type: string;
  game: string;
  image: string;
  duration: number;
  maxPlayers: number;
  createdAt: string;
  createdBy: string;
};

export type GameItem = {
  id: string;
  name: string;
  type: string;
  image: string;
  createdAt: string;
};

export type AdminData = {
  mainAdmin: string;
  subAdmins: SubAdmin[];
};

export type SubAdmin = {
  serialNumber: string;
  discordId: string;
  name: string;
  addedAt: string;
  addedBy: string;
};

export type Store = {
  events: EventItem[];
  games: GameItem[];
  admins: AdminData;
  registeredUsers: Record<string, RegisteredUser>;
};

const DATA_PATH = path.join(process.cwd(), "data", "admin-data.json");

function readStore(): Store {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const data = JSON.parse(raw);
    return {
      events: data.events ?? [],
      games: data.games ?? [],
      admins: data.admins ?? { mainAdmin: "AC-KTVH-0X4960", subAdmins: [] },
      registeredUsers: data.registeredUsers ?? {},
    };
  } catch {
    return { events: [], games: [], admins: { mainAdmin: "AC-KTVH-0X4960", subAdmins: [] }, registeredUsers: {} };
  }
}

function writeStore(store: Store): void {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(store, null, 2), "utf-8");
}

export function getEvents(): EventItem[] {
  return readStore().events;
}

export function addEvent(event: EventItem): void {
  const store = readStore();
  store.events.push(event);
  writeStore(store);
}

export function updateEvent(id: string, updates: Partial<EventItem>): boolean {
  const store = readStore();
  const idx = store.events.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  store.events[idx] = { ...store.events[idx], ...updates };
  writeStore(store);
  return true;
}

export function deleteEvent(id: string): boolean {
  const store = readStore();
  const len = store.events.length;
  store.events = store.events.filter((e) => e.id !== id);
  if (store.events.length === len) return false;
  writeStore(store);
  return true;
}

export function getGames(): GameItem[] {
  return readStore().games;
}

export function addGame(game: GameItem): void {
  const store = readStore();
  store.games.push(game);
  writeStore(store);
}

export function deleteGame(id: string): boolean {
  const store = readStore();
  const len = store.games.length;
  store.games = store.games.filter((g) => g.id !== id);
  if (store.games.length === len) return false;
  writeStore(store);
  return true;
}

export function getAdmins(): AdminData {
  return readStore().admins;
}

export function addSubAdmin(admin: SubAdmin): void {
  const store = readStore();
  store.admins.subAdmins.push(admin);
  writeStore(store);
}

export function removeSubAdmin(serial: string): boolean {
  const store = readStore();
  const len = store.admins.subAdmins.length;
  store.admins.subAdmins = store.admins.subAdmins.filter((a) => a.serialNumber !== serial);
  if (store.admins.subAdmins.length === len) return false;
  writeStore(store);
  return true;
}

export function isMainAdmin(serial: string): boolean {
  return serial === "AC-KTVH-0X4960";
}

export function isSubAdmin(serial: string): boolean {
  if (isMainAdmin(serial)) return true;
  const store = readStore();
  return store.admins.subAdmins.some((a) => a.serialNumber === serial);
}

export function registerUser(serial: string, user: RegisteredUser): void {
  const store = readStore();
  store.registeredUsers[serial] = user;
  writeStore(store);
}

export function getRegisteredUser(serial: string): RegisteredUser | null {
  const store = readStore();
  return store.registeredUsers[serial] || null;
}

export function getAllRegisteredUsers(): Record<string, RegisteredUser> {
  return readStore().registeredUsers;
}
