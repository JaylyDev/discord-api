/**
 * Types extracted from https://discord.com/developers/docs/resources/channel
 */
/**
 * https://discord.com/developers/docs/resources/channel/#channel-object-sort-order-types
 */
export enum SortOrderType {
    /**
     * Sort forum posts by activity
     */
    LatestActivity = 0,
    /**
     * Sort forum posts by creation time (from most recent to oldest)
     */
    CreationDate = 1
}
/**
 * https://discord.com/developers/docs/resources/channel/#channel-object-forum-layout-types
 */
export enum ForumLayoutType {
    /**
     * No default has been set for forum channel
     */
    NotSet = 0,
    /**
     * Display posts as a list
     */
    ListView = 1,
    /**
     * Display posts as a collection of tiles
     */
    GalleryView = 2
}
/**
 * https://discord.com/developers/docs/resources/channel#channel-object-channel-types
 */
export enum ChannelType {
    /**
     * A text channel within a guild
     */
    GuildText = 0,
    /**
     * A direct message between users
     */
    DM = 1,
    /**
     * A voice channel within a guild
     */
    GuildVoice = 2,
    /**
     * A direct message between multiple users
     */
    GroupDM = 3,
    /**
     * An organizational category that contains up to 50 channels
     *
     * See https://support.discord.com/hc/articles/115001580171
     */
    GuildCategory = 4,
    /**
     * A channel that users can follow and crosspost into their own guild
     *
     * See https://support.discord.com/hc/articles/360032008192
     */
    GuildAnnouncement = 5,
    /**
     * A temporary sub-channel within a Guild Announcement channel
     */
    AnnouncementThread = 10,
    /**
     * A temporary sub-channel within a Guild Text or Guild Forum channel
     */
    PublicThread = 11,
    /**
     * A temporary sub-channel within a Guild Text channel that is only viewable by those invited and those with the Manage Threads permission
     */
    PrivateThread = 12,
    /**
     * A voice channel for hosting events with an audience
     *
     * See https://support.discord.com/hc/articles/1500005513722
     */
    GuildStageVoice = 13,
    /**
     * The channel in a Student Hub containing the listed servers
     *
     * See https://support.discord.com/hc/articles/4406046651927
     */
    GuildDirectory = 14,
    /**
     * A channel that can only contain threads
     */
    GuildForum = 15,
    /**
     * A channel that users can follow and crosspost into their own guild
     *
     * @deprecated This is the old name for {@apilink ChannelType#GuildAnnouncement}
     *
     * See https://support.discord.com/hc/articles/360032008192
     */
    GuildNews = 5,
    /**
     * A temporary sub-channel within a Guild Announcement channel
     *
     * @deprecated This is the old name for {@apilink ChannelType#AnnouncementThread}
     */
    GuildNewsThread = 10,
    /**
     * A temporary sub-channel within a Guild Text channel
     *
     * @deprecated This is the old name for {@apilink ChannelType#PublicThread}
     */
    GuildPublicThread = 11,
    /**
     * A temporary sub-channel within a Guild Text channel that is only viewable by those invited and those with the Manage Threads permission
     *
     * @deprecated This is the old name for {@apilink ChannelType#PrivateThread}
     */
    GuildPrivateThread = 12
}
export enum VideoQualityMode {
    /**
     * Discord chooses the quality for optimal performance
     */
    Auto = 1,
    /**
     * 720p
     */
    Full = 2
}
/**
 * https://discord.com/developers/docs/resources/channel#message-object-message-types
 */
export enum MessageType {
    Default = 0,
    RecipientAdd = 1,
    RecipientRemove = 2,
    Call = 3,
    ChannelNameChange = 4,
    ChannelIconChange = 5,
    ChannelPinnedMessage = 6,
    UserJoin = 7,
    GuildBoost = 8,
    GuildBoostTier1 = 9,
    GuildBoostTier2 = 10,
    GuildBoostTier3 = 11,
    ChannelFollowAdd = 12,
    GuildDiscoveryDisqualified = 14,
    GuildDiscoveryRequalified = 15,
    GuildDiscoveryGracePeriodInitialWarning = 16,
    GuildDiscoveryGracePeriodFinalWarning = 17,
    ThreadCreated = 18,
    Reply = 19,
    ChatInputCommand = 20,
    ThreadStarterMessage = 21,
    GuildInviteReminder = 22,
    ContextMenuCommand = 23,
    AutoModerationAction = 24
}
/**
 * https://discord.com/developers/docs/resources/channel#message-object-message-activity-types
 */
export enum MessageActivityType {
    Join = 1,
    Spectate = 2,
    Listen = 3,
    JoinRequest = 5
}
/**
 * https://discord.com/developers/docs/resources/channel#message-object-message-flags
 */
export enum MessageFlags {
    /**
     * This message has been published to subscribed channels (via Channel Following)
     */
    Crossposted = 1,
    /**
     * This message originated from a message in another channel (via Channel Following)
     */
    IsCrosspost = 2,
    /**
     * Do not include any embeds when serializing this message
     */
    SuppressEmbeds = 4,
    /**
     * The source message for this crosspost has been deleted (via Channel Following)
     */
    SourceMessageDeleted = 8,
    /**
     * This message came from the urgent message system
     */
    Urgent = 16,
    /**
     * This message has an associated thread, which shares its id
     */
    HasThread = 32,
    /**
     * This message is only visible to the user who invoked the Interaction
     */
    Ephemeral = 64,
    /**
     * This message is an Interaction Response and the bot is "thinking"
     */
    Loading = 128,
    /**
     * This message failed to mention some roles and add their members to the thread
     */
    FailedToMentionSomeRolesInThread = 256
}
export enum OverwriteType {
    Role = 0,
    Member = 1
}
export enum ThreadAutoArchiveDuration {
    OneHour = 60,
    OneDay = 1440,
    ThreeDays = 4320,
    OneWeek = 10080
}
export enum ThreadMemberFlags {
}
/**
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-types
 * @deprecated *Embed types should be considered deprecated and might be removed in a future API version*
 */
export enum EmbedType {
    /**
     * Generic embed rendered from embed attributes
     */
    Rich = "rich",
    /**
     * Image embed
     */
    Image = "image",
    /**
     * Video embed
     */
    Video = "video",
    /**
     * Animated gif image embed rendered as a video embed
     */
    GIFV = "gifv",
    /**
     * Article embed
     */
    Article = "article",
    /**
     * Link embed
     */
    Link = "link",
    /**
     * Auto moderation alert embed
     *
     * @unstable This embed type is currently not documented by Discord, but it is returned in the auto moderation system messages.
     */
    AutoModerationMessage = "auto_moderation_message"
}
/**
 * https://discord.com/developers/docs/resources/channel#allowed-mentions-object-allowed-mention-types
 */
export enum AllowedMentionsTypes {
    /**
     * Controls @everyone and @here mentions
     */
    Everyone = "everyone",
    /**
     * Controls role mentions
     */
    Role = "roles",
    /**
     * Controls user mentions
     */
    User = "users"
}
/**
 * https://discord.com/developers/docs/interactions/message-components#component-object-component-types
 */
export enum ComponentType {
    /**
     * Action Row component
     */
    ActionRow = 1,
    /**
     * Button component
     */
    Button = 2,
    /**
     * Select menu for picking from defined text options
     */
    StringSelect = 3,
    /**
     * Text Input component
     */
    TextInput = 4,
    /**
     * Select menu for users
     */
    UserSelect = 5,
    /**
     * Select menu for roles
     */
    RoleSelect = 6,
    /**
     * Select menu for users and roles
     */
    MentionableSelect = 7,
    /**
     * Select menu for channels
     */
    ChannelSelect = 8,
    /**
     * Select menu for picking from defined text options
     *
     * @deprecated This is the old name for {@apilink ComponentType#StringSelect}
     */
    SelectMenu = 3
}
/**
 * https://discord.com/developers/docs/interactions/message-components#button-object-button-styles
 */
export enum ButtonStyle {
    Primary = 1,
    Secondary = 2,
    Success = 3,
    Danger = 4,
    Link = 5
}
/**
 * https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-styles
 */
export enum TextInputStyle {
    Short = 1,
    Paragraph = 2
}
/**
 * https://discord.com/developers/docs/resources/channel#channel-object-channel-flags
 */
export enum ChannelFlags {
    /**
     * This thread is pinned to the top of its parent forum channel
     */
    Pinned = 2,
    /**
     * Whether a tag is required to be specified when creating a thread in a forum channel.
     * Tags are specified in the `applied_tags` field
     */
    RequireTag = 16
}
