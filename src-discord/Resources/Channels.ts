import type { Snowflake, RESTPostAPIChannelMessageJSONBody, RESTGetAPIChannelMessagesQuery } from 'discord-api-types/v9';
import { HttpRequestMethod } from '../Constants';
import { CHANNEL, CHANNEL_MESSAGES } from '../Endpoints';
import { InternalCallback } from '../Constants';
import * as querystring from 'querystring';

/** @internal */
export function CreateMessage (channelId: Snowflake, options: RESTPostAPIChannelMessageJSONBody, BOT_TOKEN: string, callback: InternalCallback): Promise<string> {
  const method = HttpRequestMethod.POST;
  const path = CHANNEL_MESSAGES(channelId);

  return callback(path, method, BOT_TOKEN, options);
};

/** @internal */
export function GetChannelMessages (channelId: Snowflake, options: RESTGetAPIChannelMessagesQuery, BOT_TOKEN: string, callback: InternalCallback) {
  const method = HttpRequestMethod.GET;
  let path = CHANNEL_MESSAGES(channelId);
  if (typeof options === 'object') path += '?' + querystring.stringify(options as any);

  return callback(path, method, BOT_TOKEN);
};

/** @internal */
export function DeleteChanel (channelId: Snowflake, BOT_TOKEN: string, callback: InternalCallback) {
  const method = HttpRequestMethod.DELETE;
  const path = CHANNEL(channelId);

  return callback(path, method, BOT_TOKEN);
};