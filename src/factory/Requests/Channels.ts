import type { Snowflake, RESTPostAPIChannelMessageJSONBody, RESTGetAPIChannelMessagesQuery } from 'discord-api-types/v9';
import { HttpRequestMethod } from '../Resources';
import { CHANNEL, CHANNEL_MESSAGES } from '../Endpoints';
import * as querystring from 'querystring';
import request from '../request';

/** @internal */
export function CreateMessage (channelId: Snowflake, options: RESTPostAPIChannelMessageJSONBody): Promise<string> {
  const method = HttpRequestMethod.POST;
  const path = CHANNEL_MESSAGES(channelId);

  return request(path, method, options);
};

/** @internal */
export function GetChannelMessages (channelId: Snowflake, options: RESTGetAPIChannelMessagesQuery) {
  const method = HttpRequestMethod.GET;
  let path = CHANNEL_MESSAGES(channelId);
  if (typeof options === 'object') path += '?' + querystring.stringify(options as any);

  return request(path, method);
};

/** @internal */
export function DeleteChanel (channelId: Snowflake) {
  const method = HttpRequestMethod.DELETE;
  const path = CHANNEL(channelId);

  return request(path, method);
};