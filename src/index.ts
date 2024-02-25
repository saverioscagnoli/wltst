import { registerEvents } from "@api";
import { Client, IntentsBitField } from "discord.js";
import "dotenv/config";

const { Flags } = IntentsBitField;

const commands = new Map<string, unknown>();

async function main() {
  const client = new Client({
    intents: [
      Flags.Guilds,
      Flags.GuildMessages,
      Flags.GuildMessageTyping,
      Flags.GuildVoiceStates
    ]
  });

  await registerEvents(client);

  client.login(process.env.TOKEN);
}

main();
