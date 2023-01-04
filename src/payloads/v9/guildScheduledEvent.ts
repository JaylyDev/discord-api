/**
 * https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-entity-types
 */
export enum GuildScheduledEventEntityType {
    StageInstance = 1,
    Voice = 2,
    External = 3
}
/**
 * https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-status
 */
export enum GuildScheduledEventStatus {
    Scheduled = 1,
    Active = 2,
    Completed = 3,
    Canceled = 4
}
/**
 * https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-privacy-level
 */
export enum GuildScheduledEventPrivacyLevel {
    /**
     * The scheduled event is only accessible to guild members
     */
    GuildOnly = 2
}
