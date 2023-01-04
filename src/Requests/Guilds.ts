import type { Snowflake, RESTGetAPIGuildQuery, RESTGetAPIAuditLogQuery, RESTPostAPIGuildsJSONBody } from "discord-api-types/v9";
import { HttpRequestMethod } from "../factory/Resources";
import { GUILD, GUILDS, GUILD_AUDIT_LOGS, GUILD_MEMBER } from "../factory/Endpoints";
import * as querystring from 'querystring';
import request from "../factory/request";

/**
 * https://discord.com/developers/docs/resources/guild#get-guild
 * @param guildId
 * @param options
 * @param BOT_TOKEN
 * @param callback
 * @returns
 */
/** @internal */
export function GetGuild(guildId: Snowflake, options: RESTGetAPIGuildQuery): Promise<string> {
  const method = HttpRequestMethod.GET;
  let path = GUILD(guildId);

  if (typeof options === 'object') path += '?' + querystring.stringify(options as any);

  return request(path, method);
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
export function GetGuildAuditLog(guildId: Snowflake, options: RESTGetAPIAuditLogQuery): Promise<string> {
  const method = HttpRequestMethod.GET;
  let path = GUILD_AUDIT_LOGS(guildId);

  if (typeof options === 'object') path += '?' + querystring.stringify(options as any);

  return request(path, method);
}

/** @internal */
export function getGuildMember (guildId: Snowflake, userId: Snowflake) {
  const method = HttpRequestMethod.GET;
  const path = GUILD_MEMBER(guildId, userId);
  return request(path, method);
};

/** @internal */
export function CreateGuild (options: RESTPostAPIGuildsJSONBody) {
  const method = HttpRequestMethod.POST;
  return request(GUILDS, method, options);
};

/** @internal */
export function DeleteGuild (guildId: Snowflake) {
  const method = HttpRequestMethod.DELETE;
  return request(GUILD(guildId), method);
};