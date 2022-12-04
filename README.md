# Discord API for Minecraft

An unofficial Minecraft module that allows you to interact with Discord API, without the requirement of connect to localhost as an endpoint for the use of `discord.js` Node.js module.

## Caution

This project is still in an experimental state. Breaking changes and functionality may change or it may be removed in future releases.

## Installation

Following dependencies are required to use this module.

Using this package in [Minecraft](https://minecraft.net/):

- **Minecraft Bedrock Server 1.19.40 or newer**
- **@minecraft/server-net `1.0.0-beta`**

To use this in Minecraft Dedicated Server, you must build the package from source.

```sh-session
git clone https://github.com/JaylyDev/discord-api.git
cd discord-api
npm i
npm run build-mc
```

Using this package in [Node.js](https://nodejs.org/) for testing purposes:

- **Node.js 16.16.0 or newer**

```sh-session
git clone https://github.com/JaylyDev/discord-api.git
cd discord-api
npm i
npm run build-node
```