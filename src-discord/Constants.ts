import { Debug } from "./debug";

export const API_VERSION = 9;
export const BASE_URL = "/api/v" + API_VERSION;
export const CDN_URL = "https://cdn.discordapp.com";
export const CLIENT_URL = "https://discord.com";

export const Package = { homepage: "http://localhost:3000", version: "1.0.0", };
export const UserAgent = { ag: 'cpprestsdk', version: '2.9.0' };

export const ServerNetDebug = new Debug('server-net');
export const NodeDebug = new Debug('node');

export type InternalCallback = (url: string, body: object, method: HttpRequestMethod, BOT_TOKEN: string) => Promise<string>;

export enum HttpRequestMethod {
  /**
   * The GET method requests a representation of the specified resource. Requests using GET should only retrieve data.
   */
  GET = "GET",
  /**
   * The POST method submits an entity to the specified resource, often causing a change in state or side effects on the server.
   */
  POST = "POST",
  /**
   * The PUT method replaces all current representations of the target resource with the request payload.
   */
  PUT = "PUT",
  /**
   * The DELETE method deletes the specified resource.
   */
  DELETE = "DELETE",
}