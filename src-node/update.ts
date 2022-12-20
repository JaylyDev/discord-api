import { HttpRequestMethod, NodeDebug, Package, packageName, version } from "../src-discord/Constants";
import Axios from 'axios';
import type * as npm from '@npm/types';
import * as semver from 'semver';
import { Debug } from "../src-discord/debug";

const module_name = 'minecraft-extra';
const registry = 'https://registry.npmjs.org/';
const npmDebug = new Debug('npm');

/**
 * Check if update available for the package 
 * @internal
 */
async function getUpdate () {
  const url = registry + module_name;
  const response = await Axios.get(url);

  if (response.status !== 200) {
    NodeDebug.error(`Failed to ${HttpRequestMethod.GET} ${url}. Response: ${JSON.stringify(response)}`);
    return;
  };

  NodeDebug.log(`${HttpRequestMethod.GET} ${url}`);
  const packument: npm.Packument = typeof response.data == 'object' ? response.data : JSON.parse(response.data);
  const LatestVersion = packument["dist-tags"].latest;

  // 0 if v1 == v2
  // 1 if v1 is greater
  // -1 if v2 is greater.
  const result = semver.compare(version, LatestVersion);
  if (result === -1) {
    const message = 'New update available. Please update the package to version ' + LatestVersion;
    npmDebug.warn(message);
  }
  else npmDebug.log(`Current version ${version} >= latest version ${LatestVersion}`);
};

/**
 * @internal
 * get package download speed
 */
async function testOnly_packageDownload () {
  const startTime = Date.now();
  const response = await Axios.get(`https://registry.npmjs.org/${packageName}/-/${packageName}-${Package.version}.tgz`);
  const timeTaken = Date.now() - startTime;

  const ContentLength = typeof response.headers.getContentLength === 'function' ? response.headers.getContentLength() : response.headers.getContentLength;
  return parseInt(String(ContentLength)) / (timeTaken / 1000);
};

getUpdate();
(async () => {
  const DownloadSpeed = await testOnly_packageDownload();
  const kbps = (DownloadSpeed / 1000).toFixed(3);

  if (DownloadSpeed < 100000) NodeDebug.warn(`Slow internet connectivity detected. (${kbps} kbps)`);
  else NodeDebug.log(`Good internet connectivity, should be able to interact with Discord API.`);
})();