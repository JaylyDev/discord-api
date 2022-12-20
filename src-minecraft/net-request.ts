import { Package, UserAgent, BASE_URL, CLIENT_URL, ServerNetDebug, packageName, npmDebug } from '../src-discord/Constants';
import { HttpRequestMethod } from '../src-discord/Constants';
import { http, HttpHeader, HttpRequest } from '@minecraft/server-net';
import { DeepCopy } from './deep-copy';

/**
* Sends request to discord using raw HTTP requests
* @param url
* url after https://discord.com/api/v{version_number}, for example `/channels/{channel.id}`
* @param body
* JSON body, check https://discord.com/developers/docs
* @internal
*/
export default async function fetch(url: string, method: HttpRequestMethod, BOT_TOKEN: string, body?: object): Promise<string> {
  const fetchUrl = CLIENT_URL + BASE_URL + url;
  const options = new HttpRequest(fetchUrl);
  const headers: HttpHeader[] = [
    new HttpHeader('Authorization', 'Bot ' + BOT_TOKEN),
    new HttpHeader('User-Agent', `DiscordBot (${Package.homepage}, ${Package.version}) ${UserAgent.ag}/${UserAgent.version}`),
    new HttpHeader('Content-Type', 'application/json'),
    new HttpHeader('Accept-Encoding', 'utf-8'),
    new HttpHeader('Accept', 'text/plain')
  ];

  options.headers = headers;
  options.method = method;
  if (typeof body === 'object') options.body = JSON.stringify(body);

  const response = await http.request(options);

  if (response.status !== 200) {
    ServerNetDebug.error(`Failed to ${options.method} ${options.uri}. Response: ${JSON.stringify(DeepCopy(response))}`);
    throw new Error(`Failed to ${options.method} ${options.uri}`);
  }
  else {
    ServerNetDebug.log(`${options.method} ${options.uri}`);
    return response.body;
  };
}