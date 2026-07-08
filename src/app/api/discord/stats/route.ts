import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), ".data", "discord-cache.json");
const BOT_API = process.env.DISCORD_BOT_API_URL;

async function fetchFromBot() {
  if (!BOT_API) return null;
  try {
    const res = await fetch(`${BOT_API}/api/stats`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchFromInvite() {
  const res = await fetch("https://discord.com/api/v10/invites/5t3hUFVcS", {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const guild = data.guild;
  const profile = data.profile;
  return {
    name: guild.name,
    icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
    memberCount: profile.member_count ?? guild.approximate_member_count,
    onlineCount: profile.online_count ?? guild.approximate_presence_count,
    fromBot: false,
  };
}

function readBotCache() {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const raw = fs.readFileSync(CACHE_FILE, "utf-8");
    const data = JSON.parse(raw);
    return {
      name: data.name,
      icon: data.icon,
      id: data.id,
      description: data.description,
      memberCount: data.memberCount,
      onlineCount: data.onlineCount,
      fromBot: true,
      updatedAt: data.updatedAt,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const botData = await fetchFromBot();
    if (botData) return NextResponse.json(botData);

    const cached = readBotCache();
    if (cached) return NextResponse.json(cached);

    const inviteData = await fetchFromInvite();
    if (inviteData) return NextResponse.json(inviteData);

    return NextResponse.json({ error: "No data available" }, { status: 503 });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
