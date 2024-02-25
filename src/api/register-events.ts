import { Paths } from "@lib";
import { Client } from "discord.js";
import fs from "fs/promises";
import path from "path";
import chalk from "chalk";

async function registerEvents(client: Client) {
  let files = await fs.readdir(Paths.Events);

  for (let file of files) {
    let eventPath = path.join(Paths.Events, file);
    let event = await import(eventPath);

    if (!event.default) continue;

    client.on(event.default.name, event.default.callback.bind(null, client));
  }

  console.log(chalk.green(`Registered ${files.length - 1} events.`));
}

export { registerEvents };
