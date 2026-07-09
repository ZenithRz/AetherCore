require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, ActivityType } = require("discord.js");

const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const TOKEN = process.env.DISCORD_BOT_TOKEN;
if (!TOKEN) {
  console.error("DISCORD_BOT_TOKEN not found in .env.local");
  process.exit(1);
}

const WELCOME_CHANNEL_ID = process.env.WELCOME_CHANNEL_ID || null;
const STATS_CATEGORY_ID = process.env.STATS_CATEGORY_ID || null;
const ANNOUNCE_CHANNEL_ID = process.env.ANNOUNCE_CHANNEL_ID || null;
const BOT_HTTP_PORT = parseInt(process.env.BOT_HTTP_PORT || "3001", 10);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

const { handleInteraction } = require("./events/interactionCreate");
const { handleGuildMemberAdd } = require("./events/guildMemberAdd");
const { startStatsUpdater } = require("./utils/statsChannel");
const { startStatsWriter } = require("./utils/statsWriter");
const { startServer, updateCache } = require("./server");

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: "AETHRECORE | /help", type: ActivityType.Playing }],
    status: "dnd",
  });

  startStatsUpdater(client, { categoryId: STATS_CATEGORY_ID });
  startStatsWriter(client);
  startServer(BOT_HTTP_PORT);

  const guild = client.guilds.cache.first();
  if (guild) {
    try { await guild.members.fetch(); } catch (e) { console.error("Failed to fetch members:", e.message); }
  }

  updateCache(client);
  setInterval(() => updateCache(client), 60_000);
});

client.on("guildMemberAdd", (member) => {
  handleGuildMemberAdd(member, { channelId: WELCOME_CHANNEL_ID });
  updateCache(client);
});

client.on("guildMemberRemove", () => {
  updateCache(client);
});

client.on("interactionCreate", (interaction) => {
  handleInteraction(interaction, { announceChannelId: ANNOUNCE_CHANNEL_ID });
});

client.login(TOKEN).catch((err) => {
  console.error("Failed to login:", err.message);
  process.exit(1);
});
