// Credit goes to https://github.com/abalabahaha/eris/blob/dev/lib/rest/Endpoints.js
import { Snowflake } from "discord-api-types/globals";

export const ORIGINAL_INTERACTION_RESPONSE = ( appID: string, interactToken: string) => `/webhooks/${appID}/${interactToken}`;
export const COMMAND = (applicationID: string, commandID: string) => `/applications/${applicationID}/commands/${commandID}`;
export const COMMANDS = (applicationID: string) => `/applications/${applicationID}/commands`;
export const COMMAND_PERMISSIONS = ( applicationID: string, guildID: Snowflake, commandID: string) => `/applications/${applicationID}/guilds/${guildID}/commands/${commandID}/permissions`;
export const CHANNEL = (chanID: Snowflake) => `/channels/${chanID}`;
export const CHANNEL_BULK_DELETE = (chanID: Snowflake) => `/channels/${chanID}/messages/bulk-delete`;
export const CHANNEL_CALL_RING = (chanID: Snowflake) => `/channels/${chanID}/call/ring`;
export const CHANNEL_CROSSPOST = (chanID: Snowflake, msgID: string) => `/channels/${chanID}/messages/${msgID}/crosspost`;
export const CHANNEL_FOLLOW = (chanID: Snowflake) => `/channels/${chanID}/followers`;
export const CHANNEL_INVITES = (chanID: Snowflake) => `/channels/${chanID}/invites`;
export const CHANNEL_MESSAGE_REACTION = ( chanID: Snowflake, msgID: string, reaction: string) => `/channels/${chanID}/messages/${msgID}/reactions/${reaction}`;
export const CHANNEL_MESSAGE_REACTION_USER = ( chanID: Snowflake, msgID: string, reaction: string, userID: Snowflake) => `/channels/${chanID}/messages/${msgID}/reactions/${reaction}/${userID}`;
export const CHANNEL_MESSAGE_REACTIONS = (chanID: Snowflake, msgID: string) => `/channels/${chanID}/messages/${msgID}/reactions`;
export const CHANNEL_MESSAGE = (chanID: Snowflake, msgID: string) => `/channels/${chanID}/messages/${msgID}`;
export const CHANNEL_MESSAGES = (chanID: Snowflake) => `/channels/${chanID}/messages`;
export const CHANNEL_MESSAGES_SEARCH = (chanID: Snowflake) => `/channels/${chanID}/messages/search`;
export const CHANNEL_PERMISSION = (chanID: Snowflake, overID: string) => `/channels/${chanID}/permissions/${overID}`;
export const CHANNEL_PERMISSIONS = (chanID: Snowflake) => `/channels/${chanID}/permissions`;
export const CHANNEL_PIN = (chanID: Snowflake, msgID: string) => `/channels/${chanID}/pins/${msgID}`;
export const CHANNEL_PINS = (chanID: Snowflake) => `/channels/${chanID}/pins`;
export const CHANNEL_RECIPIENT = (groupID: string, userID: Snowflake) => `/channels/${groupID}/recipients/${userID}`;
export const CHANNEL_TYPING = (chanID: Snowflake) => `/channels/${chanID}/typing`;
export const CHANNEL_WEBHOOKS = (chanID: Snowflake) => `/channels/${chanID}/webhooks`;
export const CHANNELS = "/channels";
export const CUSTOM_EMOJI_GUILD = (emojiID: string) => `/emojis/${emojiID}/guild`;
export const DISCOVERY_CATEGORIES = "/discovery/categories";
export const DISCOVERY_VALIDATION = "/discovery/valid-term";
export const GATEWAY = "/gateway";
export const GATEWAY_BOT = "/gateway/bot";
export const GUILD = (guildID: Snowflake) => `/guilds/${guildID}`;
export const GUILD_AUDIT_LOGS = (guildID: Snowflake) => `/guilds/${guildID}/audit-logs`;
export const GUILD_BAN = (guildID: Snowflake, memberID: string) => `/guilds/${guildID}/bans/${memberID}`;
export const GUILD_BANS = (guildID: Snowflake) => `/guilds/${guildID}/bans`;
export const GUILD_CHANNELS = (guildID: Snowflake) => `/guilds/${guildID}/channels`;
export const GUILD_COMMAND = ( applicationID: string, guildID: Snowflake, commandID: string) => `/applications/${applicationID}/guilds/${guildID}/commands/${commandID}`;
export const GUILD_COMMAND_PERMISSIONS = ( applicationID: string, guildID: Snowflake) => `/applications/${applicationID}/guilds/${guildID}/commands/permissions`;
export const GUILD_COMMANDS = (applicationID: string, guildID: Snowflake) => `/applications/${applicationID}/guilds/${guildID}/commands`;
export const GUILD_DISCOVERY = (guildID: Snowflake) => `/guilds/${guildID}/discovery-metadata`;
export const GUILD_DISCOVERY_CATEGORY = ( guildID: Snowflake, categoryID: string) => `/guilds/${guildID}/discovery-categories/${categoryID}`;
export const GUILD_EMOJI = (guildID: Snowflake, emojiID: string) => `/guilds/${guildID}/emojis/${emojiID}`;
export const GUILD_EMOJIS = (guildID: Snowflake) => `/guilds/${guildID}/emojis`;
export const GUILD_INTEGRATION = (guildID: Snowflake, inteID: string) => `/guilds/${guildID}/integrations/${inteID}`;
export const GUILD_INTEGRATION_SYNC = (guildID: Snowflake, inteID: string) => `/guilds/${guildID}/integrations/${inteID}/sync`;
export const GUILD_INTEGRATIONS = (guildID: Snowflake) => `/guilds/${guildID}/integrations`;
export const GUILD_INVITES = (guildID: Snowflake) => `/guilds/${guildID}/invites`;
export const GUILD_VANITY_URL = (guildID: Snowflake) => `/guilds/${guildID}/vanity-url`;
export const GUILD_MEMBER = (guildID: Snowflake, memberID: string) => `/guilds/${guildID}/members/${memberID}`;
export const GUILD_MEMBER_NICK = (guildID: Snowflake, memberID: string) => `/guilds/${guildID}/members/${memberID}/nick`;
export const GUILD_MEMBER_ROLE = ( guildID: Snowflake, memberID: string, roleID: string) => `/guilds/${guildID}/members/${memberID}/roles/${roleID}`;
export const GUILD_MEMBERS = (guildID: Snowflake) => `/guilds/${guildID}/members`;
export const GUILD_MEMBERS_SEARCH = (guildID: Snowflake) => `/guilds/${guildID}/members/search`;
export const GUILD_MESSAGES_SEARCH = (guildID: Snowflake) => `/guilds/${guildID}/messages/search`;
export const GUILD_PREVIEW = (guildID: Snowflake) => `/guilds/${guildID}/preview`;
export const GUILD_PRUNE = (guildID: Snowflake) => `/guilds/${guildID}/prune`;
export const GUILD_ROLE = (guildID: Snowflake, roleID: string) => `/guilds/${guildID}/roles/${roleID}`;
export const GUILD_ROLES = (guildID: Snowflake) => `/guilds/${guildID}/roles`;
export const GUILD_SCHEDULED_EVENT = ( guildID: Snowflake, scheduledEventID: string) => `/guilds/${guildID}/scheduled-events/${scheduledEventID}`;
export const GUILD_SCHEDULED_EVENT_USERS = ( guildID: Snowflake, scheduledEventID: string) => `/guilds/${guildID}/scheduled-events/${scheduledEventID}/users`;
export const GUILD_SCHEDULED_EVENTS = (guildID: Snowflake) => `/guilds/${guildID}/scheduled-events`;
export const GUILD_STICKER = (guildID: Snowflake, stickerID: string) => `/guilds/${guildID}/stickers/${stickerID}`;
export const GUILD_STICKERS = (guildID: Snowflake) => `/guilds/${guildID}/stickers`;
export const GUILD_TEMPLATE = (code: string) => `/guilds/templates/${code}`;
export const GUILD_TEMPLATES = (guildID: Snowflake) => `/guilds/${guildID}/templates`;
export const GUILD_TEMPLATE_GUILD = (guildID: Snowflake, code: string) => `/guilds/${guildID}/templates/${code}`;
export const GUILD_VOICE_REGIONS = (guildID: Snowflake) => `/guilds/${guildID}/regions`;
export const GUILD_WEBHOOKS = (guildID: Snowflake) => `/guilds/${guildID}/webhooks`;
export const GUILD_WELCOME_SCREEN = (guildID: Snowflake) => `/guilds/${guildID}/welcome-screen`;
export const GUILD_WIDGET = (guildID: Snowflake) => `/guilds/${guildID}/widget.json`;
export const GUILD_WIDGET_SETTINGS = (guildID: Snowflake) => `/guilds/${guildID}/widget`;
export const GUILD_VOICE_STATE = (guildID: Snowflake, user: string) => `/guilds/${guildID}/voice-states/${user}`;
export const GUILDS = "/guilds";
export const INTERACTION_RESPOND = ( interactID: string, interactToken: string) => `/interactions/${interactID}/${interactToken}/callback`;
export const INVITE = (inviteID: string) => `/invites/${inviteID}`;
export const OAUTH2_APPLICATION = (appID: string) => `/oauth2/applications/${appID}`;
export const STAGE_INSTANCE = (channelID: Snowflake) => `/stage-instances/${channelID}`;
export const STAGE_INSTANCES = "/stage-instances";
export const STICKER = (stickerID: string) => `/stickers/${stickerID}`;
export const STICKER_PACKS = "/sticker-packs";
export const THREAD_MEMBER = (channelID: Snowflake, userID: Snowflake) => `/channels/${channelID}/thread-members/${userID}`;
export const THREAD_MEMBERS = (channelID: Snowflake) => `/channels/${channelID}/thread-members`;
export const THREAD_WITH_MESSAGE = (channelID: Snowflake, msgID: string) => `/channels/${channelID}/messages/${msgID}/threads`;
export const THREAD_WITHOUT_MESSAGE = (channelID: Snowflake) => `/channels/${channelID}/threads`;
export const THREADS_ACTIVE = (channelID: Snowflake) => `/channels/${channelID}/threads/active`;
export const THREADS_ARCHIVED = (channelID: Snowflake, type: string) => `/channels/${channelID}/threads/archived/${type}`;
export const THREADS_ARCHIVED_JOINED = (channelID: Snowflake) => `/channels/${channelID}/users/@me/threads/archived/private`;
export const THREADS_GUILD_ACTIVE = (guildID: Snowflake) => `/guilds/${guildID}/threads/active`;
export const USER = (userID: Snowflake) => `/users/${userID}`;
export const USER_BILLING = (userID: Snowflake) => `/users/${userID}/billing`;
export const USER_BILLING_PAYMENTS = (userID: Snowflake) => `/users/${userID}/billing/payments`;
export const USER_BILLING_PREMIUM_SUBSCRIPTION = (userID: Snowflake) => `/users/${userID}/billing/premium-subscription`;
export const USER_CHANNELS = (userID: Snowflake) => `/users/${userID}/channels`;
export const USER_CONNECTIONS = (userID: Snowflake) => `/users/${userID}/connections`;
export const USER_CONNECTION_PLATFORM = ( userID: Snowflake, platform: string, id: string) => `/users/${userID}/connections/${platform}/${id}`;
export const USER_GUILD = (userID: Snowflake, guildID: Snowflake) => `/users/${userID}/guilds/${guildID}`;
export const USER_GUILDS = (userID: Snowflake) => `/users/${userID}/guilds`;
export const USER_MFA_CODES = (userID: Snowflake) => `/users/${userID}/mfa/codes`;
export const USER_MFA_TOTP_DISABLE = (userID: Snowflake) => `/users/${userID}/mfa/totp/disable`;
export const USER_MFA_TOTP_ENABLE = (userID: Snowflake) => `/users/${userID}/mfa/totp/enable`;
export const USER_NOTE = (userID: Snowflake, targetID: string) => `/users/${userID}/note/${targetID}`;
export const USER_PROFILE = (userID: Snowflake) => `/users/${userID}/profile`;
export const USER_RELATIONSHIP = (userID: Snowflake, relID: string) => `/users/${userID}/relationships/${relID}`;
export const USER_SETTINGS = (userID: Snowflake) => `/users/${userID}/settings`;
export const USERS = "/users";
export const VOICE_REGIONS = "/voice/regions";
export const WEBHOOK = (hookID: string) => `/webhooks/${hookID}`;
export const WEBHOOK_MESSAGE = (hookID: string, token: string, msgID: string) => `/webhooks/${hookID}/${token}/messages/${msgID}`;
export const WEBHOOK_SLACK = (hookID: string) => `/webhooks/${hookID}/slack`;
export const WEBHOOK_TOKEN = (hookID: string, token: string) => `/webhooks/${hookID}/${token}`;
export const WEBHOOK_TOKEN_SLACK = (hookID: string, token: string) => `/webhooks/${hookID}/${token}/slack`;

// CDN Endpoints
export const ACHIEVEMENT_ICON = ( applicationID: string, achievementID: string, icon: string) => `/app-assets/${applicationID}/achievements/${achievementID}/icons/${icon}`;
export const APPLICATION_ASSET = (applicationID: string, asset: string) => `/app-assets/${applicationID}/${asset}`;
export const APPLICATION_ICON = (applicationID: string, icon: string) => `/app-icons/${applicationID}/${icon}`;
export const BANNER = (guildOrUserID: Snowflake, hash: string) => `/banners/${guildOrUserID}/${hash}`;
export const CHANNEL_ICON = (chanID: Snowflake, chanIcon: string) => `/channel-icons/${chanID}/${chanIcon}`;
export const CUSTOM_EMOJI = (emojiID: string) => `/emojis/${emojiID}`;
export const DEFAULT_USER_AVATAR = (userDiscriminator: string) => `/embed/avatars/${userDiscriminator}`;
export const GUILD_AVATAR = ( guildID: Snowflake, userID: Snowflake, guildAvatar: string) => `/guilds/${guildID}/users/${userID}/avatars/${guildAvatar}`;
export const GUILD_DISCOVERY_SPLASH = ( guildID: Snowflake, guildDiscoverySplash: string) => `/discovery-splashes/${guildID}/${guildDiscoverySplash}`;
export const GUILD_ICON = (guildID: Snowflake, guildIcon: string) => `/icons/${guildID}/${guildIcon}`;
export const GUILD_SCHEDULED_EVENT_COVER = ( eventID: string, eventIcon: string) => `/guild-events/${eventID}/${eventIcon}`;
export const GUILD_SPLASH = (guildID: Snowflake, guildSplash: string) => `/splashes/${guildID}/${guildSplash}`;
export const ROLE_ICON = (roleID: string, roleIcon: string) => `/role-icons/${roleID}/${roleIcon}`;
export const TEAM_ICON = (teamID: string, teamIcon: string) => `/team-icons/${teamID}/${teamIcon}`;
export const USER_AVATAR = (userID: Snowflake, userAvatar: string) => `/avatars/${userID}/${userAvatar}`;

// Application Endpoints
export const MESSAGE_LINK = ( guildID: Snowflake, channelID: Snowflake, messageID: string) => `/channels/${guildID}/${channelID}/${messageID}`;
