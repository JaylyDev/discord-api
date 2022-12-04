# Client class

## `constructor`
`new Client(token)`

- token `<string>` Discord bot token.

Creates a new instance of a stack of items for use in the world.

## `client.getGuild(guildId, options)`

- guildId [`<Snowflake>`](https://discord.com/developers/docs/reference#snowflakes) The Discord Server ID.
- options [`<RESTGetAPIGuildQuery>`](https://discord.com/developers/docs/resources/guild#get-guild)

Returns [`Guild`](./Guild.md)

## `client.sendMessage(channelId, options)`

- channelId [`<Snowflake>`](https://discord.com/developers/docs/reference#snowflakes) The Discord channel ID in a Discord server.
- options [`<RESTPostAPIChannelMessageJSONBody>`](https://discord.com/developers/docs/resources/channel#create-message)