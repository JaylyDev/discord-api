import { BASE_URL, Package, CLIENT_URL, NodeDebug } from '../src-discord/Constants';
import { HttpRequestMethod } from '../src-discord/Constants';
import Axios, { AxiosRequestConfig } from 'axios';

/**
* Sends request to discord using raw HTTP requests
* @param url
* url after https://discord.com/api/v{version_number}, for example `/channels/{channel.id}`
* @param body
* JSON body, check https://discord.com/developers/docs
*/
export default async function fetch(url: string, method: HttpRequestMethod, BOT_TOKEN: string, body?: object): Promise<string> {
  const fetchUrl = CLIENT_URL + BASE_URL + url;
  const options: AxiosRequestConfig = {
    headers: {
      'Authorization': 'Bot ' + BOT_TOKEN,
      'User-Agent': `DiscordBot (${Package.homepage}, ${Package.version}) Node.js/${process.version}`,
      'Content-Type': 'application/json',
      'Accept-Encoding': 'utf-8',
      'Accept': 'text/plain'
    },
    url: fetchUrl,
    method: method,
    data: body
  };

  NodeDebug.log(`${options.method} ${options.url}`);
  const response = await Axios.request(options);

  if (typeof response.data === 'object') return JSON.stringify(response.data);
  return response.data;
}