import type { Snowflake } from "discord-api-types/v9";
import BigInt from 'big-integer';

/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permission-type
 */
export enum ApplicationCommandPermissionType {
    Role = 1,
    User = 2,
    Channel = 3
}
/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permissions-constants
 */
export const APIApplicationCommandPermissionsConstant = {
	Everyone: (guildId: string): Snowflake => String(guildId),
	AllChannels: (guildId: string): Snowflake => String(BigInt(guildId).subtract(BigInt('1'))),
};
