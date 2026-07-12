import { NextRequest, NextResponse } from "next/server";
import { generateSerialNumber } from "@/lib/serial";
import { getEvents, addEvent, getAdmins, isSubAdmin } from "@/lib/data-store";

export async function GET() {
  const events = getEvents();
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serial, name, description, type, game, image, duration, maxPlayers } = body;

    if (!serial) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const admins = getAdmins();

    if (!isSubAdmin(serial)) {
      return NextResponse.json({ error: "Forbidden: not an admin" }, { status: 403 });
    }

    if (!name || !type || !game || !duration || !maxPlayers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const event = {
      id,
      name,
      description: description || "",
      type,
      game,
      image: image || "",
      duration: Number(duration),
      maxPlayers: Number(maxPlayers),
      createdAt: new Date().toISOString(),
      createdBy: serial,
    };

    addEvent(event);
    return NextResponse.json(event, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
