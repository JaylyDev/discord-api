/**
 * Types extracted from https://discord.com/developers/docs/resources/application
 */
/**
 * https://discord.com/developers/docs/resources/application#application-object-application-flags
 */
export enum ApplicationFlags {
    /**
     * @unstable
     */
    EmbeddedReleased = 2,
    /**
     * @unstable
     */
    ManagedEmoji = 4,
    /**
     * @unstable
     */
    GroupDMCreate = 16,
    /**
     * @unstable
     */
    RPCHasConnected = 2048,
    /**
     * Intent required for bots in 100 or more servers to receive `presence_update` events
     */
    GatewayPresence = 4096,
    /**
     * Intent required for bots in under 100 servers to receive `presence_update` events, found in Bot Settings
     */
    GatewayPresenceLimited = 8192,
    /**
     * Intent required for bots in 100 or more servers to receive member-related events like `guild_member_add`.
     * See list of member-related events [under `GUILD_MEMBERS`](https://discord.com/developers/docs/topics/gateway#list-of-intents)
     */
    GatewayGuildMembers = 16384,
    /**
     * Intent required for bots in under 100 servers to receive member-related events like `guild_member_add`, found in Bot Settings.
     * See list of member-related events [under `GUILD_MEMBERS`](https://discord.com/developers/docs/topics/gateway#list-of-intents)
     */
    GatewayGuildMembersLimited = 32768,
    /**
     * Indicates unusual growth of an app that prevents verification
     */
    VerificationPendingGuildLimit = 65536,
    /**
     * Indicates if an app is embedded within the Discord client (currently unavailable publicly)
     */
    Embedded = 131072,
    /**
     * Intent required for bots in 100 or more servers to receive [message content](https://support-dev.discord.com/hc/en-us/articles/4404772028055)
     */
    GatewayMessageContent = 262144,
    /**
     * Intent required for bots in under 100 servers to receive [message content](https://support-dev.discord.com/hc/en-us/articles/4404772028055),
     * found in Bot Settings
     */
    GatewayMessageContentLimited = 524288,
    /**
     * @unstable
     */
    EmbeddedFirstParty = 1048576,
    /**
     * Indicates if an app has registered global [application commands](https://discord.com/developers/docs/interactions/application-commands)
     */
    ApplicationCommandBadge = 8388608
}
/**
 * https://discord.com/developers/docs/resources/application-role-connection-metadata#application-role-connection-metadata-object-application-role-connection-metadata-type
 */
export enum ApplicationRoleConnectionMetadataType {
    /**
     * The metadata value (`integer`) is less than or equal to the guild's configured value (`integer`)
     */
    IntegerLessThanOrEqual = 1,
    /**
     * The metadata value (`integer`) is greater than or equal to the guild's configured value (`integer`)
     */
    IntegerGreaterThanOrEqual = 2,
    /**
     * The metadata value (`integer`) is equal to the guild's configured value (`integer`)
     */
    IntegerEqual = 3,
    /**
     * The metadata value (`integer`) is not equal to the guild's configured value (`integer`)
     */
    IntegerNotEqual = 4,
    /**
     * The metadata value (`ISO8601 string`) is less than or equal to the guild's configured value (`integer`; days before current date)
     */
    DatetimeLessThanOrEqual = 5,
    /**
     * The metadata value (`ISO8601 string`) is greater than or equal to the guild's configured value (`integer`; days before current date)
     */
    DatetimeGreaterThanOrEqual = 6,
    /**
     * The metadata value (`integer`) is equal to the guild's configured value (`integer`; `1`)
     */
    BooleanEqual = 7,
    /**
     * The metadata value (`integer`) is not equal to the guild's configured value (`integer`; `1`)
     */
    BooleanNotEqual = 8
}
