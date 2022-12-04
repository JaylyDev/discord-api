import { Package, UserAgent, BASE_URL, CLIENT_URL, ServerNetDebug } from '../src-discord/Constants';
import { HttpRequestMethod } from '../src-discord/Constants';
import { http, HttpHeader, HttpRequest } from '@minecraft/server-net';
import DeepCopy from 'deep-copy';

export class STATUS_CODES {
  static 100 = 'Continue';
  static 101 = 'Switching Protocols';
  static 102 = 'Processing';
  static 103 = 'Early Hints';
  static 200 = 'OK';
  static 201 = 'Created';
  static 202 = 'Accepted';
  static 203 = 'Non-Authoritative Information';
  static 204 = 'No Content';
  static 205 = 'Reset Content';
  static 206 = 'Partial Content';
  static 207 = 'Multi-Status';
  static 208 = 'Already Reported';
  static 226 = 'IM Used';
  static 300 = 'Multiple Choices';
  static 301 = 'Moved Permanently';
  static 302 = 'Found';
  static 303 = 'See Other';
  static 304 = 'Not Modified';
  static 305 = 'Use Proxy';
  static 307 = 'Temporary Redirect';
  static 308 = 'Permanent Redirect';
  static 400 = 'Bad Request';
  static 401 = 'Unauthorized';
  static 402 = 'Payment Required';
  static 403 = 'Forbidden';
  static 404 = 'Not Found';
  static 405 = 'Method Not Allowed';
  static 406 = 'Not Acceptable';
  static 407 = 'Proxy Authentication Required';
  static 408 = 'Request Timeout';
  static 409 = 'Conflict';
  static 410 = 'Gone';
  static 411 = 'Length Required';
  static 412 = 'Precondition Failed';
  static 413 = 'Payload Too Large';
  static 414 = 'URI Too Long';
  static 415 = 'Unsupported Media Type';
  static 416 = 'Range Not Satisfiable';
  static 417 = 'Expectation Failed';
  static 421 = 'Misdirected Request';
  static 422 = 'Unprocessable Entity';
  static 423 = 'Locked';
  static 424 = 'Failed Dependency';
  static 425 = 'Too Early';
  static 426 = 'Upgrade Required';
  static 428 = 'Precondition Required';
  static 429 = 'Too Many Requests';
  static 431 = 'Request Header Fields Too Large';
  static 451 = 'Unavailable For Legal Reasons';
  static 500 = 'Internal Server Error';
  static 501 = 'Not Implemented';
  static 502 = 'Bad Gateway';
  static 503 = 'Service Unavailable';
  static 504 = 'Gateway Timeout';
  static 505 = 'HTTP Version Not Supported';
  static 506 = 'Variant Also Negotiates';
  static 507 = 'Insufficient Storage';
  static 508 = 'Loop Detected';
  static 509 = 'Bandwidth Limit Exceeded';
  static 510 = 'Not Extended';
  static 511 = 'Network Authentication Required';
};

/**
* Sends request to discord using raw HTTP requests
* @param url
* url after https://discord.com/api/v{version_number}, for example `/channels/{channel.id}`
* @param body
* JSON body, check https://discord.com/developers/docs
*/
export default async function fetch(url: string, body: object, method: HttpRequestMethod, BOT_TOKEN: string): Promise<string> {
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
  options.body = JSON.stringify(body);

  const response = await http.request(options);

  if (response.status !== 200) {
    ServerNetDebug.error(`Failed to ${options.method} ${options.uri}: statusCode ${response.status} ${STATUS_CODES[response.status]}`);
    throw new Error(`Failed to ${options.method} ${options.uri}. Status code: ${response.status} ${STATUS_CODES[response.status]}. Response: ${JSON.stringify(DeepCopy(response))}`);
  }
  else {
    ServerNetDebug.log(`${options.method} ${options.uri}`);
    return response.body;
  };
}