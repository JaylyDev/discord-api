import { Snowflake, RESTPostAPIChannelMessageJSONBody, RESTGetAPIChannelMessagesQuery, ChannelType, RESTGetAPIChannelResult, GuildTextChannelType } from 'discord-api-types/v9';
import { DiscordAPIError, HttpRequestMethod } from '../factory/Resources';
import { CHANNEL, CHANNEL_MESSAGE, CHANNEL_MESSAGES, GUILD_CHANNELS } from '../factory/Endpoints';
import * as querystring from 'querystring';
import request from '../factory/request';
import { GuildTextChannel, DMChannel, GuildVoiceChannel, GroupDMChannel, GuildCategoryChannel, GuildAnnouncementChannel, ThreadChannel, GuildStageVoiceChannel, GuildForumChannel, Channel } from '../factory/Channels';

/** @internal */
export function CreateMessage(channelId: Snowflake, options: RESTPostAPIChannelMessageJSONBody): Promise<string> {
  const method = HttpRequestMethod.POST;
  const path = CHANNEL_MESSAGES(channelId);

  return request(path, method, options);
};

/** @internal */
export function GetChannelMessages(channelId: Snowflake, options: RESTGetAPIChannelMessagesQuery) {
  const method = HttpRequestMethod.GET;
  let path = CHANNEL_MESSAGES(channelId);
  if (typeof options === 'object') path += '?' + querystring.stringify(options as any);

  return request(path, method);
};

/** @internal */
export function DeleteChannel(channelId: Snowflake) {
  const method = HttpRequestMethod.DELETE;
  const path = CHANNEL(channelId);

  return request(path, method);
};

/** @internal */
export function DeleteMessage(channelId: Snowflake, messageId: Snowflake) {
  const method = HttpRequestMethod.DELETE;
  const path = CHANNEL_MESSAGE(channelId, messageId);

  return request(path, method);
};

/** @internal */
export async function GetChannel(channelId: Snowflake): Promise<Channel> {
  const method = HttpRequestMethod.GET;
  const path = CHANNEL(channelId);
  const response: string = await request(path, method);

  const result = JSON.parse(response) as RESTGetAPIChannelResult;

  switch (result.type) {
    case ChannelType.GuildText:
      return new GuildTextChannel(result);
    case ChannelType.DM:
      return new DMChannel(result);
    case ChannelType.GuildVoice:
      return new GuildVoiceChannel(result);
    case ChannelType.GroupDM:
      return new GroupDMChannel(result);
    case ChannelType.GuildCategory:
      return new GuildCategoryChannel(result);
    case ChannelType.GuildAnnouncement:
      return new GuildAnnouncementChannel(result);
    case ChannelType.AnnouncementThread || ChannelType.PublicThread || ChannelType.PrivateThread:
      return new ThreadChannel(result);
    case ChannelType.GuildStageVoice:
      return new GuildStageVoiceChannel(result);
    case ChannelType.GuildForum:
      return new GuildForumChannel(result);

    default:
      throw new DiscordAPIError(`Could not identify type of channel: ${result.type}`);
  }
};

export function GetGuildChannels(guildId: Snowflake) {
  const method = HttpRequestMethod.GET;
  const path = GUILD_CHANNELS(guildId);
  return request(path, method);
};