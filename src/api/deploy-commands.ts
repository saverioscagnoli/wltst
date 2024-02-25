import { Paths, table } from "@lib";
import {
  ApplicationCommandDataResolvable,
  Client,
  REST,
  Routes
} from "discord.js";
import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
import { SlashCommand } from "@structs";

async function registerCommands(commandsMap: Map<string, SlashCommand>) {
  let commands: ApplicationCommandDataResolvable[] = [];
  let files = await fs.readdir(Paths.Commands);

  for (let file of files) {
    let commandPath = path.join(Paths.Commands, file);
    let { default: command } = await import(commandPath);

    if (!command) continue;

    commands.push(command);
    commandsMap.set(command.name, command);
  }

  return commands;
}

async function deployCommands(commands: ApplicationCommandDataResolvable[]) {
  let rest = new REST().setToken(process.env.TOKEN!);

  try {
    console.log(chalk.yellow(`Deploying ${commands.length} (/) commands...`));

    let data = (await rest.put(
      process.env.NODE_ENV === "prod"
        ? Routes.applicationCommands(process.env.CLIENT_ID!)
        : Routes.applicationGuildCommands(
            process.env.CLIENT_ID!,
            process.env.GUILD_ID!
          ),
      { body: commands }
    )) as unknown[];

    table(
      commands.map(c => ({
        // @ts-ignore
        name: c.name,
        status: "Deployed"
      }))
    );
  } catch (err) {
    console.error(err);
  }
}

export { registerCommands, deployCommands };
