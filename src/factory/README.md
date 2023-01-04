# discord factory

A submodule that uses HTTP requests to connect to Discord API.

This submodule is intended to work for both Minecraft's Script Engine and Node.js

## Concept

`index.ts` file export variables from other source files so that both script engines can access to the directory easier.

In this submodule, the only HTTP requests methods that are allowed to use are `GET`, `POST`, `PUT`, and `DELETE`. Discord API supports PATCH however @minecraft/server-net does not. This remove features like update a channel's settings and modify guild.

The endpoints are listed in `Endpoints.ts`, obtained from eris repository on GitHub.

Discord API version 9 is used in this submodule to request data from and to Discord. The submodule will upgrade to v10 when neccessary.

**HTTP Requests Generator**

The methods in Resources directory requires a callback that sends HTTP request from the engine. The methods returns the body of the response for the API wrapper to work internally.

The generator is used so that it can create HTTP requests in multiple platforms. For Minecraft, the `@minecraft/server-net` module is used, and for Node.js, the `axios` module is used because it works similarly to server-net module.