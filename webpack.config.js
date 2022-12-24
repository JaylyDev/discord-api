const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

/**
 * WARNING!
 * THIS CONFIG IS NOT COMPLETED YET,
 * PLEASE DON'T USE IT FOR PRODUCTION USE.
 */
console.warn("[Warning] This webpack configuration is experimental, scripts may break in Minecraft.");

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
        minimize: false,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: 'some',
                    }
                },
                extractComments: false
            }),
            // new webpack.BannerPlugin(`This file was automatically generated.`),    
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
        "@minecraft/server-admin": '@minecraft/server-server-admin',
        "@minecraft/server-gametest": '@minecraft/server-gametest',
        "@minecraft/server-net": '@minecraft/server-net',
    },
};

module.exports = Configuration;
