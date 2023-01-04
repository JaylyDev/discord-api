import { Package, UserAgent, BASE_URL, CLIENT_URL, ServerNetDebug, } from "./factory/Constants";
import { HttpRequestMethod } from "./factory/Constants";
import { http, HttpHeader, HttpRequest } from "@minecraft/server-net";
import { DeepCopy } from "./deep-copy";

enum HTTPResponseCode {
  /*
   * The request completed successfully.
   */
  OK = 200,
  /*
   * The entity was created successfully.
   */
  Created = 201,
  /*
   * The request completed successfully but returned no content.
   */
  NoContent = 204,
  /*
   * The entity was not modified (no action was taken).
   */
  NotModified = 304,
  /*
   * The request was improperly formatted, or the server couldn't understand it.
   */
  BadRequest = 400,
  /*
   * The Authorization header was missing or invalid.
   */
  Unauthorized = 401,
  /*
   * The Authorization token you passed did not have permission to the resource.
   */
  Forbidden = 403,
  /*
   * The resource at the location specified doesn't exist.
   */
  NotFound = 404,
  /*
   * The HTTP method used is not valid for the location specified.
   */
  MethodNotAllowed = 405,
  /*
   * You are being rate limited, see Rate Limits.
   */
  TooManyRequests = 429,
  /*
   * There was not a gateway available to process your request. Wait a bit and retry.
   */
  GatewayUnavailable = 502,
  /*
   * The server had an error processing your request (these are rare).
   */
  ServerError = 503,
};

const SuccessResponseCodes: HTTPResponseCode[] = [
  HTTPResponseCode.OK,
  HTTPResponseCode.Created,
  HTTPResponseCode.NoContent,
];

/**
 * Sends request to discord using raw HTTP requests
 * @param url
 * url after https://discord.com/api/v{version_number}, for example `/channels/{channel.id}`
 * @param body
 * JSON body, check https://discord.com/developers/docs
 * @internal
 */
export default async function fetch(
  url: string,
  method: HttpRequestMethod,
  BOT_TOKEN: string,
  body?: object
): Promise<string> {
  const fetchUrl = CLIENT_URL + BASE_URL + url;
  const options = new HttpRequest(fetchUrl);
  const headers: HttpHeader[] = [
    new HttpHeader("Authorization", "Bot " + BOT_TOKEN),
    new HttpHeader(
      "User-Agent",
      `DiscordBot (${Package.homepage}, ${Package.version}) ${UserAgent.ag}/${UserAgent.version}`
    ),
    new HttpHeader("Content-Type", "application/json"),
    new HttpHeader("Accept-Encoding", "utf-8"),
    new HttpHeader("Accept", "text/plain"),
  ];

  options.headers = headers;
  options.method = method;
  if (typeof body === "object") options.body = JSON.stringify(body);

  const response = await http.request(options);

  if (SuccessResponseCodes.includes(response.status)) {
    ServerNetDebug.error(
      `Failed to ${options.method} ${options.uri}. Response: ${JSON.stringify(
        DeepCopy(response)
      )}`
    );
    throw new Error(`Failed to ${options.method} ${options.uri}`);
  } else {
    ServerNetDebug.log(`${options.method} ${options.uri}`);
    return response.body;
  }
}
