import { Events } from "discord.js";
import { Event } from "./event-base";
import chalk from "chalk";

export default new Event(Events.ClientReady, client => {
  console.log(`Logged in as ${chalk.blue(client.user.tag)}`);
});
