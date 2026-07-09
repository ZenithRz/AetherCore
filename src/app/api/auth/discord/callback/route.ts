import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = "1524379193817956442";
const GUILD_ID = "1453794735704637473";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/?discord_auth=error`
    );
  }

  try {
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    if (!clientSecret) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/?discord_auth=not_configured`
      );
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth/discord/callback`;

    const tokenRes = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/?discord_auth=token_failed`
      );
    }

    const tokens = await tokenRes.json();
    const accessToken = tokens.access_token;

    const userRes = await fetch("https://discord.com/api/v10/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const user = await userRes.json();

    let isMember = false;
    let roles: string[] = [];
    if (BOT_TOKEN) {
      try {
        const memberRes = await fetch(
          `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${user.id}`,
          {
            headers: { Authorization: `Bot ${BOT_TOKEN}` },
          }
        );
        isMember = memberRes.ok;
        if (memberRes.ok) {
          const memberData = await memberRes.json();
          roles = memberData.roles || [];
        }
      } catch {
        isMember = false;
      }
    }

    const params = new URLSearchParams({
      discord_id: user.id,
      username: user.username,
      avatar: user.avatar || "",
      global_name: user.global_name || user.username,
      is_member: String(isMember),
      roles: roles.join(","),
      authenticated: "true",
    });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/?${params.toString()}`
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/?discord_auth=error&message=${encodeURIComponent(msg)}`
    );
  }
}
