import type { APIGuildMember, APIUser, Snowflake, UserFlags, UserPremiumType, } from "discord-api-types/v9";
import { SnowflakeToDate } from "../src-discord";
import { Client } from "./Client";

/**
 * User Object
 */
export class User {
  /** @internal */
  private readonly client: Client;
  /**
   * The user's id
   */
  public readonly id: Snowflake;
  /**
   * The user's username, not unique across the platform
   */
  public readonly username: string;
  /**
   * The user's 4-digit discord-tag
   */
  public readonly discriminator: string;
  /**
   * The user's avatar hash
   *
   * See https://discord.com/developers/docs/reference#image-formatting
   */
  public readonly avatar: string | null;
  /**
   * Whether the user belongs to an OAuth2 application
   */
  public readonly bot?: boolean;
  /**
   * Whether the user is an Official Discord System user (part of the urgent message system)
   */
  public readonly system?: boolean;
  /**
   * Whether the user has two factor enabled on their account
   */
  public readonly mfaEnabled?: boolean;
  /**
   * The user's banner hash
   *
   * See https://discord.com/developers/docs/reference#image-formatting
   */
  public readonly banner?: string | null;
  /**
   * The user's banner color encoded as an integer representation of hexadecimal color code
   */
  public readonly accentColor?: number | null;
  /**
   * The user's chosen language option
   */
  public readonly locale?: string;
  /**
   * Whether the email on this account has been verified
   */
  public readonly verified?: boolean;
  /**
   * The user's email
   */
  public readonly email?: string | null;
  /**
   * The flags on a user's account
   *
   * See https://discord.com/developers/docs/resources/user#user-object-user-flags
   */
  public readonly flags?: UserFlags;
  /**
   * The type of Nitro subscription on a user's account
   *
   * See https://discord.com/developers/docs/resources/user#user-object-premium-types
   */
  public readonly premiumType?: UserPremiumType;
  /**
   * The public flags on a user's account
   *
   * See https://discord.com/developers/docs/resources/user#user-object-user-flags
   */
  public readonly publicFlags?: UserFlags;
  /**
   * When the user joined Discord
   * @returns user join dates and times in a Date object
   */
  public getJoinDate (): Date {
    return SnowflakeToDate(this.id);
  };

  /** @internal */
  constructor (response: APIUser, client: Client) {
    this.id = response.id;
    this.username = response.username;
    this.discriminator = response.discriminator;
    this.avatar = response.avatar;
    this.bot = response.bot;
    this.system = response.system;
    this.mfaEnabled = response.mfa_enabled;
    this.banner = response.banner;
    this.accentColor = response.accent_color;
    this.locale = response.locale;
    this.verified = response.verified;
    this.email = response.email;
    this.flags = response.flags;
    this.premiumType = response.premium_type;
    this.publicFlags = response.public_flags;

    this.client = client;
  };
}

export class GuildMember {
  /** @internal */
  private readonly client: Client;
  /**
   * The user this guild member represents
   *
   * **This field won't be included in the member object attached to `MESSAGE_CREATE` and `MESSAGE_UPDATE` gateway events.**
   *
   * See https://discord.com/developers/docs/resources/user#user-object
   */
  public readonly user?: User;
  /**
   * This users guild nickname
   */
  public readonly nick?: string | null;
  /**
   * The member's guild avatar hash
   */
  public readonly avatar?: string | null;
  /**
   * Array of role object ids
   *
   * See https://discord.com/developers/docs/topics/permissions#role-object
   */
  public readonly roles: Snowflake[];
  /**
   * When the user joined the guild
   */
  public readonly joinedAt: string;
  /**
   * When the user started boosting the guild
   *
   * See https://support.discord.com/hc/articles/360028038352
   */
  public readonly premiumSince?: string | null;
  /**
   * Whether the user is deafened in voice channels
   */
  public readonly deaf: boolean;
  /**
   * Whether the user is muted in voice channels
   */
  public readonly mute: boolean;
  /**
   * Whether the user has not yet passed the guild's Membership Screening requirements
   *
   * *If this field is not present, it can be assumed as `false`.*
   */
  public readonly pending?: boolean;
  /**
   * Timestamp of when the time out will be removed; until then, they cannot interact with the guild
   */
  public readonly communicationDisabledUntil?: string | null;
  /**
   * When the user joined Discord
   * @returns user join dates and times in a Date object
   */
  public getJoinDate (): Date {
    return SnowflakeToDate(this.user.id);
  };
  constructor (response: APIGuildMember, client: Client) {
    this.user = new User(response.user, client);
    this.nick = response.nick;
    this.avatar = response.avatar;
    this.roles = response.roles;
    this.joinedAt = response.joined_at;
    this.premiumSince = response.premium_since;
    this.deaf = response.deaf;
    this.mute = response.mute;
    this.pending = response.pending;
    this.communicationDisabledUntil = response.communication_disabled_until;
    this.client = client;
  };
};