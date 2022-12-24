/**
 * @internal
 */
import { Debug } from "./debug";

/**
 * Discord API version used for the wrapper
 */
export const API_VERSION = 9;
/**
 * @internal
 */
export const BASE_URL = "/api/v" + API_VERSION;
/**
 * @internal
 */
export const CDN_URL = "https://cdn.discordapp.com";
/**
 * @internal
 */
export const CLIENT_URL = "https://discord.com";
/**
 * NPM Package version
 */
export const version = '1.0.5';
/**
 * discord-api submodule version
 */
export const moduleVersion = '0.0.5';
/**
 * @internal
 */
export const packageName = 'minecraft-extra';
/**
 * @internal
 */
export const Package = { homepage: "https://www.npmjs.com/package/" + packageName, version, };
/**
 * @internal
 */
export const UserAgent = { ag: 'cpprestsdk', version: '2.9.0' };
/**
 * @internal
 */
export const ServerNetDebug = new Debug('server-net');
/**
 * @internal
 */
export const NodeDebug = new Debug('node');
/**
 * @internal
 */
export const npmDebug = new Debug('npm');
/**
 * @internal
 */
export type InternalCallback = (url: string, method: HttpRequestMethod, BOT_TOKEN: string, body?: object) => Promise<string>;

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