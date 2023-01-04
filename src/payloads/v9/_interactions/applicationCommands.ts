export * from './_applicationCommands/chatInput';
export * from './_applicationCommands/contextMenu';
export * from './_applicationCommands/permissions';
/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types
 */
export enum ApplicationCommandType {
    ChatInput = 1,
    User = 2,
    Message = 3
}
