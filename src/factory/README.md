# discord factory

A submodule that uses HTTP requests to connect to Discord API.

This submodule is intended to work for both Minecraft's Script Engine and Node.js

## Concept

In this submodule, the only HTTP requests methods that are allowed to use are `GET`, `POST`, `PUT`, and `DELETE`. Discord API supports PATCH however @minecraft/server-net does not. This remove features like update a channel's settings and modify guild.

The endpoints are listed in `Endpoints.ts`, obtained from eris repository on GitHub.

Discord API version 9 is used in this submodule to request data from and to Discord. The submodule will upgrade to v10 when neccessary.

Factory has it's own enumeration of `HttpRequestMethod` to provide working methods for @minecraft/server-net module to request to Discord API.