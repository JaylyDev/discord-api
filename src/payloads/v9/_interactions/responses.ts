/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type
 */
export enum InteractionType {
    Ping = 1,
    ApplicationCommand = 2,
    MessageComponent = 3,
    ApplicationCommandAutocomplete = 4,
    ModalSubmit = 5
}
/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type
 */
export enum InteractionResponseType {
    /**
     * ACK a `Ping`
     */
    Pong = 1,
    /**
     * Respond to an interaction with a message
     */
    ChannelMessageWithSource = 4,
    /**
     * ACK an interaction and edit to a response later, the user sees a loading state
     */
    DeferredChannelMessageWithSource = 5,
    /**
     * ACK a button interaction and update it to a loading state
     */
    DeferredMessageUpdate = 6,
    /**
     * ACK a button interaction and edit the message to which the button was attached
     */
    UpdateMessage = 7,
    /**
     * For autocomplete interactions
     */
    ApplicationCommandAutocompleteResult = 8,
    /**
     * Respond to an interaction with an modal for a user to fill-out
     */
    Modal = 9
}
