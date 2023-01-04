/**
 * Types extracted from https://discord.com/developers/docs/resources/sticker
 */
/**
 * https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-types
 */
export enum StickerType {
    /**
     * An official sticker in a pack, part of Nitro or in a removed purchasable pack
     */
    Standard = 1,
    /**
     * A sticker uploaded to a guild for the guild's members
     */
    Guild = 2
}
/**
 * https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-format-types
 */
export enum StickerFormatType {
    PNG = 1,
    APNG = 2,
    Lottie = 3
}
