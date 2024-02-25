import { SlashCommand } from "@structs";
import { ApplicationCommandOptionType } from "discord.js";

export default new SlashCommand({
  name: "skip",
  description: "Skip any song in the queue.",
  options: [
    {
      name: "amount",
      description: "The amount of songs to skip.",
      type: ApplicationCommandOptionType.Integer,
      required: false
    }
  ],
  exe: async ({ int, queues }) => {
    if (!int.guildId || !int.guild) return;

    await int.deferReply();

    let queue = queues.get(int.guildId);

    if (!queue) {
      await int.editReply(
        "There is no queue. Use `/play` to add a song to the queue! 🎶"
      );
      return;
    }

    let n = (int.options.get("amount")?.value as number) ?? 1;
    queue.skip(n);

    await int.editReply("Skipped! 🎶");
  }
});
