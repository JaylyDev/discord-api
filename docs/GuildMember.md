# GuildMember class

Infomation about a specified user in a discord server.

## Discord API GuildMember Results

Returns the entire guild member object structure provided by Discord API.

https://discord.com/developers/docs/resources/guild#guild-member-object

- `user?: APIUser` - The user this guild member represents
- `nick?: string | null` - This users guild nickname
- `avatar?: string | null` - The member's guild avatar hash
- `roles: Snowflake[]` - Array of role object ids. See https://discord.com/developers/docs/topics/permissions#role-object
- `joined_at: string` - When the user joined the guild
- `premium_since?: string | null` - When the user started boosting the guild. See https://support.discord.com/hc/articles/360028038352
- `deaf: boolean` - Whether the user is deafened in voice channels
- `mute: boolean` - Whether the user is muted in voice channels
- `pending?: boolean` - Whether the user has not yet passed the guild's Membership Screening requirements *Default: `false`.*
- `communication_disabled_until?: string | null` - Timestamp of when the time out will be removed until then, they cannot interact with the guild

## `user.getJoinDate()`

Get the time and date the user joined Discord

Returns `Date`
