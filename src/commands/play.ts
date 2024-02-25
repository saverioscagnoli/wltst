import { joinVoiceChannel } from "@discordjs/voice";
import { Queue, SlashCommand, Track } from "@structs";
import { ApplicationCommandOptionType } from "discord.js";

export default new SlashCommand({
  name: "play",
  description: "Vibe to some music! 🎶",
  options: [
    {
      name: "query",
      description: "The url or search query of the song you want to play.",
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  exe: async ({ int, queues }) => {
    let vc = int.member.voice.channel;

    if (!vc || !vc.id || !int.guildId || !int.guild) {
      await int.reply({
        content: "You need to be in a voice channel to use this command!",
        ephemeral: true
      });
      return;
    }

    await int.deferReply();

    let query = int.options.get("query")?.value as string;

    if (!queues.has(int.guildId)) {
      let connection = joinVoiceChannel({
        channelId: vc.id,
        guildId: int.guildId,
        adapterCreator: int.guild.voiceAdapterCreator,
        selfDeaf: false
      });

      let queue = new Queue({ connection, channel: int.channel! });

      queues.set(int.guildId, queue);

      let tracks = await queue.addTrack(query);

      await int.editReply({
        embeds: [tracks[0].toEmbed()]
      });

      queue.play();
    } else {
      let queue = queues.get(int.guildId);

      if (!queue) {
        throw new Error("Queue not found. There was an unkonwn error.");
      }

      let tracks = await queue.addTrack(query);

      if (tracks.length === 1) {
        await int.editReply(`
        **\`${tracks[0].title}\`** has been added to the queue! 🎶`);
      } else {
        await int.editReply(`
        **\`${tracks.length}\`** tracks have been added to the queue! 🎶`);
      }
    }
  }
});
