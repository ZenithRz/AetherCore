import { NextRequest, NextResponse } from "next/server";
import { getAdmins, addSubAdmin, isMainAdmin, isSubAdmin, getRegisteredUser } from "@/lib/data-store";

const GUILD_ID = "1453794735704637473";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export async function GET() {
  const admins = getAdmins();
  return NextResponse.json(admins);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serial, targetSerial } = body;

    if (!serial || !isMainAdmin(serial)) {
      return NextResponse.json({ error: "Forbidden: main admin only" }, { status: 403 });
    }

    if (!targetSerial) {
      return NextResponse.json({ error: "Missing target serial" }, { status: 400 });
    }

    if (targetSerial === "AC-KTVH-0X4960") {
      return NextResponse.json({ error: "Cannot add main admin as sub-admin" }, { status: 400 });
    }

    if (isSubAdmin(targetSerial)) {
      return NextResponse.json({ error: "Already an admin" }, { status: 409 });
    }

    const registered = getRegisteredUser(targetSerial);
    if (!registered) {
      return NextResponse.json({ error: "User not found. They must log in with Discord first." }, { status: 404 });
    }

    if (BOT_TOKEN) {
      try {
        const memberRes = await fetch(
          `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${registered.discordId}`,
          { headers: { Authorization: `Bot ${BOT_TOKEN}` } }
        );
        if (!memberRes.ok) {
          return NextResponse.json({ error: "User is not a member of the Discord server" }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: "Failed to verify guild membership" }, { status: 500 });
      }
    }

    const subAdmin = {
      serialNumber: targetSerial,
      discordId: registered.discordId,
      name: registered.globalName || registered.username,
      addedAt: new Date().toISOString(),
      addedBy: serial,
    };

    addSubAdmin(subAdmin);
    return NextResponse.json(subAdmin, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
