import { SlashCommand } from "./command-base";

export default new SlashCommand({
  name: "ping",
  description: "Pong!",
  exe: async ({ int, client }) => {
    await int.reply(`Pong! \`${client.ws.ping}ms\` 🏓`);
  }
});
