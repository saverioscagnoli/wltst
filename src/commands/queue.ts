import { SlashCommand } from "@structs";

export default new SlashCommand({
  name: "queue",
  description: "Display this server's queue, if any.",
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

    await int.editReply({
      embeds: [queue.toEmbed(int.guild.name, int.guild.iconURL() ?? "")]
    });
  }
});
