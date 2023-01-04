import * as GameTest from "@minecraft/server-gametest";
import type { ChannelType } from "discord-api-types/v9";
import { client, TEST_CHANNEL, TEST_GUILD } from "./config";
import { GuildTextChannel, Message } from './discord-api';

GameTest.register("ClientTests", "get_guild", async (test) => {
  const guild = await client.guild.get(TEST_GUILD);

  test.assert(guild.id === TEST_GUILD, 'Guild ID assert failed.');
}).maxTicks(100)
  .tag(GameTest.Tags.suiteDefault)
  .structureName('discord_gametest');

GameTest.register("ClientTests", "send_message", async (test) => {
  const channel = await client.channel.get(TEST_CHANNEL) as GuildTextChannel<ChannelType.GuildText>;
  const message = await channel.sendMessage({
    content: "Hello World",
    embeds: [{
      title: 'Title',
      description: "Description",
    }]
  });
  test.succeedWhen(() => message instanceof Message);
});