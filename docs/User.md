# User class

Users in Discord are generally considered the base entity. Users can spawn across the entire platform, be members of guilds, participate in text and voice chat, and much more. Users are separated by a distinction of "bot" vs "normal." Although they are similar, bot users are automated users that are "owned" by another user. Unlike normal users, bot users do not have a limitation on the number of Guilds they can be a part of.

## Discord API User Results

Returns the entire user object structure provided by Discord API.

https://discord.com/developers/docs/resources/user#user-objects

- `id: string` - the user's id
- `username: string` - the user's username, not unique across the platform
- `discriminator: string` - the user's 4-digit discord-tag
- `avatar: string` - the user's [avatar hash](#DOCS_REFERENCE/image-formatting)
- `bot?: boolean` - whether the user belongs to an OAuth2 application
- `system?: boolean` - whether the user is an Official Discord System user (part of the urgent message system)
- `mfaEnabled?: boolean` - whether the user has two factor enabled on their account  
- `banner?: string` - the user's [banner hash](#DOCS_REFERENCE/image-formatting)
- `accentColor?: integer` - the user's banner color encoded as an integer representation of hexadecimal color code
- `locale?: string` - the user's chosen [language option](#DOCS_REFERENCE/locales)   
- `verified?: boolean` - whether the email on this account has been verified
- `email?: string` - the user's email
- `flags?: integer` - the [flags](#DOCS_RESOURCES_USER/user-object-user-flags) on a user's account
- `premiumType?: integer` - the [type of Nitro subscription](#DOCS_RESOURCES_USER/user-object-premium-types) on a user's account 
- `publicFlags?: integer` - the public [flags](#DOCS_RESOURCES_USER/user-object-user-flags) on a user's account

## `user.getJoinDate()`

Get the time and date the user joined Discord

Returns `Date`
