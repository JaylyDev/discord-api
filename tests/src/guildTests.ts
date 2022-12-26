import { client, TEST_CHANNEL, TEST_GUILD, TEST_USER } from "./config";
import * as GameTest from "@minecraft/server-gametest";

GameTest.register("GuildTests", "get_messages", async (test) => {
  const guild = await client.getGuild(TEST_GUILD);
  const messages = await guild.getMessages(TEST_CHANNEL, {});

  test.assert(messages instanceof Array, "getMessages() doesn't return array.");
}).maxTicks(100)
  .tag(GameTest.Tags.suiteDefault)
  .structureName('discord_gametest');

GameTest.register("GuildTests", "send_message", async (test) => {
  const guild = await client.getGuild(TEST_GUILD);
  guild.sendMessage(TEST_CHANNEL, { content: "Hello World." });
  guild.sendMessage(TEST_CHANNEL, {
    content: "Hello, World!",
    tts: false,
    embeds: [
      {
        title: "Hello, Embed!",
        description: "This is an embedded message.",
        image: {
          url: 'https://media.discordapp.net/attachments/854033525546942464/1054264985037054042/Screenshot_2022-12-19-13-11-42-75_5c8300b655012b1930f2e0a7b81bf6a9.png',
          width: 1440,
          height: 665
        }
      },
    ],
  });
  test.succeed();
});