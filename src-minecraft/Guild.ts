import type { RESTGetAPIAuditLogQuery, RESTGetAPIAuditLogResult, RESTGetAPIChannelMessagesQuery, RESTGetAPIChannelMessagesResult, RESTGetAPIChannelResult, RESTGetAPIGuildResult, RESTPostAPIChannelMessageJSONBody, Snowflake } from 'discord-api-types/v9';
import { CreateMessage, GetChannelMessages } from '../src-discord/Resources/Channels';
import { GetChannel, GetGuildAuditLog } from '../src-discord/Resources/Guilds';
import { Client } from './Client';
import fetch from './net-request';

export class Guild {
  private readonly client: Client;
  private readonly response: RESTGetAPIGuildResult;

  public get id() { return this.response.id; };
  public get name() { return this.response.name; };
  public get icon() { return this.response.icon; };
  /**
   * Icon hash, returned when in the template object
   */
  public get iconHash() { return this.response.icon_hash; };
  public get splash() { return this.response.splash; };
  /**
   * Discovery splash hash; only present for guilds with the "DISCOVERABLE" feature
   */
  public get discoverySplash() { return this.response.discovery_splash; };
  /**
   * `true` if the user is the owner of the guild
   */
  public get owner() { return this.response.owner; };
  /**
   * ID of owner
   */
  public get ownerId() { return this.response.owner_id; };
  /**
   * Total permissions for the user in the guild (excludes overrides)
   *
   * See https://en.wikipedia.org/wiki/Bit_field
   */
  public get permissions() { return this.response.permissions; };
  /**
   * ID of afk channel
   */
  public get afkChannelId() { return this.response.afk_channel_id; };
  /**
   * afk timeout in seconds, can be set to: `60`, `300`, `900`, `1800`, `3600`
   */
  public get afkTimeout() { return this.response.afk_timeout; };
  /**
   * `true` if the guild widget is enabled
   */
  public get widgetEnabled() { return this.response.widget_enabled; };
  /**
   * The channel id that the widget will generate an invite to, or `null` if set to no invite
   */
  public get widgetChannelId() { return this.response.widget_channel_id; };
  /**
  * Verification level required for the guild
   */
  public get verificationLevel() { return this.response.verification_level; };
  /**
   * Default message notifications level
   */
  public get defaultMessageNotifications() { return this.response.default_message_notifications; };
  /**
   * Explicit content filter level
   */
  public get explicitContentFilter() { return this.response.explicit_content_filter; };
  /**
   * Roles in the guild
   */
  public get roles() { return this.response.roles; };
  /**
   * Custom guild emojis
   */
  public get emojis() { return this.response.emojis; };
  /**
   * Enabled guild features
   */
  public get features() { return this.response.features; };
  /**
   * Required MFA level for the guild
   */
  public get mfaLevel() { return this.response.mfa_level; };
  /**
   * Application id of the guild creator if it is bot-created
   */
  public get applicationId() { return this.response.application_id; };
  /**
   * The id of the channel where guild notices such as welcome messages and boost events are posted
   */
  public get systemChannelId() { return this.response.system_channel_id; };
  /**
   * System channel flags
   */
  public get systemChannelFlags() { return this.response.system_channel_flags; };
  /**
   * The id of the channel where Community guilds can display rules and/or guidelines
   */
  public get rulesChannelId() { return this.response.rules_channel_id; };
  /**
   * The maximum number of presences for the guild (`null` is always returned, apart from the largest of guilds)
   */
  public get maxPresences() { return this.response.max_presences; };
  /**
   * The maximum number of members for the guild
   */
  public get maxMembers() { return this.response.max_members; };
  /**
   * The vanity url code for the guild
   */
  public get vanityUrlCode() { return this.response.vanity_url_code; };
  /**
   * The description for the guild
   */
  public get description() { return this.response.description; };
  /**
   * Banner hash
   */
  public get banner() { return this.response.banner; };
  /**
   * Premium tier (Server Boost level)
   */
  public get premiumTier() { return this.response.premium_tier; };
  /**
   * The number of boosts this guild currently has
   */
  public get premiumSubscriptionCount() { return this.response.premium_subscription_count; };
  /**
   * The preferred locale of a Community guild; used in guild discovery and notices from Discord; defaults to "en-US"
  *
  public get preferredLocale () { return this.response.preferred_locale; };
  /**
   * The id of the channel where admins and moderators of Community guilds receive notices from Discord
   */
  public get publicUpdatesChannelId() { return this.response.public_updates_channel_id; };
  /**
   * The maximum amount of users in a video channel
   */
  public get maxVideoChannelUsers() { return this.response.max_video_channel_users; };
  /**
   * **This field is only received from https://discord.com/developers/docs/resources/guild#get-guild with the `with_counts` query parameter set to `true`**
   */
  public get approximateMemberCount() { return this.response.approximate_member_count; };
  /**
   * **This field is only received from https://discord.com/developers/docs/resources/guild#get-guild with the `with_counts` query parameter set to `true`**
   */
  public get approximatePresenceCount() { return this.response.approximate_presence_count; };
  /**
   * The welcome screen of a Community guild, shown to new members
  *
  public get welcomeScreen () { return this.response.welcome_screen; };
  /**
   * The nsfw level of the guild
   */
  public get nsfwLevel() { return this.response.nsfw_level; };
  /**
   * Custom guild stickers
   */
  public get stickers() { return this.response.stickers; };
  /**
   * Whether the guild has the boost progress bar enabled.
   */
  public get premiumProgressBarEnabled() { return this.response.premium_progress_bar_enabled; };
  /**
   * The type of Student Hub the guild is
   */
  public get hubType() { return this.response.hub_type; };

  /**
   * Get server audit log
   * @param options Get guild audit log object
   * @returns aduit log object 
   */
  async getAuditLog(options?: RESTGetAPIAuditLogQuery) {
    const response: string = await GetGuildAuditLog(this.id, options, this.client['token'], fetch);
    const result: RESTGetAPIAuditLogResult = JSON.parse(response);
    return result;
  };

  /**
   * Send a message in a channel
   * @param channelId 
   * @param options 
   */
  public sendMessage(channelId: Snowflake, options: RESTPostAPIChannelMessageJSONBody) {
    CreateMessage(channelId, options, this.client['token'], fetch).catch((err) => console.error(err));
  };

  /**
   * Get messages from a channel
   * @param channelId 
   * @param options 
   * @returns 
   */
  public async getMessages(channelId: Snowflake, options: RESTGetAPIChannelMessagesQuery) {
    const response: string = await GetChannelMessages(channelId, options, this.client['token'], fetch);
    const result: RESTGetAPIChannelMessagesResult = JSON.parse(response);
    return result;
  };

  /**
   * Get channel from current guild
   * @param channelId 
   * @returns 
   */
  async getChannel(channelId: Snowflake) {
    const response: string = await GetChannel(channelId, this.client['token'], fetch);
    const result = JSON.parse(response) as RESTGetAPIChannelResult;
    return result;
  };

  constructor(response: RESTGetAPIGuildResult, client: Client) {
    this.client = client;
    this.response = response;
  };
};
