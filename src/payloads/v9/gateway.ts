/**
 * Types extracted from
 *  - https://discord.com/developers/docs/topics/gateway
 *  - https://discord.com/developers/docs/topics/gateway-events
 */
export enum PresenceUpdateStatus {
    Online = "online",
    DoNotDisturb = "dnd",
    Idle = "idle",
    /**
     * Invisible and shown as offline
     */
    Invisible = "invisible",
    Offline = "offline"
}
/**
 * @unstable This enum is currently not documented by Discord but has known values which we will try to keep up to date.
 * Values might be added or removed without a major version bump.
 */
export enum ActivityPlatform {
    Desktop = "desktop",
    Xbox = "xbox",
    Samsung = "samsung",
    IOS = "ios",
    Android = "android",
    Embedded = "embedded",
    PS4 = "ps4",
    PS5 = "ps5"
}
/**
 * https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-types
 */
export enum ActivityType {
    /**
     * Playing {game}
     */
    Playing = 0,
    /**
     * Streaming {details}
     */
    Streaming = 1,
    /**
     * Listening to {name}
     */
    Listening = 2,
    /**
     * Watching {details}
     */
    Watching = 3,
    /**
     * {emoji} {details}
     */
    Custom = 4,
    /**
     * Competing in {name}
     */
    Competing = 5
}
/**
 * https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-flags
 */
export enum ActivityFlags {
    Instance = 1,
    Join = 2,
    Spectate = 4,
    JoinRequest = 8,
    Sync = 16,
    Play = 32,
    PartyPrivacyFriends = 64,
    PartyPrivacyVoiceChannel = 128,
    Embedded = 256
}
