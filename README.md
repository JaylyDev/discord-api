# Discord API for Minecraft

An unofficial Minecraft module that allows you to interact with Discord API, without the requirement of connect to localhost as an endpoint for the use of `discord.js` Node.js module.

This repository contains the source code for:

- [`minecraft-extra/discord`](https://www.npmjs.com/package/minecraft-extra) submodule.

## Caution

This project is still in an experimental state. Breaking changes and functionality may change or it may be removed in future releases.

## Installation

This package can only be used in [Minecraft](https://minecraft.net/):

Following dependencies are required to use this module.

- **Minecraft Bedrock Dedicated Server 1.19.40 or newer**
- **@minecraft/server-net `1.0.0-beta`**

To use this in Minecraft Dedicated Server, you can build the package from source.

```sh-session
git clone https://github.com/JaylyDev/discord-api.git
cd discord-api
npm i
npm run build
```

or install the pre-built package in minecraft-extra module, available with NPM.

```
npm i minecraft-extra
```

## Documentation

For more information on using this wrapper check out the following:

- [API Documentation](https://jaylydev.github.io/discord-api/)