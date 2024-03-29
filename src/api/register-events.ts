import { Paths } from "@lib";
import { Client } from "discord.js";
import fs from "fs/promises";
import path from "path";
import chalk from "chalk";

async function registerEvents(client: Client) {
  let files = await fs.readdir(Paths.Events);

  for (let file of files) {
    let eventPath = path.join(Paths.Events, file);
    let { default: event } = await import(eventPath);

    if (!event) continue;

    client.on(event.name, event.callback);
  }

  console.log(chalk.green(`Registered ${files.length - 1} events.`));
}

export { registerEvents };
