const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require('webpack');

/**
 * WARNING!
 * THIS CONFIG IS NOT COMPLETED YET,
 * PLEASE DON'T USE IT FOR PRODUCTION USE.
 */
console.warn("[Warning] This webpack configuration is experimental, scripts may break in Minecraft.");

/**
 * @type {import('webpack').Configuration}
 */
const CopyrightNotice = `Copyright (c) Jayly. All rights reserved.
Licensed under the Apache License, Version 2.0.
The LICENSE file in the root directory of this source tree.`;

/**
 * @type {import('webpack').Configuration}
 */
const Configuration = {
    entry: "./src/index.ts",
    devtool: "source-map",
    mode: "production",
    target: ["es2020"],
    // ------ ^
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: 'some',
                    }
                },
                extractComments: false
            }),
            new webpack.BannerPlugin(CopyrightNotice),    
        ]
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'built', 'local'),
        library: {
            type: 'module'
        },
    },
    experiments: {
        outputModule: true,
    },
    externalsType: "module",
    externals: {
        "@minecraft/server": '@minecraft/server',
        "@minecraft/server-ui": '@minecraft/server-ui',
        "@minecraft/server-admin": '@minecraft/server-admin',
        "@minecraft/server-gametest": '@minecraft/server-gametest',
        "@minecraft/server-net": '@minecraft/server-net',
    },
};

module.exports = (env) => {
    // env.entry
    if (!!env.entry) Configuration.entry = env.entry;
    if (!!env.output) {
        Configuration.output.path = path.resolve(__dirname, path.dirname(env.output));
        Configuration.output.filename = path.basename(env.output);
    };
    if (env.minimize === 'false') Configuration.optimization.minimize = false;
    return Configuration;
};
