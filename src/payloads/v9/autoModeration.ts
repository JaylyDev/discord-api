/**
 * Types extracted from https://discord.com/developers/docs/resources/auto-moderation
 */
/**
 * https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-types
 */
export enum AutoModerationRuleTriggerType {
    /**
     * Check if content contains words from a user defined list of keywords (Maximum of 3 per guild)
     */
    Keyword = 1,
    /**
     * Check if content represents generic spam (Maximum of 1 per guild)
     */
    Spam = 3,
    /**
     * Check if content contains words from internal pre-defined wordsets (Maximum of 1 per guild)
     */
    KeywordPreset = 4,
    /**
     * Check if content contains more mentions than allowed (Maximum of 1 per guild)
     */
    MentionSpam = 5
}
/**
 * https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-keyword-preset-types
 */
export enum AutoModerationRuleKeywordPresetType {
    /**
     * Words that may be considered forms of swearing or cursing
     */
    Profanity = 1,
    /**
     * Words that refer to sexually explicit behavior or activity
     */
    SexualContent = 2,
    /**
     * Personal insults or words that may be considered hate speech
     */
    Slurs = 3
}
/**
 * https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-event-types
 */
export enum AutoModerationRuleEventType {
    /**
     * When a member sends or edits a message in the guild
     */
    MessageSend = 1
}
/**
 * https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-action-object-action-types
 */
export enum AutoModerationActionType {
    /**
     * Blocks the content of a message according to the rule
     */
    BlockMessage = 1,
    /**
     * Logs user content to a specified channel
     */
    SendAlertMessage = 2,
    /**
     * Timeout user for specified duration, this action type can be set if the bot has `MODERATE_MEMBERS` permission
     */
    Timeout = 3
}
