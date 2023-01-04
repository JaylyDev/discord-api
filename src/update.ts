import { Package, ServerNetDebug, version, npmDebug, packageName } from "./factory/Resources";
import { http, HttpRequestMethod } from "@minecraft/server-net";
import type * as npm from '@npm/types';
import { DeepCopy } from "./factory/Resources";
import * as semver from 'semver';

/**
 * Check if update available for the package 
 * @internal
 */
async function getUpdate () {
  const url = Package.homepage;
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
    
    // attempt to import @minecraft/server module
    const { world } = await import('@minecraft/server');
    world.say(message);
  }
  else npmDebug.log(`Current version ${version} >= latest version ${LatestVersion}`);
};

/**
 * get package download speed
 */
async function testOnly_packageDownload () {
  const startTime = Date.now();
  const response = await http.get(`https://registry.npmjs.org/${packageName}/-/${packageName}-${Package.version}.tgz`);
  const timeTaken = Date.now() - startTime;

  const ContentLength = response.headers.find(({key}) => key === 'content-length');
  return parseInt(String(ContentLength.value ?? 0)) / (timeTaken / 1000);
};

// getUpdate();
// (async () => {
//   const DownloadSpeed = await testOnly_packageDownload();
//   const kbps = (DownloadSpeed / 1000).toFixed(3);

//   if (DownloadSpeed < 100000) ServerNetDebug.warn(`Slow internet connectivity detected. (${kbps} kbps)`);
//   else ServerNetDebug.log('Good internet connectivity, should be able to interact with Discord API.');
// })();