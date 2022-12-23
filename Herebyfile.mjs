import { execa } from "execa";
import { task } from "hereby";
import dts from "dts-bundle-generator";
import fs from 'fs';
import path from "path";
import url from "url";

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
        await execa("npx webpack", ["--config", "webpack.config.js"]);
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
        await execa("npx typedoc");
    }
});

export const build = task({
    name: "build",
    dependencies: [test, bundle, dtsBundle, docs],
});

export default build;