import { registerEvents, deployCommands, registerCommands } from "@api";
import { Queue, SlashCommand } from "@structs";
import { Client, IntentsBitField } from "discord.js";
import "dotenv/config";

const commandsMap = new Map<string, SlashCommand>();
const queues = new Map<string, Queue>();

export { commandsMap, queues };

const { Flags } = IntentsBitField;

async function main() {
  const client = new Client({
    intents: [
      Flags.Guilds,
      Flags.GuildMessages,
      Flags.GuildMessageTyping,
      Flags.GuildVoiceStates,
      Flags.GuildIntegrations
    ]
  });

  await registerEvents(client);

  let commands = await registerCommands(commandsMap);
  await deployCommands(commands);

  client.login(process.env.TOKEN);
}

main();

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);
