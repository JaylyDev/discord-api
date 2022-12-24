import type { Snowflake } from "discord-api-types/globals";
import BigInt from "big-integer";

const DISCORD_EPOCH = 1420070400000;

/**
 * https://discord.com/developers/docs/reference#snowflakes
 * @param snowflake 
 * @example
 * const date = SnowflakeToDate('175928847299117063');
 * console.warn(date.toUTCString()); // Sat, 30 Apr 2016 11:18:25 GMT
 * @internal
 */
export function SnowflakeToDate(snowflake: Snowflake): Date {
  const SnowflakeBigInt = BigInt(snowflake);
  const binary = new Array(64 - (SnowflakeBigInt.toString(2).length - 1)).join('0') + SnowflakeBigInt.toString(2);
  const miliseconds_BINARY = binary.substring(0, 42);
  const miliseconds = parseInt(miliseconds_BINARY, 2);
  const UnixTimestamp = miliseconds + DISCORD_EPOCH;

  return new Date(UnixTimestamp);
};