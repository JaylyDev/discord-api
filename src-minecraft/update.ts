import { ServerNetDebug, version } from "../src-discord/Constants";
import { http, HttpRequestMethod } from "@minecraft/server-net";
import type * as npm from '@npm/types';
import { DeepCopy } from "./deep-copy";
import * as semver from 'semver';
import { Debug } from "../src-discord/debug";
import { world } from '@minecraft/server';

const module_name = 'minecraft-extra';
const registry = 'https://registry.npmjs.org/';
const npmDebug = new Debug('npm');

/**
 * Check if update available for the package 
 * @internal
 */
export async function getUpdate () {
  const url = registry + module_name;
  const response = await http.get(url);

  if (response.status !== 200) {
    ServerNetDebug.error(`Failed to ${HttpRequestMethod.GET} ${url}. Response: ${JSON.stringify(DeepCopy(response))}`);
    return;
  };

  ServerNetDebug.log(`${HttpRequestMethod.GET} ${url}`);
  const packument: npm.Packument = JSON.parse(response.body);
  const LatestVersion = packument["dist-tags"].latest;

  // 0 if v1 == v2
  // 1 if v1 is greater
  // -1 if v2 is greater.
  const result = semver.compare(version, LatestVersion);
  if (result === -1) {
    const message = 'New update available. Please update the package to version ' + LatestVersion;
    npmDebug.warn(message);
    world.say(message);
  }
  else npmDebug.log(`Current version ${version} >= latest version ${LatestVersion}`);
};