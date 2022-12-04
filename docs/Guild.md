# Guild class

Guilds in Discord represent an isolated collection of users and channels, and are often referred to as "servers" in the UI.

## Discord API Guild Results

Returns the entire guild object structure provided by Discord API.

https://discord.com/developers/docs/resources/guild#guild-object-guild-structure

- `id`: Guild id
- `name`: Guild name
- `icon`: Guild icon
- `iconHash`: Icon hash, returned when in the template object
- `splash`: Guild splash
- `discoverySplash`: Discovery splash hash; only present for guilds with the "DISCOVERABLE" feature
- `owner`: `true` if the user is the owner of the guild
- `ownerId`: ID of owner
- `permissions`: Total permissions for the user in the guild (excludes overrides). See https://en.wikipedia.org/wiki/Bit_field
- `afkChannelId`: ID of afk channel
- `afkTimeout`: afk timeout in seconds, can be set to: `60`, `300`, `900`, `1800`, `3600`
- `widgetEnabled`: `true` if the guild widget is enabled
- `widgetChannelId`: The channel id that the widget will generate an invite to, or `null` if set to no invite
- `verificationLevel`: Verification level required for the guild
- `defaultMessageNotifications`: Default message notifications level
- `explicitContentFilter`: Explicit content filter level
- `roles`: Roles in the guild
- `emojis`: Custom guild emojis
- `features`: Enabled guild features
- `mfaLevel`: Required MFA level for the guild
- `applicationId`: Application id of the guild creator if it is bot-created
- `systemChannelId`: The id of the channel where guild notices such as welcome messages and boost events are posted
- `systemChannelFlags`: System channel flags
- `rulesChannelId`: The id of the channel where Community guilds can display rules and/or guidelines
- `maxPresences`: The maximum number of presences for the guild (`null` is always returned, apart from the largest of guilds)
- `maxMembers`: The maximum number of members for the guild
- `vanityUrlCode`: The vanity url code for the guild
- `description`: The description for the guild
- `banner`: Banner hash
- `premiumTier`: Premium tier (Server Boost level)
- `premiumSubscriptionCount`: The number of boosts this guild currently has
- `preferredLocale`: The preferred locale of a Community guild; used in guild discovery and notices from Discord; defaults to "en-US"
- `publicUpdatesChannelId`: The id of the channel where admins and moderators of Community guilds receive notices from Discord
- `maxVideoChannelUsers`: The maximum amount of users in a video channel
- `approximateMemberCount`: **This field is only received from https://discord.com/developers/docs/resources/guild#get-guild with the `with_counts` query parameter set to `true`**
- `approximatePresenceCount`: **This field is only received from https://discord.com/developers/docs/resources/guild#get-guild with the `with_counts` query parameter set to `true`**
- `welcomeScreen`: The welcome screen of a Community guild, shown to new members
- `nsfwLevel`: The nsfw level of the guild
- `stickers`: Custom guild stickers
- `premiumProgressBarEnabled`: Whether the guild has the boost progress bar enabled.
- `hubType`: The type of Student Hub the guild is

## `guild.getAuditLog(options)`

- options [`<RESTGetAPIAuditLogQuery>`](https://discord.com/developers/docs/resources/audit-log#get-guild-audit-log)

Returns [`Promise<APIAuditLog>`](https://discord.com/developers/docs/resources/audit-log#audit-log-object-audit-log-structure)

## `guild.sendMessage(channelId, options)`

- channelId [`<Snowflake>`](https://discord.com/developers/docs/reference#snowflakes) The Discord channel ID in a Discord server.
- options [`<RESTPostAPIChannelMessageJSONBody>`](https://discord.com/developers/docs/resources/channel#create-message)

## `guild.getMessages(channelId, options)`

- channelId [`<Snowflake>`](https://discord.com/developers/docs/reference#snowflakes) The Discord channel ID in a Discord server.
- options [`<RESTGetAPIChannelMessagesQuery>`](https://discord.com/developers/docs/resources/channel#get-channel-messages)

Returns [`Promise<RESTGetAPIChannelMessagesResult>`](https://discord.com/developers/docs/resources/channel#get-channel-messages)

## `guild.getChannel(channelId)`

- channelId [`<Snowflake>`](https://discord.com/developers/docs/reference#snowflakes) The Discord channel ID in a Discord server.

Returns [`Promise<APIChannel>`](https://discord.com/developers/docs/resources/channel#get-channel)