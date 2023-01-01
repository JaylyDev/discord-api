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
export type InternalCallback = (url: string, method: HttpRequestMethod, body?: object) => Promise<string>;

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

/**
 * Clone the object using iteration
 * @param obj object
 * @internal
 */
export function DeepCopy(obj: object): object {
  if (obj === null || obj === undefined || typeof obj !== "object") {
    return obj;
  }
  if (obj instanceof Array) {
    var cloneA = [];
    for (var i = 0; i < obj.length; ++i) {
      cloneA[i] = DeepCopy(obj[i]);
    }
    return cloneA;
  }
  var cloneO = {};
  for (var e in obj) {
    cloneO[e] = DeepCopy(obj[e]);
  }
  return cloneO;
};

interface Dict<T> {
  [key: string]: T | undefined;
};

/**
 * The `environ` property returns an object containing the user environment.
 * See [`environ(7)`](http://man7.org/linux/man-pages/man7/environ.7.html).
 */
export const environ: Dict<string> = {};