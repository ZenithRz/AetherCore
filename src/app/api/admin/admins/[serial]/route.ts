import { NextRequest, NextResponse } from "next/server";
import { removeSubAdmin, isMainAdmin } from "@/lib/data-store";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ serial: string }> }) {
  try {
    const { serial } = await params;
    const body = await req.json();
    const { requesterSerial } = body;

    if (!requesterSerial || !isMainAdmin(requesterSerial)) {
      return NextResponse.json({ error: "Forbidden: main admin only" }, { status: 403 });
    }

    if (isMainAdmin(serial)) {
      return NextResponse.json({ error: "Cannot remove main admin" }, { status: 400 });
    }

    const ok = removeSubAdmin(serial);
    if (!ok) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
