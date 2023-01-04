import { GetGuildAuditLog, getGuildMember } from './Requests/Guilds';
import { GuildVerificationLevel, GuildDefaultMessageNotifications, GuildExplicitContentFilter, APIRole, APIEmoji, GuildFeature, GuildMFALevel, GuildSystemChannelFlags, GuildPremiumTier, APIGuildWelcomeScreen, GuildNSFWLevel, APISticker, GuildHubType, RESTGetAPIAuditLogQuery, RESTGetAPIAuditLogResult, RESTGetAPIChannelMessagesQuery, RESTGetAPIChannelMessagesResult, RESTGetAPIGuildResult, RESTPostAPIChannelMessageJSONBody, Snowflake, RESTGetAPIGuildMemberResult, ChannelType, GuildTextChannelType } from 'discord-api-types/v9';
import { CreateMessage, GetChannelMessages, GetGuildChannels } from './Requests/Channels';
import { GuildMember } from './User';
import { DiscordAPIError } from './factory/Resources';
import { Channel, ChannelClassType, GuildChannel } from './factory/Channels';
import { deprecate } from './factory/deprecate';

/**
 * Guilds in Discord represent an isolated collection of users and channels,
 * and are often referred to as "servers" in the UI.
 */
export class Guild {
  /**
   * Guild id
   */
  public readonly id: string;
  /**
   * Guild name
   */
  public readonly name: string;
  /**
   * Guild icon
   */
  public readonly icon: string;
  /**
   * Icon hash, returned when in the template object
   */
  public readonly iconHash: string;
  /**
   * Guild splash
   */
  public readonly splash: string;
  /**
   * Discovery splash hash; only present for guilds with the "DISCOVERABLE" feature
   */
  public readonly discoverySplash: string;
  /**
   * `true` if the user is the owner of the guild
   */
  public readonly owner: boolean;
  /**
   * ID of owner
   */
  public readonly ownerId: string;
  /**
   * Total permissions for the user in the guild (excludes overrides)
   *
   * See https://en.wikipedia.org/wiki/Bit_field
   */
  public readonly permissions: string;
  /**
   * ID of afk channel
   */
  public readonly afkChannelId: string;
  /**
   * afk timeout in seconds, can be set to: `60`, `300`, `900`, `1800`, `3600`
   */
  public readonly afkTimeout: number;
  /**
   * `true` if the guild widget is enabled
   */
  public readonly widgetEnabled: boolean;
  /**
   * The channel id that the widget will generate an invite to, or `null` if set to no invite
   */
  public readonly widgetChannelId: string;
  /**
  * Verification level required for the guild
   */
  public readonly verificationLevel: GuildVerificationLevel;
  /**
   * Default message notifications level
   */
  public readonly defaultMessageNotifications: GuildDefaultMessageNotifications;
  /**
   * Explicit content filter level
   */
  public readonly explicitContentFilter: GuildExplicitContentFilter;
  /**
   * Roles in the guild
   */
  public readonly roles: APIRole[];
  /**
   * Custom guild emojis
   */
  public readonly emojis: APIEmoji[];
  /**
   * Enabled guild features
   */
  public readonly features: GuildFeature[];
  /**
   * Required MFA level for the guild
   */
  public readonly mfaLevel: GuildMFALevel;
  /**
   * Application id of the guild creator if it is bot-created
   */
  public readonly applicationId: string;
  /**
   * The id of the channel where guild notices such as welcome messages and boost events are posted
   */
  public readonly systemChannelId: string;
  /**
   * System channel flags
   */
  public readonly systemChannelFlags: GuildSystemChannelFlags;
  /**
   * The id of the channel where Community guilds can display rules and/or guidelines
   */
  public readonly rulesChannelId: string;
  /**
   * The maximum number of presences for the guild (`null` is always returned, apart from the largest of guilds)
   */
  public readonly maxPresences: number;
  /**
   * The maximum number of members for the guild
   */
  public readonly maxMembers: number;
  /**
   * The vanity url code for the guild
   */
  public readonly vanityUrlCode: string;
  /**
   * The description for the guild
   */
  public readonly description: string;
  /**
   * Banner hash
   */
  public readonly banner: string;
  /**
   * Premium tier (Server Boost level)
   */
  public readonly premiumTier: GuildPremiumTier;
  /**
   * The number of boosts this guild currently has
   */
  public readonly premiumSubscriptionCount: number;
  /**
   * The preferred locale of a Community guild; used in guild discovery and notices from Discord; defaults to "en-US"
   */
  public readonly preferredLocale: string;
  /**
   * The id of the channel where admins and moderators of Community guilds receive notices from Discord
   */
  public readonly publicUpdatesChannelId: string;
  /**
   * The maximum amount of users in a video channel
   */
  public readonly maxVideoChannelUsers: number;
  /**
   * **This field is only received from https://discord.com/developers/docs/resources/guild#get-guild with the `with_counts` query parameter set to `true`**
   */
  public readonly approximateMemberCount: number;
  /**
   * **This field is only received from https://discord.com/developers/docs/resources/guild#get-guild with the `with_counts` query parameter set to `true`**
   */
  public readonly approximatePresenceCount: number;
  /**
   * The welcome screen of a Community guild, shown to new members
   */
  public readonly welcomeScreen: APIGuildWelcomeScreen;
  /**
   * The nsfw level of the guild
   */
  public readonly nsfwLevel: GuildNSFWLevel;
  /**
   * Custom guild stickers
   */
  public readonly stickers: APISticker[];
  /**
   * Whether the guild has the boost progress bar enabled.
   */
  public readonly premiumProgressBarEnabled: boolean;
  /**
   * The type of Student Hub the guild is
   */
  public readonly hubType: GuildHubType;

  /**
   * Get server audit log
   * @param options Get guild audit log object
   * @returns aduit log object 
   */
  async getAuditLog(options?: RESTGetAPIAuditLogQuery) {
    const response: string = await GetGuildAuditLog(this.id, options);
    const result: RESTGetAPIAuditLogResult = JSON.parse(response);
    return result;
  };

  /**
   * Send a message in a channel
   * @param channelId 
   * @param options 
   * @deprecated Please use `guild.getChannel().sendMessage()` to send a message to a specific channel
   */
  public sendMessage(channelId: Snowflake, options: RESTPostAPIChannelMessageJSONBody) {
    deprecate(CreateMessage, "Please use 'guild.getChannel().sendMessage()' to send a message to a specific channel")(channelId, options);
  };

  /**
   * Get messages from a channel
   * @param channelId 
   * @param options 
   * @returns 
   */
  public async getMessages(channelId: Snowflake, options: RESTGetAPIChannelMessagesQuery) {
    const response: string = await GetChannelMessages(channelId, options);
    const result: RESTGetAPIChannelMessagesResult = JSON.parse(response);
    return result;
  };

  /**
   * Returns a list of guild channel objects. Does not include threads.
   */
  public async getChannels() {
    const response: string = await GetGuildChannels(this.id);
    const channels: Channel[] = JSON.parse(response);
    return channels;
  };

  /**
   * Get channel from current guild
   * @param channelId The id of the channel
   * @param channelType The type of the channel the API is expecting, throws error if returned channel type is not matched with expected channel type.
   * @returns A channel object if channel exist
   */
  async getChannel<T extends ChannelType>(channelId: Snowflake, channelType?: T): Promise<ChannelClassType[T]> {
    const channels = await this.getChannels();
    const channelIndex = channels.findIndex(({id}) => id === channelId);
    const channel = channels[channelIndex] as ChannelClassType[T];
    if (!channel) throw new DiscordAPIError(`Channel '${channelId}' not found in guild '${this.name}'`);
    else if (typeof channelType === 'number' && channel.type !== channelType) throw new DiscordAPIError(`The type of the channel '${ChannelType[channel.type]}' is not the same as expected channel type '${ChannelType[channelType]}'.`);
    else return channel;
  };

  public async getMember (userId: Snowflake) {
    const response: string = await getGuildMember(this.id, userId);
    const result: RESTGetAPIGuildMemberResult = JSON.parse(response);
    return new GuildMember(result);
  };

  /** @internal */
  constructor(response: RESTGetAPIGuildResult) {
    this.id = response.id;
    this.name = response.name;
    this.icon = response.icon;
    this.iconHash = response.icon_hash;
    this.splash = response.splash;
    this.discoverySplash = response.discovery_splash;
    this.owner = response.owner;
    this.ownerId = response.owner_id;
    this.permissions = response.permissions;
    this.afkChannelId = response.afk_channel_id;
    this.afkTimeout = response.afk_timeout;
    this.widgetEnabled = response.widget_enabled;
    this.widgetChannelId = response.widget_channel_id;
    this.verificationLevel = response.verification_level;
    this.defaultMessageNotifications = response.default_message_notifications;
    this.explicitContentFilter = response.explicit_content_filter;
    this.roles = response.roles;
    this.emojis = response.emojis;
    this.features = response.features;
    this.mfaLevel = response.mfa_level;
    this.applicationId = response.application_id;
    this.systemChannelId = response.system_channel_id;
    this.systemChannelFlags = response.system_channel_flags;
    this.rulesChannelId = response.rules_channel_id;
    this.maxPresences = response.max_presences;
    this.maxMembers = response.max_members;
    this.vanityUrlCode = response.vanity_url_code;
    this.description = response.description;
    this.banner = response.banner;
    this.premiumTier = response.premium_tier;
    this.premiumSubscriptionCount = response.premium_subscription_count;
    this.preferredLocale = response.preferred_locale;
    this.publicUpdatesChannelId = response.public_updates_channel_id;
    this.maxVideoChannelUsers = response.max_video_channel_users;
    this.approximateMemberCount = response.approximate_member_count;
    this.approximatePresenceCount = response.approximate_presence_count;
    this.welcomeScreen = response.welcome_screen;
    this.nsfwLevel = response.nsfw_level;
    this.stickers = response.stickers;
    this.premiumProgressBarEnabled = response.premium_progress_bar_enabled;
    this.hubType = response.hub_type;
  };
};