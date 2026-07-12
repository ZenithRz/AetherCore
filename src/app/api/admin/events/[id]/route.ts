import { NextRequest, NextResponse } from "next/server";
import { updateEvent, deleteEvent, getAdmins, isSubAdmin } from "@/lib/data-store";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { serial, ...updates } = body;

    if (!serial) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isSubAdmin(serial)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ok = updateEvent(id, updates);
    if (!ok) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { serial } = body;

    if (!serial) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isSubAdmin(serial)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ok = deleteEvent(id);
    if (!ok) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
