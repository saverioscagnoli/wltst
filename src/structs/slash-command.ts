import {
  ChatInputApplicationCommandData,
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  PermissionResolvable
} from "discord.js";
import { Queue } from "./queue";

interface Interaction extends CommandInteraction {
  member: GuildMember;
}

interface ExeOptions {
  client: Client;
  int: Interaction;
  args: CommandInteractionOptionResolver;
  queues: Map<string, Queue>;
}

type ExeFunction = (options: ExeOptions) => void;

type TCommand = {
  userPermissions?: PermissionResolvable[];
  exe: ExeFunction;
} & ChatInputApplicationCommandData;

class SlashCommand {
  public exe: ExeFunction;
  public constructor({ exe, ...data }: TCommand) {
    this.exe = exe;
    Object.assign(this, data);
  }
}

export { SlashCommand, Interaction };
