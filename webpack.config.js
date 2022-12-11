const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

/**
 * WARNING!
 * THIS CONFIG IS NOT COMPLETED YET,
 * PLEASE DON'T USE IT FOR PRODUCTION USE.
 */
console.warn("[Warning] This webpack configuration is experimental, scripts may break in Minecraft.");

const Configuration = {
  /**
   * @type {import('webpack').Configuration}
   */
  'server-net': {
    entry: "./src-minecraft/index.ts",
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
      filename: 'server-net.js',
      path: path.resolve(__dirname, 'dist'),
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
    }
  },
  /**
   * @type {import('webpack').Configuration}
   */
  'node': {
    entry: "./src-node/index.ts",
    devtool: "source-map",
    mode: "production",
    target: ["node"],
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
      extensions: [".tsx", ".ts", ".js"],
    },
    optimization: {
      minimize: false,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: "some",
            },
          },
          extractComments: false,
        }),
      ],
    },
    output: {
      filename: 'node.js',
      path: path.resolve(__dirname, "dist"),
    },
    externalsType: "commonjs",
  }
};

module.exports = (env) => {
  if (Object.keys(Configuration).includes(env.platform)) {
    console.log(`Platform: ${env.platform}`);

    // env.entry
    if (!!env.entry) Configuration[env.platform].entry = env.entry;

    return Configuration[env.platform];
  } else throw new TypeError(`Invalid platform. Accept values for "platform": ${Object.keys(Configuration).join(', ')}. Received ${env.platform}.`);
};
