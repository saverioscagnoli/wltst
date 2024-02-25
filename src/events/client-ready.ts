import { Events } from "discord.js";
import { Event } from "@structs";
import chalk from "chalk";

export default new Event(Events.ClientReady, client => {
  console.log(`Logged in as ${chalk.blue(client.user.tag)}`);
});
