import type { Snowflake, RESTGetAPIGuildQuery, RESTGetAPIAuditLogQuery } from "discord-api-types/v9";
import { HttpRequestMethod } from "../Constants";
import { CHANNEL, GUILD, GUILD_AUDIT_LOGS, GUILD_MEMBER } from "../Endpoints";
import { InternalCallback } from "../Constants";
import * as querystring from 'querystring';

/**
 * https://discord.com/developers/docs/resources/guild#get-guild
 * @param guildId
 * @param options
 * @param BOT_TOKEN
 * @param callback
 * @returns
 */
/** @internal */
export function GetGuild(guildId: Snowflake, options: RESTGetAPIGuildQuery, BOT_TOKEN: string, callback: InternalCallback): Promise<string> {
  const method = HttpRequestMethod.GET;
  let path = GUILD(guildId);

  if (typeof options === 'object') path += '?' + querystring.stringify(options as any);

  return callback(path, method, BOT_TOKEN);
}

/**
 * Returns an audit log object for the guild.
 * Requires the {@link [VIEW_AUDIT_LOG](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags)} permission.
 * @param guildId 
 * @param options 
 * @param BOT_TOKEN 
 * @param callback 
 * @returns Returns an audit log object for the guild.
 * @internal
 */
export function GetGuildAuditLog(guildId: Snowflake, options: RESTGetAPIAuditLogQuery, BOT_TOKEN: string, callback: InternalCallback): Promise<string> {
  const method = HttpRequestMethod.GET;
  let path = GUILD_AUDIT_LOGS(guildId);

  if (typeof options === 'object') path += '?' + querystring.stringify(options as any);

  return callback(path, method, BOT_TOKEN);
}

/** @internal */
export function GetChannel(channelId: Snowflake, BOT_TOKEN: string, callback: InternalCallback) {
  const method = HttpRequestMethod.GET;
  const path = CHANNEL(channelId);
  return callback(path, method, BOT_TOKEN);
}

/** @internal */
export function getGuildMember (guildId: Snowflake, userId: Snowflake, BOT_TOKEN: string, callback: InternalCallback) {
  const method = HttpRequestMethod.GET;
  const path = GUILD_MEMBER(guildId, userId);
  return callback(path, method, BOT_TOKEN);
};