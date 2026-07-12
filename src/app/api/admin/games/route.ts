import { NextRequest, NextResponse } from "next/server";
import { getGames, addGame, getAdmins, isSubAdmin } from "@/lib/data-store";

export async function GET() {
  const games = getGames();
  return NextResponse.json(games);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serial, name, type, image } = body;

    if (!serial) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isSubAdmin(serial)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!name || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = `game_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const game = {
      id,
      name,
      type,
      image: image || "",
      createdAt: new Date().toISOString(),
    };

    addGame(game);
    return NextResponse.json(game, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
