/**
 * Types extracted from https://discord.com/developers/docs/resources/user
 */
/**
 * https://discord.com/developers/docs/resources/user#user-object-user-flags
 */
export enum UserFlags {
    /**
     * Discord Employee
     */
    Staff = 1,
    /**
     * Partnered Server Owner
     */
    Partner = 2,
    /**
     * HypeSquad Events Member
     */
    Hypesquad = 4,
    /**
     * Bug Hunter Level 1
     */
    BugHunterLevel1 = 8,
    /**
     * House Bravery Member
     */
    HypeSquadOnlineHouse1 = 64,
    /**
     * House Brilliance Member
     */
    HypeSquadOnlineHouse2 = 128,
    /**
     * House Balance Member
     */
    HypeSquadOnlineHouse3 = 256,
    /**
     * Early Nitro Supporter
     */
    PremiumEarlySupporter = 512,
    /**
     * User is a [team](https://discord.com/developers/docs/topics/teams)
     */
    TeamPseudoUser = 1024,
    /**
     * Bug Hunter Level 2
     */
    BugHunterLevel2 = 16384,
    /**
     * Verified Bot
     */
    VerifiedBot = 65536,
    /**
     * Early Verified Bot Developer
     */
    VerifiedDeveloper = 131072,
    /**
     * Moderator Programs Alumni
     */
    CertifiedModerator = 262144,
    /**
     * Bot uses only [HTTP interactions](https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction) and is shown in the online member list
     */
    BotHTTPInteractions = 524288,
    /**
     * User has been identified as spammer
     *
     * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
     */
    Spammer = 1048576,
    /**
     * User is an [Active Developer](https://support-dev.discord.com/hc/articles/10113997751447)
     */
    ActiveDeveloper = 4194304,
    /**
     * User's account has been [quarantined](https://support.discord.com/hc/articles/6461420677527) based on recent activity
     *
     * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
     *
     * @privateRemarks
     *
     * This value would be 1 << 44, but bit shifting above 1 << 30 requires bigints
     */
    Quarantined = 17592186044416
}
/**
 * https://discord.com/developers/docs/resources/user#user-object-premium-types
 */
export enum UserPremiumType {
    None = 0,
    NitroClassic = 1,
    Nitro = 2,
    NitroBasic = 3
}
export enum ConnectionService {
    BattleNet = "battlenet",
    eBay = "ebay",
    EpicGames = "epicgames",
    Facebook = "facebook",
    GitHub = "github",
    LeagueOfLegends = "leagueoflegends",
    PlayStationNetwork = "playstation",
    Reddit = "reddit",
    RiotGames = "riotgames",
    PayPal = "paypal",
    Spotify = "spotify",
    Skype = "skype",
    Steam = "steam",
    Twitch = "twitch",
    Twitter = "twitter",
    Xbox = "xbox",
    YouTube = "youtube"
}
export enum ConnectionVisibility {
    /**
     * Invisible to everyone except the user themselves
     */
    None = 0,
    /**
     * Visible to everyone
     */
    Everyone = 1
}
