import { Snowflake, RESTPostAPIChannelMessageJSONBody, RESTGetAPIChannelMessagesQuery, ChannelType, RESTGetAPIChannelResult, GuildTextChannelType } from 'discord-api-types/v9';
import { HttpRequestMethod, ServerNetDebug } from '../Resources';
import { CHANNEL, CHANNEL_MESSAGES, GUILD_CHANNELS } from '../Endpoints';
import * as querystring from 'querystring';
import request from '../request';
import { GuildTextChannel, DMChannel, GuildVoiceChannel, GroupDMChannel, GuildCategoryChannel, NewsChannel, ThreadChannel, GuildStageVoiceChannel, GuildForumChannel } from '../Channels';

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
export function DeleteChanel(channelId: Snowflake) {
  const method = HttpRequestMethod.DELETE;
  const path = CHANNEL(channelId);

  return request(path, method);
};

/** @internal */
export async function GetChannel(channelId: Snowflake) {
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
      return new NewsChannel(result);
    case ChannelType.AnnouncementThread || ChannelType.PublicThread || ChannelType.PrivateThread:
      return new ThreadChannel(result);
    case ChannelType.GuildStageVoice:
      return new GuildStageVoiceChannel(result);
    case ChannelType.GuildForum:
      return new GuildForumChannel(result);

    default:
      ServerNetDebug.warn('Could not identify type of channel:', result.type);
      return result;
  }
};

export function GetGuildChannels(guildId: Snowflake) {
  const method = HttpRequestMethod.GET;
  const path = GUILD_CHANNELS(guildId);
  return request(path, method);
};

export type Channel = GuildTextChannel<GuildTextChannelType> | DMChannel | GuildVoiceChannel | GroupDMChannel | GuildCategoryChannel | NewsChannel | ThreadChannel | GuildStageVoiceChannel | GuildForumChannel;