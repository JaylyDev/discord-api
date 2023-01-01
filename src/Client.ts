import type { RESTGetAPIGuildQuery, RESTGetAPIGuildResult, RESTPostAPIChannelMessageJSONBody, RESTPostAPIGuildsJSONBody, Snowflake } from 'discord-api-types/v9';
import { CreateGuild, DeleteGuild, GetGuild } from './factory/Requests/Guilds';
import { Guild } from './Guild';
import { environ } from './factory';

/**
 * A class that wraps the state of a Discord guild.
 */
export class GuildOperation {
  /**
   * Get infomation about discord server
   * @param guildId 
   * @param options get guild options
   * @returns Guild object
   */
  public async get(guildId: Snowflake, options?: RESTGetAPIGuildQuery) {
    const rawResponse: string = await GetGuild(guildId, options);
    const guildResponse: RESTGetAPIGuildResult = JSON.parse(rawResponse);
    return new Guild(guildResponse);
  };
  /**
   * Create a new guild. Returns a guild object on success.
   * This function can be used only by bots in less than 10 guilds.
   * @param options options for creating a new guild
   */
  public async create(options: RESTPostAPIGuildsJSONBody) {
    /**
     * Returns a guild object on success.
     */
    const rawResponse: string = await CreateGuild(options);
    const guildResponse: RESTGetAPIGuildResult = JSON.parse(rawResponse);
    return new Guild(guildResponse);
  };
  /**
   * Delete a guild permanently. User must be owner.
   */
  public async delete(guildId: Snowflake): Promise<boolean> {
    try {
      await DeleteGuild(guildId);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
};

/**
 * Represents a client connection that connects to Discord.
 * This class is used to authenticate and interact with the Discord API.
 */
export class Client {
  /** @internal */
  private set token(value: string) {
    environ.DISCORD_TOKEN = value;
  };

  /**
   * A class that wraps the state of a Discord guild.
   */
  public readonly guild = new GuildOperation();

  /**
   * Creates a client
   * @param token Discord bot token. **Do not share it with anyone.**
   */
  constructor(token: string) {
    this.token = token;
  };
};