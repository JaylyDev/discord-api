import type { Snowflake, RESTGetAPIGuildQuery, RESTGetAPIAuditLogQuery } from "discord-api-types/v9";
import { HttpRequestMethod } from "../Constants";
import { CHANNEL, GUILD, GUILD_AUDIT_LOGS } from "../Endpoints";
import { InternalCallback } from "../Constants";

/**
 * https://discord.com/developers/docs/resources/guild#get-guild
 * @param guildId
 * @param options
 * @param BOT_TOKEN
 * @param callback
 * @returns
 */
export function GetGuild(guildId: Snowflake, options: RESTGetAPIGuildQuery, BOT_TOKEN: string, callback: InternalCallback): Promise<string> {
  const method = HttpRequestMethod.GET;
  const path = GUILD(guildId);
  return callback(path, options, method, BOT_TOKEN);
}

/**
 * Returns an audit log object for the guild. Requires the {@link [VIEW_AUDIT_LOG](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags)} permission.
 */
export function GetGuildAuditLog(guildId: Snowflake, options: RESTGetAPIAuditLogQuery, BOT_TOKEN: string, callback: InternalCallback): Promise<string> {
  const method = HttpRequestMethod.GET;
  const path = GUILD_AUDIT_LOGS(guildId);
  return callback(path, options, method, BOT_TOKEN);
}

export function GetChannel(channelId: Snowflake, BOT_TOKEN: string, callback: InternalCallback) {
  const method = HttpRequestMethod.GET;
  const path = CHANNEL(channelId);
  return callback(path, undefined, method, BOT_TOKEN);
}
