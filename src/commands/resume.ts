import { SlashCommand } from "@structs";

export default new SlashCommand({
  name: "resume",
  description: "Resume the current song, if paused.",
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

    if (!queue.isPaused()) {
      await int.editReply("The queue is already playing!");
      return;
    }

    queue.resume();

    await int.editReply("Resumed! 🎶");
  }
});
