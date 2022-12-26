import { client, TEST_CHANNEL, TEST_GUILD, TEST_USER } from "./config";

(async function getGuildMemberInfo() {
  const guild = await client.getGuild(TEST_GUILD);
  const member = await guild.getGuildMember(TEST_USER);
  const memberTag = `${member?.user?.username}#${member?.user?.discriminator}`;

  console.log(
    `Member ${memberTag} join date: ${member.getJoinDate().toDateString()}`
  );
  // Member Jayly#1397 join date: Thu Apr 26 2018
})().catch(console.error);

(async function sendMessage() {
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
})().catch(console.error);
