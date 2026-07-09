import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), ".data", "discord-cache.json");
const BOT_API = process.env.DISCORD_BOT_API_URL || "https://aethrecore-bot-production.up.railway.app";

async function fetchFromBot() {
  if (!BOT_API) return null;
  try {
    const res = await fetch(`${BOT_API}/api/members`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const fromBot = await fetchFromBot();
    if (fromBot) return NextResponse.json(fromBot);

    if (!fs.existsSync(CACHE_FILE)) {
      return NextResponse.json({ error: "Bot not connected" }, { status: 503 });
    }
    const raw = fs.readFileSync(CACHE_FILE, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json({
      guildName: data.name,
      guildIcon: data.icon,
      members: data.members || [],
      totalMembers: data.memberCount,
      totalOnline: data.onlineCount,
      updatedAt: data.updatedAt,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
