import * as GameTest from "@minecraft/server-gametest";
import { client, TEST_GUILD, TEST_USER } from "./config";

GameTest.register("UserTests", "guild_member", async (test) => {
  const guild = await client.getGuild(TEST_GUILD);
  const member = await guild.getGuildMember(TEST_USER);
  const memberTag = `${member.user.username}#${member.user.discriminator}`;

  test.assert(memberTag === 'Jayly#1397', 'Member tag assert failed.');
  test.assert(member.getJoinDate().getTime() === 1524738361417, 'Member join timestamp assert failed.');
}).maxTicks(100)
  .tag(GameTest.Tags.suiteDefault)
  .structureName('discord_gametest');