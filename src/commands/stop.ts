import { SlashCommand } from "@structs";

export default new SlashCommand({
  name: "stop",
  description: "Kill the vibe.",
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

    await queue.end();

    await int.editReply(`${int.user} Killed the vibe! :(`);
  }
});
