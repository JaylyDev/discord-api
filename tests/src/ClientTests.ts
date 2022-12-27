import * as GameTest from "@minecraft/server-gametest";
import { client, TEST_CHANNEL, TEST_GUILD, TEST_USER } from "./config";

GameTest.register("ClientTests", "get_guild", async (test) => {
  const guild = await client.getGuild(TEST_GUILD);

  test.assert(guild.id === TEST_GUILD, 'Guild ID assert failed.');
}).maxTicks(100)
  .tag(GameTest.Tags.suiteDefault)
  .structureName('discord_gametest');

GameTest.register("ClientTests", "send_message", (test) => {
  client.sendMessage(TEST_CHANNEL, {
    content: "Hello World",
    embeds: [{
      title: 'Title',
      description: "Description",
    }]
  });
  test.succeed();
});