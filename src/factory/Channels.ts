import {
    ChannelType,
    ChannelFlags,
    APIUser,
    APITextChannel,
    ThreadAutoArchiveDuration,
    APIOverwrite,
    APINewsChannel,
    APIGuildVoiceChannel,
    VideoQualityMode,
    APIGuildStageVoiceChannel,
    APIGuildCategoryChannel,
    APIThreadChannel,
    APIThreadMember,
    APIThreadMetadata,
    APIGuildForumChannel,
    APIGuildForumTag,
    APIGuildForumDefaultReactionEmoji,
    SortOrderType,
    ForumLayoutType,
    APIDMChannelBase,
    GuildTextChannelType,
    APIGuildChannel,
    APITextBasedChannel,
    APIChannelBase,
    Snowflake,
    APIGuildTextChannel,
    APIPartialChannel,
    APIVoiceChannelBase,
    APIDMChannel,
    APIGroupDMChannel,
} from "discord-api-types/v9";
import { Guild } from "../Guild";

//////////////////
// DM Channel API
/////////////////

class DMChannelBase<T extends ChannelType> implements APIDMChannelBase<T> {
    /** @internal */
    constructor(response: APIDMChannelBase<T>) {
        this.recipients = response.recipients;
        this.lastMessageId = response.last_message_id;
        this.lastPinTimestamp = response.last_pin_timestamp;
        this.type = response.type;
        this.flags = response.flags;
        this.id = response.id;
        this.name = response.name;
    };
    readonly recipients?: APIUser[];
    readonly lastMessageId?: string;
    readonly lastPinTimestamp?: string;
    readonly type: T;
    readonly flags?: ChannelFlags;
    readonly id: string;
    readonly name?: string;
};
export class GroupDMChannel extends DMChannelBase<ChannelType.GroupDM> implements APIGroupDMChannel {
    /** @internal */
    constructor(response: APIGroupDMChannel) {
        super(response);
        this.name = response.name;
        this.applicationId = response.application_id;
        this.icon = response.icon;
        this.ownerId = response.owner_id;
        this.lastMessageId = response.last_message_id;
        this.lastPinTimestamp = response.last_pin_timestamp;
        this.type = response.type;
        this.flags = response.flags;
        this.id = response.id;
        this.recipients = response.recipients;
    };
    readonly name: string;
    readonly applicationId?: string;
    readonly icon?: string;
    readonly ownerId?: string;
    readonly lastMessageId?: string;
    readonly lastPinTimestamp?: string;
    readonly type: ChannelType.GroupDM;
    readonly flags?: ChannelFlags;
    readonly id: string;
    readonly recipients?: APIUser[];
};
export class DMChannel extends DMChannelBase<ChannelType.DM> implements APIDMChannel {
    /** @internal */
    constructor(response: APIDMChannel) {
        super(response);
        this.name = response.name;
        this.lastMessageId = response.last_message_id;
        this.lastPinTimestamp = response.last_pin_timestamp;
        this.type = response.type;
        this.flags = response.flags;
        this.id = response.id;
        this.recipients = response.recipients;
    };
    readonly name: null;
    readonly lastMessageId?: string;
    readonly lastPinTimestamp?: string;
    readonly type: ChannelType.DM;
    readonly flags?: ChannelFlags;
    readonly id: string;
    readonly recipients?: APIUser[];
};

///////////////////////////
// Guild Text Channel API
///////////////////////////

/**
 * Not documented, but partial only includes id, name, and type
 */
export class PartialChannel implements APIPartialChannel {
    /** @internal */
    constructor(response: APIPartialChannel) {
        this.id = response.id;
        this.type = response.type;
        this.name = response.name;
    }
    readonly id: Snowflake;
    readonly type: ChannelType;
    readonly name?: string | null;
}
/**
 * This interface is used to allow easy extension for other channel types. While
 * also allowing `APIPartialChannel` to be used without breaking.
 */
class ChannelBase<T extends ChannelType> extends PartialChannel implements APIChannelBase<T> {
    /** @internal */
    constructor(response: APIChannelBase<T>) {
        super(response);
        this.type = response.type;
        this.flags = response.flags;
    }
    readonly type: T;
    readonly flags?: ChannelFlags;
}
export class TextBasedChannel<T extends ChannelType> extends ChannelBase<T> implements APITextBasedChannel<T> {
    /** @internal */
    constructor(response: APITextBasedChannel<T>) {
        super(response);
        this.lastMessageId = response.last_message_id;
        this.lastPinTimestamp = response.last_pin_timestamp;
        this.rateLimitPerUser = response.rate_limit_per_user;
    };
    /**
     * The id of the last message sent in this channel (may not point to an existing or valid message)
     */
    readonly lastMessageId?: Snowflake | null;
    /**
     * When the last pinned message was pinned.
     * This may be `null` in events such as `GUILD_CREATE` when a message is not pinned
     */
    readonly lastPinTimestamp?: string | null;
    /**
     * Amount of seconds a user has to wait before sending another message (0-21600);
     * bots, as well as users with the permission `MANAGE_MESSAGES` or `MANAGE_CHANNELS`, are unaffected
     *
     * `rate_limit_per_user` also applies to thread creation. Users can send one message and create one thread during each `rate_limit_per_user` interval.
     *
     * For thread channels, `rate_limit_per_user` is only returned if the field is set to a non-zero and non-null value.
     * The absence of this field in API calls and Gateway events should indicate that slowmode has been reset to the default value.
     */
    readonly rateLimitPerUser?: number;
};
export class GuildChannel<T extends ChannelType> extends ChannelBase<T> implements APIGuildChannel<T> {
    /** @internal */
    constructor(response: APIGuildChannel<T>, guild?: Guild) {
        super(response);
        this.name = response.name;
        this.guildId = response.guild_id ?? guild.id;
        this.permissionOverwrites = response.permission_overwrites;
        this.position = response.position;
        this.parentId = response.parent_id;
        this.nsfw = response.nsfw;

        this.guild = guild;
    };
    readonly name: string;
    /**
     * The id of the guild (may be missing for some channel objects received over gateway guild dispatches)
     */
    readonly guildId?: Snowflake;
    /**
     * Explicit permission overwrites for members and roles
     *
     * See https://discord.com/developers/docs/resources/channel#overwrite-object
     */
    readonly permissionOverwrites?: APIOverwrite[];
    /**
     * Sorting position of the channel
     */
    readonly position: number;
    /**
     * ID of the parent category for a channel (each parent category can contain up to 50 channels)
     *
     * OR
     *
     * ID of the parent channel for a thread
     */
    readonly parentId?: Snowflake | null;
    readonly nsfw?: boolean;
    /**
     * The guild object (may be missing for some channel objects received over gateway guild dispatches)
     */
    readonly guild: Guild;
};
export class GuildTextChannel<T extends GuildTextChannelType> extends TextBasedChannel<T> implements APIGuildTextChannel<T> {
    /** @internal */
    constructor (response: APIGuildTextChannel<T>, guild?: Guild) {
        super(response);
        this.name = response.name;
        this.guildId = response.guild_id;
        this.permissionOverwrites = response.permission_overwrites;
        this.position = response.position;
        this.parentId = response.parent_id;
        this.nsfw = response.nsfw;
        this.defaultAutoArchiveDuration = response.default_auto_archive_duration;
        this.defaultThreadRateLimitPerUser = response.default_thread_rate_limit_per_user;
        this.topic = response.topic;
        this.guild = guild;
    }
    readonly name: string;
    /**
     * The id of the guild (may be missing for some channel objects received over gateway guild dispatches)
     */
    readonly guildId?: Snowflake;
    /**
     * Explicit permission overwrites for members and roles
     *
     * See https://discord.com/developers/docs/resources/channel#overwrite-object
     */
    readonly permissionOverwrites?: APIOverwrite[];
    /**
     * Sorting position of the channel
     */
    readonly position: number;
    /**
     * ID of the parent category for a channel (each parent category can contain up to 50 channels)
     *
     * OR
     *
     * ID of the parent channel for a thread
     */
    readonly parentId?: Snowflake | null;
    readonly nsfw?: boolean;
    /**
     * Default duration for newly created threads, in minutes, to automatically archive the thread after recent activity
     */
    readonly defaultAutoArchiveDuration?: ThreadAutoArchiveDuration;
    /**
     * The initial `rate_limit_per_user` to set on newly created threads.
     * This field is copied to the thread at creation time and does not live update
     */
    readonly defaultThreadRateLimitPerUser?: number;
    /**
     * The channel topic (0-1024 characters)
     */
    readonly topic?: string | null;
    /**
     * The guild object (may be missing for some channel objects received over gateway guild dispatches)
     */
    readonly guild: Guild;
}

export class TextChannel extends GuildTextChannel<ChannelType.GuildText> implements APITextChannel {
    constructor (response: APITextChannel) {
        super(response);
    };
};
export class NewsChannel extends GuildTextChannel<ChannelType.GuildAnnouncement> implements APINewsChannel {
    constructor (response: APINewsChannel) {
        super(response);
    };
};

///////////////////////////
// Guild Voice Channel API
///////////////////////////

class VoiceChannelBase<T extends ChannelType> extends GuildChannel<T> implements APIVoiceChannelBase<T> {
    /** @internal */
    constructor (response: APIVoiceChannelBase<T>) {
        super(response);
        this.bitrate = response.bitrate;
        this.userLimit = response.user_limit;
        this.rtcRegion = response.rtc_region;
    }
    readonly bitrate?: number;
    readonly userLimit?: number;
    readonly rtcRegion?: string | null;
}

export class GuildVoiceChannel extends VoiceChannelBase<ChannelType.GuildVoice> implements APIGuildVoiceChannel {
    /** @internal */
    constructor (response: APIGuildVoiceChannel) {
        super(response);
        this.lastMessageId = response.last_message_id;
        this.rateLimitPerUser = response.rate_limit_per_user;
        this.videoQualityMode = response.video_quality_mode;
    }
    readonly lastMessageId?: Snowflake | null;
    readonly rateLimitPerUser?: number;
    readonly videoQualityMode?: VideoQualityMode;
}

export class GuildStageVoiceChannel extends VoiceChannelBase<ChannelType.GuildStageVoice> implements APIGuildStageVoiceChannel {
    constructor (response: APIGuildStageVoiceChannel) {
        super(response);
    };
};
export class GuildCategoryChannel extends GuildChannel<ChannelType.GuildCategory> implements APIGuildCategoryChannel {
    constructor (response: APIGuildCategoryChannel) {
        super(response);
    };
};
export class ThreadChannel extends GuildChannel<ChannelType.PublicThread | ChannelType.PrivateThread | ChannelType.AnnouncementThread> {
    /** @internal */
    constructor (response: APIThreadChannel, guild?: Guild) {
        super(response, guild);
        this.member = response.member;
        this.threadMetadata = response.thread_metadata;
        this.messageCount = response.message_count;
        this.memberCount = response.member_count;
        this.ownerId = response.owner_id;
        this.totalMessageSent = response.total_message_sent;
        this.appliedTags = response.applied_tags;
        this.lastMessageId = response.last_message_id;
        this.lastPinTimestamp = response.last_pin_timestamp;
        this.rateLimitPerUser = response.rate_limit_per_user;
    };
    readonly member?: APIThreadMember;
    readonly threadMetadata?: APIThreadMetadata;
    readonly messageCount?: number;
    readonly memberCount?: number;
    readonly ownerId?: Snowflake;
    readonly totalMessageSent?: number;
    readonly appliedTags: Snowflake[];
    readonly lastMessageId?: Snowflake | null;
    readonly lastPinTimestamp?: string | null;
    readonly rateLimitPerUser?: number;
};
export class GuildForumChannel extends GuildTextChannel<ChannelType.GuildForum> {
    /** @internal */
    constructor (response: APIGuildForumChannel) {
        super(response);
        this.availableTags = response.available_tags;
        this.defaultReactionEmoji = response.default_reaction_emoji;
        this.defaultSortOrder = response.default_sort_order;
        this.defaultForumLayout = response.default_forum_layout;
    };
    readonly availableTags: APIGuildForumTag[];
    readonly defaultReactionEmoji: APIGuildForumDefaultReactionEmoji | null;
    readonly defaultSortOrder: SortOrderType | null;
    readonly defaultForumLayout: ForumLayoutType;
};