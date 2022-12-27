import { execa } from "execa";
import { task } from "hereby";
import dts from "dts-bundle-generator";
import fs from 'fs';
import path from "path";
import url from "url";
import * as dotenv from "dotenv";

const __filename = url.fileURLToPath(new URL(import.meta.url));
const __dirname = path.dirname(__filename);

export const test = task({
    name: "test",
    run: async () => {
        await execa("tsc", ["--noEmit"]);
    },
});

export const bundle = task({
    name: "bundle",
    run: async () => {
        await execa("webpack", ["--config", "webpack.config.js"]);
    },
});

export const dtsBundle = task({
    name: "dts-bundle",
    dependencies: [bundle],
    run: () => {
        const outputFile = dts.generateDtsBundle([{
            filePath: "built/local/discord/index.d.ts",
            output: {
                noBanner: true,
            },
        }]);
        fs.writeFileSync(path.resolve(__dirname, "built/local/index.d.ts"), outputFile[0]);
    },
});

export const docs = task({
    name: "docs",
    dependencies: [dtsBundle],
    run: async () => {
        await execa("typedoc");
    }
});

export const bdsConfig = task({
    name: "bds-config",
    run: () => {
        // load all env variables from process
        dotenv.config();
        const { BOT_TOKEN, TEST_GUILD, TEST_USER, TEST_CHANNEL, DOWNLOAD_PATH } = process.env;

        // All values must not leave blank
        const variables = {
            "BOT_TOKEN": BOT_TOKEN,
            "TEST_GUILD": TEST_GUILD, // Jayly's Discord id
            "TEST_USER": TEST_USER, // Jayly id,
            "TEST_CHANNEL": TEST_CHANNEL // #general
        };
        const permissions = {
            allowed_modules: [
                "@minecraft/server-gametest",
                "@minecraft/server",
                "@minecraft/server-ui",
                "@minecraft/server-admin",
                "@minecraft/server-net"
            ]
        };

        fs.writeFileSync(path.resolve(DOWNLOAD_PATH, 'config/default/variables.json'), JSON.stringify(variables));
        console.log('Created config/default/variables.json');

        fs.writeFileSync(path.resolve(DOWNLOAD_PATH, 'config/default/permissions.json'), JSON.stringify(permissions));
        console.log('Created config/default/permissions.json');
    }
});

export const buildTest = task({
    name: "build-test",
    dependencies: [bdsConfig],
    run: async () => {
        await execa("webpack", [
            "--config",
            "webpack.config.js",
            "--env",
            "entry=./tests/src/index.ts",
            "output=./tests/behavior_packs/discord_gametest/scripts/index.js",
            "minimize=false"
        ]);
    }
});

export const build = task({
    name: "build",
    dependencies: [test, bundle, dtsBundle, docs],
});

export default build;