import type { RESTGetAPIGuildQuery, RESTGetAPIGuildResult, RESTPostAPIGuildsJSONBody, Snowflake } from "discord-api-types/v9";
import { GetChannel, DeleteChannel } from './Requests/Channels';
import { CreateGuild, DeleteGuild, GetGuild } from './Requests/Guilds';
import { DiscordAPIError, environ } from './factory/Resources';
import { Guild } from './Guild';
import { Channel, ChannelClassType } from './factory/Channels';
import { ChannelType } from "./payloads";

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
    } catch {
      throw new DiscordAPIError(`Fail to delete guild '${guildId}'`);
    };
  };
};
/**
 * A class that wraps the state of a Discord channel.
 */
export class ChannelOperation {
  /**
   * Get infomation about discord channel from discord servers the bot is in
   * @param channelId 
   * @param options get channel options
   * @returns channel object
   */
  public async get<T extends ChannelType>(channelId: Snowflake, channelType?: T): Promise<ChannelClassType[T]> {
    const channel = await GetChannel(channelId) as ChannelClassType[T];
    if (!channel) throw new DiscordAPIError(`Channel '${channelId}' not found`);
    else if (typeof channelType === 'number' && channel.type !== channelType) throw new DiscordAPIError(`The type of the channel '${ChannelType[channel.type]}' is not the same as expected channel type '${ChannelType[channelType]}'.`);
    else return channel;
  };
  /**
   * Delete a channel, or close a private message.
   * Requires the `MANAGE_CHANNELS` permission for the guild, or `MANAGE_THREADS` if the channel is a thread.
   * Deleting a category does not delete its child channels,
   * they will have their `parent_id` removed and a Channel Update Gateway event will fire for each of them. 
   * Returns a channel object on success.
   */
  public async delete(channelId: Snowflake): Promise<Channel> {
    try {
      const rawResponse = await DeleteChannel(channelId);
      return JSON.parse(rawResponse) as Channel;
    } catch (error) {
      throw new DiscordAPIError(`Fail to delete channel '${channelId}'`);
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
   * A class that wraps the state of a Discord guild.
   */
  public readonly channel = new ChannelOperation();

  /**
   * Creates a client
   * @param token Discord bot token. **Do not share it with anyone.**
   */
  constructor(token: string) {
    this.token = token;
  };
};