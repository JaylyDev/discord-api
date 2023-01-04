/**
 * Types extracted from https://discord.com/developers/docs/resources/guild
 */
/**
 * https://discord.com/developers/docs/resources/guild#guild-object-default-message-notification-level
 */
export enum GuildDefaultMessageNotifications {
    AllMessages = 0,
    OnlyMentions = 1
}
/**
 * https://discord.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level
 */
export enum GuildExplicitContentFilter {
    Disabled = 0,
    MembersWithoutRoles = 1,
    AllMembers = 2
}
/**
 * https://discord.com/developers/docs/resources/guild#guild-object-mfa-level
 */
export enum GuildMFALevel {
    None = 0,
    Elevated = 1
}
/**
 * https://discord.com/developers/docs/resources/guild#guild-object-guild-nsfw-level
 */
export enum GuildNSFWLevel {
    Default = 0,
    Explicit = 1,
    Safe = 2,
    AgeRestricted = 3
}
/**
 * https://discord.com/developers/docs/resources/guild#guild-object-verification-level
 */
export enum GuildVerificationLevel {
    /**
     * Unrestricted
     */
    None = 0,
    /**
     * Must have verified email on account
     */
    Low = 1,
    /**
     * Must be registered on Discord for longer than 5 minutes
     */
    Medium = 2,
    /**
     * Must be a member of the guild for longer than 10 minutes
     */
    High = 3,
    /**
     * Must have a verified phone number
     */
    VeryHigh = 4
}
/**
 * https://discord.com/developers/docs/resources/guild#guild-object-premium-tier
 */
export enum GuildPremiumTier {
    None = 0,
    Tier1 = 1,
    Tier2 = 2,
    Tier3 = 3
}
export enum GuildHubType {
    Default = 0,
    HighSchool = 1,
    College = 2
}
/**
 * https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags
 */
export enum GuildSystemChannelFlags {
    /**
     * Suppress member join notifications
     */
    SuppressJoinNotifications = 1,
    /**
     * Suppress server boost notifications
     */
    SuppressPremiumSubscriptions = 2,
    /**
     * Suppress server setup tips
     */
    SuppressGuildReminderNotifications = 4,
    /**
     * Hide member join sticker reply buttons
     */
    SuppressJoinNotificationReplies = 8
}
/**
 * https://discord.com/developers/docs/resources/guild#guild-object-guild-features
 */
export enum GuildFeature {
    /**
     * Guild has access to set an animated guild banner image
     */
    AnimatedBanner = "ANIMATED_BANNER",
    /**
     * Guild has access to set an animated guild icon
     */
    AnimatedIcon = "ANIMATED_ICON",
    /**
     * Guild is using the old permissions configuration behavior
     *
     * See https://discord.com/developers/docs/change-log#upcoming-application-command-permission-changes
     */
    ApplicationCommandPermissionsV2 = "APPLICATION_COMMAND_PERMISSIONS_V2",
    /**
     * Guild has set up auto moderation rules
     */
    AutoModeration = "AUTO_MODERATION",
    /**
     * Guild has access to set a guild banner image
     */
    Banner = "BANNER",
    /**
     * Guild can enable welcome screen, Membership Screening and discovery, and receives community updates
     */
    Community = "COMMUNITY",
    DeveloperSupportServer = "DEVELOPER_SUPPORT_SERVER",
    /**
     * Guild is able to be discovered in the directory
     */
    Discoverable = "DISCOVERABLE",
    /**
     * Guild is able to be featured in the directory
     */
    Featurable = "FEATURABLE",
    /**
     * Guild is listed in a directory channel
     */
    HasDirectoryEntry = "HAS_DIRECTORY_ENTRY",
    /**
     * Guild is a Student Hub
     *
     * See https://support.discord.com/hc/articles/4406046651927
     *
     * @unstable This feature is currently not documented by Discord, but has known value
     */
    Hub = "HUB",
    /**
     * Guild has disabled invite usage, preventing users from joining
     */
    InvitesDisabled = "INVITES_DISABLED",
    /**
     * Guild has access to set an invite splash background
     */
    InviteSplash = "INVITE_SPLASH",
    /**
     * Guild is in a Student Hub
     *
     * See https://support.discord.com/hc/articles/4406046651927
     *
     * @unstable This feature is currently not documented by Discord, but has known value
     */
    LinkedToHub = "LINKED_TO_HUB",
    /**
     * Guild has enabled Membership Screening
     */
    MemberVerificationGateEnabled = "MEMBER_VERIFICATION_GATE_ENABLED",
    /**
     * Guild has enabled monetization
     */
    MonetizationEnabled = "MONETIZATION_ENABLED",
    /**
     * Guild has increased custom sticker slots
     */
    MoreStickers = "MORE_STICKERS",
    /**
     * Guild has access to create news channels
     */
    News = "NEWS",
    /**
     * Guild is partnered
     */
    Partnered = "PARTNERED",
    /**
     * Guild can be previewed before joining via Membership Screening or the directory
     */
    PreviewEnabled = "PREVIEW_ENABLED",
    /**
     * Guild has access to create private threads
     */
    PrivateThreads = "PRIVATE_THREADS",
    RelayEnabled = "RELAY_ENABLED",
    /**
     * Guild is able to set role icons
     */
    RoleIcons = "ROLE_ICONS",
    /**
     * Guild has enabled ticketed events
     */
    TicketedEventsEnabled = "TICKETED_EVENTS_ENABLED",
    /**
     * Guild has access to set a vanity URL
     */
    VanityURL = "VANITY_URL",
    /**
     * Guild is verified
     */
    Verified = "VERIFIED",
    /**
     * Guild has access to set 384kbps bitrate in voice (previously VIP voice servers)
     */
    VIPRegions = "VIP_REGIONS",
    /**
     * Guild has enabled the welcome screen
     */
    WelcomeScreenEnabled = "WELCOME_SCREEN_ENABLED"
}
/**
 * https://discord.com/developers/docs/resources/guild#integration-object-integration-expire-behaviors
 */
export enum IntegrationExpireBehavior {
    RemoveRole = 0,
    Kick = 1
}
/**
 * https://discord.com/developers/docs/resources/guild#get-guild-widget-image-widget-style-options
 */
export enum GuildWidgetStyle {
    /**
     * Shield style widget with Discord icon and guild members online count
     */
    Shield = "shield",
    /**
     * Large image with guild icon, name and online count. "POWERED BY DISCORD" as the footer of the widget
     */
    Banner1 = "banner1",
    /**
     * Smaller widget style with guild icon, name and online count. Split on the right with Discord logo
     */
    Banner2 = "banner2",
    /**
     * Large image with guild icon, name and online count. In the footer, Discord logo on the left and "Chat Now" on the right
     */
    Banner3 = "banner3",
    /**
     * Large Discord logo at the top of the widget. Guild icon, name and online count in the middle portion of the widget
     * and a "JOIN MY SERVER" button at the bottom
     */
    Banner4 = "banner4"
}
export enum MembershipScreeningFieldType {
    /**
     * Server Rules
     */
    Terms = "TERMS"
}
