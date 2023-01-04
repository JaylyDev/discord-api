import type { RESTGetAPIGuildQuery, RESTGetAPIGuildResult, RESTPostAPIChannelMessageJSONBody, Snowflake } from 'discord-api-types/v9';
import { GetGuild } from './factory/Requests/Guilds';
import { Guild } from './Guild';
import fetch from './net-request';
import { CreateMessage } from './factory/Requests/Channels';

/**
 * Represents a client connection that connects to Discord.
 * This class is used to authenticate and interact with the Discord API.
 */
export class Client {
  /** @internal */
  private readonly token: string;

  /**
   * Get infomation about discord server
   * @param guildId 
   * @param options get guild options
   * @returns Guild object
   */
  public async getGuild(guildId: Snowflake, options?: RESTGetAPIGuildQuery) {
    const rawResponse: string = await GetGuild(guildId, options, this.token, fetch);
    const guildResponse: RESTGetAPIGuildResult = JSON.parse(rawResponse);
    return new Guild(guildResponse, this);
  };

  /**
   * Send a message in a channel
   * @param channelId 
   * @param options 
   */
  public sendMessage(channelId: Snowflake, options: RESTPostAPIChannelMessageJSONBody) {
    CreateMessage(channelId, options, this.token, fetch);
  };

  /**
   * Creates a client
   * @param token Discord bot token. **Do not share it with anyone.**
   */
  constructor (token: string) {
    this.token = token;
  };
};