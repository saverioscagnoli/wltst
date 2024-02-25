import { commandsMap } from "@main";
import { Event } from "./event-base";
import { Interaction } from "@commands";
import {
  CommandInteractionOptionResolver,
  Events,
  InteractionType
} from "discord.js";

export default new Event(Events.InteractionCreate, async int => {
  if (int.type !== InteractionType.ApplicationCommand) return;

  let command = commandsMap.get(int.commandName);

  if (!command) return;

  command.exe({
    args: int.options as CommandInteractionOptionResolver,
    client: int.client,
    int: int as Interaction
  });
});
