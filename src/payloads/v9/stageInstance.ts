/**
 * https://discord.com/developers/docs/resources/stage-instance#stage-instance-object-privacy-level
 */
export enum StageInstancePrivacyLevel {
    /**
     * The stage instance is visible publicly, such as on stage discovery
     * @deprecated
     */
    Public = 1,
    /**
     * The stage instance is visible to only guild members
     */
    GuildOnly = 2
}
